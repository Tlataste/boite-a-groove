# Generated by Django 4.2 on 2023-06-15 13:33

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        (
            "box_management",
            "0006_box_max_deposit_alter_locationpoint_latitude_and_more",
        ),
    ]

    operations = [
        migrations.RenameField(
            model_name="box", old_name="max_deposit", new_name="max_deposits",
        ),
    ]
