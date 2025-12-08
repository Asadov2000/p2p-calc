Как интегрировать Telegram WebApp и отправлять сообщения через сервер

1) Добавьте `TELEGRAM_BOT_TOKEN` как секрет в Vercel/GitHub/Netlify

2) На фронтенде используйте `getTelegramUserId()` из `src/shared/lib/telegramClient.ts`

3) Отправляйте запрос на `POST /api/sendMessage` с `{ chatId, text }` — endpoint использует `TELEGRAM_BOT_TOKEN` на сервере

4) Важно: бот может отправлять сообщения только пользователям, которые начали с ним диалог
