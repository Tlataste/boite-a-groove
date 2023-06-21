from django.db import models
from users.models import CustomUser


class DeezerToken(models.Model):
    """
    This model is used to store the Deezer access token of the user.
    """
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    access_token = models.CharField(max_length=150)
