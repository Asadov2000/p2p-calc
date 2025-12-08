export function getTelegramUserId(): number | null {
  try {
    // @ts-ignore
    const tg = (window as any).Telegram;
    if (!tg?.WebApp?.initDataUnsafe) return null;
    return tg.WebApp.initDataUnsafe.user?.id ?? null;
  } catch (e) {
    return null;
  }
}

export async function sendMessageViaServer(chatId: number, text: string) {
  const res = await fetch('/api/sendMessage', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chatId, text })
  });
  return res.json();
}
