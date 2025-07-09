from django.contrib import admin
from .models import CustomUser, Product, UserProduct
from .models import Business, UserBusiness, DailyRevenue, Referral

admin.site.register(CustomUser)
admin.site.register(Product)
admin.site.register(UserProduct)
admin.site.register(Referral)

@admin.register(Business)
class BusinessAdmin(admin.ModelAdmin):
    list_display = ('title', 'price', 'daily_profit')
    search_fields = ('title',)
    ordering = ('title',)


@admin.register(UserBusiness)
class UserBusinessAdmin(admin.ModelAdmin):
    list_display = ('user', 'business', 'quantity', 'last_paid')
    list_filter = ('business', 'last_paid')
    search_fields = ('user__username', 'business__title')
    ordering = ('user', 'business')


@admin.register(DailyRevenue)
class DailyRevenueAdmin(admin.ModelAdmin):
    list_display = ('user', 'business', 'amount', 'date')
    list_filter = ('date', 'business')
    search_fields = ('user__username', 'business__title')
    ordering = ('-date',)