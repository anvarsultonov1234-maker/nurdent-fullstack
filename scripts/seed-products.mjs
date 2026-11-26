/**
 * NurDent - Standalone Supabase Seed Script
 * Migrates all 33 products from products-data.js into Supabase 'products' table.
 *
 * Usage:
 *   node scripts/seed-products.mjs
 *   or: npm run db:seed
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// 1. Read .env.local manually
function loadEnvLocal() {
  const envPath = path.join(rootDir, '.env.local');
  if (!fs.existsSync(envPath)) {
    console.warn('⚠️  .env.local fayli topilmadi!');
    return {};
  }
  const content = fs.readFileSync(envPath, 'utf8');
  const env = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim();
      env[key] = val;
    }
  }
  return env;
}

// 2. Load 33 products from assets/js/products-data.js
function loadProductsFromSource() {
  const dataPath = path.join(rootDir, 'assets', 'js', 'products-data.js');
  if (!fs.existsSync(dataPath)) {
    throw new Error(`products-data.js fayli topilmadi: ${dataPath}`);
  }
  const fileContent = fs.readFileSync(dataPath, 'utf8');

  // Extract JSON array from NURDENT_PRODUCTS = [...]
  const startIdx = fileContent.indexOf('[');
  const endIdx = fileContent.lastIndexOf(']');
  if (startIdx === -1 || endIdx === -1) {
    throw new Error('NURDENT_PRODUCTS massivi topilmadi!');
  }

  const jsonStr = fileContent.substring(startIdx, endIdx + 1);
  const products = JSON.parse(jsonStr);
  return products;
}

async function main() {
  console.log('════════════════════════════════════════════════════════════');
  console.log('🦷 NurDent: Supabase Products Import / Seed Script');
  console.log('════════════════════════════════════════════════════════════\n');

  const env = loadEnvLocal();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    '';

  console.log(`📌 Supabase URL: ${supabaseUrl || '(aniqlanmadi)'}`);

  // Check if placeholder keys exist
  if (
    !supabaseUrl ||
    !supabaseKey ||
    supabaseUrl.includes('nurdent-demo') ||
    supabaseUrl.includes('your-project') ||
    supabaseKey.includes('replace-with-your-real-key')
  ) {
    console.error('\n❌ XATOLIK: .env.local faylida haqiqiy Supabase kalitlari mavjud emas!');
    console.log('\nIltimos, .env.local faylini oching va quyidagi kalitlarni to‘ldiring:');
    console.log('  NEXT_PUBLIC_SUPABASE_URL=https://<your-project-id>.supabase.co');
    console.log('  SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>');
    console.log('\n💡 Eslatma: Shuningdek siz "supabase/seed_products.sql" faylini Supabase SQL Editorida to‘g‘ridan-to‘g‘ri ishga tushirishingiz ham mumkin!\n');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  console.log('📦 products-data.js faylidan mahsulotlar o‘qilmoqda...');
  const rawProducts = loadProductsFromSource();
  console.log(`✓ Jami topilgan mahsulotlar soni: ${rawProducts.length} ta\n`);

  // Format products for Supabase schema
  const formattedProducts = rawProducts.map((p) => {
    // Ensure images path has leading slash for Next.js
    const images = Array.isArray(p.images)
      ? p.images.map((img) => (img.startsWith('/') ? img : `/${img}`))
      : ['/assets/images/nurdent_logo.jpg'];

    return {
      id: String(p.id),
      category: p.category || 'equipment',
      name_uz: p.name_uz || '',
      name_ru: p.name_ru || null,
      desc_uz: p.desc_uz || null,
      desc_ru: p.desc_ru || null,
      price: Number(p.price) || 0,
      price_display_uz: p.price_display_uz || `${Number(p.price || 0).toLocaleString('ru-RU')} so'm`,
      price_display_ru: p.price_display_ru || `${Number(p.price || 0).toLocaleString('ru-RU')} сум`,
      status: p.status || (p.in_stock ? 'in_stock' : 'on_order'),
      badge_uz: p.badge_uz || null,
      badge_ru: p.badge_ru || null,
      images: images,
    };
  });

  console.log('🚀 Supabase "products" jadvaliga yuklanmoqda (upsert)...');

  const { data, error } = await supabase
    .from('products')
    .upsert(formattedProducts, { onConflict: 'id' })
    .select('id, name_uz');

  if (error) {
    console.error('\n❌ Supabase xatosi:', error.message);
    if (error.details) console.error('Tafsilotlar:', error.details);
    if (error.hint) console.error('Maslahat:', error.hint);
    process.exit(1);
  }

  console.log('\n🎉 MUVAFFAQITYATLI YAKUNLANDI!');
  console.log(`✅ Jami ${formattedProducts.length} ta mahsulot Supabase "products" jadvaliga ko‘chirildi.`);
  console.log('════════════════════════════════════════════════════════════\n');
}

main().catch((err) => {
  console.error('\n❌ Kutilmagan xatolik yuz berdi:', err);
  process.exit(1);
});
