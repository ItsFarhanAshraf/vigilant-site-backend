from django.conf import settings
from django.db import models
from django.db.models import Q

from apps.common.enums import (
    ComplianceStatus,
    MaterialType,
    MilestoneStatus,
    MILESTONE_NO_CHOICES,
    ProjectType,
    VisitNo,
)


class MilestoneDefinition(models.Model):
    """Reference definitions for the 15 construction milestones."""

    milestone_no = models.PositiveSmallIntegerField(unique=True)
    name = models.CharField(max_length=255)
    duration_days = models.PositiveSmallIntegerField()
    phase = models.CharField(max_length=50)

    class Meta:
        ordering = ['milestone_no']

    def __str__(self):
        return f'{self.milestone_no}. {self.name}'


class Project(models.Model):
    case_id = models.CharField(max_length=50, unique=True)
    owner_name = models.CharField(max_length=255)
    owner_phone = models.CharField(max_length=20)
    owner_cnic_hash = models.CharField(max_length=128)
    division = models.CharField(max_length=100)
    district = models.CharField(max_length=100)
    tehsil = models.CharField(max_length=100)
    latitude = models.FloatField()
    longitude = models.FloatField()
    project_type = models.CharField(max_length=30, choices=ProjectType.choices)
    plot_size_marla = models.FloatField()
    covered_area_sqft = models.FloatField()
    loan_approved = models.DecimalField(max_digits=15, decimal_places=2)
    loan_disbursed = models.DecimalField(max_digits=15, decimal_places=2)
    assigned_engineer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='assigned_projects',
        limit_choices_to=Q(role='FIELD_ENGINEER'),
    )
    plans_status = models.CharField(
        max_length=20,
        choices=ComplianceStatus.choices,
        default=ComplianceStatus.PENDING,
    )
    environment_status = models.CharField(
        max_length=20,
        choices=ComplianceStatus.choices,
        default=ComplianceStatus.PENDING,
    )
    quality_status = models.CharField(
        max_length=20,
        choices=ComplianceStatus.choices,
        default=ComplianceStatus.PENDING,
    )
    site_risk_flag = models.BooleanField(default=False)
    overall_progress_pct = models.FloatField(default=0.0)
    current_milestone_no = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.case_id} - {self.owner_name}'


class ProjectMilestone(models.Model):
    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name='milestones',
    )
    milestone_no = models.IntegerField(choices=MILESTONE_NO_CHOICES)
    status = models.CharField(
        max_length=20,
        choices=MilestoneStatus.choices,
        default=MilestoneStatus.PENDING,
    )
    completed_date = models.DateTimeField(null=True, blank=True)
    completed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='completed_milestones',
    )
    remarks = models.TextField(blank=True)

    class Meta:
        unique_together = ('project', 'milestone_no')
        ordering = ['project', 'milestone_no']

    def __str__(self):
        return f'{self.project.case_id} - Milestone {self.milestone_no}'


class Visit(models.Model):
    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name='visits',
    )
    engineer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='visits',
    )
    visit_no = models.CharField(max_length=10, choices=VisitNo.choices)
    visit_date = models.DateTimeField()
    latitude = models.FloatField()
    longitude = models.FloatField()
    progress_pct_reported = models.FloatField()
    engineer_remarks = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('project', 'visit_no')
        ordering = ['-visit_date']

    def __str__(self):
        return f'{self.project.case_id} - {self.get_visit_no_display()}'


class Photo(models.Model):
    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name='photos',
    )
    visit = models.ForeignKey(
        Visit,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='photos',
    )
    milestone_no = models.IntegerField()
    image_ref = models.CharField(max_length=500)
    latitude = models.FloatField()
    longitude = models.FloatField()
    gps_accuracy_m = models.FloatField()
    captured_at = models.DateTimeField()
    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='uploaded_photos',
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-captured_at']

    def __str__(self):
        return f'Photo for {self.project.case_id} (M{self.milestone_no})'


class EngineerRating(models.Model):
    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name='engineer_ratings',
    )
    engineer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='ratings_received',
    )
    rated_by_user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='ratings_given',
    )
    rating = models.IntegerField()
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'Rating {self.rating} for {self.engineer.username}'


class MaterialRate(models.Model):
    district = models.CharField(max_length=100)
    material = models.CharField(max_length=20, choices=MaterialType.choices)
    rate = models.DecimalField(max_digits=12, decimal_places=2)
    unit = models.CharField(max_length=50)
    effective_from = models.DateField()
    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='material_rate_updates',
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-effective_from', 'district', 'material']

    def __str__(self):
        return f'{self.material} - {self.district} ({self.rate} {self.unit})'


class SoilReference(models.Model):
    district = models.CharField(max_length=100, unique=True)
    dominant_soil_type = models.CharField(max_length=100)
    susceptibility = models.CharField(max_length=100)
    note = models.TextField(blank=True)

    class Meta:
        ordering = ['district']

    def __str__(self):
        return f'{self.district} - {self.dominant_soil_type}'
