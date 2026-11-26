/**
 * NurDent - Apple Minimalist Web Experience
 * Compact Mobile UI, 2-Column Grid, Load More, Live Search, Apple Bag drawer, Telegram order
 * Multi-Device Cloud Database Sync & Visual Admin Panel (No-Code CMS)
 */

// ==========================================
// 1. CONFIGURATION & CONSTANTS
// ==========================================
// CLOUD DATABASE CONFIGURATION (Multi-Device Live Sync)
const CLOUD_DB_CONFIG = {
  // Pre-configured cloud database endpoint (can be edited directly in Admin Panel)
  url: "https://nurdent-shop-default-rtdb.europe-west1.firebasedatabase.app/inventory.json",
  apiKey: ""
};

function getActiveCloudUrl() {
  let url = (localStorage.getItem('nurdent_cloud_url') || "").trim();
  if (!url) url = (CLOUD_DB_CONFIG.url || "").trim();
  if (!url) return "";

  // Auto-format Firebase Realtime DB URLs
  if (url.includes('firebaseio.com') || url.includes('firebasedatabase.app')) {
    url = url.replace(/\/+$/, '');
    if (!url.endsWith('.json')) {
      url += '/inventory.json';
    }
  }
  return url;
}

function getActiveCloudKey() {
  const local = (localStorage.getItem('nurdent_cloud_key') || "").trim();
  if (local) return local;
  return (CLOUD_DB_CONFIG.apiKey || "").trim();
} 

// Default Admin Security PIN (matches phone +998 50 570 71 70 last 4 digits)
const ADMIN_PIN = "7170";

// ==========================================
// 2. APPLE BILINGUAL DICTIONARY
// ==========================================
const I18N = {
  uz: {
    ribbon: "Stomatologlar uchun professional asbob-uskunalar. O‘zbekiston bo‘ylab yetkazib berish mavjud.",
    nav_lineup: "Katalog",
    nav_specs: "Afzalliklar",
    nav_contact: "Aloqa",
    call_now: "Qo‘ng‘iroq qilish",
    
    hero_kicker: "NurDent Pro",
    hero_title: "Aniq. Ishonchli. Mukammal.",
    hero_desc: "Stomatologiya, jarrohlik va implantologiya uchun yuqori aniqlikdagi asboblar to‘plami va sarf materiallari.",
    hero_btn_explore: "Mahsulotlar qatori",
    hero_btn_call: "Bog‘lanish",
    hero_hit_badge: "Xit to‘plam",
    hero_hit_title: "Stomatologik asboblar to‘plami (8 ta + lotok)",
    hero_hit_price: "270 000 so‘m",
    hero_hit_add: "Savatga qo‘shish",
    
    shelf_kicker: "Mahsulotlar qatori",
    shelf_title: "Klinikangiz uchun eng munosibini tanlang.",
    search_placeholder: "Mahsulotlarni qidirish...",
    no_results: "Hech qanday mahsulot topilmadi.",
    reset_search: "Qidiruvni tozalash",
    load_more: "Yana ko‘rsatish",
    
    categories: {
      all: "Barchasi",
      sets: "To‘plamlar",
      surgery: "Jarrohlik & Implant",
      therapy: "Terapiya & Polirovka",
      equipment: "Uskunalar",
      consumables: "Sarf materiallari"
    },
    
    btn_add_bag: "Savatga",
    btn_details: "Batafsil",
    btn_inquire: "So‘rov qoldirish",
    status_in_stock: "Sotuvda bor",
    status_out_of_stock: "Vaqtincha tugagan",
    status_on_order: "Buyurtmaga",
    
    // Apple Bag Drawer
    bag_title: "Xaridlar sumkasi",
    bag_empty_title: "Sumkangiz hozircha bo‘sh.",
    bag_empty_desc: "Katalogdan kerakli stomatologik asboblarni tanlang.",
    bag_total: "Jami summa:",
    bag_name_ph: "Ismingiz (Doktor F.I.Sh)",
    bag_phone_ph: "+998 (90) 123-45-67",
    bag_btn_order: "Telegram orqali buyurtma berish",
    bag_btn_call: "Qo‘ng‘iroq qilib buyurtma berish",
    bag_item_added: "Sumkaga qo‘shildi",
    bag_req_err: "Iltimos, ismingiz va telefon raqamingizni kiriting!",
    out_of_stock_toast: "Bu mahsulot vaqtincha tugagan",
    agreed_price: "kelishilgan narx",
    
    // Highlights
    spec_1_val: "100%",
    spec_1_lbl: "Tibbiy zanglamas po‘lat va avtoklavga chidamlilik",
    spec_2_val: "14",
    spec_2_lbl: "14 hudud bo‘ylab tezkor va xavfsiz yetkazib berish",
    spec_3_val: "24/7",
    spec_3_lbl: "Professional mutaxassis konsultatsiyasi",
    
    // Contact
    contact_title: "Savollaringiz bormi? Qo‘ng‘iroq qiling.",
    contact_desc: "Mutaxassisimiz sizga to‘g‘ri instrument tanlashda va yetkazib berishda ko‘maklashadi.",
    contact_phone_main: "+998 50 570 71 70",
    
    // Footer
    footer_copy: "© 2026 NurDent. Barcha huquqlar himoyalangan.",
    footer_note: "O‘zbekiston bo‘ylab stomatologiya mollari va professional asboblar."
  },
  
  ru: {
    ribbon: "Профессиональные стоматологические инструменты. Доставка по всему Узбекистану.",
    nav_lineup: "Каталог",
    nav_specs: "Преимущества",
    nav_contact: "Контакты",
    call_now: "Позвонить",
    
    hero_kicker: "NurDent Pro",
    hero_title: "Точно. Надежно. Безупречно.",
    hero_desc: "Линейка высокоточных инструментов, наборов и расходных материалов для стоматологии, хирургии и имплантологии.",
    hero_btn_explore: "Линейка продукции",
    hero_btn_call: "Связаться",
    hero_hit_badge: "Хит набор",
    hero_hit_title: "Набор стоматологических инструментов (8 шт + лоток)",
    hero_hit_price: "270 000 сум",
    hero_hit_add: "В корзину",
    
    shelf_kicker: "Линейка продукции",
    shelf_title: "Выберите то, что подходит вашей клинике.",
    search_placeholder: "Поиск по каталогу...",
    no_results: "По вашему запросу ничего не найдено.",
    reset_search: "Сбросить поиск",
    load_more: "Показать еще",
    
    categories: {
      all: "Все",
      sets: "Наборы инструментов",
      surgery: "Хирургия & Импланты",
      therapy: "Терапия & Полировка",
      equipment: "Оборудование",
      consumables: "Расходные материалы"
    },
    
    btn_add_bag: "В корзину",
    btn_details: "Подробнее",
    btn_inquire: "Оставить запрос",
    status_in_stock: "В наличии",
    status_out_of_stock: "Нет в наличии",
    status_on_order: "Под заказ",
    
    // Apple Bag Drawer
    bag_title: "Корзина покупок",
    bag_empty_title: "Ваша корзина пока пуста.",
    bag_empty_desc: "Выберите необходимые инструменты из каталога.",
    bag_total: "Общий итог:",
    bag_name_ph: "Ваше имя (Ф.И.О доктора)",
    bag_phone_ph: "+998 (90) 123-45-67",
    bag_btn_order: "Оформить заказ через Telegram",
    bag_btn_call: "Позвонить для заказа",
    bag_item_added: "Добавлено в корзину",
    bag_req_err: "Пожалуйста, введите имя и номер телефона!",
    out_of_stock_toast: "Этот товар временно отсутствует",
    agreed_price: "по согласованию",
    
    // Highlights
    spec_1_val: "100%",
    spec_1_lbl: "Медицинская сталь и устойчивость к автоклаву",
    spec_2_val: "14",
    spec_2_lbl: "Быстрая и безопасная доставка по всем 14 регионам",
    spec_3_val: "24/7",
    spec_3_lbl: "Консультация практикующего специалиста",
    
    // Contact
    contact_title: "Есть вопросы? Позвоните нам.",
    contact_desc: "Наш специалист поможет подобрать позиции и организует доставку.",
    contact_phone_main: "+998 50 570 71 70",
    
    // Footer
    footer_copy: "© 2026 NurDent. Все права защищены.",
    footer_note: "Стоматологические товары и инструменты в Узбекистане."
  }
};

