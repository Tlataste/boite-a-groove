# Generated by Django 4.2 on 2023-06-12 12:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("box_management", "0004_rename_n_platform_song_platform_id"),
    ]

    operations = [
        migrations.AlterField(
            model_name="box", name="client_name", field=models.CharField(max_length=50),
        ),
        migrations.AlterField(
            model_name="box", name="url", field=models.SlugField(blank=True),
        ),
    ]
