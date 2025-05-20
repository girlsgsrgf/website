from django.shortcuts import render
from django.core.management import call_command
from django.http import HttpResponse
from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from .forms import SignUpForm, SignInForm
from .models import CustomUser
from django.contrib.auth.decorators import login_required
import random
from django.core.mail import send_mail
from django.conf import settings

def index_view(request):
    return render(request, 'index.html')
# views.py



def signup_view(request):
    if request.method == 'POST':
        form = SignUpForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)
            code = str(random.randint(100000, 999999))
            user.verification_code = code
            user.is_active = False
            user.save()
            send_mail(
                'Your FlyUp Verification Code',
                f'Your code is: {code}',
                settings.DEFAULT_FROM_EMAIL,
                [user.email],
                fail_silently=False  # чтобы увидеть ошибки отправки
            )
            return redirect('verify_email')
        else:
            print(form.errors)  # для отладки
    else:
        form = SignUpForm()
    return render(request, 'signup.html', {'form': form})


def signin_view(request):
    if request.method == 'POST':
        form = SignInForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            if user.is_verified:
                login(request, user)
                return redirect('/')
            else:
                return redirect('verify_email')
    else:
        form = SignInForm()
    return render(request, 'signin.html', {'form': form})

def verify_email(request):
    if request.method == 'POST':
        code = request.POST.get('code')
        user = CustomUser.objects.filter(verification_code=code).first()
        if user:
            user.is_verified = True
            user.is_active = True
            user.verification_code = ''
            user.save()
            login(request, user)
            return redirect('/')
    return render(request, 'verification_code.html')


def check_auth(request):
    return JsonResponse({'authenticated': request.user.is_authenticated})



@login_required
def get_user_balance(request):
    user = request.user
    return JsonResponse({'balance': float(user.balance)})