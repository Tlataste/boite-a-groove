from django.db import models
from users.models import CustomUser
from django.utils import timezone


class Achievement(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='achievements')
    unlocked_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
