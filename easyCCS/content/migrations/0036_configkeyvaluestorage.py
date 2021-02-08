# Generated by Django 3.0.6 on 2021-02-08 17:05

import content.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0035_wikidataentry_wikidata_related_fields'),
    ]

    operations = [
        migrations.CreateModel(
            name='ConfigKeyValueStorage',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('config_key', models.CharField(max_length=100, unique=True)),
                ('config_value', models.CharField(help_text='A python expression like "abc", [1, 2, 3], True etc.', max_length=100, validators=[content.models.is_valid_python])),
            ],
        ),
    ]
