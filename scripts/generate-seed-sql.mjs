import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const content = fs.readFileSync(path.join(rootDir, 'assets/js/products-data.js'), 'utf8');
const start = content.indexOf('[');
const end = content.lastIndexOf(']');
const list = JSON.parse(content.substring(start, end + 1));

const escapeSql = (str) => (str ? str.replace(/'/g, "''") : '');

let sql = `-- ==============================================================================
-- NurDent Dental Store - 33 Products Seed SQL
-- Run this query in Supabase SQL Editor (supabase.com -> SQL Editor -> Run)
-- ==============================================================================

INSERT INTO public.products (
  id, category, name_uz, name_ru, desc_uz, desc_ru,
  price, price_display_uz, price_display_ru, status,
  badge_uz, badge_ru, images
) VALUES
`;

const values = list.map((p) => {
  const imgs = JSON.stringify((p.images || []).map((img) => (img.startsWith('/') ? img : '/' + img)));
  return `  ('${escapeSql(p.id)}', '${escapeSql(p.category)}', '${escapeSql(p.name_uz)}', ` +
    (p.name_ru ? `'${escapeSql(p.name_ru)}'` : 'NULL') + ', ' +
    (p.desc_uz ? `'${escapeSql(p.desc_uz)}'` : 'NULL') + ', ' +
    (p.desc_ru ? `'${escapeSql(p.desc_ru)}'` : 'NULL') + ', ' +
    `${Number(p.price) || 0}, ` +
    (p.price_display_uz ? `'${escapeSql(p.price_display_uz)}'` : 'NULL') + ', ' +
    (p.price_display_ru ? `'${escapeSql(p.price_display_ru)}'` : 'NULL') + ', ' +
    `'${escapeSql(p.status || (p.in_stock ? 'in_stock' : 'on_order'))}', ` +
    (p.badge_uz ? `'${escapeSql(p.badge_uz)}'` : 'NULL') + ', ' +
    (p.badge_ru ? `'${escapeSql(p.badge_ru)}'` : 'NULL') + ', ' +
    `'${imgs.replace(/'/g, "''")}'::jsonb)`;
});

sql += values.join(',\n') + '\n';
sql += `ON CONFLICT (id) DO UPDATE SET
  category = EXCLUDED.category,
  name_uz = EXCLUDED.name_uz,
  name_ru = EXCLUDED.name_ru,
  desc_uz = EXCLUDED.desc_uz,
  desc_ru = EXCLUDED.desc_ru,
  price = EXCLUDED.price,
  price_display_uz = EXCLUDED.price_display_uz,
  price_display_ru = EXCLUDED.price_display_ru,
  status = EXCLUDED.status,
  badge_uz = EXCLUDED.badge_uz,
  badge_ru = EXCLUDED.badge_ru,
  images = EXCLUDED.images;
`;

fs.writeFileSync(path.join(rootDir, 'supabase/seed_products.sql'), sql, 'utf8');
console.log(`Generated supabase/seed_products.sql with ${list.length} products.`);
