from django.contrib import admin
from django.urls import path, include
from .views import GetBox


urlpatterns = [
    path('get-box', GetBox.as_view())
]
