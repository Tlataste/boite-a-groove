from django.urls import path
from .views import boite_detail, ajouter_chanson

urlpatterns = [
    path('<slug:url>/', boite_detail, name='boite_detail'),
    path('<slug:url>/add_song/', ajouter_chanson, name='ajouter_chanson')
                ]
