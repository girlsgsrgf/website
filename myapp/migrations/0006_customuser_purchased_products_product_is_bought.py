# Generated by Django 5.2.1 on 2025-06-04 14:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0005_remove_product_image'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='purchased_products',
            field=models.ManyToManyField(blank=True, to='myapp.product'),
        ),
        migrations.AddField(
            model_name='product',
            name='is_bought',
            field=models.BooleanField(default=False),
        ),
    ]
