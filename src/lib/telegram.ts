import { OrderItem } from '@/types';

interface TelegramOrderPayload {
  customer_name: string;
  customer_phone: string;
  telegram_username?: string;
  items: OrderItem[];
  total_price: number;
}

export async function sendTelegramOrderNotification(order: TelegramOrderPayload): Promise<{
  success: boolean;
  message?: string;
}> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId || token.includes('ABCdefGHI') || chatId === '123456789') {
    console.warn(
      '[Telegram] Bot token yoki Chat ID to‘g‘ri sozlanmagan (.env.local faylida TELEGRAM_BOT_TOKEN va TELEGRAM_CHAT_ID tekshiring).'
    );
    return {
      success: false,
      message: 'Telegram sozlamalari to‘liq emas, ammo buyurtma bazaga qabul qilindi.',
    };
  }

  // Format currency
  const formatSum = (amount: number) =>
    amount.toLocaleString('ru-RU').replace(/,/g, ' ') + ' so‘m';

  // Build items list
  const itemsText = order.items
    .map(
      (item, idx) =>
        `${idx + 1}. <b>${escapeHtml(item.name)}</b>\n   └ ${item.quantity} dona × ${formatSum(item.price)} = <b>${formatSum(item.quantity * item.price)}</b>`
    )
    .join('\n');

  const usernameText = order.telegram_username
    ? order.telegram_username.startsWith('@')
      ? order.telegram_username
      : `@${order.telegram_username}`
    : '<i>Kiritilmagan</i>';

  const now = new Date();
  const timeFormatted = new Intl.DateTimeFormat('uz-UZ', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Tashkent',
  }).format(now);

  const message = `🦷 <b>YANGI BUYURTMA — NurDent</b>
━━━━━━━━━━━━━━━━━━━━━━
👤 <b>Mijoz:</b> ${escapeHtml(order.customer_name)}
📞 <b>Telefon:</b> <code>${escapeHtml(order.customer_phone)}</code>
💬 <b>Telegram:</b> ${usernameText}
⏱ <b>Vaqt:</b> ${timeFormatted}

📦 <b>Buyurtma tarkibi:</b>
${itemsText}

━━━━━━━━━━━━━━━━━━━━━━
💰 <b>JAMI SUMMA:</b> <b>${formatSum(order.total_price)}</b>
━━━━━━━━━━━━━━━━━━━━━━`;

  try {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    });

    const data = await response.json();
    if (!data.ok) {
      console.error('[Telegram API Error]', data);
      return { success: false, message: data.description || 'Telegram xatosi' };
    }

    return { success: true };
  } catch (error: any) {
    console.error('[Telegram Network Error]', error);
    return { success: false, message: error.message };
  }
}

function escapeHtml(text: string): string {
  return (text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
