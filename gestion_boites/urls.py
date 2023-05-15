from django.urls import path
from .views import boite_detail

urlpatterns = [
    path('<slug:url>/', boite_detail, name='boite_detail')
                ]
