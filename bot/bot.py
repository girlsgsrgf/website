from telegram import InlineKeyboardButton, InlineKeyboardMarkup, Update
from telegram.ext import ApplicationBuilder, CommandHandler, ContextTypes
import logging

# Enable logging
logging.basicConfig(level=logging.INFO)

BOT_TOKEN = "8155139765:AAHUTF9FcQ7SYqpDRMFR1VaCtcxyhl3F2Vg"  # Replace this with the token you get from @BotFather
IMAGE_URL = "image.png"  # Replace with your image URL

CAPTION = "💰 Join and get an airdrop in our ecosystem! 🚀 Don’t miss your chance! 🌟"

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    # Create an inline keyboard with a URL button
    keyboard = [
        [InlineKeyboardButton("Start", url="https://t.me/flyupchainbot/flyup")]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)

    # Send photo with caption and button in the same message
    await update.message.reply_photo(
        photo=IMAGE_URL,
        caption=CAPTION,
        reply_markup=reply_markup
    )

if __name__ == "__main__":
    app = ApplicationBuilder().token(BOT_TOKEN).build()
    app.add_handler(CommandHandler("start", start))

    print("Bot is running...")
    app.run_polling()
