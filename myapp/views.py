from django.shortcuts import render, redirect
from django.utils import timezone
from datetime import timedelta
from django.http import JsonResponse
from django.contrib.auth import login
from django.contrib.auth.decorators import login_required
from .forms import SignUpForm, SignInForm
from .models import CustomUser
import random
from django.core.mail import send_mail
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
from .models import Product
from django.shortcuts import get_object_or_404



def index_view(request):
    return render(request, 'index.html')


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
                fail_silently=False,
            )
            return redirect('verify_email')
        else:
            print(form.errors)
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
    # Можно добавить CORS заголовки если требуется для фронта
    return JsonResponse({'authenticated': request.user.is_authenticated})

@login_required
def get_user_balance(request):
    user = request.user
    return JsonResponse({
        'balance': float(user.balance)
    })


def product_list(request):
    products = Product.objects.filter(is_bought=False)

    data = [
        {
            'id': product.id,
            'title': product.title,
            'description': product.description,
            'price': float(product.price),
            'image': product.image_url
        } for product in products
    ]
    return JsonResponse(data, safe=False)


def buy_view(request, product_id):
    product = Product.objects.filter(id=product_id, is_bought=False).first()
    user = request.user

    if not product:
        messages.error(request, "Product not found or already bought.")
        return redirect('/')

    if request.method == 'POST':
        if user.balance < product.price:
            messages.error(request, "Not enough balance.")
        else:
            user.balance -= product.price
            user.save()
            product.is_bought = True
            product.save()
            user.purchased_products.add(product)
            messages.success(request, "Product successfully purchased!")
            return redirect('/marketplace/')  # или куда нужно

    return render(request, 'buy.html', {'product': product})