// ==========================================
// 3. APPLICATION STATE
// ==========================================
let currentLang = localStorage.getItem('nurdent_lang') || 'uz';
let activeCategory = 'all';
let searchQuery = '';
let visibleCount = 8;
let cart = JSON.parse(localStorage.getItem('nurdent_cart') || '[]');
let cloudSyncStatus = { active: false, count: 0, time: null, error: null };
let adminFilterCategory = 'all';
let adminSearchQuery = '';

// ==========================================
// 4. HELPER: PRICE PARSER (NO NaN GUARANTEE)
// ==========================================
function getItemPrice(item) {
  if (!item) return 0;
  if (typeof item.price === 'number' && !isNaN(item.price)) {
    return item.price;
  }
  if (typeof item.price === 'string') {
    const clean = item.price.replace(/[^\d]/g, '');
    const parsed = parseInt(clean, 10);
    return isNaN(parsed) ? 0 : parsed;
  }
  if (typeof item.price_display_uz === 'string') {
    const clean = item.price_display_uz.replace(/[^\d]/g, '');
    const parsed = parseInt(clean, 10);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
}

// ==========================================
// 5. CLOUD DATABASE MULTI-DEVICE SYNC
// (Zero-Config Central Cloud Store)
// ==========================================

/**
 * Loads latest product data & overrides from Cloud Database
 */
async function syncFromCloudDatabase(forceRefresh = false) {
  const url = getActiveCloudUrl();
  if (!url) {
    cloudSyncStatus = { active: false, count: 0, time: null, error: null };
    return false;
  }

  const apiKey = getActiveCloudKey();
  const headers = { 'Accept': 'application/json' };
  if (apiKey) {
    headers['X-Master-Key'] = apiKey;
    headers['Authorization'] = 'Bearer ' + apiKey;
  }

  try {
    const fetchUrl = url + (url.includes('?') ? '&' : '?') + '_t=' + Date.now();
    const res = await fetch(fetchUrl, { headers });
    if (!res.ok) {
      if (res.status === 404) {
        // Database is empty or newly created, not an error
        cloudSyncStatus = { active: false, count: 0, time: null, error: null };
        return false;
      }
      throw new Error('HTTP ' + res.status);
    }

    const data = await res.json();
    if (!data) return false;

    // Handle different formats: array, or JSONBin { record: [...] }, or Firebase object
    let remoteProducts = null;
    let remoteOverrides = null;

    if (Array.isArray(data)) {
      remoteProducts = data;
    } else if (data.record && Array.isArray(data.record)) {
      remoteProducts = data.record;
    } else if (data.products && Array.isArray(data.products)) {
      remoteProducts = data.products;
    } else if (data.overrides && Array.isArray(data.overrides)) {
      remoteOverrides = data.overrides;
    } else if (typeof data === 'object') {
      const vals = Object.values(data);
      if (vals.length > 0 && vals[0] && vals[0].name_uz) {
        remoteProducts = vals;
      } else if (vals.length > 0 && vals[0] && (vals[0].price_display_uz || vals[0].status)) {
        remoteOverrides = vals;
      }
    }

    let updatedCount = 0;

    // Merge remote products into NURDENT_PRODUCTS
    if (remoteProducts && remoteProducts.length > 0) {
      remoteProducts.forEach(remoteItem => {
        const existing = NURDENT_PRODUCTS.find(p => String(p.id) === String(remoteItem.id));
        if (existing) {
          if (remoteItem.price_display_uz) existing.price_display_uz = remoteItem.price_display_uz;
          if (remoteItem.price_display_ru) existing.price_display_ru = remoteItem.price_display_ru;
          if (remoteItem.status) {
            existing.status = remoteItem.status;
            existing.in_stock = (remoteItem.status === 'in_stock');
          }
          if (remoteItem.name_uz) existing.name_uz = remoteItem.name_uz;
          if (remoteItem.name_ru) existing.name_ru = remoteItem.name_ru;
          if (remoteItem.images && remoteItem.images.length) existing.images = remoteItem.images;
          existing.price = getItemPrice(existing);
          updatedCount++;
        } else {
          NURDENT_PRODUCTS.unshift(remoteItem);
          updatedCount++;
        }
      });
    } else if (remoteOverrides && remoteOverrides.length > 0) {
      remoteOverrides.forEach(ov => {
        const existing = NURDENT_PRODUCTS.find(p => String(p.id) === String(ov.id));
        if (existing) {
          if (ov.price_display_uz) existing.price_display_uz = ov.price_display_uz;
          if (ov.price_display_ru) existing.price_display_ru = ov.price_display_ru;
          if (ov.status) {
            existing.status = ov.status;
            existing.in_stock = (ov.status === 'in_stock');
          }
          existing.price = getItemPrice(existing);
          updatedCount++;
        }
      });
    }

    const timeStr = new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });
    cloudSyncStatus = {
      active: true,
      count: updatedCount,
      time: timeStr,
      error: null
    };
    return true;
  } catch (err) {
    console.warn("Cloud DB sync (using local cache):", err.message);
    cloudSyncStatus = {
      active: false,
      count: 0,
      time: null,
      error: err.message
    };
    return false;
  }
}

/**
 * Saves current products and overrides to Cloud Database
 */
async function saveToCloudDatabase() {
  const url = getActiveCloudUrl();
  if (!url) return false;

  const apiKey = getActiveCloudKey();
  const headers = {
    'Content-Type': 'application/json'
  };
  if (apiKey) {
    headers['X-Master-Key'] = apiKey;
    headers['Authorization'] = 'Bearer ' + apiKey;
  }

  try {
    const payload = JSON.stringify(NURDENT_PRODUCTS);

    let res = await fetch(url, {
      method: 'PUT',
      headers,
      body: payload
    });

    if (!res.ok && res.status === 405) {
      res = await fetch(url, {
        method: 'POST',
        headers,
        body: payload
      });
    }

    if (!res.ok) {
      throw new Error('HTTP ' + res.status);
    }

    const timeStr = new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });
    cloudSyncStatus = {
      active: true,
      count: NURDENT_PRODUCTS.length,
      time: timeStr,
      error: null
    };
    updateAdminCloudStatusBadge();
    return true;
  } catch (err) {
    console.error("Save to Cloud DB failed:", err);
    cloudSyncStatus.error = err.message;
    updateAdminCloudStatusBadge();
    return false;
  }
}

/**
 * Apply local storage overrides if manager made direct browser edits
 */
