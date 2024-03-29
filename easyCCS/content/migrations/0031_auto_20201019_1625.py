# Generated by Django 3.0.6 on 2020-10-19 16:25

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0030_auto_20201019_1246'),
    ]

    operations = [
        migrations.AddField(
            model_name='wikidataentry',
            name='wikidata_name',
            field=models.CharField(default='', max_length=100),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='wikidataentry',
            name='wikidata_id',
            field=models.CharField(help_text='The wikidata item id', max_length=12, unique=True, validators=[django.core.validators.RegexValidator('^Q[1-9]\\d*$', message='Invalid format. Should be Q<number>.')]),
        ),
    ]
