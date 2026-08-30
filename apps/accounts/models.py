from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db.models import Avg

from apps.common.enums import UserRole


class User(AbstractUser):
    role = models.CharField(
        max_length=30,
        choices=UserRole.choices,
        default=UserRole.HOUSE_OWNER,
    )
    phone = models.CharField(max_length=20, blank=True)
    cnic_hash = models.CharField(max_length=128, blank=True)
    division = models.CharField(max_length=100, blank=True)
    district = models.CharField(max_length=100, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.username} ({self.get_role_display()})'


class EngineerProfile(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='engineer_profile',
    )
    employee_code = models.CharField(max_length=50, unique=True)
    assigned_division = models.CharField(max_length=100)
    assigned_districts = models.JSONField(default=list, blank=True)
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['employee_code']

    def __str__(self):
        return f'{self.employee_code} - {self.user.username}'

    @property
    def average_beneficiary_rating(self):
        result = self.user.ratings_received.aggregate(avg=Avg('rating'))
        return result['avg']

    @property
    def projects_assigned(self):
        return self.user.assigned_projects.count()
