# Generated by Django 3.0.6 on 2020-09-15 15:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0024_keyword'),
    ]

    operations = [
        migrations.AddField(
            model_name='content',
            name='content_keywords',
            field=models.ManyToManyField(blank=True, related_name='content_keyword', to='content.Keyword'),
        ),
        migrations.AddField(
            model_name='skill',
            name='skill_keywords',
            field=models.ManyToManyField(blank=True, related_name='skill_keyword', to='content.Keyword'),
        ),
    ]
