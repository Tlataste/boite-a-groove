from django.urls import path
from .views import index

# Here, dispatch the URLs to the correct app

urlpatterns = [
    path('', index),
    path('register', index)
]