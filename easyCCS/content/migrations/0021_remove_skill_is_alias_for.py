# Generated by Django 3.0.6 on 2020-07-23 09:27

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0020_auto_20200723_0831'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='skill',
            name='is_alias_for',
        ),
    ]