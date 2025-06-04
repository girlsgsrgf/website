from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Application, CommandHandler, ContextTypes
import os
import django
import sys

BOT_TOKEN = "8155139765:AAHUTF9FcQ7SYqpDRMFR1VaCtcxyhl3F2Vg"
CAPTION = "💰 Join and get an airdrop in our ecosystem! 🚀 Don’t miss your chance! 🌟"
IMAGE_URL = "https://yourdomain.com/static/image.png"  # Укажи публичный URL

# Создание приложения Telegram
application = Application.builder().token(BOT_TOKEN).build()

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    keyboard = [[InlineKeyboardButton("Start", url="https://t.me/flyupchainbot")]]
    reply_markup = InlineKeyboardMarkup(keyboard)

    await update.message.reply_photo(
        photo=IMAGE_URL,
        caption=CAPTION,
        reply_markup=reply_markup
    )

application.add_handler(CommandHandler("start", start))

# Для Django views.py — просто импортируем Application
telegram_application = application
