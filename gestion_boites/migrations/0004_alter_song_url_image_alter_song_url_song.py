# Generated by Django 4.2 on 2023-05-15 12:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("gestion_boites", "0003_box_url_box_alter_box_url_image"),
    ]

    operations = [
        migrations.AlterField(
            model_name="song", name="url_image", field=models.URLField(),
        ),
        migrations.AlterField(
            model_name="song", name="url_song", field=models.URLField(),
        ),
    ]
