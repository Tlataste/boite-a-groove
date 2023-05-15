from django.shortcuts import render, get_object_or_404
from rest_framework import generics

from .serializers import BoxSerializer
from .models import Box


# Create your views here.
def boite_detail(request, slug):
    boite = get_object_or_404(Box, slug=slug)
    return render(request, 'frontend/index.html', {'boite': boite})


def index1(request, *args, **kwargs):
    return render(request, 'frontend/index.html') #changer url pour le template
