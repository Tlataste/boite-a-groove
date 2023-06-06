from django.contrib import admin
from .models import Box

admin.site.site_header = "Administration de la Boîte à Son"
admin.site.register(Box)
