from django.db import models
from django.contrib.auth.models import AbstractUser
from decimal import Decimal, ROUND_HALF_UP
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.db import models
from django.conf import settings 
from django.db.models import Sum
import random
import string

def generate_unique_code():
    while True:
        code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
        if not Referral.objects.filter(code=code).exists():
            return code

class CustomUserManager(BaseUserManager):
    def create_user(self, telegram_id, username, password=None, **extra_fields):
        if not telegram_id:
            raise ValueError('The Telegram ID is required')
        user = self.model(telegram_id=telegram_id, username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, telegram_id, username, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(telegram_id, username, password, **extra_fields)

class CustomUser(AbstractBaseUser, PermissionsMixin):
    telegram_id = models.BigIntegerField(unique=True, null=False, blank=False)
    username = models.CharField(max_length=150, unique=True)
    balance = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    is_staff = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = 'telegram_id'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.username


class Referral(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='referral_profile'
    )
    code = models.CharField(max_length=6, unique=True, default=generate_unique_code)
    referred_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='referrals_made'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} → {self.code}"

class Product(models.Model):
    title = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=100, default="Uncategorized") 
    base_price = models.DecimalField(max_digits=10, decimal_places=2, default=10.00)  # fixed base
    supply = models.PositiveIntegerField(default=0)  # добавляем это поле
    owner = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, blank=True, related_name='owned_products')

    def update_dynamic_price(self):
    
        # Спрос — сколько товара у пользователей
        total_demand = UserProduct.objects.filter(product=self).aggregate(
            total=Sum('quantity')
        )['total'] or 0

        # Предложение — только у системы
        total_supply = self.supply or 1  # защита от деления на 0

        # Разница между спросом и предложением
        demand_factor = (Decimal(total_demand) - Decimal(total_supply)) / Decimal(total_supply)

        # Ценовой коэффициент — рост/падение на 10% за каждую единицу относительного спроса
        price_multiplier = Decimal('1.0') + Decimal('0.1') * demand_factor

        # Новая цена
        new_price = (self.base_price * price_multiplier).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)

        # Минимум — базовая цена
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

class Business(models.Model):
    title = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    daily_profit = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))

    @property
    def image_url(self):
        return f'/static/business/id{self.id}.png'

    def __str__(self):
        return f"{self.title} (${self.price}) +${self.daily_profit}/day"


class UserBusiness(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    business = models.ForeignKey(Business, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    last_paid = models.DateField(null=True, blank=True)  # Когда последний раз начисляли прибыль

    def __str__(self):
        return f"{self.user} owns {self.quantity} x {self.business.title}"

    def pay_revenue(self):
        today = timezone.now().date()
        if self.last_paid == today:
            return Decimal('0.00')  # Уже выплачено сегодня

        total_profit = self.business.daily_profit * self.quantity
        self.user.balance += total_profit
        self.user.save()

        self.last_paid = today
        self.save()

        # Optional: track history
        DailyRevenue.objects.create(
            user=self.user,
            business=self.business,
            amount=total_profit,
            date=today
        )
        return total_profit


class DailyRevenue(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    business = models.ForeignKey(Business, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateField()

    def __str__(self):
        return f"{self.user} earned ${self.amount} from {self.business} on {self.date}"