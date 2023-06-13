from django.contrib import admin
from django.urls import path, include
from .views import GetBox, check_location, Location


urlpatterns = [
    path('get-box', GetBox.as_view()),
    path('check-location', check_location),
    path('verify-location', Location.as_view()),
]
