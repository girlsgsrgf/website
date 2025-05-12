from django.shortcuts import render
from django.core.management import call_command
from django.http import HttpResponse

def index_view(request):
    return render(request, 'index.html')
# views.py

from django.shortcuts import redirect
from .models import TelegramUser

def user_redirect(request, telegram_id):
    user, created = TelegramUser.objects.get_or_create(telegram_id=telegram_id)

    if created:
        user.page_url = f"/user/{telegram_id}/"
        user.save()

    return redirect(user.page_url)

def migrate(request):
    call_command('makemigrations', 'myapp')  # Replace 'app' with your app name
    call_command('migrate')
    return HttpResponse("Migrations complete.")
    
# views.py
from django.http import JsonResponse

def get_user_data(request, telegram_id):
    try:
        user = TelegramUser.objects.get(telegram_id=telegram_id)
        return JsonResponse({'balance': user.balance, 'telegram_id': user.telegram_id})
    except TelegramUser.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)