import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const supabaseUrl = 'https://fsdtkzhxxvklevmhrjjp.supabase.co';
const supabaseKey = 'sb_publishable_EIPLGc1KipgLrzdjfnkOVw_B4sCYwmH';

const supabase = createClient(supabaseUrl, supabaseKey);

async function uploadAllImages() {
  const imagesDir = path.join(rootDir, 'public', 'assets', 'images');
  const files = fs.readdirSync(imagesDir);

  console.log(`🚀 ${files.length} ta rasm Supabase Storage ("product-images") ga yuklanmoqda...`);

  let successCount = 0;
  for (const file of files) {
    if (!file.match(/\.(jpg|jpeg|png|webp|gif)$/i)) continue;
    const filePath = path.join(imagesDir, file);
    const fileBuffer = fs.readFileSync(filePath);

    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(file, fileBuffer, {
        contentType: 'image/jpeg',
        upsert: true,
      });

    if (error) {
      console.warn(`⚠️ ${file} yuklashda xatolik:`, error.message);
    } else {
      successCount++;
    }
  }

  console.log(`✅ Jami ${successCount} ta rasm Supabase Storage "product-images" bucketiga muvaffaqiyatli yuklandi!`);
}

uploadAllImages().catch(console.error);
