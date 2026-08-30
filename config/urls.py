from django.contrib import admin
from django.urls import path

urlpatterns = [
    path('admin/', admin.site.urls),
]

admin.site.site_header = 'Vigilant Site Admin'
admin.site.site_title = 'Vigilant Site'
admin.site.index_title = 'ACAG Construction Monitoring'