function applyLocalInventoryOverrides() {
  try {
    // 1. Load any created products from browser storage
    const createdRaw = localStorage.getItem('nurdent_created_products');
    if (createdRaw) {
      const createdList = JSON.parse(createdRaw);
      if (Array.isArray(createdList)) {
        createdList.forEach(created => {
          if (!NURDENT_PRODUCTS.some(p => String(p.id) === String(created.id))) {
            NURDENT_PRODUCTS.unshift(created);
          }
        });
      }
    }

    // 2. Load custom overrides (prices, statuses)
    const localSaved = localStorage.getItem('nurdent_custom_inventory');
    if (localSaved) {
      const customList = JSON.parse(localSaved);
      if (Array.isArray(customList)) {
        customList.forEach(override => {
          const prod = NURDENT_PRODUCTS.find(p => String(p.id).trim() === String(override.id).trim());
          if (!prod) return;
          if (override.status) {
            prod.status = override.status;
            prod.in_stock = (prod.status === 'in_stock');
          }
          if (override.price_display_uz) {
            prod.price_display_uz = override.price_display_uz;
            prod.price = getItemPrice(prod);
          }
          if (override.price_display_ru) {
            prod.price_display_ru = override.price_display_ru;
          }
        });
      }
    }
  } catch (e) {
    console.error('Failed to apply local inventory overrides:', e);
  }
}


// ==========================================
// 6. INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', async () => {
  // 1. Apply local browser overrides if any
  applyLocalInventoryOverrides();

  // 2. Fetch live data from Cloud Database if configured
  await syncFromCloudDatabase();

  // 3. Initialize UI modules
  initLanguageSwitcher();
  initCategoryPills();
  initSearch();
  initBagDrawer();
  initAdminTriggers();
  renderProductsGrid();
  updateUIStrings();
  renderBagBadge();
});

// ==========================================
// 7. STATUS BADGES & SMART BUTTONS
// ==========================================
function getStatusBadgeHtml(status, size = 'sm') {
  const dict = I18N[currentLang];
  const s = status || 'in_stock';
  
  if (s === 'out_of_stock') {
    const text = dict.status_out_of_stock;
    const pad = size === 'lg' ? 'px-2.5 py-1 text-[11px]' : 'px-2 py-0.5 text-[9px] sm:text-[10px]';
    return `
      <span class="status-badge status-badge-out_of_stock ${pad}">
        <span class="status-badge-dot"></span>
        <span>${text}</span>
      </span>
    `;
  } else if (s === 'on_order') {
    const text = dict.status_on_order;
    const pad = size === 'lg' ? 'px-2.5 py-1 text-[11px]' : 'px-2 py-0.5 text-[9px] sm:text-[10px]';
    return `
      <span class="status-badge status-badge-on_order ${pad}">
        <span class="status-badge-dot"></span>
        <span>${text}</span>
      </span>
    `;
  } else {
    // in_stock
    const text = dict.status_in_stock;
    const pad = size === 'lg' ? 'px-2.5 py-1 text-[11px]' : 'px-2 py-0.5 text-[9px] sm:text-[10px]';
    return `
      <span class="status-badge status-badge-in_stock ${pad}">
        <span class="status-badge-dot"></span>
        <span>${text}</span>
      </span>
    `;
  }
}

/**
 * Opens Telegram for out-of-stock item inquiry
 */
