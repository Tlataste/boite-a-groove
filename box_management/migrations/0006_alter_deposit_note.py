# Generated by Django 4.2.2 on 2023-06-20 18:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('box_management', '0005_merge_0004_deposit_note_0004_discoveredsong'),
    ]

    operations = [
        migrations.AlterField(
            model_name='deposit',
            name='note',
            field=models.CharField(blank=True, choices=[('calme', "Cette chanson m'apaise et me détend !"), ('danse', 'Cette chanson me donne envie de danser !'), ('inspire', 'Cette chanson me pousse à être créatif !'), ('joie', 'Cette chanson me met de bonne humeur !'), ('motive', 'Cette chanson me motive pour la journée !'), ('reflexion', 'Cette chanson me fait réfléchir sur la vie.'), ('rire', 'Cette chanson me fait rire !'), ('triste', 'Cette chanson me rend mélancolique !')], max_length=50),
        ),
    ]
