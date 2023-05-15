from django.shortcuts import render
from rest_framework import generics

from .serializers import BoxSerializer
from .models import Box

# Create your views here.
class BoxView(generics.CreateAPIView):
    query_set = Box.objects.all()
    serializer_class = BoxSerializer