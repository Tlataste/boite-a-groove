# Generated by Django 5.0.4 on 2024-06-17 10:38

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("box_management", "0015_alter_deposit_note"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="song",
            name="n_deposits",
        ),
        migrations.RemoveField(
            model_name="song",
            name="song_id",
        ),
    ]