function openTelegramInquiry(productId) {
  const item = NURDENT_PRODUCTS.find(p => p.id === productId);
  if (!item) return;

  const title = currentLang === 'uz' ? item.name_uz : item.name_ru;
  const msg = currentLang === 'uz'
    ? `Assalomu alaykum! NurDent saytida "${title}" (ID: ${item.id}) mahsulotini ko‘rgan edim. Ushbu mahsulot qachon yana sotuvga keladi? Ma'lumot bera olasizmi?`
    : `Здравствуйте! Увидел на сайте NurDent товар "${title}" (ID: ${item.id}). Подскажите, пожалуйста, когда он снова поступит в продажу?`;

  const url = `https://t.me/+998505707170?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
}

// ==========================================
// 8. LANGUAGE SWITCHER
// ==========================================
function setLanguage(lang) {
  if (lang !== 'uz' && lang !== 'ru') return;
  currentLang = lang;
  localStorage.setItem('nurdent_lang', lang);
  updateUIStrings();
  renderCategoryPills();
  renderProductsGrid();
  renderBagDrawer();
}

function initLanguageSwitcher() {
  const uzBtn = document.getElementById('lang-uz');
  const ruBtn = document.getElementById('lang-ru');
  if (uzBtn && ruBtn) {
    uzBtn.addEventListener('click', () => setLanguage('uz'));
    ruBtn.addEventListener('click', () => setLanguage('ru'));
  }
}

function updateUIStrings() {
  const dict = I18N[currentLang];
  
  const uzBtn = document.getElementById('lang-uz');
  const ruBtn = document.getElementById('lang-ru');
  if (uzBtn && ruBtn) {
    if (currentLang === 'uz') {
      uzBtn.className = "text-[12px] font-semibold text-[#1d1d1f]";
      ruBtn.className = "text-[12px] font-normal text-[#86868b] hover:text-[#1d1d1f]";
    } else {
      ruBtn.className = "text-[12px] font-semibold text-[#1d1d1f]";
      uzBtn.className = "text-[12px] font-normal text-[#86868b] hover:text-[#1d1d1f]";
    }
  }

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) {
      el.textContent = dict[key];
    }
  });

  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    const key = el.getAttribute('data-i18n-ph');
    if (dict[key]) {
      el.placeholder = dict[key];
    }
  });
}

// ==========================================
// 9. CATEGORY PILLS
// ==========================================
function initCategoryPills() {
  renderCategoryPills();
}

function renderCategoryPills() {
  const container = document.getElementById('category-pills');
  if (!container) return;

  const dict = I18N[currentLang];
  const categories = [
    { key: 'all', label: dict.categories.all },
    { key: 'sets', label: dict.categories.sets },
    { key: 'surgery', label: dict.categories.surgery },
    { key: 'therapy', label: dict.categories.therapy },
    { key: 'equipment', label: dict.categories.equipment },
    { key: 'consumables', label: dict.categories.consumables }
  ];

  container.innerHTML = categories.map(cat => {
    const isActive = activeCategory === cat.key;
    return `
      <button onclick="selectCategory('${cat.key}')" class="apple-pill ${isActive ? 'active' : ''}">
        ${cat.label}
      </button>
    `;
  }).join('');
}

function selectCategory(catKey) {
  activeCategory = catKey;
  visibleCount = 8;
  renderCategoryPills();
  renderProductsGrid();
}

// ==========================================
// 10. LIVE SEARCH
// ==========================================
function initSearch() {
  const searchInput = document.getElementById('search-input');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    searchQuery = (e.target.value || '').trim().toLowerCase();
    visibleCount = 8;
    renderProductsGrid();
  });
}

function resetSearch() {
  searchQuery = '';
  visibleCount = 8;
  const searchInput = document.getElementById('search-input');
  if (searchInput) searchInput.value = '';
  renderProductsGrid();
}

// ==========================================
// 11. FILTERED PRODUCTS & COMPACT APPLE GRID
// ==========================================
function getFilteredProducts() {
  return NURDENT_PRODUCTS.filter(item => {
    if (activeCategory !== 'all' && item.category !== activeCategory) {
      return false;
    }
    if (searchQuery) {
      const nameUz = (item.name_uz || '').toLowerCase();
      const nameRu = (item.name_ru || '').toLowerCase();
      const descUz = (item.desc_uz || '').toLowerCase();
      const descRu = (item.desc_ru || '').toLowerCase();
      const priceStr = (item.price_display_uz || '').toLowerCase();
      
      const matches = nameUz.includes(searchQuery) ||
                      nameRu.includes(searchQuery) ||
                      descUz.includes(searchQuery) ||
                      descRu.includes(searchQuery) ||
                      priceStr.includes(searchQuery);
      if (!matches) return false;
    }
    return true;
  });
}

function renderProductsGrid() {
  const grid = document.getElementById('product-grid');
  const loadMoreWrap = document.getElementById('load-more-wrap');
  if (!grid) return;

  const allFiltered = getFilteredProducts();
  const dict = I18N[currentLang];

  if (allFiltered.length === 0) {
    grid.innerHTML = `
      <div class="col-span-full py-12 text-center">
        <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#f5f5f7] flex items-center justify-center mx-auto mb-3 text-[#86868b]">
          <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
        </div>
        <h4 class="text-[15px] sm:text-[17px] font-semibold text-[#1d1d1f] mb-2">${dict.no_results}</h4>
        <button onclick="resetSearch()" class="apple-btn-primary text-[12px] sm:text-[13px] py-1.5 px-4 sm:py-2 sm:px-5">
          ${dict.reset_search}
        </button>
      </div>
    `;
    if (loadMoreWrap) loadMoreWrap.innerHTML = '';
    return;
  }

  const visibleProducts = allFiltered.slice(0, visibleCount);

  grid.innerHTML = visibleProducts.map(item => {
    const title = currentLang === 'uz' ? item.name_uz : item.name_ru;
    const priceDisplay = currentLang === 'uz' ? item.price_display_uz : item.price_display_ru;
    const catLabel = dict.categories[item.category] || "NurDent";
    const image = item.images && item.images.length > 0 ? item.images[0] : 'assets/images/item_431_1.jpg';
    const isOutOfStock = (item.status === 'out_of_stock');
    const badgeHtml = getStatusBadgeHtml(item.status);

    let actionButton = '';
    if (isOutOfStock) {
      actionButton = `
        <button type="button" onclick="openTelegramInquiry('${item.id}')" class="apple-btn-inquire py-1.5 sm:py-2 px-2.5 sm:px-4 text-[11px] sm:text-[13px] flex-grow">
          ${dict.btn_inquire}
        </button>
      `;
    } else {
      actionButton = `
        <button type="button" onclick="addToBag('${item.id}')" class="apple-btn-primary py-1.5 sm:py-2 px-2.5 sm:px-4 text-[11px] sm:text-[13px] flex-grow">
          ${dict.btn_add_bag}
        </button>
      `;
    }

    return `
      <div class="apple-card p-3 sm:p-5 rounded-[18px] sm:rounded-[24px] flex flex-col justify-between ${isOutOfStock ? 'is-out-of-stock' : ''}">
        <!-- Top Info -->
        <div>
          <div class="text-[9px] sm:text-[11px] font-semibold tracking-wider uppercase text-[#86868b] mb-0.5 sm:mb-1">
            ${catLabel}
          </div>
          <h3 class="text-[13px] sm:text-[16px] font-semibold text-[#1d1d1f] tracking-tight leading-snug line-clamp-2 min-h-[34px] sm:min-h-[42px] cursor-pointer hover:opacity-80 transition" onclick="openProductModal('${item.id}')">
            ${title}
          </h3>
          <div class="mt-1 text-[13px] sm:text-[15px] font-semibold text-[#1d1d1f]">
            ${priceDisplay}
          </div>
        </div>

        <!-- Middle Clean Image Container with Status Badge at Top-Right -->
        <div class="product-img-wrap relative my-2.5 sm:my-4 aspect-square rounded-[12px] sm:rounded-[16px] overflow-hidden bg-white/80 p-2 sm:p-3 flex items-center justify-center cursor-pointer group" onclick="openProductModal('${item.id}')">
          <!-- Top-Right Status Badge -->
          <div class="absolute top-2 right-2 z-10">
            ${badgeHtml}
          </div>
          <img src="${image}" alt="${title}" class="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 ease-out" loading="lazy" />
        </div>

        <!-- Bottom Action Buttons -->
        <div class="flex items-center justify-between gap-1.5 sm:gap-3 pt-1 sm:pt-2">
          ${actionButton}
          <button type="button" onclick="openProductModal('${item.id}')" class="text-[11px] sm:text-[13px] font-medium text-[#0071e3] hover:underline px-1 py-1 shrink-0">
            ${dict.btn_details}
          </button>
        </div>
      </div>
    `;
  }).join('');

  // Handle Load More Button
  if (loadMoreWrap) {
    if (allFiltered.length > visibleCount) {
      const remaining = allFiltered.length - visibleCount;
      const nextBatch = Math.min(8, remaining);
      const btnText = currentLang === 'uz' ? `Yana ko‘rsatish (+${nextBatch})` : `Показать еще (+${nextBatch})`;

      loadMoreWrap.innerHTML = `
        <button onclick="loadMoreProducts()" class="apple-btn-loadmore">
          <span>${btnText}</span>
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
        </button>
      `;
    } else {
      loadMoreWrap.innerHTML = '';
    }
  }
}

function loadMoreProducts() {
  visibleCount += 8;
  renderProductsGrid();
}

// ==========================================
// 12. APPLE BAG (SAVATCHA)
// ==========================================
function saveCart() {
  localStorage.setItem('nurdent_cart', JSON.stringify(cart));
  renderBagBadge();
  renderBagDrawer();
}

function renderBagBadge() {
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const badges = document.querySelectorAll('.bag-badge');
  badges.forEach(b => {
    b.textContent = totalCount;
    if (totalCount > 0) {
      b.classList.remove('hidden');
    } else {
      b.classList.add('hidden');
    }
  });
}

function addToBag(productId) {
  const product = NURDENT_PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  if (product.status === 'out_of_stock') {
    showToast(I18N[currentLang].out_of_stock_toast);
    return;
  }

  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id: productId, quantity: 1 });
  }

  saveCart();
  showToast(I18N[currentLang].bag_item_added);
}

function updateBagQuantity(productId, delta) {
  const existing = cart.find(item => item.id === productId);
  if (!existing) return;

  existing.quantity += delta;
  if (existing.quantity <= 0) {
    cart = cart.filter(item => item.id !== productId);
  }
  saveCart();
}

function removeBagItem(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCart();
}

function initBagDrawer() {
  const openBtns = document.querySelectorAll('.open-bag-btn');
  const closeBtns = document.querySelectorAll('.close-bag-btn');
  const backdrop = document.getElementById('bag-backdrop');

  openBtns.forEach(btn => {
    btn.addEventListener('click', openBagDrawer);
  });

  closeBtns.forEach(btn => {
    btn.addEventListener('click', closeBagDrawer);
  });

  if (backdrop) {
    backdrop.addEventListener('click', closeBagDrawer);
  }
}

function openBagDrawer() {
  const drawer = document.getElementById('bag-drawer');
  const backdrop = document.getElementById('bag-backdrop');
  if (!drawer) return;

  drawer.classList.remove('translate-x-full');
  backdrop.classList.remove('opacity-0', 'pointer-events-none');
  document.body.classList.add('overflow-hidden');
  renderBagDrawer();
}

function closeBagDrawer() {
  const drawer = document.getElementById('bag-drawer');
  const backdrop = document.getElementById('bag-backdrop');
  if (!drawer) return;

  drawer.classList.add('translate-x-full');
  backdrop.classList.add('opacity-0', 'pointer-events-none');
  document.body.classList.remove('overflow-hidden');
}

function renderBagDrawer() {
  const container = document.getElementById('bag-items');
  const emptyState = document.getElementById('bag-empty');
  const footerArea = document.getElementById('bag-footer');
  const totalEl = document.getElementById('bag-total-val');
  if (!container) return;

  const dict = I18N[currentLang];

  if (cart.length === 0) {
    container.innerHTML = '';
    emptyState.classList.remove('hidden');
    footerArea.classList.add('hidden');
    return;
  }

  emptyState.classList.add('hidden');
  footerArea.classList.remove('hidden');

  let total = 0;
  let hasAgreedPrice = false;

  container.innerHTML = cart.map(item => {
    const prod = NURDENT_PRODUCTS.find(p => p.id === item.id);
    if (!prod) return '';

    const title = currentLang === 'uz' ? prod.name_uz : prod.name_ru;
    const priceDisplay = currentLang === 'uz' ? prod.price_display_uz : prod.price_display_ru;
    const image = prod.images && prod.images.length > 0 ? prod.images[0] : 'assets/images/item_431_1.jpg';
    
    const price = getItemPrice(prod);
    if (price > 0) {
      total += price * item.quantity;
    } else {
      hasAgreedPrice = true;
    }

    const itemTotalStr = price > 0 
      ? (price * item.quantity).toLocaleString('ru-RU') + " so‘m"
      : (currentLang === 'uz' ? "Kelishilgan" : "По согласованию");

    return `
      <div class="flex items-center gap-3 sm:gap-4 py-3 sm:py-4 border-b border-black/[0.06]">
        <img src="${image}" alt="${title}" class="w-14 h-14 sm:w-16 sm:h-16 rounded-[12px] sm:rounded-[14px] object-contain bg-[#f5f5f7] p-2 shrink-0" />
        <div class="flex-grow min-w-0">
          <h4 class="text-[13px] sm:text-[14px] font-semibold text-[#1d1d1f] line-clamp-1 mb-0.5 sm:mb-1">${title}</h4>
          <div class="text-[11px] sm:text-[12px] text-[#86868b] mb-1.5 sm:mb-2">${priceDisplay}</div>
          <div class="flex items-center gap-2">
            <button onclick="updateBagQuantity('${prod.id}', -1)" class="w-6 h-6 rounded-full bg-[#f5f5f7] flex items-center justify-center text-[12px] sm:text-[13px] font-semibold text-[#1d1d1f] hover:bg-[#e5e5e7]">&minus;</button>
            <span class="text-[12px] sm:text-[13px] font-semibold text-[#1d1d1f] px-1">${item.quantity}</span>
            <button onclick="updateBagQuantity('${prod.id}', 1)" class="w-6 h-6 rounded-full bg-[#f5f5f7] flex items-center justify-center text-[12px] sm:text-[13px] font-semibold text-[#1d1d1f] hover:bg-[#e5e5e7]">&plus;</button>
            <button onclick="removeBagItem('${prod.id}')" class="text-[11px] text-[#86868b] hover:text-[#e11d48] ml-2">
              ${currentLang === 'uz' ? "O‘chirish" : "Удалить"}
            </button>
          </div>
        </div>
        <div class="text-[13px] sm:text-[14px] font-semibold text-[#1d1d1f] shrink-0">
          ${itemTotalStr}
        </div>
      </div>
    `;
  }).join('');

  if (totalEl) {
    let formattedTotal = `${total.toLocaleString('ru-RU')} so‘m`;
    if (hasAgreedPrice) {
      formattedTotal += ` + ${dict.agreed_price}`;
    }
    totalEl.textContent = formattedTotal;
  }
}

// ==========================================
// 13. ORDER SUBMISSION (TELEGRAM & PHONE)
// ==========================================
function submitOrderViaTelegram() {
  const dict = I18N[currentLang];
  const nameInput = document.getElementById('order-name');
  const phoneInput = document.getElementById('order-phone');

  const name = nameInput ? nameInput.value.trim() : '';
  const phone = phoneInput ? phoneInput.value.trim() : '';

  if (!name || !phone) {
    alert(dict.bag_req_err);
    if (!name && nameInput) nameInput.focus();
    else if (!phone && phoneInput) phoneInput.focus();
    return;
  }

  let text = `🦷 *YANGI BUYURTMA — NurDent*\n\n`;
  text += `👤 *Mijoz:* ${name}\n`;
  text += `📞 *Telefon:* ${phone}\n`;
  text += `\n📦 *Mahsulotlar:*\n`;

  let total = 0;
  let hasAgreedPrice = false;

  cart.forEach((item, index) => {
    const prod = NURDENT_PRODUCTS.find(p => p.id === item.id);
    if (!prod) return;
    const title = currentLang === 'uz' ? prod.name_uz : prod.name_ru;
    const price = getItemPrice(prod);
    const statusNote = prod.status === 'on_order' ? ' (Buyurtmaga)' : '';
    
    if (price > 0) {
      const lineTotal = price * item.quantity;
      total += lineTotal;
      text += `${index + 1}. ${title}${statusNote} x ${item.quantity} = ${lineTotal.toLocaleString('ru-RU')} so‘m\n`;
    } else {
      hasAgreedPrice = true;
      text += `${index + 1}. ${title}${statusNote} x ${item.quantity} = Kelishilgan narxda\n`;
    }
  });

  text += `\n💰 *Jami summa:* ${total.toLocaleString('ru-RU')} so‘m`;
  if (hasAgreedPrice) text += ` + kelishilgan narx`;
  text += `\n🚚 *Yetkazib berish:* O‘zbekiston bo‘ylab (14 hudud)`;

  const telegramUrl = `https://t.me/+998505707170?text=${encodeURIComponent(text)}`;
  window.open(telegramUrl, '_blank');
}

