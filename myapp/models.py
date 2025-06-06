from django.db import models
from django.contrib.auth.models import AbstractUser
from decimal import Decimal, ROUND_HALF_UP

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    balance = models.DecimalField(max_digits=12, decimal_places=2, default=15.00)
    is_verified = models.BooleanField(default=False)
    verification_code = models.CharField(max_length=6, blank=True, null=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

class Product(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    base_price = models.DecimalField(max_digits=10, decimal_places=2, default=10.00)  # fixed base
    supply = models.PositiveIntegerField(default=0)  # добавляем это поле
    owner = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, blank=True, related_name='owned_products')

    def update_dynamic_price(self):
        # Спрос — сколько товара у пользователей
        total_demand = UserProduct.objects.filter(product=self).aggregate(
            total=models.Sum('quantity')
        )['total'] or 0

        # Предложение — сколько товара у системы + выставлено на продажу
        total_listing = ProductListing.objects.filter(product=self).aggregate(
            total=models.Sum('quantity')
        )['total'] or 0

        total_supply = self.supply + total_listing or 1  # avoid division by zero

        demand_factor = (Decimal(total_demand) - Decimal(total_supply)) / Decimal(total_supply)

        # Ценовой коэффициент (10% за единицу спроса сверх предложения)
        price_multiplier = Decimal('1.0') + Decimal('0.1') * demand_factor

        # Новая цена
        new_price = (self.base_price * price_multiplier).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)

        # Не ниже базовой цены
        if new_price < self.base_price:
            new_price = self.base_price

        self.price = new_price
        self.save()

    @property
    def image_url(self):
        return f'/static/products/id{self.id}.png'

    def __str__(self):
        return self.title

class UserProduct(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=0)

    class Meta:
        unique_together = ('user', 'product')

class ProductListing(models.Model):
    seller = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)  # можно дать возможность указывать цену
    created_at = models.DateTimeField(auto_now_add=True)


class Message(models.Model):
    sender = models.ForeignKey('CustomUser', on_delete=models.CASCADE, related_name='sent_messages')
    recipient = models.ForeignKey('CustomUser', on_delete=models.CASCADE, related_name='received_messages')
    content = models.TextField(blank=True)
    media = models.FileField(upload_to='message_media/', blank=True, null=True)
    media_type = models.CharField(max_length=20, blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    class Meta:
        ordering = ['timestamp']

    def __str__(self):
        return f"From {self.sender} to {self.recipient} at {self.timestamp}"