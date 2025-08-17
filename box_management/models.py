from django.db import models
from django.utils import timezone
from django.utils.text import slugify
from django.core.validators import MinValueValidator, MaxValueValidator
from users.models import CustomUser
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _


class Box(models.Model):
    """
    Class goal: This class represents a Music Box.

    Attributes:
        name        : The name of the box.
        description : The description of the box.
        url         : The URL of the box.
        image_url   : The URL of the image of the box.
        created_at  : The date of creation of the box.
        updated_at  : The date of the last update of the box.
        client_name : The name of the client.
        max_deposits: The maximum number of deposits allowed in the box.
    """

    name = models.CharField(max_length=50, unique=True)
    description = models.CharField(max_length=150, blank=True)
    url = models.SlugField(blank=True)
    image_url = models.URLField(max_length=200, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    client_name = models.CharField(max_length=50)
    max_deposits = models.IntegerField(default=5)

    def __str__(self):
        """
        Method goal: Returns the name of the box used to display it in the admin interface.
        """
        return self.name

    def save(self, *args, **kwargs):
        # If url is empty, construct it based on the app's base URL and box name
        if not self.url:
            self.url = self.name
        super().save(*args, **kwargs)


def validate_spotify_or_deezer_id(value):
    if not value['spotify_id'] and not value['deezer_id']:
        raise ValidationError(
            _('At least one of Spotify ID or Deezer ID must be present.'),
            params={'value': value},
        )

class Song(models.Model):
    """
    Class goal: This class represents a song.

    Attributes:
        title     : The title of the song.
        artist    : The artist of the song.
        url       : The URL of the song.
        image_url : The URL of the image of the song.
        duration  : The duration of the song.
        platform_id: The id of the platform on which the song is available.
        n_deposits: The number of deposits of the song.
        spotify_id: The Spotify ID of the song.
        deezer_id : The Deezer ID of the song.
    """

    title = models.CharField(max_length=50)
    artist = models.CharField(max_length=50)
    url = models.URLField(max_length=200)
    image_url = models.URLField(max_length=200, blank=True)
    duration = models.IntegerField(default=0)  # Duration in seconds
    platform_id = models.IntegerField(default=0)
    spotify_id = models.CharField(max_length=50, blank=True, null=True, validators=[validate_spotify_or_deezer_id])
    deezer_id = models.CharField(max_length=50, blank=True, null=True, validators=[validate_spotify_or_deezer_id])

    def __str__(self):
        """
        Method goal: Returns the title and the artist of the song used to display it in the admin interface.
        """
        return self.title + " - " + self.artist

    @property
    def n_deposits(self):
        return self.deposits.count()


class Deposit(models.Model):

    song = models.ForeignKey(Song, on_delete=models.CASCADE, related_name='deposits')
    box = models.ForeignKey(Box, on_delete=models.CASCADE)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True)
    is_visible = models.BooleanField(default=False)
    deposited_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.song} - {self.box}"


class LocationPoint(models.Model):
    """
    Class goal: This class represents a location point.

    Attributes:
        box_id       : The id of the box.
        latitude     : The latitude of the location point.
        longitude    : The longitude of the location point.
        dist_location: The maximum distance between the user and the location point.
    """

    box = models.ForeignKey(Box, on_delete=models.CASCADE)
    latitude = models.FloatField(
        validators=[MinValueValidator(-90), MaxValueValidator(90)], blank=False
    )
    longitude = models.FloatField(
        validators=[MinValueValidator(-180), MaxValueValidator(180)], blank=False
    )
    dist_location = models.IntegerField(default=100)

    def __str__(self):
        """
        Method goal: Returns the name of the box, the latitude and the longitude of the location point
        used to display it in the admin interface.
        """
        return f"{self.box.name} - {self.latitude} - {self.longitude}"


class VisibleDeposit(models.Model):
    """
    Class goal: This class represents a visible deposit, i.e. a deposit that is visible by the user in a box.

    Attributes:
        deposit_id: The id of the deposit.
    """

    deposit_id = models.ForeignKey(Deposit, on_delete=models.CASCADE)

    def __str__(self):
        return str(self.id) + "-" + str(self.deposit_id)


class DiscoveredSong(models.Model):
    """
    Class goal: This class represents a discovered song.

    Attributes:
        song_id   : The id of the song.
        user_id   : The id of the user.
    """

    deposit = models.ForeignKey(Deposit, on_delete=models.CASCADE)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)

    def __str__(self):
        """
        Method goal: Returns the id of the user and the id of the deposit used to display it in the admin interface.
        """
        return str(self.user) + " - " + str(self.deposit)

class Cardboard(models.Model):
    """
    Class goal: This class represents a Cardboard linked to a Box.
    
    Attributes:
        box       : Foreign key to the associated Box.
        unique_url: A unique URL slug for the Cardboard.
    """
    box = models.ForeignKey(Box, on_delete=models.CASCADE)
    unique_url = models.SlugField(unique=True)

    def __str__(self):
        """
        Method goal: Returns the unique URL of the cardboard used to display it in the admin interface.
        """
        return f"Cardboard for {self.box.name} with URL {self.unique_url}"

    def get_absolute_url(self):
        """
        Method goal: Returns the absolute URL for the cardboard.
        """
        return reverse('cardboard_redirect', kwargs={'unique_url': self.unique_url})

