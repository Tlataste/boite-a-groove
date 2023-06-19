from django.contrib import admin
from import_export.admin import ImportExportModelAdmin
from .models import *


class BoxAdmin(ImportExportModelAdmin, admin.ModelAdmin):
    list_display = ('name', 'description', 'url', 'image_url', 'client_name')


class LocationPointAdmin(ImportExportModelAdmin, admin.ModelAdmin):
    list_display = ('box_id', 'latitude', 'longitude', 'dist_location')


admin.site.site_header = "Administration de la Boîte à Son"
admin.site.register(Box, BoxAdmin)
admin.site.register(Deposit)
admin.site.register(Song)
admin.site.register(LocationPoint, LocationPointAdmin)
admin.site.register(VisibleDeposit)
