# Generated by Django 4.2.2 on 2023-06-20 16:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('box_management', '0003_deposit_user_alter_deposit_deposited_at'),
    ]

    operations = [
        migrations.AddField(
            model_name='deposit',
            name='note',
            field=models.CharField(blank=True, choices=[('rire', 'Cette chanson me fait rire !'), ('triste', 'Cette chanson me rend mélancolique !'), ('joie', 'Cette chanson me met de bonne humeur !')], max_length=50),
        ),
    ]
