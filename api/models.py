from django.db import models

# Create your models here.

class MusicDeposit(models.Model):
    host =  models.CharField(max_length=15)
    music_id = models.CharField(max_length=15, null= False)
    time = models.DateTimeField(auto_now_add=True)