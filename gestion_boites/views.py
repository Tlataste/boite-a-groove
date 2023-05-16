from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse
from rest_framework import generics

from .serializers import BoxSerializer
from .models import Box, Deposit, Song


# Create your views here.
def boite_detail(request, url):
    boite = get_object_or_404(Box, url_box=url)
    # Récupérer les deux derniers dépôts liés à la boîte
    derniers_depots = Deposit.objects.filter(id_boite=boite.id_boite).order_by('-deposited_at')[:2]
    # Récupérer les noms des chansons correspondantes aux dépôts
    chansons = Song.objects.filter(id_song__in=derniers_depots.values('id_song'))
    print(derniers_depots)
    print(chansons)
    return render(request, 'frontend/affichage_boite.html', {'boite': boite, 'chansons': chansons})

# def boite_detail(request, url):
#     boite = get_object_or_404(Box, url_box=url)
#     return HttpResponse("Bienvenue dans la boite à son de l'arrêt " + boite.nom_boite + ' (réseau ' + boite.client +')')