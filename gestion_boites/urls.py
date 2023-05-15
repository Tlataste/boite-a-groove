from django.urls import path
from .views import BoxView

url_patterns = [
    path('home', BoxView.as_view())
                ]
