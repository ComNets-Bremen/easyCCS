# Generated by Django 3.0.6 on 2020-10-19 16:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0031_auto_20201019_1625'),
    ]

    operations = [
        migrations.AlterField(
            model_name='wikidataentry',
            name='wikidata_name',
            field=models.CharField(default='', max_length=100),
        ),
    ]