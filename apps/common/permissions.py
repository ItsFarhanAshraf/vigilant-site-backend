from rest_framework import permissions

from apps.common.enums import UserRole


class IsAdmin(permissions.BasePermission):
    """Allow access only to admin users."""

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role == UserRole.ADMIN
        )


class IsFieldEngineer(permissions.BasePermission):
    """Allow access only to field engineers."""

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role == UserRole.FIELD_ENGINEER
        )


class IsBackendReviewEngineer(permissions.BasePermission):
    """Allow access only to backend review engineers."""

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role == UserRole.BACKEND_REVIEW_ENGINEER
        )


class IsHouseOwner(permissions.BasePermission):
    """Allow access only to house owners."""

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role == UserRole.HOUSE_OWNER
        )
