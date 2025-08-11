# ADSMANAT – Telegram Mini App

Neon-themed Telegram Mini App with daily ad views awarding tickets. Front-end (HTML/CSS/JS) + PHP backend (PDO, MySQL, secure Telegram auth).

## Deploy (InfinityFree)

1. Create MySQL DB and note credentials.
2. Upload all files to your hosting root (keep folder structure).
3. Edit `api/config.php` and fill `TELEGRAM_BOT_TOKEN` with your bot token.
4. Import SQL schema into your DB using phpMyAdmin:
   - Open phpMyAdmin for your DB
   - Paste contents of `api/schema.sql` and run
5. In BotFather, set Web App URL to your domain (HTTPS required). Use the same domain for serving the app.

## Security
- The bot token exists only on the server in `api/config.php`.
- All API calls require Telegram `initData` which is verified on the server.
- Uses prepared statements (PDO) and server-side daily limit checks.

## Endpoints
- `POST /api/init.php` { init_data }
- `POST /api/get_user.php` { init_data }
- `POST /api/watch_ad.php` { init_data }

## Dev notes
- Front-end pulls `initData` from Telegram WebApp. For local tests, pass `?tgWebAppData=...` in URL.
- Daily ad limit is `20` (see `DAILY_AD_LIMIT`).