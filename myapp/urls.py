from django.urls import path, re_path
from django.views.generic import TemplateView
from django.views.static import serve
from django.conf import settings
import os
from . import views
from django.contrib.auth.models import User
from django.http import HttpResponse
from .views import get_user_balance


def create_superuser(request):
    if not User.objects.filter(username="admin").exists():
        User.objects.create_superuser("admin", "admin@example.com", "admin123")
        return HttpResponse("Superuser created.")
    return HttpResponse("Superuser already exists.")


urlpatterns = [
    # Serve the main index.html (React entry point)
    path('', TemplateView.as_view(template_name='index.html')),

    # Serve static files manually (for dev only)
    re_path(r'^manifest\.json$', serve, {
        'path': 'manifest.json',
        'document_root': os.path.join(settings.BASE_DIR, 'frontend/build'),
    }),
    re_path(r'^logo192\.png$', serve, {
        'path': 'logo192.png',
        'document_root': os.path.join(settings.BASE_DIR, 'frontend/build'),
    }),
    re_path(r'^favicon\.ico$', serve, {
        'path': 'favicon.ico',
        'document_root': os.path.join(settings.BASE_DIR, 'frontend/build'),
    }),

    # Serve your custom icon images like /icons/home.png
    re_path(r'^icons/(?P<path>.*)$', serve, {
        'document_root': os.path.join(settings.BASE_DIR, 'frontend/build/icons'),
    }),
    path('create-superuser/', create_superuser),
    path('signup/', views.signup_view, name='signup'),
    path('signin/', views.signin_view, name='signin'),
    path('verify/', views.verify_email, name='verify_email'),
    path('api/check-auth/', views.check_auth, name='check_auth'),
    path('api/get-balance/', get_user_balance, name='get_user_balance'),
    path('api/products/', views.product_list, name='product_list'),
    path('buy/<int:product_id>/', views.buy_view, name='buy_view'),
    path('api/my-products/', views.my_products_api, name='my_products_api')

]