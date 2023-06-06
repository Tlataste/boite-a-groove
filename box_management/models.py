from django.db import models
from django.utils.text import slugify


class Box(models.Model):
    name = models.CharField(max_length=50, unique=True)
    description = models.CharField(max_length=150, blank=True)
    url = models.SlugField(unique=True, blank=True)
    latitude = models.CharField(max_length=50, unique=True)
    longitude = models.CharField(max_length=50, unique=True)
    image_url = models.URLField(max_length=200, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    client_name = models.CharField(max_length=50, unique=True)


class Song(models.Model):
    title = models.CharField(max_length=50)
    artist = models.CharField(max_length=50)
    url = models.URLField(max_length=200)
    image_url = models.URLField(max_length=200, blank=True)
    n_deposits = models.IntegerField(default=0)


class Deposit(models.Model):
    song_id = models.ForeignKey(Song, on_delete=models.CASCADE)
    box_id = models.ForeignKey(Box, on_delete=models.CASCADE)
    # user_id = models.IntegerField()
    deposited_at = models.DateTimeField(auto_now_add=True)