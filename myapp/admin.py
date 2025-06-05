from django.contrib import admin
from .models import CustomUser, Product, UserProduct

admin.site.register(CustomUser)
admin.site.register(Product)
admin.site.register(UserProduct)
