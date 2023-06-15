from django.middleware.csrf import get_token
from django.urls import reverse
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView  # Generic API view
from .serializers import BoxSerializer, SongSerializer, DepositSerializer
from .models import *
from .util import normalize_string, calculate_distance
import json
import requests


class GetBox(APIView):
    lookup_url_kwarg = 'name'
    serializer_class = BoxSerializer

    def get(self, request, format=None):
        name = request.GET.get(self.lookup_url_kwarg)
        if name is not None:
            box = Box.objects.filter(name=name)
            if len(box) > 0:
                data = BoxSerializer(box[0]).data  # Gets in json the data from the database corresponding to the Box
                deposit_count = Deposit.objects.filter(box_id=data.get('id')).count()
                last_deposit = Deposit.objects.filter(box_id=data.get('id')).order_by('-deposited_at')[0:2]
                # Récupérer les noms des chansons correspondantes aux dépôts
                songs = Song.objects.filter(id__in=last_deposit.values('song_id'))
                songs = SongSerializer(songs, many=True).data
                resp = {}
                resp['last_deposits'] = songs
                resp['deposit_count'] = deposit_count
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

        # Ajout de points
        cookies = request.COOKIES
        csrf_token = get_token(request)
        # Get the complete URL for the add-points endpoint using reverse
        add_points_url = request.build_absolute_uri(reverse('add-points'))

        headers = {
            "Content-Type": "application/json",
            "X-CSRFToken": csrf_token
        }

        requests.post(add_points_url, cookies=cookies, headers=headers, data=json.dumps({
            "points": 30
        })).json()

        new_deposit = DepositSerializer(new_deposit).data
        # Rediriger vers la page de détails de la boîte
        return Response(new_deposit, status=status.HTTP_200_OK)


class Location(APIView):
    def post(self, request, format=None):
        latitude = float(request.data.get('latitude'))
        longitude = float(request.data.get('longitude'))
        box = request.data.get('box')
        box = Box.objects.filter(id=box.get('id')).get()
        # Get all location points of the box
        points = LocationPoint.objects.filter(box_id=box)
        is_valid_location = False
        if len(points) == 0:
            # No location points for this box, return an error in the response
            return Response({'error': 'No location points for this box'}, status=status.HTTP_404_NOT_FOUND)
        for point in points:
            # Get the coordinates of the point
            max_dist = int(point.dist_location)
            target_latitude = float(point.latitude)
            target_longitude = float(point.longitude)
            # Calculate distance between the two points
            distance = calculate_distance(latitude, longitude, target_latitude, target_longitude)
            # Comparez les coordonnées avec l'emplacement souhaité
            if distance <= max_dist:
                is_valid_location = True

        if is_valid_location:
            # L'emplacement est valide
            return Response({'valid': True}, status=status.HTTP_200_OK)
        else:
            # L'emplacement est invalide
            return Response({'valid': False, 'lat': latitude, 'long': longitude}, status=status.HTTP_403_FORBIDDEN)


class CurrentBoxManagement(APIView):

    def get(self, request, format=None):
        try:
            current_box_name = request.session['current_box_name']
            return Response({'current_box_name': current_box_name}, status=status.HTTP_200_OK)
        except KeyError:
            # The 'current_box_name' key does not exist in request.session
            return Response({'error': 'La clé current_box_name n\'existe pas'}, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request, format=None):

        # Guard clause that checks if user is logged in
        if 'current_box_name' not in request.data:
            return Response({'errors': 'Aucun nom de boîte n\'a été fournie.'}, status=status.HTTP_401_UNAUTHORIZED)

        current_box_name = request.data.get('current_box_name')

        try:
            # Update the current box name in the user's session
            request.session['current_box_name'] = current_box_name
            request.session.modified = True

            return Response({'status': 'Le nom de la boîte actuelle a été modifié avec succès.'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'errors': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
