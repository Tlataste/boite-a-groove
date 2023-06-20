from django.db import models
from django.utils import timezone
from django.utils.text import slugify
from users.models import CustomUser


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
    song_id = models.CharField(max_length=15)
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
    # Overriding of the save() method in order to avoid 'auto_now_add=True' which makes DateTimeField uneditable
    def save(self, *args, **kwargs):
        if not self.pk:  # Check if it's the first save
            self.deposited_at = timezone.now()

        super().save(*args, **kwargs)  # calling the save() method of the parent class (which is User)

    NOTE_CHOICES = [
        ('calme', 'Cette chanson m\'apaise et me détend !'),
        ('danse', 'Cette chanson me donne envie de danser !'),
        ('inspire', 'Cette chanson me pousse à être créatif !'),
        ('joie', 'Cette chanson me met de bonne humeur !'),
        ('motive', 'Cette chanson me motive pour la journée !'),
        ('reflexion', 'Cette chanson me fait réfléchir sur la vie.'),
        ('rire', 'Cette chanson me fait rire !'),
        ('triste', 'Cette chanson me rend mélancolique !'),
    ]

    song_id = models.ForeignKey(Song, on_delete=models.CASCADE)
    box_id = models.ForeignKey(Box, on_delete=models.CASCADE)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True)
    note = models.CharField(max_length=50, choices=NOTE_CHOICES, blank=True)
    # user_id = models.IntegerField()
    deposited_at = models.DateTimeField()

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


class VisibleDeposit(models.Model):
    deposit_id = models.ForeignKey(Deposit, on_delete=models.CASCADE)

    def __str__(self):
        return str(self.id) + '-' + str(self.deposit_id)


class DiscoveredSong(models.Model):
    deposit_id = models.ForeignKey(Deposit, on_delete=models.CASCADE)
    user_id = models.ForeignKey(CustomUser, on_delete=models.CASCADE)

    def __str__(self):
        return str(self.user_id) + ' - ' + str(self.deposit_id)
