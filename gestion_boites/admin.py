from django.contrib import admin

from .models import Box, Deposit, Song

admin.site.site_header = "Administration de la Boîte à Son"
admin.site.register(Box)
admin.site.register(Deposit)
admin.site.register(Song)
