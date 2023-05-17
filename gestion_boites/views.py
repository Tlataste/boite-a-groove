from django.shortcuts import render, get_object_or_404, redirect
import re

import gestion_boites
from .models import Box, Deposit, Song
from django.template import *


# Create your views here.
def boite_detail(request, url):
    boite = get_object_or_404(Box, url_box=url)
    # Récupérer les deux derniers dépôts liés à la boîte
    derniers_depots = Deposit.objects.filter(id_boite=boite.id_boite).order_by('-deposited_at')[1:3]
    # Récupérer les noms des chansons correspondantes aux dépôts
    chansons = Song.objects.filter(id_song__in=derniers_depots.values('id_song'))
    mon_depot = Deposit.objects.filter(id_boite=boite.id_boite).order_by('-deposited_at')[0]
    ma_chanson = Song.objects.filter(id_song=mon_depot.id_song.id_song)[0]
    return render(request, 'frontend/detail_boite.html', {'boite': boite, 'chansons': chansons, 'ma_chanson': ma_chanson})


def normalize_string(input_string):
    # Remove special characters and convert to lowercase
    normalized_string = re.sub(r'[^a-zA-Z0-9\s]', '', input_string).lower()
    # Replace multiple spaces with a single space
    normalized_string = re.sub(r'\s+', ' ', normalized_string).strip()
    return normalized_string


def ajouter_chanson(request, url, nom_chanson='Final Countdown', auteur='Europe'):
    # Récupérer la boîte correspondante
    boite = get_object_or_404(Box, url_box=url)
    # Normaliser les noms de chanson et d'auteur
    nom_chanson = normalize_string(nom_chanson)
    auteur = normalize_string(auteur)
    # Vérifier si la chanson existe déjà
    try:
        chanson = Song.objects.filter(name_song=nom_chanson, name_artist=auteur).get()
        id_chanson = chanson.id_song
        chanson.n_deposits += 1
        chanson.save()
    except Song.DoesNotExist:
        # Créer une nouvelle chanson
        chanson = Song(name_song=nom_chanson, name_artist=auteur, n_deposits=1)
        chanson.save()
        id_chanson = chanson.id_song

    # Créer un nouveau dépôt de musique
    nouveau_depot = Deposit(id_song=chanson, id_boite=boite, user=request.user.username)
    nouveau_depot.save()

    # Rediriger vers la page de détails de la boîte
    return redirect('../decouvrir/', url_boite=url)


def boite_accueil(request, url):
    boite = get_object_or_404(Box, url_box=url)
    # Récupérer les deux derniers dépôts liés à la boîte
    derniers_depots = Deposit.objects.filter(id_boite=boite.id_boite).order_by('-deposited_at')[:2]
    # Récupérer les noms des chansons correspondantes aux dépôts
    chansons = Song.objects.filter(id_song__in=derniers_depots.values('id_song'))
    return render(request, 'frontend/affichage_boite.html', {'boite': boite, 'chansons': chansons})
