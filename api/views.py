from django.shortcuts import render
from rest_framework import generics, status  # Give us access to HTTP status code
from .models import MusicDeposit
from .serializers import MusicDepositSerializer, CreateMusicDepositSerializer
from rest_framework.views import APIView  # Generic API view
from rest_framework.response import Response  # To send a custom response from our view


# Create your views here.

class MusicDepositView(generics.CreateAPIView):  # Creates a view from the serialization applied on the model
    queryset = MusicDeposit.objects.all()
    serializer_class = MusicDepositSerializer

# The APIView class enables us to write get, post methods and depending on the request that is made, it will dispatch the correct method


class CreateMusicDepositView(APIView):
    serializer_class = CreateMusicDepositSerializer

    def post(self, request, format=None):

        # If the user does not have a session :
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        serializer = self.serializer_class(data=request.data)
        music_deposit = None
        if serializer.is_valid():
            music_id = serializer.data.get('music_id')
            host = self.request.session.session_key
            music_deposit = MusicDeposit(host=host, music_id=music_id)
            music_deposit.save()

        if music_deposit:
            return Response(MusicDepositSerializer(music_deposit).data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
