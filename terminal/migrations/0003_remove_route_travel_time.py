# Generated by Django 3.1.7 on 2021-03-23 23:36

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('terminal', '0002_auto_20210323_1740'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='route',
            name='travel_time',
        ),
    ]