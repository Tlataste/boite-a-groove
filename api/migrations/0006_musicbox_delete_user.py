# Generated by Django 4.1.7 on 2023-04-25 18:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_alter_user_id_alter_user_password_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='MusicBox',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=15, unique=True)),
                ('address', models.CharField(max_length=15)),
            ],
        ),
        migrations.DeleteModel(
            name='User',
        ),
    ]