from django.contrib import admin
from django.urls import include, path, re_path
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework import permissions
from rest_framework_simplejwt.views import TokenRefreshView

from apps.accounts.views import (
    LoginView,
    LogoutView,
    MeView,
    RegisterUserView,
    UserActivateView,
    UserDetailView,
    UserListView,
)

schema_view = get_schema_view(
    openapi.Info(
        title='Vigilant Site API',
        default_version='v1',
        description='ACAG Construction Monitoring System API',
        terms_of_service='https://www.google.com/policies/terms/',
        contact=openapi.Contact(email='2023cs706@student.uet.edu.pk'),
        license=openapi.License(name='BSD License'),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('admin/', admin.site.urls),

    # Authentication
    path('auth/login/', LoginView.as_view(), name='auth-login'),
    path('auth/logout/', LogoutView.as_view(), name='auth-logout'),
    path('auth/me/', MeView.as_view(), name='auth-me'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token-refresh'),

    # User management
    path('users/register/', RegisterUserView.as_view(), name='user-register'),
    path('users/', UserListView.as_view(), name='user-list'),
    path('users/<int:id>/', UserDetailView.as_view(), name='user-detail'),
    path('users/<int:id>/activate/', UserActivateView.as_view(), name='user-activate'),

    # Projects & Compliance
    path('', include('apps.projects.urls')),
    path('', include('apps.compliance.urls')),

    # API Documentation
    re_path(
        r'^swagger(?P<format>\.json|\.yaml)$',
        schema_view.without_ui(cache_timeout=0),
        name='schema-json',
    ),
    path(
        'swagger/',
        schema_view.with_ui('swagger', cache_timeout=0),
        name='schema-swagger-ui',
    ),
    path(
        'redoc/',
        schema_view.with_ui('redoc', cache_timeout=0),
        name='schema-redoc',
    ),
]

admin.site.site_header = 'Vigilant Site Admin'
admin.site.site_title = 'Vigilant Site'
admin.site.index_title = 'ACAG Construction Monitoring'
