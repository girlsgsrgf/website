from django.contrib import admin
from .models import CustomUser, Product

admin.site.register(CustomUser)
admin.site.register(Product)
