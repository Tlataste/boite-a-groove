from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView  # Generic API view
from .serializers import BoxSerializer, SongSerializer, DepositSerializer
from .models import *
from .util import normalize_string, calculate_distance
from django.shortcuts import render


class GetBox(APIView):
    lookup_url_kwarg = 'name'
    serializer_class = BoxSerializer

    def get(self, request, format=None):
        name = request.GET.get(self.lookup_url_kwarg)
        if name is not None:
            box = Box.objects.filter(name=name)
            if len(box) > 0:
                data = BoxSerializer(box[0]).data  # Gets in json the data from the database corresponding to the Box
                last_deposit = Deposit.objects.filter(box_id=data.get('id')).order_by('-deposited_at')[0:2]
                # Récupérer les noms des chansons correspondantes aux dépôts
                songs = Song.objects.filter(id__in=last_deposit.values('song_id'))
                songs = SongSerializer(songs, many=True).data
                resp = {}
                resp['last_deposits'] = songs
                resp['box'] = data
                return Response(resp, status=status.HTTP_200_OK)
            else:
                return Response({'Bad Request': 'Invalid Box Name'}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({'Bad Request': 'Name of the box not found in request'}, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request, format=None):
        # Récupérer la boîte correspondante
        option = request.data.get('option')
        song_name = option.get('name')
        song_author = option.get('artist')
        song_platform_id = option.get('platform_id')
        box_name = request.data.get('boxName')

        # Normaliser les noms de chanson et d'auteur
        song_name = normalize_string(song_name)
        song_author = normalize_string(song_author)

        # Vérifier si la chanson existe déjà
        try:
            song = Song.objects.filter(title=song_name, artist=song_author, platform_id=song_platform_id).get()
            song.n_deposits += 1
            song.save()

        except Song.DoesNotExist:
            # Créer une nouvelle chanson,
            song_url = option.get('url')
            song_image = option.get('image_url')
            song_duration = option.get('duration')
            song = Song(title=song_name, artist=song_author, url=song_url, image_url=song_image, duration=song_duration,
                        platform_id=song_platform_id, n_deposits=1)

            song.save()

        # Créer un nouveau dépôt de musique
        box = Box.objects.filter(name=box_name).get()
        new_deposit = Deposit(song_id=song, box_id=box)
        new_deposit.save()
        new_deposit = DepositSerializer(new_deposit).data
        # Rediriger vers la page de détails de la boîte
        return Response(new_deposit, status=status.HTTP_200_OK)


class Location(APIView):
    def post(self, request, format=None):
        latitude = float(request.data.get('latitude'))
        longitude = float(request.data.get('longitude'))
        target_longitude = float(request.data.get('box_longitude'))
        target_latitude = float(request.data.get('box_latitude'))
        # Comparez les coordonnées avec l'emplacement souhaité
        max_distance = 100  # Distance maximale tolérée en mètres
        distance = calculate_distance(latitude, longitude, target_latitude, target_longitude)
        if distance <= max_distance:
            # L'emplacement est valide
            return Response({'valid': True}, status=status.HTTP_200_OK)
        else:
            # L'emplacement est invalide
            return Response({'valid': False, 'lat': latitude, 'long': longitude}, status=status.HTTP_403_FORBIDDEN)


def check_location(request):
    return render(request, 'frontend/check_location.html')