// ==========================================
// 14. PRODUCT DETAIL MODAL
// ==========================================
function openProductModal(productId) {
  const item = NURDENT_PRODUCTS.find(p => p.id === productId);
  if (!item) return;

  const modal = document.getElementById('apple-modal');
  const backdrop = document.getElementById('apple-modal-backdrop');
  const content = document.getElementById('apple-modal-content');
  if (!modal || !content) return;

  const title = currentLang === 'uz' ? item.name_uz : item.name_ru;
  const desc = currentLang === 'uz' ? item.desc_uz : item.desc_ru;
  const priceDisplay = currentLang === 'uz' ? item.price_display_uz : item.price_display_ru;
  const dict = I18N[currentLang];
  const images = item.images && item.images.length > 0 ? item.images : ['assets/images/item_431_1.jpg'];
  const isOutOfStock = (item.status === 'out_of_stock');
  const badgeHtml = getStatusBadgeHtml(item.status, 'lg');

  let modalActionBtn = '';
  if (isOutOfStock) {
    modalActionBtn = `
      <button onclick="openTelegramInquiry('${item.id}'); closeProductModal();" class="apple-btn-inquire flex-grow py-2.5 sm:py-3 text-[13px] sm:text-[14px]">
        ${dict.btn_inquire}
      </button>
    `;
  } else {
    modalActionBtn = `
      <button onclick="addToBag('${item.id}'); closeProductModal();" class="apple-btn-primary flex-grow py-2.5 sm:py-3 text-[13px] sm:text-[14px]">
        ${dict.btn_add_bag}
      </button>
    `;
  }

  content.innerHTML = `
    <div class="flex flex-col md:flex-row gap-6 sm:gap-8 items-center">
      <div class="relative md:w-1/2 w-full bg-[#f5f5f7] rounded-[20px] sm:rounded-[24px] p-4 sm:p-6 flex items-center justify-center aspect-square">
        <!-- Top-Right Status Badge inside Modal -->
        <div class="absolute top-3 right-3 sm:top-4 sm:right-4 z-10">
          ${badgeHtml}
        </div>
        <img id="modal-img-view" src="${images[0]}" alt="${title}" class="max-h-full max-w-full object-contain ${isOutOfStock ? 'opacity-55 grayscale-[30%]' : ''}" />
      </div>
      <div class="md:w-1/2 w-full flex flex-col justify-between">
        <div>
          <span class="text-[11px] sm:text-[12px] font-semibold text-[#86868b] uppercase tracking-wider block mb-1">
            ${dict.categories[item.category] || "NurDent"}
          </span>
          <h2 class="text-[20px] sm:text-[26px] font-semibold text-[#1d1d1f] tracking-tight leading-snug mb-2 sm:mb-3">
            ${title}
          </h2>
          <div class="text-[18px] sm:text-[20px] font-semibold text-[#1d1d1f] mb-3 sm:mb-4">
            ${priceDisplay}
          </div>
          <p class="text-[13px] sm:text-[14px] text-[#86868b] leading-relaxed mb-4 sm:mb-6 font-normal">
            ${desc}
          </p>
          <div class="text-[12px] text-[#1d1d1f] space-y-1 mb-5 sm:mb-6 font-medium">
            <div>✓ ${currentLang === 'uz' ? 'Tibbiy zanglamas po‘lat / Original sifat' : 'Медицинская сталь / Оригинальное качество'}</div>
            <div>✓ ${currentLang === 'uz' ? 'O‘zbekiston bo‘ylab yetkazib beriladi' : 'Доставка по всему Узбекистану'}</div>
          </div>
        </div>

        <div class="flex items-center gap-2.5 sm:gap-3 pt-3 sm:pt-4 border-t border-black/[0.06]">
          ${modalActionBtn}
          <a href="tel:+998505707170" class="apple-btn-light py-2.5 sm:py-3 px-4 sm:px-5 text-[12px] sm:text-[13px]">
            +998 50 570 71 70
          </a>
        </div>
      </div>
    </div>
  `;

  modal.classList.remove('hidden');
  backdrop.classList.remove('opacity-0', 'pointer-events-none');
  document.body.classList.add('overflow-hidden');
}

