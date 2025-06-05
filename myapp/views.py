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
from django.contrib import messages




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


from django.db import transaction

@login_required
def buy_view(request, product_id):
    product = get_object_or_404(Product, id=product_id)
    buyer = request.user

    if product.owner == buyer:
        if product.owner == buyer:
            messages.error(request, "You already own this product.")
            return render(request, 'buy.html', {'product': product})


    if not product.is_bought:
        # Товар на продаже (is_bought = False), значит можно купить
        if buyer.balance < product.price:
            messages.error(request, "You don't have enough balance to buy this product.")
            return redirect('buy_view', product_id=product_id)

        if request.method == 'POST':
            with transaction.atomic():
                seller = product.owner  # может быть None, если товар изначально без владельца

                # Списываем деньги с покупателя
                buyer.balance -= product.price
                buyer.save()

                # Если продавец есть (т.е. это перепродажа), переводим деньги ему
                if seller and seller != buyer:
                    seller.balance += product.price
                    seller.save()

                # Передаем право собственности покупателю
                product.owner = buyer
                product.is_bought = True
                product.save()

            messages.success(request, "Product purchased successfully!")
            return redirect('buy_view', product_id=product_id)
    else:
        messages.error(request, "Product is already bought.")
        return redirect('buy_view', product_id=product_id)

    return render(request, 'buy.html', {'product': product})


@login_required
def sell_view(request, product_id):
    product = get_object_or_404(Product, id=product_id)
    user = request.user

    if product.owner != user:
        messages.error(request, "You are not the owner of this product.")
        return redirect('buy_view', product_id=product_id)

    if request.method == 'POST':
        # Выставляем товар на маркетплейс
        product.is_bought = False
        product.price = Decimal('50.00')  # фиксированная цена перепродажи
        product.save()

        messages.success(request, "Product is now on sale for $50.")
        return redirect('buy_view', product_id=product_id)

    return render(request, 'buy.html', {'product': product})



@login_required
def my_products_api(request):
    products = Product.objects.filter(owner=request.user)
    data = [{
        'id': p.id,
        'title': p.title,
        'description': p.description,
        'price': float(p.price),
        'image': p.image_url,
    } for p in products]
    return JsonResponse(data, safe=False)
