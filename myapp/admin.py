from django.contrib import admin
from .models import CustomUser, Product, UserProduct, ProductListing

admin.site.register(CustomUser)
admin.site.register(Product)
admin.site.register(UserProduct)
admin.site.register(ProductListing)