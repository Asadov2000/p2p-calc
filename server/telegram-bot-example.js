const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
  console.error('TELEGRAM_BOT_TOKEN is not set.');
  process.exit(1);
}

// If you want to test locally, set TEST_CHAT_ID environment variable to a numeric chat id
const chatId = process.env.TEST_CHAT_ID || null;

async function sendMessage(chatId, text) {
  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  const payload = { chat_id: chatId, text };
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}

(async () => {
  if (!chatId) {
    console.log('No TEST_CHAT_ID provided. To test, set TEST_CHAT_ID env var.');
    return;
  }
  try {
    const r = await sendMessage(chatId, 'Test message from p2p-calc backend');
    console.log('Response:', r);
  } catch (e) {
    console.error('Failed to send:', e);
  }
})();
