# Generated by Django 4.2 on 2023-06-08 09:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("box_management", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="song",
            name="duration",
            field=models.IntegerField(default=0),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name="song",
            name="n_platform",
            field=models.IntegerField(default=0),
            preserve_default=False,
        ),
    ]
