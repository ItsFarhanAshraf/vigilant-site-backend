from rest_framework import serializers

from apps.accounts.models import User
from apps.common.enums import MilestoneStatus, UserRole
from apps.projects.models import (
    MilestoneDefinition,
    Photo,
    Project,
    ProjectMilestone,
    Visit,
)
from apps.projects.services import ProjectService


class MilestoneDefinitionSerializer(serializers.ModelSerializer):
    weight = serializers.SerializerMethodField()

    class Meta:
        model = MilestoneDefinition
        fields = ['milestone_no', 'name', 'weight', 'phase']
        read_only_fields = fields

    def get_weight(self, obj):
        weights = ProjectService.get_milestone_weights()
        return weights.get(obj.milestone_no, getattr(obj, 'duration_days', 0))


class MilestoneSerializer(serializers.ModelSerializer):
    completed_by_name = serializers.SerializerMethodField()
    phase = serializers.SerializerMethodField()
    weight = serializers.SerializerMethodField()
    name = serializers.SerializerMethodField()

    class Meta:
        model = ProjectMilestone
        fields = [
            'id',
            'milestone_no',
            'name',
            'status',
            'completed_date',
            'completed_by',
            'completed_by_name',
            'remarks',
            'phase',
            'weight',
        ]
        read_only_fields = fields

    def get_completed_by_name(self, obj):
        if obj.completed_by:
            return obj.completed_by.get_full_name() or obj.completed_by.username
        return None

    def get_phase(self, obj):
        defn = MilestoneDefinition.objects.filter(milestone_no=obj.milestone_no).first()
        if defn:
            return defn.phase
        return ProjectService.get_phase(obj.milestone_no)

    def get_weight(self, obj):
        return ProjectService.get_milestone_weights().get(obj.milestone_no, 0)

    def get_name(self, obj):
        defn = MilestoneDefinition.objects.filter(milestone_no=obj.milestone_no).first()
        return defn.name if defn else f'Milestone {obj.milestone_no}'


class VisitSerializer(serializers.ModelSerializer):
    engineer_name = serializers.SerializerMethodField()
    visit_no_display = serializers.CharField(source='get_visit_no_display', read_only=True)

    class Meta:
        model = Visit
        fields = [
            'id',
            'visit_no',
            'visit_no_display',
            'visit_date',
            'latitude',
            'longitude',
            'progress_pct_reported',
            'engineer_remarks',
            'created_at',
            'engineer',
            'engineer_name',
        ]
        read_only_fields = ['id', 'created_at', 'engineer_name', 'visit_no_display']

    def get_engineer_name(self, obj):
        if obj.engineer:
            return obj.engineer.get_full_name() or obj.engineer.username
        return None


class PhotoSerializer(serializers.ModelSerializer):
    uploaded_by_name = serializers.SerializerMethodField()

    class Meta:
        model = Photo
        fields = [
            'id',
            'image_ref',
            'milestone_no',
            'latitude',
            'longitude',
            'gps_accuracy_m',
            'captured_at',
            'uploaded_by',
            'uploaded_by_name',
            'created_at',
        ]
        read_only_fields = ['id', 'created_at', 'uploaded_by_name']

    def get_uploaded_by_name(self, obj):
        if obj.uploaded_by:
            return obj.uploaded_by.get_full_name() or obj.uploaded_by.username
        return None


class ProjectListSerializer(serializers.ModelSerializer):
    assigned_engineer_name = serializers.SerializerMethodField()
    compliance = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            'id',
            'case_id',
            'owner_name',
            'owner_phone',
            'division',
            'district',
            'tehsil',
            'project_type',
            'plot_size_marla',
            'assigned_engineer',
            'assigned_engineer_name',
            'plans_status',
            'environment_status',
            'quality_status',
            'compliance',
            'site_risk_flag',
            'overall_progress_pct',
            'created_at',
            'updated_at',
        ]
        read_only_fields = fields

    def get_assigned_engineer_name(self, obj):
        if obj.assigned_engineer:
            return obj.assigned_engineer.get_full_name() or obj.assigned_engineer.username
        return None

    def get_compliance(self, obj):
        return {
            'plans_status': obj.plans_status,
            'environment_status': obj.environment_status,
            'quality_status': obj.quality_status,
        }


class ProjectDetailSerializer(serializers.ModelSerializer):
    assigned_engineer_name = serializers.SerializerMethodField()
    compliance = serializers.SerializerMethodField()
    current_phase = serializers.SerializerMethodField()
    completion_percentage = serializers.SerializerMethodField()
    milestones = MilestoneSerializer(many=True, read_only=True)
    visits = VisitSerializer(many=True, read_only=True)

    class Meta:
        model = Project
        fields = [
            'id',
            'case_id',
            'owner_name',
            'owner_phone',
            'owner_cnic_hash',
            'division',
            'district',
            'tehsil',
            'latitude',
            'longitude',
            'project_type',
            'plot_size_marla',
            'covered_area_sqft',
            'loan_approved',
            'loan_disbursed',
            'assigned_engineer',
            'assigned_engineer_name',
            'plans_status',
            'environment_status',
            'quality_status',
            'compliance',
            'site_risk_flag',
            'overall_progress_pct',
            'current_milestone_no',
            'current_phase',
            'completion_percentage',
            'milestones',
            'visits',
            'created_at',
            'updated_at',
        ]
        read_only_fields = fields

    def get_assigned_engineer_name(self, obj):
        if obj.assigned_engineer:
            return obj.assigned_engineer.get_full_name() or obj.assigned_engineer.username
        return None

    def get_compliance(self, obj):
        return {
            'plans_status': obj.plans_status,
            'environment_status': obj.environment_status,
            'quality_status': obj.quality_status,
        }

    def get_current_phase(self, obj):
        return ProjectService.get_phase(obj.current_milestone_no)

    def get_completion_percentage(self, obj):
        return obj.overall_progress_pct


class CreateProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = [
            'case_id',
            'owner_name',
            'owner_phone',
            'owner_cnic_hash',
            'division',
            'district',
            'tehsil',
            'latitude',
            'longitude',
            'project_type',
            'plot_size_marla',
            'covered_area_sqft',
            'loan_approved',
            'loan_disbursed',
            'assigned_engineer',
        ]

    def validate_assigned_engineer(self, value):
        if value and value.role != UserRole.FIELD_ENGINEER:
            raise serializers.ValidationError('Assigned engineer must be a field engineer.')
        return value

    def create(self, validated_data):
        project = Project.objects.create(**validated_data)
        # Create 15 milestones with status='PENDING'
        milestones = [
            ProjectMilestone(
                project=project,
                milestone_no=i,
                status=MilestoneStatus.PENDING,
            )
            for i in range(1, 16)
        ]
        ProjectMilestone.objects.bulk_create(milestones)
        return project


class UpdateProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = [
            'owner_name',
            'owner_phone',
            'owner_cnic_hash',
            'division',
            'district',
            'tehsil',
            'latitude',
            'longitude',
            'project_type',
            'plot_size_marla',
            'covered_area_sqft',
            'loan_approved',
            'loan_disbursed',
            'assigned_engineer',
            'plans_status',
            'environment_status',
            'quality_status',
            'site_risk_flag',
        ]

    def validate_assigned_engineer(self, value):
        if value and value.role != UserRole.FIELD_ENGINEER:
            raise serializers.ValidationError('Assigned engineer must be a field engineer.')
        return value
