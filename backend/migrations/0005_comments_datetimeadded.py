# Generated by Django 3.1.5 on 2021-04-16 19:09

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0004_products_avgrating'),
    ]

    operations = [
        migrations.AddField(
            model_name='comments',
            name='dateTimeAdded',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
    ]