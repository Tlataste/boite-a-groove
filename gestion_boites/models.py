from django.db import models
from django.utils.text import slugify


class Box(models.Model):
    id_boite = models.AutoField(primary_key=True)
    nom_boite = models.CharField(max_length=50, unique=True)
    url_image = models.URLField(max_length=200, blank=True)
    description_boite = models.CharField(max_length=150, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    location_lat = models.CharField(max_length=50, unique=True)
    location_long = models.CharField(max_length=50, unique=True)
    client = models.CharField(max_length=50, unique=True)
    url_box = models.SlugField(unique=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.url_box:
            self.url_box = slugify(self.nom_boite)
        super().save(*args, **kwargs)

    def __str__(self):
        return str(self.id_boite) + " - " + self.nom_boite


class Song(models.Model):
    id_song = models.AutoField(primary_key=True)
    name_song = models.CharField(max_length=50, unique=True)
    name_artist = models.CharField(max_length=50, unique=True)
    url_song = models.URLField(max_length=200)
    url_image = models.URLField(max_length=200)
    n_deposits = models.IntegerField(default=0)

    def __str__(self):
        return str(self.id_song) + " - " + self.name_song + " - " + self.name_artist


class Deposit(models.Model):
    id_deposit = models.AutoField(primary_key=True)
    id_song = models.IntegerField()
    id_boite = models.IntegerField()
    deposited_at = models.DateTimeField(auto_now_add=True)
    user = models.CharField(max_length=50)

    def __str__(self):
        return self.user + " - " + str(self.id_song) + " - " + str(self.id_boite)
