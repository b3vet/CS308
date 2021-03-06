# Generated by Django 3.2 on 2021-05-22 21:03

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0014_auto_20210522_1639'),
    ]

    operations = [
        migrations.AddField(
            model_name='orderhasproducts',
            name='orderedPrice',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='products',
            name='did',
            field=models.ForeignKey(blank=True, db_column='discount', default=None, null=True, on_delete=django.db.models.deletion.SET_NULL, to='backend.discount'),
        ),
    ]
