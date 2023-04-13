# Translates our model into a JSON response

from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta: # Defines metadata options for the UserSerializer class
        model = User # Model we want to serialize
        fields = ('id', 'username', 'password')