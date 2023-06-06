from rest_framework import serializers
from .models import Box, Song, Deposit


class BoxSerializer(serializers.ModelSerializer):
    class Meta:
        model = Box
        fields = '__all__'