function closeProductModal() {
  const modal = document.getElementById('apple-modal');
  const backdrop = document.getElementById('apple-modal-backdrop');
  if (!modal) return;
  modal.classList.add('hidden');
  backdrop.classList.add('opacity-0', 'pointer-events-none');
  document.body.classList.remove('overflow-hidden');
}

// ==========================================
// 15. VISUAL ADMIN PANEL & LIVE CMS LOGIC
// ==========================================
let adminClickCounter = 0;
let adminClickTimer = null;

function initAdminTriggers() {
  const footerTrigger = document.getElementById('footer-admin-trigger');
  if (footerTrigger) {
    // Mobile touch optimizations (prevent double-tap zoom)
    footerTrigger.style.touchAction = 'manipulation';
    footerTrigger.style.webkitUserSelect = 'none';
    footerTrigger.style.userSelect = 'none';

    // 1. Triple click / tap handler
    const handleTap = (e) => {
      adminClickCounter++;
      clearTimeout(adminClickTimer);
      adminClickTimer = setTimeout(() => { adminClickCounter = 0; }, 1600);

      if (adminClickCounter >= 3) {
        adminClickCounter = 0;
        if (e && e.cancelable) e.preventDefault();
        openAdminPinModal();
      }
    };

    footerTrigger.addEventListener('click', handleTap);

    // 2. Long Press for Mobile (Hold 1.2s to open automatically)
    let longPressTimer = null;

    footerTrigger.addEventListener('touchstart', () => {
      longPressTimer = setTimeout(() => {
        if (navigator.vibrate) {
          try { navigator.vibrate(60); } catch (_) {}
        }
        openAdminPinModal();
      }, 1200);
    }, { passive: true });

    footerTrigger.addEventListener('touchend', () => {
      clearTimeout(longPressTimer);
    });

    footerTrigger.addEventListener('touchmove', () => {
      clearTimeout(longPressTimer);
    });
  }

  // 3. Direct URL access: ?admin=1 or #admin
  const checkUrl = () => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === '1' || window.location.hash === '#admin') {
      openAdminPinModal();
    }
  };

  checkUrl();
  window.addEventListener('hashchange', checkUrl);
}

function openAdminPinModal() {
  if (sessionStorage.getItem('nurdent_admin_auth') === '1') {
    openAdminModal();
    return;
  }

  const pinModal = document.getElementById('admin-pin-modal');
  const pinBackdrop = document.getElementById('admin-pin-backdrop');
  const pinInput = document.getElementById('admin-pin-input');
  const pinErr = document.getElementById('admin-pin-error');
  if (!pinModal) return;

  if (pinInput) pinInput.value = '';
  if (pinErr) pinErr.classList.add('hidden');

  pinModal.classList.remove('hidden');
  pinBackdrop.classList.remove('opacity-0', 'pointer-events-none');
  setTimeout(() => pinInput && pinInput.focus(), 150);
}

function closeAdminPinModal() {
  const pinModal = document.getElementById('admin-pin-modal');
  const pinBackdrop = document.getElementById('admin-pin-backdrop');
  if (!pinModal) return;

  pinModal.classList.add('hidden');
  pinBackdrop.classList.add('opacity-0', 'pointer-events-none');
}

function submitAdminPin() {
  const pinInput = document.getElementById('admin-pin-input');
  const pinErr = document.getElementById('admin-pin-error');
  const enteredPin = (pinInput ? pinInput.value : '').trim();

  if (enteredPin === ADMIN_PIN) {
    sessionStorage.setItem('nurdent_admin_auth', '1');
    closeAdminPinModal();
    openAdminModal();
  } else {
    if (pinErr) pinErr.classList.remove('hidden');
    if (pinInput) {
      pinInput.value = '';
      pinInput.focus();
    }
  }
}

function openAdminModal() {
  const modal = document.getElementById('admin-modal');
  const backdrop = document.getElementById('admin-modal-backdrop');
  if (!modal) return;

  const cloudInput = document.getElementById('admin-cloud-url');
  if (cloudInput) {
    cloudInput.value = getActiveCloudUrl();
  }

  updateAdminCloudStatusBadge();
  renderAdminTable();

  modal.classList.remove('hidden');
  backdrop.classList.remove('opacity-0', 'pointer-events-none');
  document.body.classList.add('overflow-hidden');
}

function closeAdminModal() {
  const modal = document.getElementById('admin-modal');
  const backdrop = document.getElementById('admin-modal-backdrop');
  if (!modal) return;

  modal.classList.add('hidden');
  backdrop.classList.add('opacity-0', 'pointer-events-none');
  document.body.classList.remove('overflow-hidden');
}

