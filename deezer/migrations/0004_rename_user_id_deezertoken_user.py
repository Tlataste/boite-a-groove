# Generated by Django 4.2 on 2023-06-13 08:10

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("deezer", "0003_rename_user_deezertoken_user_id"),
    ]

    operations = [
        migrations.RenameField(
            model_name="deezertoken", old_name="user_id", new_name="user",
        ),
    ]
