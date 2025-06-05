from django.shortcuts import render, redirect
from django.utils import timezone
from datetime import timedelta
from django.http import JsonResponse
from django.contrib.auth import login
from django.contrib.auth.decorators import login_required
from .forms import SignUpForm, SignInForm
from .models import Product, CustomUser, UserProduct, ProductListing
import random
from django.core.mail import send_mail
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
from .models import Product
from django.shortcuts import get_object_or_404
from django.contrib import messages
from django.db import transaction





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
    products = Product.objects.filter(supply__gt=0)

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

@login_required
def buy_view(request, product_id):
    product = get_object_or_404(Product, id=product_id)
    buyer = request.user

    if request.method == 'POST':
        try:
            quantity = int(request.POST.get('quantity', '1'))
        except ValueError:
            messages.error(request, "Неверное количество.")
            return render(request, 'buy.html', {'product': product})

        if quantity < 1:
            messages.error(request, "Количество должно быть не меньше 1.")
            return render(request, 'buy.html', {'product': product})

        total_price = 0
        remaining = quantity

        with transaction.atomic():
            # 1. Покупка у других пользователей
            listings = ProductListing.objects.filter(product=product).order_by('created_at')

            for listing in listings:
                if remaining == 0:
                    break

                to_buy = min(listing.quantity, remaining)
                cost = to_buy * listing.price

                if buyer.balance < total_price + cost:
                    messages.error(request, "Недостаточно средств для покупки.")
                    return render(request, 'buy.html', {'product': product})

                # Деньги продавцу
                listing.seller.balance += cost
                listing.seller.save()

                # Обновляем или удаляем listing
                listing.quantity -= to_buy
                if listing.quantity == 0:
                    listing.delete()
                else:
                    listing.save()

                # Добавляем товар покупателю
                user_product, _ = UserProduct.objects.get_or_create(user=buyer, product=product)
                user_product.quantity += to_buy
                user_product.save()

                total_price += cost
                remaining -= to_buy

            # 2. Если ещё осталась нужда в количестве — покупаем у системы
            if remaining > 0:
                if product.supply < remaining:
                    messages.error(request, f"Остаток: {quantity - remaining}. Не хватает {remaining} штук в наличии.")
                    return render(request, 'buy.html', {'product': product})

                cost = remaining * product.price
                if buyer.balance < total_price + cost:
                    messages.error(request, "Недостаточно средств для покупки у системы.")
                    return render(request, 'buy.html', {'product': product})

                product.supply -= remaining
                product.save()

                user_product, _ = UserProduct.objects.get_or_create(user=buyer, product=product)
                user_product.quantity += remaining
                user_product.save()

                total_price += cost

            # Финальное списание денег
            buyer.balance -= total_price
            buyer.save()

        messages.success(request, f"Вы купили {quantity} шт. {product.title} за ${total_price:.2f}")
        return redirect('buy_view', product_id=product.id)

    return render(request, 'buy.html', {'product': product})



@login_required
def sell_view(request, product_id):
    product = get_object_or_404(Product, id=product_id)
    user = request.user

    user_product = UserProduct.objects.filter(user=user, product=product).first()

    if not user_product or user_product.quantity == 0:
        messages.error(request, "У вас нет этого товара для продажи.")
        return render(request, 'buy.html', {'product': product})

    if request.method == 'POST':
        try:
            quantity_to_sell = int(request.POST.get('quantity', '1'))
        except ValueError:
            messages.error(request, "Неверное количество.")
            return render(request, 'buy.html', {'product': product, 'is_selling': True})

        if quantity_to_sell < 1 or quantity_to_sell > user_product.quantity:
            messages.error(request, "Неверное количество для продажи.")
            return render(request, 'buy.html', {'product': product, 'is_selling': True})

        # Можно позволить продавцу указать цену, иначе использовать базовую
        price = request.POST.get('price')
        try:
            price = float(price) if price else product.price
        except ValueError:
            price = product.price

        with transaction.atomic():
            user_product.quantity -= quantity_to_sell
            user_product.save()

            ProductListing.objects.create(
                seller=user,
                product=product,
                quantity=quantity_to_sell,
                price=price
            )

        messages.success(request, f"Вы выставили {quantity_to_sell} шт. {product.title} на продажу.")
        return redirect('buy_view', product_id=product.id)

    return render(request, 'buy.html', {
        'product': product,
        'user_product': user_product,
        'is_selling': True,
    })


@login_required
def my_products_api(request):
    user_products = UserProduct.objects.filter(user=request.user, quantity__gt=0)

    data = [
        {
            'id': up.product.id,
            'title': up.product.title,
            'description': up.product.description,
            'price': float(up.product.price),
            'quantity': up.quantity,
            'image': up.product.image_url,
        }
        for up in user_products
    ]
    return JsonResponse(data, safe=False)