from django.shortcuts import render
from rest_framework import generics
from .models import User
from .serializers import UserSerializer

# Create your views here.

class UserView(generics.CreateAPIView): # Creates a view from the serialization applied on the model
    queryset = User.objects.all()
    serializer_class = UserSerializer