function updateAdminCloudStatusBadge() {
  const badge = document.getElementById('admin-cloud-status');
  if (!badge) return;

  const url = getActiveCloudUrl();
  if (!url) {
    badge.className = "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-medium bg-black/[0.05] text-[#86868b]";
    badge.innerHTML = `<span class="w-2 h-2 rounded-full bg-[#86868b]"></span> Standart rejim (Lokal xotira faol)`;
  } else if (cloudSyncStatus.active) {
    badge.className = "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-medium bg-emerald-500/10 text-emerald-700 border border-emerald-500/20";
    badge.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Bulutli baza ulangan (${cloudSyncStatus.count} ta mahsulot, ${cloudSyncStatus.time || 'hozir'})`;
  } else if (cloudSyncStatus.error) {
    badge.className = "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-medium bg-amber-500/10 text-amber-800 border border-amber-500/20";
    badge.innerHTML = `<span class="w-2 h-2 rounded-full bg-amber-500"></span> Lokal rejimda ishlamoqda (Bulut kutilyapti)`;
  } else {
    badge.className = "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-medium bg-blue-500/10 text-blue-700";
    badge.innerHTML = `<span class="w-2 h-2 rounded-full bg-blue-500"></span> Bulutli baza sozlandi`;
  }
}

async function saveAdminCloudConfig() {
  const urlInput = document.getElementById('admin-cloud-url');
  if (!urlInput) return;

  let url = urlInput.value.trim();
  if ((url.includes('firebaseio.com') || url.includes('firebasedatabase.app')) && !url.endsWith('.json')) {
    url = url.replace(/\/+$/, '') + '/inventory.json';
    urlInput.value = url;
  }
  localStorage.setItem('nurdent_cloud_url', url);

  showToast("Bulutli baza sozlamalari saqlanmoqda...");
  const success = await syncFromCloudDatabase(true);
  updateAdminCloudStatusBadge();
  renderAdminTable();
  renderProductsGrid();

  if (success) {
    showToast("Bulutli baza bilan muvaffaqiyatli sinxronlandi! ☁️✅");
  } else if (url) {
    showToast("Bulutli baza manzili saqlandi.");
  }
}

async function testAdminCloudConnection() {
  const urlInput = document.getElementById('admin-cloud-url');
  if (!urlInput) return;

  let url = urlInput.value.trim();
  if (!url) {
    alert("Iltimos, Bulutli baza URL manzilini kiriting!");
    return;
  }

  if ((url.includes('firebaseio.com') || url.includes('firebasedatabase.app')) && !url.endsWith('.json')) {
    url = url.replace(/\/+$/, '') + '/inventory.json';
    urlInput.value = url;
  }

  showToast("Bulutli baza bilan aloqa tekshirilmoqda...");
  try {
    const apiKey = getActiveCloudKey();
    const headers = { 'Accept': 'application/json' };
    if (apiKey) {
      headers['X-Master-Key'] = apiKey;
      headers['Authorization'] = 'Bearer ' + apiKey;
    }

    const res = await fetch(url + (url.includes('?') ? '&' : '?') + '_t=' + Date.now(), { headers });
    if (res.ok || res.status === 404) {
      alert("✅ Aloqa 100% muvaffaqiyatli!\n\nBulutli baza serveri bilan aloqa o‘rnatildi.\nEndi narxlar va mahsulotlar barcha qurilmalarda avtomatik yangilanadi.");
      saveAdminCloudConfig();
    } else {
      alert("⚠️ Server javobi: HTTP " + res.status + "\nIltimos, URL va ruxsatlarni tekshiring.");
    }
  } catch (err) {
    alert("❌ Aloqada xatolik:\n" + err.message + "\n\nIltimos, internet aloqasi va URL manzilini tekshiring.");
  }
}

function renderAdminTable() {
  const tbody = document.getElementById('admin-table-body');
  if (!tbody) return;

  const searchVal = (document.getElementById('admin-table-search')?.value || '').trim().toLowerCase();

  const filtered = NURDENT_PRODUCTS.filter(item => {
    if (!searchVal) return true;
    const nameUz = (item.name_uz || '').toLowerCase();
    const idStr = String(item.id);
    return nameUz.includes(searchVal) || idStr.includes(searchVal);
  });

  tbody.innerHTML = filtered.map(item => {
    const status = item.status || 'in_stock';
    const image = item.images && item.images.length > 0 ? item.images[0] : 'assets/images/item_431_1.jpg';

    return `
      <tr data-product-id="${item.id}" class="hover:bg-black/[0.015] transition">
        <!-- ID -->
        <td class="font-mono text-[12px] text-[#86868b] font-semibold">
          #${item.id}
        </td>

        <!-- Image & Title -->
        <td class="py-2.5">
          <div class="flex items-center gap-3">
            <img src="${image}" alt="" class="w-9 h-9 rounded-lg bg-[#f5f5f7] object-contain p-1 shrink-0" />
            <div class="max-w-[280px]">
              <div class="font-medium text-[#1d1d1f] text-[13px] line-clamp-1 leading-snug">${item.name_uz}</div>
              <div class="text-[11px] text-[#86868b] font-mono">${item.category}</div>
            </div>
          </div>
        </td>

        <!-- Price UZ Input -->
        <td class="min-w-[140px]">
          <input 
            type="text" 
            value="${item.price_display_uz || ''}" 
            class="admin-item-price-uz apple-input text-[12px] py-1 px-2.5 font-medium" 
            data-id="${item.id}" 
            placeholder="270 000 so'm"
          />
        </td>

        <!-- Status Select -->
        <td class="min-w-[160px]">
          <select 
            class="admin-item-status apple-select text-[12px] w-full" 
            data-id="${item.id}"
          >
            <option value="in_stock" ${status === 'in_stock' ? 'selected' : ''}>🟢 Sotuvda bor</option>
            <option value="out_of_stock" ${status === 'out_of_stock' ? 'selected' : ''}>⚪ Vaqtincha tugagan</option>
            <option value="on_order" ${status === 'on_order' ? 'selected' : ''}>🟡 Buyurtmaga</option>
          </select>
        </td>

        <!-- Preview Status Badge & Delete Action -->
        <td class="text-right whitespace-nowrap">
          <div class="flex items-center justify-end gap-2">
            ${getStatusBadgeHtml(status, 'sm')}
            <button type="button" onclick="deleteProduct('${item.id}')" class="p-1 rounded-full text-[#86868b] hover:text-rose-600 hover:bg-rose-50 transition" title="Mahsulotni o‘chirish">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function filterAdminTable() {
  renderAdminTable();
}

async function saveAdminTableChanges() {
  const priceInputs = document.querySelectorAll('.admin-item-price-uz');
  const statusSelects = document.querySelectorAll('.admin-item-status');

  priceInputs.forEach(input => {
    const id = input.getAttribute('data-id');
    const prod = NURDENT_PRODUCTS.find(p => String(p.id) === String(id));
    if (!prod) return;

    const newPriceUz = input.value.trim();
    if (newPriceUz) {
      prod.price_display_uz = newPriceUz;
      prod.price = getItemPrice(prod);
    }
  });

  statusSelects.forEach(select => {
    const id = select.getAttribute('data-id');
    const prod = NURDENT_PRODUCTS.find(p => String(p.id) === String(id));
    if (!prod) return;

    const newStatus = select.value;
    prod.status = newStatus;
    prod.in_stock = (newStatus === 'in_stock');
  });

  saveCurrentInventoryState();

  // If cloud database is configured, push changes to cloud
  if (getActiveCloudUrl()) {
    showToast("Bulutli bazaga saqlanmoqda...");
    await saveToCloudDatabase();
  }

  renderAdminTable();
  renderProductsGrid();
  showToast("Barcha o‘zgarishlar barcha qurilmalarda saqlandi! ☁️🎉");
}

function resetAdminTableToDefault() {
  if (!confirm("Barcha qo‘lda kiritilgan o‘zgarishlar va kesh tozalanib, dastlabki holatga qaytarilsinmi?")) {
    return;
  }
  localStorage.removeItem('nurdent_custom_inventory');
  localStorage.removeItem('nurdent_created_products');
  localStorage.removeItem('nurdent_cloud_url');
  localStorage.removeItem('nurdent_cloud_key');

  window.location.reload();
}

/**
 * Generates and downloads updated products-data.js
 */
function generateAndDownloadJS() {
  const jsContent = `/**
 * NurDent Products Database
 * Exported via NurDent Visual Admin Panel
 * Last updated: ${new Date().toLocaleString('uz-UZ')}
 */

const NURDENT_PRODUCTS = ${JSON.stringify(NURDENT_PRODUCTS, null, 2)};
`;

  const blob = new Blob([jsContent], { type: 'application/javascript;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'products-data.js';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  showToast("products-data.js fayli muvaffaqiyatli yuklab olindi!");
}

// ==========================================
// 16. TOAST NOTIFICATIONS
// ==========================================
function showToast(msg) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'apple-toast';
  toast.textContent = msg;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px) scale(0.96)';
    setTimeout(() => toast.remove(), 300);
  }, 2200);
}

