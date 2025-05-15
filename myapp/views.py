from django.shortcuts import render
from django.core.management import call_command
from django.http import HttpResponse
from django.http import JsonResponse

def index_view(request):
    return render(request, 'index.html')
# views.py

from django.shortcuts import redirect

def migrate(request):
    call_command('makemigrations', 'myapp')  # Replace 'app' with your app name
    call_command('migrate')
    return HttpResponse("Migrations complete.")
    
