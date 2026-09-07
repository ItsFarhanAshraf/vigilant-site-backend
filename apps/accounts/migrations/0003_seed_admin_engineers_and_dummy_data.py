from django.db import migrations


def forwards(apps, schema_editor):
    """Load admin user, junior engineers (from Excel fixture), and dummy dashboard data.

    Friend workflow after git pull:
        python manage.py migrate
    """
    from seeds.seed_data import seed_all

    seed_all()


def backwards(apps, schema_editor):
    JuniorEngineer = apps.get_model('accounts', 'JuniorEngineer')
    User = apps.get_model('accounts', 'User')
    Project = apps.get_model('projects', 'Project')

    JuniorEngineer.objects.all().delete()
    Project.objects.filter(case_id__startswith='VS-2026-').delete()
    User.objects.filter(username='admin').delete()


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0002_junior_engineer'),
        ('common', '0002_auditlog_user_agent_alter_auditlog_action_and_more'),
        ('projects', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(forwards, backwards),
    ]
