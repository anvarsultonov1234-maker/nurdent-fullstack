import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, isServerSupabaseConfigured } from '@/lib/supabase/server';
import { sendTelegramOrderNotification } from '@/lib/telegram';
import { OrderItem } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customer_name,
      customer_phone,
      telegram_username,
      items,
      total_price,
    } = body;

    // 1. Validation
    if (!customer_name || typeof customer_name !== 'string' || !customer_name.trim()) {
      return NextResponse.json(
        { success: false, error: 'Iltimos, ismingizni kiriting.' },
        { status: 400 }
      );
    }

    if (!customer_phone || typeof customer_phone !== 'string' || !customer_phone.trim()) {
      return NextResponse.json(
        { success: false, error: 'Iltimos, telefon raqamingizni kiriting.' },
        { status: 400 }
      );
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Savatchangiz bo‘sh.' },
        { status: 400 }
      );
    }

    const calculatedTotal =
      typeof total_price === 'number' && total_price >= 0
        ? total_price
        : items.reduce(
            (sum: number, item: OrderItem) =>
              sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
            0
          );

    let savedOrderId = `order_${Date.now()}`;

    // 2. Save order to Supabase orders table
    if (isServerSupabaseConfigured) {
      const { data, error } = await supabaseAdmin
        .from('orders')
        .insert([
          {
            customer_name: customer_name.trim(),
            customer_phone: customer_phone.trim(),
            telegram_username: telegram_username ? telegram_username.trim() : null,
            items: items,
            total_price: calculatedTotal,
            status: 'Yangi',
          },
        ])
        .select()
        .single();

      if (error) {
        console.error('[Supabase Order Insert Error]', error);
        // Fallback: we still proceed to send telegram notification so the owner doesn't lose the lead
      } else if (data?.id) {
        savedOrderId = data.id;
      }
    } else {
      console.warn(
        '[Supabase] Server kalitlari to‘liq kiritilmagan. Buyurtma faqat Telegram botga yuborilmoqda.'
      );
    }

    // 3. Send Telegram Bot notification
    const telegramResult = await sendTelegramOrderNotification({
      customer_name: customer_name.trim(),
      customer_phone: customer_phone.trim(),
      telegram_username: telegram_username ? telegram_username.trim() : undefined,
      items: items,
      total_price: calculatedTotal,
    });

    return NextResponse.json({
      success: true,
      order_id: savedOrderId,
      telegram: telegramResult,
      message: 'Buyurtmangiz qabul qilindi! Tez orada bog‘lanamiz.',
    });
  } catch (error: any) {
    console.error('[/api/order Error]', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Serverda xatolik yuz berdi.',
      },
      { status: 500 }
    );
  }
}
