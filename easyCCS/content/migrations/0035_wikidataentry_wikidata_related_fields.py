# Generated by Django 3.0.6 on 2020-10-21 09:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0034_auto_20201021_0836'),
    ]

    operations = [
        migrations.AddField(
            model_name='wikidataentry',
            name='wikidata_related_fields',
            field=models.ManyToManyField(blank=True, help_text='Related fields available in this installations.', related_name='_wikidataentry_wikidata_related_fields_+', to='content.WikidataEntry'),
        ),
    ]
