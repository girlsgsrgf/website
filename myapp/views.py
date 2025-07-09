from django.shortcuts import render, redirect
from django.utils import timezone
from datetime import timedelta
from django.http import JsonResponse
from django.contrib.auth import login
from django.contrib.auth.decorators import login_required
from .models import Product, CustomUser, UserProduct
import random
from django.core.mail import send_mail
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
from .models import Product
from django.shortcuts import get_object_or_404
from django.contrib import messages
from django.db import transaction
from decimal import Decimal
from django.contrib.auth import get_user_model
from .models import Message 
from django.db.models import Q
from django.views.decorators.http import require_POST
from django.http import HttpResponseNotFound, HttpResponseForbidden
from .models import Business








def index_view(request):
    return render(request, 'index.html')

#def signup_view(request):
 #   if request.method == 'POST':
  #      form = SignUpForm(request.POST)
   #     if form.is_valid():
    #        user = form.save(commit=False)
     #       code = str(random.randint(100000, 999999))
      #      user.verification_code = code
       #     user.is_active = False
        #    user.save()
         #   send_mail(
          #      'Your FlyUp Verification Code',
           #     f'Your code is: {code}',
            #    settings.DEFAULT_FROM_EMAIL,
             #   [user.email],
              #  fail_silently=False,
            #)
            #return redirect('verify_email')
        #else:
         #   print(form.errors)
    #else:
     #   form = SignUpForm()
    #return render(request, 'signup.html', {'form': form})


#def signin_view(request):
 #   if request.method == 'POST':
  #      form = SignInForm(request, data=request.POST)
   #     if form.is_valid():
    #        user = form.get_user()
     #       if user.is_verified:
      #          login(request, user)
       #         return redirect('/')
        #    else:
         #       return redirect('verify_email')
    #else:
     #   form = SignInForm()
    #return render(request, 'signin.html', {'form': form})


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
    search = request.GET.get('search', '').strip()
    category = request.GET.get('category', '').strip()

    products = Product.objects.filter(supply__gt=0)

    if search:
        products = products.filter(title__icontains=search)

    if category:
        products = products.filter(category__iexact=category)

    data = [
        {
            'id': product.id,
            'title': product.title,
            'description': product.description,
            'price': float(product.price),
            'category': product.category,       # add category to the response
            'image': product.image_url,
        }
        for product in products
    ]

    return JsonResponse(data, safe=False)


def buy_view(request, product_id):
    product = get_object_or_404(Product, id=product_id)
    is_selling = request.GET.get('mode') == 'sell'
    user_id = request.GET.get('user_id')
    referral_code = request.GET.get('ref')

    if user_id:
        request.session['user_id'] = user_id
    else:
        user_id = request.session.get('user_id')

    if not user_id:
        return HttpResponseForbidden("User ID is required")

    buyer, created = CustomUser.objects.get_or_create(
        telegram_id=user_id,
        defaults={'username': f'user_{user_id}'}
    )

    if created:
        referred_by = None
        if referral_code:
            try:
                referrer = Referral.objects.get(code=referral_code).user
                referred_by = referrer
                referrer.balance += 20000
                referrer.save()
            except Referral.DoesNotExist:
                pass

        Referral.objects.create(user=buyer, referred_by=referred_by)

    new_balance = request.session.pop('new_balance', None)

    context = {
        'product': product,
        'new_balance': new_balance,
        'is_selling': is_selling,
        'user_product': UserProduct.objects.filter(user=buyer, product=product).first() if is_selling else None
    }

    if request.method == 'POST':
        try:
            quantity = int(request.POST.get('quantity', '1'))
        except ValueError:
            messages.error(request, "Incorrect quantity.")
            return render(request, 'buy.html', context)

        if quantity < 1:
            messages.error(request, "The quantity must be at least 1.")
            return render(request, 'buy.html', context)

        cost = quantity * product.price

        if product.supply < quantity:
            messages.error(request, f"Only {product.supply} units available.")
            return render(request, 'buy.html', context)

        if buyer.balance < cost:
            messages.error(request, "Insufficient funds.")
            return render(request, 'buy.html', context)

        with transaction.atomic():
            product.supply -= quantity
            product.update_dynamic_price()
            product.save()

            buyer.balance -= cost
            buyer.save()

            user_product, _ = UserProduct.objects.get_or_create(user=buyer, product=product)
            user_product.quantity += quantity
            user_product.save()

        request.session['new_balance'] = float(buyer.balance)
        messages.success(request, f"You purchased {quantity} units of {product.title} for ${cost:.2f}.")
        return redirect(f'/buy/{product.id}/?user_id={user_id}')

    return render(request, 'buy.html', context)


