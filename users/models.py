from django.contrib.auth.models import AbstractUser
from django.db import models
from django.dispatch import receiver
from utils import generate_unique_filename


class CustomUser(AbstractUser):

    def profile_picture_path(instance, filename):
        # Modify the file name to ensure uniqueness
        filename = generate_unique_filename(instance, filename)
        return f"profile_pictures/{filename}"

    profile_picture = models.ImageField(upload_to=profile_picture_path, blank=True)


@receiver(models.signals.pre_delete, sender=CustomUser)
# When a user is deleted, his profile picture is deleted from the database
def delete_profile_picture(sender, instance, **kwargs):
    # Delete the profile picture file from storage
    if instance.profile_picture:
        instance.profile_picture.delete(False)
