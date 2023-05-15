from django.urls import path
from .views import boite_detail

urlpatterns = [
    path('<url_box>/', boite_detail, name='boite_detail')
                ]
