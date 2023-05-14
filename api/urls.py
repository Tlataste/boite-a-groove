# URLs inside the local app

from django.urls import path
from .views import MusicDepositView, CreateMusicDepositView

urlpatterns = [
    path('createmusicdeposit', CreateMusicDepositView.as_view())
]
