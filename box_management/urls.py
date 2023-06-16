from django.contrib import admin
from django.urls import path, include
from .views import GetBox, Location, ReplaceVisibleDeposits


urlpatterns = [
    path('get-box', GetBox.as_view()),
    path('verify-location', Location.as_view()),
    path('replace-visible-deposits', ReplaceVisibleDeposits.as_view()),
]
