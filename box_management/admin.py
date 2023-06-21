from django.contrib import admin
from import_export.admin import ImportExportModelAdmin
from .models import *


class BoxAdmin(ImportExportModelAdmin, admin.ModelAdmin):
    """
    Class goal: This class represents a Music Box used in the admin interface to import/export data.
    """
    list_display = ('name', 'description', 'url', 'image_url', 'client_name')


class LocationPointAdmin(ImportExportModelAdmin, admin.ModelAdmin):
    """
    Class goal: This class represents a Location Point used in the admin interface to import/export data.
    """
    list_display = ('box_id', 'latitude', 'longitude', 'dist_location')


class DepositAdmin(ImportExportModelAdmin, admin.ModelAdmin):
    list_display = ('id', 'song_id', 'box_id', 'deposited_at', 'user', 'note')
    list_filter = ('id', 'song_id', 'box_id', 'deposited_at', 'user', 'note')
    search_fields = ('id', 'song_id__title', 'box_id__name', 'user')
    ordering = ('-deposited_at',)


admin.site.site_header = "Administration de la Boîte à Son"
admin.site.register(Box, BoxAdmin)
admin.site.register(Deposit, DepositAdmin)
admin.site.register(Song)
admin.site.register(LocationPoint, LocationPointAdmin)
admin.site.register(VisibleDeposit)
admin.site.register(DiscoveredSong)
