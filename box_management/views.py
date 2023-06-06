from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView  # Generic API view
from .serializers import BoxSerializer, SongSerializer, DepositSerializer
from .models import *
import re


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
                return Response(songs, status=status.HTTP_200_OK)
            else:
                return Response({'Bad Request': 'Invalid Box Name'}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({'Bad Request': 'Name of the box not found in request'}, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request, format=None):
        # Récupérer la boîte correspondante
        option = request.data.get('option')
        song_name = option.get('name')
        song_author = option.get('artist')
        box_name = request.data.get('boxName')

        # Normaliser les noms de chanson et d'auteur
        song_name = self.normalize_string(song_name)
        song_author = self.normalize_string(song_author)

        # Vérifier si la chanson existe déjà
        try:
            song = Song.objects.filter(title=song_name, artist=song_author).get()
            song.n_deposits += 1
            song.save()

        except Song.DoesNotExist:
            # Créer une nouvelle chanson,
            song_url = option.get('spotify_url')
            song_image = option.get('image_url')
            song = Song(title=song_name, artist=song_author, url=song_url, image_url=song_image, n_deposits=1)

            song.save()

        # Créer un nouveau dépôt de musique
        box = Box.objects.filter(name=box_name).get()
        new_deposit = Deposit(song_id=song, box_id=box)
        new_deposit.save()
        new_deposit = DepositSerializer(new_deposit).data
        # Rediriger vers la page de détails de la boîte
        return Response(new_deposit, status=status.HTTP_200_OK)

    @staticmethod
    def normalize_string(input_string):
        # Remove special characters and convert to lowercase
        normalized_string = re.sub(r'[^a-zA-Z0-9\s]', '', input_string).lower()
        # Replace multiple spaces with a single space
        normalized_string = re.sub(r'\s+', ' ', normalized_string).strip()
        return normalized_string
