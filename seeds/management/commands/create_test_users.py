from django.core.management.base import BaseCommand

from apps.accounts.models import EngineerProfile, User
from apps.common.enums import UserRole


class Command(BaseCommand):
    help = 'Create test users for development and QA'

    def handle(self, *args, **options):
        created_count = 0

        admin_user, created = self._create_user(
            username='admin',
            password='admin123',
            email='admin@vigilant.local',
            role=UserRole.ADMIN,
            division='Lahore',
            district='Lahore',
            is_staff=True,
            is_superuser=True,
        )
        if created:
            created_count += 1
            self.stdout.write(self.style.SUCCESS('Created admin user (admin / admin123)'))

        for i in range(1, 3):
            _, created = self._create_user(
                username=f'reviewer{i}',
                password='reviewer123',
                email=f'reviewer{i}@vigilant.local',
                role=UserRole.BACKEND_REVIEW_ENGINEER,
                division='Lahore',
                district='Lahore',
            )
            if created:
                created_count += 1

        for i in range(1, 6):
            user, created = self._create_user(
                username=f'engineer{i}',
                password='engineer123',
                email=f'engineer{i}@vigilant.local',
                role=UserRole.FIELD_ENGINEER,
                division='Lahore',
                district='Lahore',
            )
            if created:
                created_count += 1
                EngineerProfile.objects.get_or_create(
                    user=user,
                    defaults={
                        'employee_code': f'EMG-{user.id:04d}',
                        'assigned_division': user.division,
                        'assigned_districts': [user.district],
                    },
                )

        for i in range(1, 11):
            _, created = self._create_user(
                username=f'owner{i}',
                password='owner123',
                email=f'owner{i}@vigilant.local',
                role=UserRole.HOUSE_OWNER,
                division='Lahore',
                district='Lahore',
            )
            if created:
                created_count += 1

        self.stdout.write(
            self.style.SUCCESS(f'Test users ready. {created_count} new user(s) created.')
        )

    def _create_user(self, username, password, email, role, division, district,
                     is_staff=False, is_superuser=False):
        user, created = User.objects.get_or_create(
            username=username,
            defaults={
                'email': email,
                'role': role,
                'division': division,
                'district': district,
                'is_staff': is_staff,
                'is_superuser': is_superuser,
            },
        )
        if created:
            user.set_password(password)
            user.save()
        return user, created
