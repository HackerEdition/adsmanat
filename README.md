# Telegram Webhook Bot (Koyeb / Render)

This repo contains a minimal Flask + pyTelegramBotAPI app to run a Telegram bot with a WebApp button.

## Files
- `bot.py` — Flask server + Telegram webhook logic.
- `requirements.txt` — Python dependencies.
- `Procfile` — start command suitable for Render/Heroku-style platforms.

## Environment variables (set in dashboard)
- `BOT_TOKEN` — your Telegram bot token (e.g. 123456:ABC...).
- `WEBAPP_URL` — URL opened by the blue "Open" button (e.g. https://your-site.com).

## How to deploy on Koyeb (free tier)
1. Push these files to a GitHub repo.
2. Create an account at https://www.koyeb.com and click **Create Service** → **GitHub** → select your repo.
3. Build: Auto-detected (Python). Set **Start command** to: `gunicorn bot:server --bind 0.0.0.0:$PORT`
4. Set environment variables: `BOT_TOKEN`, `WEBAPP_URL`.
5. Deploy. After it's live, open the public URL in your browser — it will set the webhook automatically.
6. In Telegram, send `/start` to your bot. You should see the message with the blue WebApp button.

## How to deploy on Render (free web service)
1. Push these files to GitHub.
2. Create a service at https://render.com → **New** → **Web Service** → connect your repo.
3. Environment: Python 3. Start command: `gunicorn bot:server --bind 0.0.0.0:$PORT`
4. Add env vars `BOT_TOKEN` and `WEBAPP_URL`.
5. Deploy. The free plan spins down after 15 min inactivity; first request may be slow. Open the service URL once to set webhook, then test with `/start`.

## Local test
```
export BOT_TOKEN=YOUR_TOKEN
export WEBAPP_URL=https://example.com
python3 -m venv .venv && . .venv/bin/activate
pip install -r requirements.txt
python bot.py
```
Then POST updates to `http://localhost:8080/<BOT_TOKEN>` to simulate Telegram.