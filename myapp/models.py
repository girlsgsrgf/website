# models.py
from django.db import models

class TelegramUser(models.Model):
    telegram_id = models.BigIntegerField(unique=True)
    username = models.CharField(max_length=150, blank=True)
    page_url = models.CharField(max_length=255, blank=True)  # /user/12345
    balance = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.telegram_id} - {self.balance}"
