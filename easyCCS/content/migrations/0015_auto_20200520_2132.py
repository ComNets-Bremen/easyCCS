# Generated by Django 3.0.6 on 2020-05-20 21:32

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0014_auto_20200520_2132'),
    ]

    operations = [
        migrations.RenameField(
            model_name='skill',
            old_name='isAliasFor',
            new_name='is_alias_for',
        ),
    ]
