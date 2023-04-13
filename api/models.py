from django.db import models

# Create your models here.

# Just a test to make sure it works

"""
def checkUser(user : str) -> bool:

    if(User.objects.filter(username=user).exists()):
        return True
    else:
        return False
"""

class User(models.Model):
    username = models.CharField(max_length=15, unique=True, null= False)
    password = models.CharField(max_length=15, null=False)