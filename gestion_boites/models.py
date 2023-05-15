from django.db import models


class Boites(models.Model):
    id_boite = models.AutoField(primary_key=True)
    nom_boite = models.CharField(max_length=50, unique=True)
    url_image = models.CharField(max_length=150)
    description_boite = models.CharField(max_length=150)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    location_lat = models.CharField(max_length=50, unique=True)
    location_long = models.CharField(max_length=50, unique=True)
    client = models.CharField(max_length=50, unique=True)


class Song(models.Model):
    id_song = models.AutoField(primary_key=True)
    name_song = models.CharField(max_length=50, unique=True)
    name_artist = models.CharField(max_length=50, unique=True)
    url_song = models.CharField(max_length=150)
    url_image = models.CharField(max_length=150)
    n_deposits = models.IntegerField(default=0)


class Deposit(models.Model):
    id_deposit = models.AutoField(primary_key=True)
    id_song = models.IntegerField()
    id_boite = models.IntegerField()
    deposited_at = models.DateTimeField(auto_now_add=True)
    user = models.CharField()