# Generated by Django 5.0.4 on 2024-05-21 12:36

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("box_management", "0007_alter_locationpoint_latitude_and_more"),
        ("users", "0002_customuser_favorite_song"),
    ]

    operations = [
        migrations.CreateModel(
            name="FavoriteSongDiscovery",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("discovered_at", models.DateTimeField(auto_now_add=True)),
                (
                    "discovered_by",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="favsong_discoveries",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
                (
                    "discovered_song",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="box_management.song",
                    ),
                ),
                (
                    "discovered_user",
                    models.ForeignKey(
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "unique_together": {
                    ("discovered_by", "discovered_user", "discovered_song")
                },
            },
        ),
    ]
