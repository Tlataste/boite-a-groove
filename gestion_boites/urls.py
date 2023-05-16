from django.urls import path
from .views import boite_detail, ajouter_chanson, boite_accueil

urlpatterns = [
    path('<slug:url>/', boite_accueil, name='boite_accueil'),
    path('<slug:url>/ajouter/', ajouter_chanson, name='ajouter_chanson'),
    path('<slug:url>/decouvrir/', boite_detail, name='boite_detail')
]