def sell_view(request, product_id):
    product = get_object_or_404(Product, id=product_id)

    user_id = request.GET.get('user_id')
    if user_id:
        request.session['user_id'] = user_id
    else:
        user_id = request.session.get('user_id')

    if not user_id:
        return HttpResponseForbidden("User ID is required")

    user = get_object_or_404(CustomUser, telegram_id=user_id)
    user_product = UserProduct.objects.filter(user=user, product=product).first()

    if not user_product or user_product.quantity == 0:
        messages.error(request, "You don't have this product to sell.")
        return render(request, 'buy.html', {'product': product, 'is_selling': True})

    if request.method == 'POST':
        try:
            quantity_to_sell = int(request.POST.get('quantity', '1'))
        except ValueError:
            messages.error(request, "Invalid quantity.")
            return render(request, 'buy.html', {'product': product, 'user_product': user_product, 'is_selling': True})

        if quantity_to_sell < 1 or quantity_to_sell > user_product.quantity:
            messages.error(request, "Invalid quantity for sale.")
            return render(request, 'buy.html', {'product': product, 'user_product': user_product, 'is_selling': True})

        price_per_unit = product.price * Decimal('0.9')  # Продаём системе дешевле, напр. на 10%
        total_revenue = quantity_to_sell * price_per_unit

        with transaction.atomic():
            user_product.quantity -= quantity_to_sell
            user_product.save()

            product.supply += quantity_to_sell
            product.update_dynamic_price()
            product.save()

            user.balance += total_revenue
            user.save()

            request.session['new_balance'] = float(user.balance)


        messages.success(request, f"You sold {quantity_to_sell} units of {product.title} for ${total_revenue:.2f}.")

        from django.urls import reverse
        return redirect(f"{reverse('buy_view', args=[product.id])}?user_id={user_id}&mode=sell")

    return render(request, 'buy.html', {
        'product': product,
        'user_product': user_product,
        'is_selling': True,
    })

def my_products_api(request):
    user_id = request.GET.get('user_id')
    if not user_id:
        return JsonResponse([], safe=False)

    user = get_object_or_404(CustomUser, telegram_id=user_id)
    user_products = UserProduct.objects.filter(user=user, quantity__gt=0)

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


User = get_user_model()

    
@csrf_exempt
def search_users(request):
    user_id = request.GET.get('user_id')
    q = request.GET.get('q', '')

    if not user_id:
        return JsonResponse({'error': 'Missing user_id'}, status=400)

    try:
        current_user = CustomUser.objects.get(telegram_id=user_id)
    except CustomUser.DoesNotExist:
        return JsonResponse({'error': 'Current user not found'}, status=404)

    users = CustomUser.objects.filter(username__icontains=q).exclude(id=current_user.id)[:10]
    results = [{'id': u.id, 'username': u.username} for u in users]
    return JsonResponse({'results': results})



def get_messages(request, user_id):
    current_user = request.user
    current_user_id = current_user.id
    try:
        target = CustomUser.objects.get(id=user_id)
    except CustomUser.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)

    messages = Message.objects.filter(
        sender__in=[request.user, target],
        recipient__in=[request.user, target]
    ).order_by('timestamp')

    data = [
        {
            'id': m.id,
            'sender': m.sender.username,
            'recipient': m.recipient.username,
            'content': m.content,
            'media_url': m.media.url if hasattr(m, 'media') and m.media else None,
            'media_type': getattr(m, 'media_type', None),
            'timestamp': m.timestamp.strftime('%Y-%m-%d %H:%M')
        }
        for m in messages
    ]
    return JsonResponse({'messages': data, 'current_user_id': current_user_id})


