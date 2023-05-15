from django.urls import path
from .views import index1

urlpatterns = [
    path('', index1, name=''),
    path('register', index1)
                ]
