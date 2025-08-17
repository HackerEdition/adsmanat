import os
from flask import Flask, request
import telebot
from telebot import types
from urllib.parse import urljoin

# Read token from environment; DO NOT hardcode your token in code.
API_TOKEN = os.environ.get("BOT_TOKEN", "").strip()
if not API_TOKEN:
    raise RuntimeError("Environment variable BOT_TOKEN is not set. Please set it in your hosting dashboard.")

WEBAPP_URL = os.environ.get("WEBAPP_URL", "https://example.com").strip()  # change this to your site if not using env var

bot = telebot.TeleBot(API_TOKEN)
server = Flask(__name__)

@bot.message_handler(commands=['start'])
def send_welcome(message):
    kb = types.InlineKeyboardMarkup()
    kb.add(types.InlineKeyboardButton(text="🚀 Başla", web_app=types.WebAppInfo(url=WEBAPP_URL)))
    bot.send_message(
        message.chat.id,
        "👋 Salam!\n\n💸 Pul qazanmaq istəyirsən?\n✨ Doğru məkandasan!\n\n👇 Başlamaq üçün kliklə və başla!",
        reply_markup=kb
    )

@server.route("/" + (API_TOKEN or "token"), methods=["POST"])
def telegram_webhook():
    update = telebot.types.Update.de_json(request.get_data(as_text=True))
    bot.process_new_updates([update])
    return "OK", 200

@server.route("/", methods=["GET"])
def index():
    # Auto-configure webhook to the current public URL
    base_url = request.url_root  # e.g., https://your-app.koyeb.app/
    webhook_url = urljoin(base_url, API_TOKEN)
    try:
        bot.remove_webhook()
        bot.set_webhook(url=webhook_url)
        msg = f"Webhook set to {webhook_url}"
    except Exception as e:
        msg = f"Failed to set webhook: {e}"
    return msg, 200

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))  # Koyeb uses 8080 by default
    server.run(host="0.0.0.0", port=port)