from django.shortcuts import render
from rest_framework import generics

from .serializers import BoxSerializer
from .models import Box


# Create your views here.
class BoxView(generics.CreateAPIView):
    query_set = Box.objects.all()
    serializer_class = BoxSerializer


def index1(request, *args, **kwargs):
    return render(request, 'frontend/index.html') #changer url pour le template