@csrf_exempt
def send_message(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST allowed'}, status=405)

    receiver_id = request.POST.get('receiver_id')
    content = request.POST.get('content', '')
    file = request.FILES.get('media')

    try:
        receiver = CustomUser.objects.get(id=receiver_id)
    except CustomUser.DoesNotExist:
        return JsonResponse({'error': 'Receiver not found'}, status=404)

    media_type = None
    if file:
        ext = file.name.split('.')[-1].lower()
        if ext in ['jpg', 'jpeg', 'png', 'gif']:
            media_type = 'image'
        elif ext in ['mp4', 'mov', 'avi']:
            media_type = 'video'
        elif ext in ['mp3', 'wav']:
            media_type = 'audio'
        elif ext in ['pdf', 'docx', 'txt']:
            media_type = 'document'
        else:
            return JsonResponse({'error': 'Unsupported file type'}, status=400)

    message = Message.objects.create(
        sender=request.user,
        recipient=receiver,
        content=content,
        media=file,
        media_type=media_type,
        timestamp=timezone.now()
    )

    return JsonResponse({
        'status': 'sent',
        'message': {
            'id': message.id,
            'sender': message.sender.username,
            'recipient': message.recipient.username,
            'content': message.content,
            'media_url': message.media.url if message.media else None,
            'media_type': message.media_type,
            'timestamp': message.timestamp.strftime('%Y-%m-%d %H:%M'),
        }
    })

@csrf_exempt
def save_balance(request):
    user_id = request.GET.get('user_id')
    balance = request.GET.get('balance')
    user_name = f'user_{user_id}'

    if not user_id or balance is None:
        return JsonResponse({'error': 'Missing user_id or balance'}, status=400)

    try:
        balance = float(balance)
    except ValueError:
        return JsonResponse({'error': 'Invalid balance value'}, status=400)

    if not user_name:
        user_name = f'user_{user_id}'  # если имя не передано — резервное

    user, created = CustomUser.objects.get_or_create(
        telegram_id=user_id,
        defaults={'username': user_name, 'balance': balance}
    )

    if not created:
        user.balance = balance
        user.save()

    return JsonResponse({
        'status': 'success',
        'user_id': user_id,
        'balance': user.balance,
        'created': created,
    })


    
def get_user_wealth(request):
    user_id = request.GET.get('user_id')
    username = f'user_{user_id}'

    try:
        user = CustomUser.objects.get(telegram_id=user_id)
    except CustomUser.DoesNotExist:
        original_username = username
        suffix = 0
        while CustomUser.objects.filter(username=username).exists():
            suffix = random.randint(100, 999)
            username = f"{original_username}_{suffix}"

        user = CustomUser.objects.create(
            telegram_id=user_id,
            username=username
        )

    user_products = UserProduct.objects.filter(user=user, quantity__gt=0)
    products_value = sum([
        up.quantity * up.product.price for up in user_products
    ])

    return JsonResponse({
        'username': user.username,
        'products_value': round(products_value, 2)
    })


@csrf_exempt
def buy_business(request):
    if request.method == "POST":
        user_id = request.POST.get("user_id")
        business_id = request.POST.get("business_id")

        try:
            user = User.objects.get(id=user_id)
            business = Business.objects.get(id=business_id)
        except (User.DoesNotExist, Business.DoesNotExist):
            return JsonResponse({"error": "User or business not found"}, status=404)

        if user.balance < business.price:
            return JsonResponse({"error": "Insufficient balance"}, status=400)

        # Списываем баланс
        user.balance -= business.price
        user.save()

        # Создаем UserBusiness, если уже есть — увеличиваем quantity
        user_business, created = UserBusiness.objects.get_or_create(user=user, business=business)
        if not created:
            user_business.quantity += 1
            user_business.save()

        return JsonResponse({"success": True, "new_balance": str(user.balance)})

    return JsonResponse({"error": "Invalid method"}, status=405)


def list_businesses(request):
    businesses = Business.objects.all()
    data = [
        {
            "id": b.id,
            "title": b.title,
            "price": str(b.price),
            "daily_profit": str(b.daily_profit),
        }
        for b in businesses
    ]
    return JsonResponse(data, safe=False)