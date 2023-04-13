# URLs inside the local app

from django.urls import path
from .views import UserView

urlpatterns = [
   path('', UserView.as_view())
]