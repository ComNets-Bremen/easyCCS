# Generated by Django 3.0.2 on 2020-05-20 09:19

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0012_auto_20200316_1515'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='content',
            options={'ordering': ['-id']},
        ),
        migrations.AlterModelOptions(
            name='skill',
            options={'ordering': ['-id']},
        ),
    ]
