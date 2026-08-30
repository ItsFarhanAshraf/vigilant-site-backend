from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated

from apps.common.enums import AuditAction, UserRole
from apps.common.pagination import StandardResultsSetPagination
from apps.common.permissions import (
    CanCompleteMilestone,
    CanEditProject,
    CanViewProject,
    IsAdmin,
)
from apps.common.responses import error_response, success_response
from apps.common.utils import log_audit
from apps.projects.filters import ProjectFilter
from apps.projects.models import Photo, Project, ProjectMilestone, Visit
from apps.projects.serializers import (
    CreateProjectSerializer,
    MilestoneSerializer,
    PhotoSerializer,
    ProjectDetailSerializer,
    ProjectListSerializer,
    UpdateProjectSerializer,
    VisitSerializer,
)
from apps.projects.services import ProjectService


class ProjectViewSet(viewsets.ModelViewSet):
    """ViewSet for managing projects, milestones, visits, photos, and compliance status."""

    queryset = Project.objects.all().order_by('-created_at')
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend]
    filterset_class = ProjectFilter

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'milestones', 'visits', 'photos']:
            return [IsAuthenticated(), CanViewProject()]
        elif self.action in ['create', 'update', 'partial_update', 'create_visit', 'upload_photos']:
            return [IsAuthenticated(), CanEditProject()]
        elif self.action == 'destroy':
            return [IsAuthenticated(), IsAdmin()]
        elif self.action == 'complete_milestone':
            return [IsAuthenticated(), CanCompleteMilestone()]
        elif self.action == 'compliance':
            return [IsAuthenticated(), IsAdmin()]
        return [IsAuthenticated()]

    def get_serializer_class(self):
        if self.action == 'list':
            return ProjectListSerializer
        elif self.action == 'create':
            return CreateProjectSerializer
        elif self.action in ['update', 'partial_update']:
            return UpdateProjectSerializer
        return ProjectDetailSerializer

    def get_queryset(self):
        user = self.request.user
        if not user or not user.is_authenticated:
            return Project.objects.none()

        qs = Project.objects.all().order_by('-created_at')

        if user.role in (UserRole.ADMIN, UserRole.BACKEND_REVIEW_ENGINEER):
            return qs
        elif user.role == UserRole.FIELD_ENGINEER:
            return qs.filter(assigned_engineer=user)
        elif user.role == UserRole.HOUSE_OWNER:
            filters = Q()
            if user.cnic_hash:
                filters |= Q(owner_cnic_hash=user.cnic_hash)
            if user.phone:
                filters |= Q(owner_phone=user.phone)
            if filters:
                return qs.filter(filters)
            return qs.none()

        return qs.none()

    @swagger_auto_schema(
        operation_summary='List all projects',
        operation_description='Retrieve a paginated list of projects filtered by user role and query parameters.',
        tags=['Projects'],
    )
    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = ProjectListSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = ProjectListSerializer(queryset, many=True)
        return success_response(data=serializer.data)

    @swagger_auto_schema(
        operation_summary='Retrieve project details',
        operation_description='Retrieve full 360° detail view for a specific project.',
        tags=['Projects'],
    )
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = ProjectDetailSerializer(instance)
        return success_response(data=serializer.data)

    @swagger_auto_schema(
        operation_summary='Create project',
        operation_description='Create a new project (Field Engineers / Admin). Auto-creates 15 milestones.',
        request_body=CreateProjectSerializer,
        tags=['Projects'],
    )
    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        if request.user.role == UserRole.FIELD_ENGINEER and 'assigned_engineer' not in data:
            data['assigned_engineer'] = request.user.id

        serializer = CreateProjectSerializer(data=data, context={'request': request})
        if not serializer.is_valid():
            return error_response(
                code='VALIDATION_ERROR',
                message='Project creation failed.',
                details=serializer.errors,
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        project = serializer.save()

        log_audit(
            user=request.user,
            action=AuditAction.CREATE,
            entity_type='project',
            entity_id=project.id,
            after=ProjectDetailSerializer(project).data,
            request=request,
        )

        return success_response(
            data=ProjectDetailSerializer(project).data,
            message='Project created successfully.',
            status_code=status.HTTP_201_CREATED,
        )

    @swagger_auto_schema(
        operation_summary='Update project',
        operation_description='Update project details (Admin or assigned Field Engineer).',
        request_body=UpdateProjectSerializer,
        tags=['Projects'],
    )
    def update(self, request, *args, **kwargs):
        return self._update_project(request, partial=False)

    @swagger_auto_schema(
        operation_summary='Partial update project',
        operation_description='Partially update project details (Admin or assigned Field Engineer).',
        request_body=UpdateProjectSerializer,
        tags=['Projects'],
    )
    def partial_update(self, request, *args, **kwargs):
        return self._update_project(request, partial=True)

    def _update_project(self, request, partial):
        project = self.get_object()
        before = ProjectDetailSerializer(project).data

        serializer = UpdateProjectSerializer(
            project, data=request.data, partial=partial, context={'request': request}
        )
        if not serializer.is_valid():
            return error_response(
                code='VALIDATION_ERROR',
                message='Project update failed.',
                details=serializer.errors,
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        project = serializer.save()

        log_audit(
            user=request.user,
            action=AuditAction.UPDATE,
            entity_type='project',
            entity_id=project.id,
            before=before,
            after=ProjectDetailSerializer(project).data,
            request=request,
        )

        return success_response(
            data=ProjectDetailSerializer(project).data,
            message='Project updated successfully.',
        )

    @swagger_auto_schema(
        operation_summary='Delete project',
        operation_description='Delete a project (Admin only).',
        tags=['Projects'],
    )
    def destroy(self, request, *args, **kwargs):
        project = self.get_object()
        before = ProjectDetailSerializer(project).data
        project_id = project.id

        project.delete()

        log_audit(
            user=request.user,
            action=AuditAction.DELETE,
            entity_type='project',
            entity_id=project_id,
            before=before,
            request=request,
        )

        return success_response(message='Project deleted successfully.')

    @swagger_auto_schema(
        method='get',
        operation_summary='Get project milestones',
        operation_description='Get list of all 15 milestones for a project.',
        tags=['Milestones'],
    )
    @action(detail=True, methods=['get'])
    def milestones(self, request, pk=None):
        project = self.get_object()
        milestones = project.milestones.all().order_by('milestone_no')
        serializer = MilestoneSerializer(milestones, many=True)
        return success_response(data=serializer.data)

    @swagger_auto_schema(
        method='get',
        operation_summary='Get project visits',
        operation_description='Get list of all visits for a project.',
        tags=['Visits'],
    )
    @action(detail=True, methods=['get'])
    def visits(self, request, pk=None):
        project = self.get_object()
        visits = project.visits.all().order_by('created_at')
        serializer = VisitSerializer(visits, many=True)
        return success_response(data=serializer.data)

    @swagger_auto_schema(
        method='get',
        operation_summary='Get project photos',
        operation_description='Get photos for a project, optionally filtered by milestone_no.',
        manual_parameters=[
            openapi.Parameter('milestone_no', openapi.IN_QUERY, description='Filter by milestone number', type=openapi.TYPE_INTEGER)
        ],
        tags=['Photos'],
    )
    @action(detail=True, methods=['get'])
    def photos(self, request, pk=None):
        project = self.get_object()
        photos_qs = project.photos.all()
        milestone_no = request.query_params.get('milestone_no')
        if milestone_no:
            photos_qs = photos_qs.filter(milestone_no=milestone_no)

        serializer = PhotoSerializer(photos_qs, many=True)
        return success_response(data=serializer.data)

    @swagger_auto_schema(
        method='post',
        operation_summary='Complete milestone',
        operation_description='Complete a milestone. Requires at least 1 photo reference in request body.',
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['photos'],
            properties={
                'remarks': openapi.Schema(type=openapi.TYPE_STRING, description='Remarks'),
                'photos': openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Schema(type=openapi.TYPE_STRING), description='List of image references'),
                'latitude': openapi.Schema(type=openapi.TYPE_NUMBER, description='Latitude'),
                'longitude': openapi.Schema(type=openapi.TYPE_NUMBER, description='Longitude'),
                'gps_accuracy_m': openapi.Schema(type=openapi.TYPE_NUMBER, description='GPS Accuracy in meters'),
            },
        ),
        tags=['Milestones'],
    )
    @action(detail=True, methods=['post'], url_path=r'milestones/(?P<no>\d+)/complete')
    def complete_milestone(self, request, pk=None, no=None):
        project = self.get_object()
        milestone_no = int(no)

        photos = request.data.get('photos', [])
        if not photos or not isinstance(photos, list) or len(photos) == 0:
            return error_response(
                code='PHOTO_REQUIRED',
                message='At least 1 photo is required for milestone completion.',
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        remarks = request.data.get('remarks', '')
        latitude = request.data.get('latitude', project.latitude)
        longitude = request.data.get('longitude', project.longitude)
        gps_accuracy_m = request.data.get('gps_accuracy_m', 5.0)

        try:
            milestone = ProjectService.complete_milestone(
                project=project,
                milestone_no=milestone_no,
                user=request.user,
                remarks=remarks,
            )
        except Exception as e:
            if hasattr(e, 'detail') and isinstance(e.detail, dict):
                code = e.detail.get('code', 'VALIDATION_ERROR')
                msg = e.detail.get('message', e.detail.get('detail', str(e)))
                return error_response(code=code, message=str(msg), status_code=status.HTTP_400_BAD_REQUEST)
            return error_response(code='MILESTONE_ERROR', message=str(e), status_code=status.HTTP_400_BAD_REQUEST)

        # Save photos
        now = timezone.now()
        created_photos = []
        for img_ref in photos:
            photo = Photo.objects.create(
                project=project,
                milestone_no=milestone_no,
                image_ref=img_ref,
                latitude=latitude,
                longitude=longitude,
                gps_accuracy_m=gps_accuracy_m,
                captured_at=now,
                uploaded_by=request.user,
            )
            created_photos.append(photo)

        log_audit(
            user=request.user,
            action=AuditAction.UPDATE,
            entity_type='milestone',
            entity_id=milestone.id,
            after={
                'milestone_no': milestone_no,
                'status': milestone.status,
                'overall_progress_pct': project.overall_progress_pct,
            },
            request=request,
        )

        return success_response(
            data={
                'milestone': MilestoneSerializer(milestone).data,
                'overall_progress_pct': project.overall_progress_pct,
                'photos': PhotoSerializer(created_photos, many=True).data,
            },
            message=f'Milestone {milestone_no} completed successfully.',
        )

    @swagger_auto_schema(
        method='post',
        operation_summary='Create visit',
        operation_description='Create a new inspection visit record (sequential order enforced: 1 -> 2 -> 3).',
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['visit_no', 'visit_date', 'latitude', 'longitude', 'progress_pct_reported'],
            properties={
                'visit_no': openapi.Schema(type=openapi.TYPE_STRING, description='Visit number (1, 2, or 3)'),
                'visit_date': openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_DATETIME),
                'latitude': openapi.Schema(type=openapi.TYPE_NUMBER),
                'longitude': openapi.Schema(type=openapi.TYPE_NUMBER),
                'progress_pct_reported': openapi.Schema(type=openapi.TYPE_NUMBER),
                'engineer_remarks': openapi.Schema(type=openapi.TYPE_STRING),
            },
        ),
        tags=['Visits'],
    )
    @action(detail=True, methods=['post'], url_path='visits')
    def create_visit(self, request, pk=None):
        project = self.get_object()
        visit_no = request.data.get('visit_no')

        try:
            visit = ProjectService.create_visit(
                project=project,
                engineer=request.user,
                visit_no=visit_no,
                data=request.data,
            )
        except Exception as e:
            if hasattr(e, 'detail') and isinstance(e.detail, dict):
                code = e.detail.get('code', 'VALIDATION_ERROR')
                msg = e.detail.get('message', e.detail.get('detail', str(e)))
                return error_response(code=code, message=str(msg), status_code=status.HTTP_400_BAD_REQUEST)
            return error_response(code='VISIT_ERROR', message=str(e), status_code=status.HTTP_400_BAD_REQUEST)

        log_audit(
            user=request.user,
            action=AuditAction.CREATE,
            entity_type='visit',
            entity_id=visit.id,
            after=VisitSerializer(visit).data,
            request=request,
        )

        return success_response(
            data=VisitSerializer(visit).data,
            message='Visit created successfully.',
            status_code=status.HTTP_201_CREATED,
        )

    @swagger_auto_schema(
        method='post',
        operation_summary='Upload photos',
        operation_description='Upload photo records for a project milestone.',
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['milestone_no', 'photos'],
            properties={
                'milestone_no': openapi.Schema(type=openapi.TYPE_INTEGER),
                'photos': openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Schema(type=openapi.TYPE_STRING)),
                'latitude': openapi.Schema(type=openapi.TYPE_NUMBER),
                'longitude': openapi.Schema(type=openapi.TYPE_NUMBER),
                'gps_accuracy_m': openapi.Schema(type=openapi.TYPE_NUMBER),
            },
        ),
        tags=['Photos'],
    )
    @action(detail=True, methods=['post'], url_path='photos')
    def upload_photos(self, request, pk=None):
        project = self.get_object()
        milestone_no = request.data.get('milestone_no')
        photos = request.data.get('photos', [])
        latitude = request.data.get('latitude', project.latitude)
        longitude = request.data.get('longitude', project.longitude)
        gps_accuracy_m = request.data.get('gps_accuracy_m', 5.0)

        if not milestone_no or not photos:
            return error_response(
                code='VALIDATION_ERROR',
                message='milestone_no and photos are required.',
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        now = timezone.now()
        created_photos = []
        for img_ref in photos:
            photo = Photo.objects.create(
                project=project,
                milestone_no=milestone_no,
                image_ref=img_ref,
                latitude=latitude,
                longitude=longitude,
                gps_accuracy_m=gps_accuracy_m,
                captured_at=now,
                uploaded_by=request.user,
            )
            created_photos.append(photo)

        return success_response(
            data=PhotoSerializer(created_photos, many=True).data,
            message='Photos uploaded successfully.',
            status_code=status.HTTP_201_CREATED,
        )

    @swagger_auto_schema(
        method='patch',
        operation_summary='Update project compliance',
        operation_description='Update compliance statuses (plans_status, environment_status, quality_status). Admin only.',
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'plans_status': openapi.Schema(type=openapi.TYPE_STRING),
                'environment_status': openapi.Schema(type=openapi.TYPE_STRING),
                'quality_status': openapi.Schema(type=openapi.TYPE_STRING),
            },
        ),
        tags=['Projects'],
    )
    @action(detail=True, methods=['patch'], url_path='compliance')
    def compliance(self, request, pk=None):
        project = self.get_object()
        before_compliance = {
            'plans_status': project.plans_status,
            'environment_status': project.environment_status,
            'quality_status': project.quality_status,
        }

        plans_status = request.data.get('plans_status')
        environment_status = request.data.get('environment_status')
        quality_status = request.data.get('quality_status')

        updated = False
        if plans_status:
            project.plans_status = plans_status
            updated = True
        if environment_status:
            project.environment_status = environment_status
            updated = True
        if quality_status:
            project.quality_status = quality_status
            updated = True

        if updated:
            project.save()
            log_audit(
                user=request.user,
                action=AuditAction.UPDATE,
                entity_type='project_compliance',
                entity_id=project.id,
                before=before_compliance,
                after={
                    'plans_status': project.plans_status,
                    'environment_status': project.environment_status,
                    'quality_status': project.quality_status,
                },
                request=request,
            )

        return success_response(
            data={
                'plans_status': project.plans_status,
                'environment_status': project.environment_status,
                'quality_status': project.quality_status,
            },
            message='Compliance status updated successfully.',
        )
