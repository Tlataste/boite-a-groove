from django.shortcuts import render, get_object_or_404, redirect

from .models import Box, Deposit, Song


# Create your views here.
def boite_detail(request, url):
    boite = get_object_or_404(Box, url_box=url)
    # Récupérer les deux derniers dépôts liés à la boîte
    derniers_depots = Deposit.objects.filter(id_boite=boite.id_boite).order_by('-deposited_at')[:2]
    # Récupérer les noms des chansons correspondantes aux dépôts
    chansons = Song.objects.filter(id_song__in=derniers_depots.values('id_song'))
    return render(request, 'frontend/affichage_boite.html', {'boite': boite, 'chansons': chansons})


def ajouter_chanson(request, url, nom_chanson='Believer', auteur='Imagine Dragons'):
    # Récupérer la boîte correspondante
    boite = get_object_or_404(Box, url_box=url)

    # Vérifier si la chanson existe déjà
    try:
        chanson = Song.objects.filter(name_song=nom_chanson, name_artist=auteur).get()
        id_chanson = chanson.id_song
        chanson.n_deposits += 1
        chanson.save()
    except:
        # Créer une nouvelle chanson
        nouvelle_chanson = Song(name_song=nom_chanson, name_artist=auteur, n_deposits=1)
        nouvelle_chanson.save()
        id_chanson = nouvelle_chanson.id_song

    # Créer un nouveau dépôt de musique
    nouveau_depot = Deposit(id_song=id_chanson, id_boite=boite.id_boite, user=request.user.username)
    nouveau_depot.save()

    # Rediriger vers la page de détails de la boîte
    return redirect('../', url_boite=url)
