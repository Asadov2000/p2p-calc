import crypto from 'crypto';

const rateMap = new Map();
const RATE_LIMIT_COUNT = 5; // messages
const RATE_LIMIT_WINDOW = 60 * 1000; // ms

function parseInitData(initDataString) {
  const parts = initDataString.split('&');
  const obj = {};
  for (const p of parts) {
    const [k, v] = p.split('=');
    if (k) obj[k] = decodeURIComponent(v || '');
  }
  return obj;
}

function verifyInitData(initDataString, botToken) {
  try {
    const data = parseInitData(initDataString);
    const hash = data.hash;
    if (!hash) return false;
    delete data.hash;
    const keys = Object.keys(data).sort();
    const dataCheckString = keys.map(k => `${k}=${data[k]}`).join('\n');
    const secret = crypto.createHash('sha256').update(botToken).digest();
    const hmac = crypto.createHmac('sha256', secret).update(dataCheckString).digest('hex');
    return hmac === hash;
  } catch (e) {
    return false;
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return res.status(500).json({ error: 'TELEGRAM_BOT_TOKEN not configured' });
  try {
    const { chatId, text, initData } = req.body;
    if (!chatId || !text) return res.status(400).json({ error: 'Missing chatId or text' });

    if (initData) {
      const ok = verifyInitData(initData, token);
      if (!ok) return res.status(403).json({ error: 'Invalid initData signature' });
    }

    const now = Date.now();
    const rate = rateMap.get(chatId) || { count: 0, first: now };
    if (now - rate.first > RATE_LIMIT_WINDOW) {
      rate.count = 0;
      rate.first = now;
    }
    rate.count += 1;
    rateMap.set(chatId, rate);
    if (rate.count > RATE_LIMIT_COUNT) return res.status(429).json({ error: 'Rate limit exceeded' });

    const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text })
    });
    const data = await r.json();
    return res.status(r.ok ? 200 : 400).json(data);
  } catch (e) {
    return res.status(500).json({ error: 'Failed to send message', details: String(e) });
  }
}
