from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Application, CommandHandler, ContextTypes, MessageHandler, filters
import os

BOT_TOKEN = "8155139765:AAHUTF9FcQ7SYqpDRMFR1VaCtcxyhl3F2Vg"
CAPTION = "💰 Join and get an airdrop in our ecosystem! 🚀 Don’t miss your chance! 🌟"
IMAGE_URL = "./image.png"

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