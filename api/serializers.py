# Translates our model into a JSON response

from rest_framework import serializers
from .models import MusicDeposit

# Ingoing serializers


class MusicDepositSerializer(serializers.ModelSerializer):
    class Meta:  # Defines metadata options for the UserSerializer class
        model = MusicDeposit  # Model we want to serialize
        fields = ('host', 'music_id', 'time')


# Outgoing serializers

# To make sure the data sended in the post request is valid and it fits with the field of the model

class CreateMusicDepositSerializer(serializers.ModelSerializer):
    class Meta:
        model = MusicDeposit
        fields = ('host', 'music_id', 'time')
