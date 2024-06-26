# Generated by Django 4.2 on 2023-06-20 08:32

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("box_management", "0003_deposit_user_alter_deposit_deposited_at"),
    ]

    operations = [
        migrations.CreateModel(
            name="DiscoveredSong",
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
                (
                    "deposit_id",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="box_management.deposit",
                    ),
                ),
                (
                    "user_id",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
    ]
