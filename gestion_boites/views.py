from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse
from rest_framework import generics

from .serializers import BoxSerializer
from .models import Box


# Create your views here.
def boite_detail(request, url):
    boite = get_object_or_404(Box, url_box=url)
    return render(request, 'frontend/affichage_boite.html', {'boite': boite})

# def boite_detail(request, url):
#     boite = get_object_or_404(Box, url_box=url)
#     return HttpResponse("Bienvenue dans la boite à son de l'arrêt " + boite.nom_boite + ' (réseau ' + boite.client +')')