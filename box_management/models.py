from django.db import models
from django.utils.text import slugify


class Box(models.Model):
    name = models.CharField(max_length=50, unique=True)
    description = models.CharField(max_length=150, blank=True)
    url = models.SlugField(blank=True)
    image_url = models.URLField(max_length=200, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    client_name = models.CharField(max_length=50)
    max_deposits = models.IntegerField(default=5)

    def __str__(self):
        return self.name


class Song(models.Model):
    title = models.CharField(max_length=50)
    artist = models.CharField(max_length=50)
    url = models.URLField(max_length=200)
    image_url = models.URLField(max_length=200, blank=True)
    duration = models.IntegerField(default=0)  # Duration in seconds
    platform_id = models.IntegerField(default=0)
    n_deposits = models.IntegerField(default=0)

    def __str__(self):
        return self.title + ' - ' + self.artist


class Deposit(models.Model):
    song_id = models.ForeignKey(Song, on_delete=models.CASCADE)
    box_id = models.ForeignKey(Box, on_delete=models.CASCADE)
    # user_id = models.IntegerField()
    deposited_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.song_id) + ' - ' + str(self.box_id)


class LocationPoint(models.Model):
    box_id = models.ForeignKey(Box, on_delete=models.CASCADE)
    latitude = models.FloatField()
    longitude = models.FloatField()
    dist_location = models.IntegerField(default=100)

    def __str__(self):
        box_name = Box.objects.get(id=self.box_id_id).name
        return box_name + ' - ' + str(self.latitude) + ' - ' + str(self.longitude)
