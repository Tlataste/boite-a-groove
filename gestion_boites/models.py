from django.db import models
from django.utils.text import slugify


class Box(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50, unique=True)
    image_url = models.URLField(max_length=200, blank=True)
    description = models.CharField(max_length=150, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    latitude = models.CharField(max_length=50, unique=True)
    longitude = models.CharField(max_length=50, unique=True)
    client_name = models.CharField(max_length=50, unique=True)
    url = models.SlugField(unique=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.url:
            self.url = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return str(self.id) + " - " + self.name


class Song(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=50)
    artist = models.CharField(max_length=50)
    url = models.URLField(max_length=200)
    image_url = models.URLField(max_length=200, blank=True)
    n_deposits = models.IntegerField(default=0)

    def __str__(self):
        return str(self.id) + " - " + self.title + " - " + self.artist


class Deposit(models.Model):
    id = models.AutoField(primary_key=True)
    song_id = models.IntegerField()
    box_id = models.IntegerField()
    user_id = models.IntegerField()
    deposited_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return "User : " + str(self.user_id) + " -  Song : " + str(self.song_id) + " - Box : " + str(self.box_id)