// ==========================================
// 17. ADD / CREATE & DELETE PRODUCT LOGIC
// ==========================================
let newProductImageBase64 = null;

function openAddProductModal() {
  const modal = document.getElementById('admin-add-modal');
  const backdrop = document.getElementById('admin-add-backdrop');
  if (!modal) return;

  // Reset form
  newProductImageBase64 = null;
  const preview = document.getElementById('new-prod-img-preview');
  const placeholder = document.getElementById('new-prod-img-placeholder');
  const fileInput = document.getElementById('new-prod-img-file');
  const form = document.getElementById('add-product-form');

  if (preview) { preview.src = ''; preview.classList.add('hidden'); }
  if (placeholder) placeholder.classList.remove('hidden');
  if (fileInput) fileInput.value = '';
  if (form) form.reset();

  modal.classList.remove('hidden');
  backdrop.classList.remove('opacity-0', 'pointer-events-none');
}

function closeAddProductModal() {
  const modal = document.getElementById('admin-add-modal');
  const backdrop = document.getElementById('admin-add-backdrop');
  if (!modal) return;

  modal.classList.add('hidden');
  backdrop.classList.add('opacity-0', 'pointer-events-none');
}

/**
 * High-performance smart canvas image compression
 * Compresses any smartphone photo down to crisp Retina ~40KB JPEG
 */
function compressImage(file, maxWidth = 640, maxHeight = 640, quality = 0.85) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function handleNewProductImageSelect(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  try {
    showToast("Rasm yuklanmoqda va optimallashtirilmoqda...");
    const compressedDataUrl = await compressImage(file);
    newProductImageBase64 = compressedDataUrl;

    const preview = document.getElementById('new-prod-img-preview');
    const placeholder = document.getElementById('new-prod-img-placeholder');

    if (preview && placeholder) {
      preview.src = compressedDataUrl;
      preview.classList.remove('hidden');
      placeholder.classList.add('hidden');
    }
    showToast("Rasm tayyor! ✅");
  } catch (err) {
    console.error('Image compression error:', err);
    alert("Rasmni yuklashda xatolik yuz berdi. Boshqa rasm tanlab ko‘ring.");
  }
}

function submitNewProduct() {
  const nameUz = (document.getElementById('new-prod-name-uz')?.value || '').trim();
  const nameRu = (document.getElementById('new-prod-name-ru')?.value || '').trim();
  const categoryVal = document.getElementById('new-prod-category')?.value || 'equipment';
  const priceInput = (document.getElementById('new-prod-price')?.value || '').trim();
  const statusVal = document.getElementById('new-prod-status')?.value || 'in_stock';
  const badgeVal = (document.getElementById('new-prod-badge')?.value || '').trim();
  const descVal = (document.getElementById('new-prod-desc')?.value || '').trim();

  if (!nameUz || !priceInput) {
    alert("Iltimos, mahsulot nomi va narxini kiriting!");
    return;
  }

  // Parse price cleanly
  const cleanNum = priceInput.replace(/[^\d]/g, '');
  const parsedPrice = parseInt(cleanNum, 10);
  const finalPrice = isNaN(parsedPrice) ? 0 : parsedPrice;
  const formattedPriceUz = finalPrice > 0 ? `${finalPrice.toLocaleString('ru-RU')} so'm` : priceInput;
  const formattedPriceRu = finalPrice > 0 ? `${finalPrice.toLocaleString('ru-RU')} сум` : (nameRu || "По согласованию");

  // Generate unique product ID
  const existingIds = NURDENT_PRODUCTS.map(p => parseInt(p.id, 10)).filter(n => !isNaN(n));
  const nextId = String(Math.max(...existingIds, 500) + 1);

  const newProduct = {
    id: nextId,
    category: categoryVal,
    name_uz: nameUz,
    name_ru: nameRu || nameUz,
    desc_uz: descVal || nameUz,
    desc_ru: descVal || (nameRu || nameUz),
    price: finalPrice,
    price_display_uz: formattedPriceUz,
    price_display_ru: formattedPriceRu,
    status: statusVal,
    in_stock: (statusVal === 'in_stock'),
    badge_uz: badgeVal || "Yangi",
    badge_ru: badgeVal || "Новинка",
    images: [newProductImageBase64 || 'assets/images/item_431_1.jpg']
  };

  // Prepend to main product list so it appears at top of store
  NURDENT_PRODUCTS.unshift(newProduct);

  // Save to created products in localStorage
  let createdList = [];
  try {
    const raw = localStorage.getItem('nurdent_created_products');
    if (raw) createdList = JSON.parse(raw) || [];
  } catch (_) {}
  createdList.unshift(newProduct);
  localStorage.setItem('nurdent_created_products', JSON.stringify(createdList));

  saveCurrentInventoryState();
  if (getActiveCloudUrl()) {
    saveToCloudDatabase();
  }

  closeAddProductModal();
  renderAdminTable();
  renderProductsGrid();
  showToast("Yangi mahsulot saytga muvaffaqiyatli qo‘shildi! 🎉");
}

function deleteProduct(productId) {
  const prod = NURDENT_PRODUCTS.find(p => String(p.id) === String(productId));
  if (!prod) return;

  if (!confirm(`"${prod.name_uz}" mahsulotini ro‘yxatdan o‘chirmoqchimisiz?`)) {
    return;
  }

  // Remove from runtime array
  const idx = NURDENT_PRODUCTS.findIndex(p => String(p.id) === String(productId));
  if (idx !== -1) {
    NURDENT_PRODUCTS.splice(idx, 1);
  }

  // Remove from nurdent_created_products
  try {
    let createdList = JSON.parse(localStorage.getItem('nurdent_created_products') || '[]');
    createdList = createdList.filter(p => String(p.id) !== String(productId));
    localStorage.setItem('nurdent_created_products', JSON.stringify(createdList));
  } catch (_) {}

  // Remove from cart if present
  cart = cart.filter(item => String(item.id) !== String(productId));
  saveCart();

  saveCurrentInventoryState();
  if (getActiveCloudUrl()) {
    saveToCloudDatabase();
  }
  renderAdminTable();
  renderProductsGrid();
  showToast("Mahsulot barcha qurilmalardan o‘chirildi. ☁️");
}

function saveCurrentInventoryState() {
  const customOverrides = NURDENT_PRODUCTS.map(p => ({
    id: p.id,
    price_display_uz: p.price_display_uz,
    price_display_ru: p.price_display_ru,
    status: p.status
  }));
  localStorage.setItem('nurdent_custom_inventory', JSON.stringify(customOverrides));
}
