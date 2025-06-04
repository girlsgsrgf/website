# set_webhook.py
import requests

TOKEN = "8155139765:AAHUTF9FcQ7SYqpDRMFR1VaCtcxyhl3F2Vg"
WEBHOOK_URL = "https://flyup.help/webhook/"

res = requests.get(f"https://api.telegram.org/bot{TOKEN}/setWebhook?url={WEBHOOK_URL}")
print(res.json())
