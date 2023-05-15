from rest_framework import serializers
from .models import Boites, Song, Deposit


class BoitesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Boites
        fields = ('id_boite', 'nom_boite', 'url_image', 'description_boite', 'created_at', 'updated_at', 'location_lat',
                  'location_long', 'client')


class SongSerializer(serializers.ModelSerializer):
    class Meta:
        model = Song
        fields = ('id_song', 'name_song', 'name_artist', 'url_song', 'url_image', 'n_deposits')


class DepositSerializer(serializers.ModelSerializer):
    class Meta:
        model = Deposit
        fields = ('id_deposit', 'id_song', 'id_boite', 'deposited_at', 'user')
