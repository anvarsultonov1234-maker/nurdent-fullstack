# NurDent Full-Stack MVP — O‘rnatish va Foydalanish Qo‘llanmasi

Ushbu loyiha zamonaviy Full-Stack arxitekturaga to‘liq o‘tkazildi:
- **Frontend & Backend**: Next.js 14 (App Router) + Tailwind CSS + Lucide Icons
- **Ma’lumotlar bazasi & Auth & Storage**: Supabase (`orders`, `products`, `product-images` bucket, Supabase Auth)
- **Xabarnomalar**: Telegram Bot API (HTML formatdagi buyurtma xabari)
- **Telegram integratsiyasi**: Telegram Mini App (`telegram-web-app.js`, avtomatik ism va @username)

---

## 1. Loyihani Ishga Tushirish (Local Development)

```bash
# Kutubxonalarni o'rnatish (allaqachon o'rnatilgan)
npm install

# Dasturchi rejimida ishga tushirish (http://localhost:3000)
npm run dev

# Production build qilish
npm run build

# Production serverni yurgizish
npm start
```

---

## 2. `.env.local` Kalitlarini Sozlash

Loyihaning ildiz papkasidagi `.env.local` faylini oching va haqiqiy kalitlaringizni kiriting:

```env
# Supabase sozlamalari (supabase.com -> Project Settings -> API)
NEXT_PUBLIC_SUPABASE_URL=https://sizning-loyiha-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=ey...sizning-anon-kalitingiz
SUPABASE_SERVICE_ROLE_KEY=sizning-service-role-kalitingiz

# Telegram Bot API sozlamalari
# @BotFather orqali olingan bot tokeni
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrSTUvwxYZ

# Buyurtmalar yuboriladigan shaxsiy yoki guruh Telegram ID si (@userinfobot orqali olish mumkin)
TELEGRAM_CHAT_ID=123456789
```

---

## 3. Supabase Bazasini Sozlash (1 marta bajariladi)

1. [Supabase](https://supabase.com) platformasiga kiring va yangi loyiha oching.
2. Chap menyudan **SQL Editor** bo‘limiga o‘ting va **New query** tugmasini bosing.
3. Loyihadagi `supabase/schema.sql` fayli ichidagi barcha kodni nusxalab, SQL Editor oynasiga qo‘ying va **Run** tugmasini bosing.
   - Bu `orders` va `products` jadvallarini yaratadi;
   - Xavfsizlik qoidalarini (RLS) faollashtiradi;
   - Rasmlar uchun `product-images` public storage bucketini yaratadi.
4. **Admin foydalanuvchi yaratish**:
   - Supabase boshqaruvida **Authentication -> Users** bo‘limiga kiring.
   - **Add user** tugmasini bosib, admin login (email) va parolini kiriting (masalan: `admin@nurdent.uz`).
   - Ushbu login va parol bilan `/admin` sahifasiga kiriladi.

---

## 4. Mahsulotlar Bazasini To‘ldirish (Seed)

1. Saytning `/admin` sahifasiga kiring (`http://localhost:3000/admin`).
2. Yaratgan admin emailingiz va parolingiz bilan tizimga kiring.
3. **2-Tab: Mahsulotlar CMS** ga o‘ting.
4. **"33 ta mahsulotni yuklash (Seed)"** tugmasini 1 marta bosing. Barcha 33 ta katalog tovari avtomatik bazaga yoziladi!
5. Istalgan mahsulotning narxini to‘g‘ridan-to‘g‘ri jadvalda o‘zgartirishingiz, holatini (Sotuvda bor, Buyurtmaga, Vaqtincha tugagan) tanlashingiz yoki **"+ Yangi mahsulot qo‘shish"** tugmasi orqali rasm yuklab yangi tovar qo‘shishingiz mumkin.

---

## 5. Savatcha va Buyurtma Jarayoni (`/api/order`)

- Mijoz saytdan tovarlarni savatga qo‘shib, Ism va Telefonini kiritadi.
- **"Buyurtma berish"** bosilganda mijoz Telegram ilovasiga yo‘naltirilmaydi.
- Serverdagi `/api/order` route:
  1. Buyurtmani Supabase `orders` jadvaliga saqlaydi;
  2. Telegram bot orqali do‘kon egasining Telegramiga chiroyli formatda tovarlar ro‘yxati, mijoz ismi, telefoni va @username ni yuboradi;
  3. Mijoz ekranida **"Buyurtmangiz qabul qilindi! Tez orada bog‘lanamiz"** tasdiqlash modali chiqadi va savatcha tozalanadi.

---

## 6. Telegram Mini App Integratsiyasi

- Sayt Telegram WebApp SDK (`https://telegram.org/js/telegram-web-app.js`) bilan to‘liq jihozlangan.
- BotFather da Web App havolasi sifatida sayt URL manzilini ko‘rsatganingizda:
  - Telegram ichida avtomatik `ready()` va `expand()` bajariladi (to‘liq ekranga yoyiladi);
  - Mijozning Telegramdagi ismi savatdagi **Ism** maydoniga avtomatik tushadi;
  - Mijozning `@username` i avtomatik buyurtmaga qo‘shilib Telegram xabarida aks etadi.

---

## 7. Himoyalangan Admin Panel (`/admin`)

- PIN-kod va eski Firebase/Cloud backup olib tashlangan.
- O‘rniga Supabase Auth (Email + Parol) orqali to‘liq himoyalangan alohida `/admin` sahifa yaratilgan.
- Foydalanuvchi tizimga kirmaguncha bazaga biron bir so‘rov ketmaydi.
- **1-Tab (Buyurtmalar CRM)**:
  - Barcha buyurtmalar, mijoz ismi, telefoni, @username, xarid qilingan tovarlar va jami summa;
  - Statuslarni o‘zgartirish: `Yangi`, `Bog‘lanildi`, `Yetkazilmoqda`, `Yakunlandi`, `Bekor qilindi`;
  - Buyurtmani o‘chirish imkoniyati.
- **2-Tab (Mahsulotlar CMS)**:
  - Narx va holatni tezkor tahrirlash;
  - Mahsulotni o‘chirish;
  - Yangi mahsulot qo‘shish (Supabase Storage `product-images` ga rasm yuklash bilan).
