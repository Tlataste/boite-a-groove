from django.contrib import admin
from import_export.admin import ImportExportModelAdmin
from .models import Box, Deposit, Song


class BoxAdmin(ImportExportModelAdmin, admin.ModelAdmin):
    list_display = ('name', 'description', 'url', 'latitude', 'longitude', 'image_url', 'client_name')


admin.site.site_header = "Administration de la Boîte à Son"
admin.site.register(Box, BoxAdmin)
admin.site.register(Deposit)
admin.site.register(Song)


