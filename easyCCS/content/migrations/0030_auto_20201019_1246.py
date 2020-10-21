# Generated by Django 3.0.6 on 2020-10-19 12:46

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0029_auto_20201019_1239'),
    ]

    operations = [
        migrations.AlterField(
            model_name='wikidataentry',
            name='wikidata_id',
            field=models.CharField(help_text='The wikidata item id', max_length=12, unique=True, validators=[django.core.validators.RegexValidator('^Q([1-9][0-9]*)$', message='Invalid format. Should be Q<number>.')]),
        ),
    ]