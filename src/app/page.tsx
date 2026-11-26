'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search,
  ShoppingBag,
  X,
  Phone,
  CheckCircle,
  Plus,
  Minus,
  Trash2,
  ChevronRight,
  ExternalLink,
  ShieldAlert,
  Loader2,
} from 'lucide-react';
import { Product, CartItem, Language, ProductCategory } from '@/types';
import { INITIAL_PRODUCTS } from '@/data/initialProducts';
import { I18N, formatPrice } from '@/lib/i18n';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';

export default function HomePage() {
  // 1. Core State
  const [lang, setLang] = useState<Language>('uz');
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isBagOpen, setIsBagOpen] = useState(false);
  const [activeModalProduct, setActiveModalProduct] = useState<Product | null>(null);
  const [activeModalImgIndex, setActiveModalImgIndex] = useState(0);
  const [modalQty, setModalQty] = useState(1);
  const [visibleCount, setVisibleCount] = useState(8);

  // Customer Checkout Details
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [telegramUsername, setTelegramUsername] = useState('');
  const [isTelegramMiniApp, setIsTelegramMiniApp] = useState(false);

  // Order Submission State
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [orderSuccessModal, setOrderSuccessModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const t = I18N[lang];

  // 2. Telegram Mini App & LocalStorage Initialization
  useEffect(() => {
    // Load saved language
    const savedLang = localStorage.getItem('nurdent_lang') as Language;
    if (savedLang && (savedLang === 'uz' || savedLang === 'ru')) {
      setLang(savedLang);
    }

    // Load saved cart
    try {
      const savedCart = localStorage.getItem('nurdent_cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (e) {
      console.error('Failed to load cart from localStorage', e);
    }

    // Initialize Telegram WebApp
    if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
      try {
        const tg = (window as any).Telegram.WebApp;
        tg.ready();
        tg.expand();

        const user = tg.initDataUnsafe?.user;
        if (user) {
          setIsTelegramMiniApp(true);
          const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ');
          if (fullName) {
            setCustomerName(fullName);
          }
          if (user.username) {
            setTelegramUsername(user.username);
          }
        }
      } catch (err) {
        console.warn('Telegram WebApp init notice:', err);
      }
    }

    // Fetch live products from Supabase if configured
    if (isSupabaseConfigured) {
      const fetchSupabaseProducts = async () => {
        try {
          const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

          if (!error && data && data.length > 0) {
            setProducts(data);
          }
        } catch (err) {
          console.warn('Supabase products fetch fallback to initial data', err);
        }
      };
      fetchSupabaseProducts();
    }
  }, []);

  // Save cart to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('nurdent_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cart]);

  // Switch Language
  const switchLang = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem('nurdent_lang', newLang);
  };

  // Toast Notification Trigger
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((prev) => (prev === message ? null : prev));
    }, 2500);
  };

  // Cart operations
  const addToBag = (product: Product, quantity: number = 1) => {
    if (product.status === 'out_of_stock') {
      showToast(t.out_of_stock_toast);
      return;
    }

    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.product.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { product, quantity }];
    });

    showToast(`${t.bag_item_added}: ${lang === 'uz' ? product.name_uz : product.name_ru || product.name_uz}`);

    // Telegram Haptic feedback if in Mini App
    if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp?.HapticFeedback) {
      try {
        (window as any).Telegram.WebApp.HapticFeedback.impactOccurred('light');
      } catch (e) {}
    }
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromBag = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  const totalCartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const totalCartPrice = useMemo(
    () =>
      cart.reduce((sum, item) => sum + (item.product.price || 0) * item.quantity, 0),
    [cart]
  );

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (selectedCategory !== 'all' && p.category !== selectedCategory) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const nameUz = (p.name_uz || '').toLowerCase();
        const nameRu = (p.name_ru || '').toLowerCase();
        const descUz = (p.desc_uz || '').toLowerCase();
        const descRu = (p.desc_ru || '').toLowerCase();
        const badgeUz = (p.badge_uz || '').toLowerCase();
        const badgeRu = (p.badge_ru || '').toLowerCase();
        return (
          nameUz.includes(query) ||
          nameRu.includes(query) ||
          descUz.includes(query) ||
          descRu.includes(query) ||
          badgeUz.includes(query) ||
          badgeRu.includes(query)
        );
      }
      return true;
    });
  }, [products, selectedCategory, searchQuery]);

  const visibleProducts = useMemo(
    () => filteredProducts.slice(0, visibleCount),
    [filteredProducts, visibleCount]
  );

  // Submit Order via /api/order
  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim() || !customerPhone.trim()) {
      alert(t.bag_req_err);
      return;
    }

    if (cart.length === 0) {
      alert(t.bag_empty_title);
      return;
    }

    setIsSubmittingOrder(true);

    try {
      const orderItems = cart.map((item) => ({
        id: item.product.id,
        name: lang === 'uz' ? item.product.name_uz : item.product.name_ru || item.product.name_uz,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.images?.[0] || '',
      }));

      const response = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: customerName,
          customer_phone: customerPhone,
          telegram_username: telegramUsername || undefined,
          items: orderItems,
          total_price: totalCartPrice,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Success: Clear cart & show confirmation modal
        setCart([]);
        localStorage.removeItem('nurdent_cart');
        setIsBagOpen(false);
        setOrderSuccessModal(true);

        // Telegram Haptic feedback
        if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp?.HapticFeedback) {
          try {
            (window as any).Telegram.WebApp.HapticFeedback.notificationOccurred('success');
          } catch (e) {}
        }
      } else {
        alert(data.error || 'Buyurtma yuborishda xatolik yuz berdi.');
      }
    } catch (err: any) {
      console.error('Order submission error:', err);
      alert('Tarmoq xatosi. Iltimos qaytadan urinib ko‘ring.');
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  // Open Product Modal
  const openProductModal = (product: Product) => {
    setActiveModalProduct(product);
    setActiveModalImgIndex(0);
    setModalQty(1);
  };

  const closeProductModal = () => {
    setActiveModalProduct(null);
  };

  const categoriesList: { key: ProductCategory; label: string }[] = [
    { key: 'all', label: t.categories.all },
    { key: 'equipment', label: t.categories.equipment },
    { key: 'sets', label: t.categories.sets },
    { key: 'surgery', label: t.categories.surgery },
    { key: 'therapy', label: t.categories.therapy },
    { key: 'consumables', label: t.categories.consumables },
  ];

  const heroFeaturedProduct = products.find((p) => p.id === '431') || products[0];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* 1. TOP ANNOUNCEMENT RIBBON */}
      <div className="bg-[#f5f5f7] border-b border-black/[0.04] py-2 px-4 text-center">
        <p className="text-[12px] sm:text-[13px] text-[#86868b] tracking-normal font-normal">
          {t.ribbon}
        </p>
      </div>

      {/* 2. APPLE GLOBAL NAVIGATION BAR */}
      <header className="sticky top-0 z-40 apple-nav">
        <div className="max-w-[1024px] mx-auto px-4 sm:px-6 h-[48px] sm:h-[52px] flex items-center justify-between gap-4">
          {/* Brand Logo (Logo only, larger, no text) */}
          <Link href="/" className="flex items-center group" title="NurDent">
            <img
              src="/assets/images/nurdent_logo.jpg"
              alt="NurDent"
              className="w-[36px] h-[36px] sm:w-[44px] sm:h-[44px] rounded-full object-cover border border-black/[0.08] shadow-sm group-hover:scale-105 transition-transform"
            />
          </Link>

          {/* Center Minimalist Links */}
          <nav className="hidden md:flex items-center gap-8 text-[13px] text-[#1d1d1f]/80">
            <a href="#lineup" className="hover:text-[#1d1d1f] transition">
              {t.nav_lineup}
            </a>
            <a href="#specs" className="hover:text-[#1d1d1f] transition">
              {t.nav_specs}
            </a>
            <a href="#contact" className="hover:text-[#1d1d1f] transition">
              {t.nav_contact}
            </a>
          </nav>

          {/* Right Actions: Phone, Language, Apple Shopping Bag */}
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Direct Phone Call */}
            <a
              href="tel:+998505707170"
              className="text-[13px] font-medium text-[#0071e3] hover:underline flex items-center gap-1.5"
              title={t.call_now}
            >
              <Phone className="w-3.5 h-3.5 fill-current" />
              <span className="hidden sm:inline">+998 50 570 71 70</span>
            </a>

            {/* Bilingual Switcher (UZ | RU) */}
            <div className="flex items-center gap-1.5 border-l border-black/[0.08] pl-3 sm:pl-4">
              <button
                type="button"
                onClick={() => switchLang('uz')}
                className={`text-[12px] transition ${
                  lang === 'uz'
                    ? 'font-bold text-[#1d1d1f]'
                    : 'font-normal text-[#86868b] hover:text-[#1d1d1f]'
                }`}
              >
                UZ
              </button>
              <span className="text-[#86868b] text-[11px]">|</span>
              <button
                type="button"
                onClick={() => switchLang('ru')}
                className={`text-[12px] transition ${
                  lang === 'ru'
                    ? 'font-bold text-[#1d1d1f]'
                    : 'font-normal text-[#86868b] hover:text-[#1d1d1f]'
                }`}
              >
                RU
              </button>
            </div>

            {/* Apple Shopping Bag Button */}
            <button
              type="button"
              onClick={() => setIsBagOpen(true)}
              className="relative text-[#1d1d1f] hover:opacity-70 transition p-1"
              title={t.bag_title}
            >
              <ShoppingBag className="w-[18px] h-[18px]" strokeWidth={1.4} />
              {totalCartCount > 0 && (
                <span className="absolute -top-1 -right-2 px-1.5 py-0.2 bg-[#0071e3] text-white text-[10px] font-bold rounded-full shadow-sm">
                  {totalCartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* 3. APPLE HERO SECTION */}
      <section className="pt-8 sm:pt-20 pb-8 sm:pb-16 text-center px-4 max-w-[1024px] mx-auto">
        <div className="mb-3">
          <span className="text-[19px] sm:text-[21px] font-semibold text-[#86868b] tracking-normal">
            {t.hero_kicker}
          </span>
        </div>

        <h1 className="text-[38px] sm:text-[64px] font-semibold tracking-[-0.03em] leading-[1.08] text-[#1d1d1f] mb-4">
          {t.hero_title}
        </h1>

        <p className="text-[18px] sm:text-[23px] text-[#86868b] max-w-[680px] mx-auto leading-relaxed mb-8 font-normal">
          {t.hero_desc}
        </p>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-5 sm:gap-6 mb-12">
          <a href="#lineup" className="apple-btn-primary py-2.5 px-6 text-[14px]">
            {t.hero_btn_explore}
          </a>
          <a href="tel:+998505707170" className="apple-link text-[14px]">
            <span>{t.hero_btn_call}</span>
            <span>&rsaquo;</span>
          </a>
        </div>

        {/* Interactive Hero Card */}
        {heroFeaturedProduct && (
          <div className="relative mx-auto max-w-[620px] pt-4">
            <div
              onClick={() => openProductModal(heroFeaturedProduct)}
              className="group cursor-pointer rounded-[20px] sm:rounded-[28px] bg-[#f5f5f7] p-5 sm:p-10 border border-black/[0.04] transition-all duration-300 hover:shadow-xl hover:scale-[1.01]"
            >
              <img
                src={heroFeaturedProduct.images[0] || '/assets/images/item_431_1.jpg'}
                alt={heroFeaturedProduct.name_uz}
                className="w-full max-h-[200px] sm:max-h-[320px] object-contain drop-shadow-sm transition-transform duration-500 group-hover:scale-105"
              />
              <div className="mt-6 text-center">
                <div className="text-[13px] font-semibold text-[#86868b] uppercase tracking-wider mb-1">
                  {lang === 'uz' ? heroFeaturedProduct.badge_uz || t.hero_hit_badge : heroFeaturedProduct.badge_ru || t.hero_hit_badge}
                </div>
                <div className="text-[20px] font-semibold text-[#1d1d1f] group-hover:text-[#0071e3] transition">
                  {lang === 'uz' ? heroFeaturedProduct.name_uz : heroFeaturedProduct.name_ru || heroFeaturedProduct.name_uz}
                </div>
                <div className="text-[16px] font-normal text-[#86868b] mt-1 mb-4">
                  {formatPrice(heroFeaturedProduct.price, lang)}
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    addToBag(heroFeaturedProduct);
                  }}
                  className="apple-btn-primary py-2 px-6 text-[13px] shadow-sm hover:scale-105 active:scale-95 transition"
                >
                  <span>{t.hero_hit_add}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 4. PRODUCT LINEUP SECTION */}
      <section id="lineup" className="py-10 sm:py-20 bg-[#f5f5f7]/60 border-t border-black/[0.04]">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
          {/* Header & Search */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <span className="text-[14px] font-semibold text-[#86868b] uppercase tracking-wider block mb-1">
                {t.shelf_kicker}
              </span>
              <h2 className="text-[28px] sm:text-[40px] font-semibold tracking-[-0.025em] text-[#1d1d1f]">
                {t.shelf_title}
              </h2>
            </div>

            {/* Apple Live Search Input */}
            <div className="apple-search-wrapper max-w-sm w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#86868b]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setVisibleCount(8);
                }}
                placeholder={t.search_placeholder}
                className="apple-search-input"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#86868b] hover:text-[#1d1d1f]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="mb-8 overflow-x-auto pb-2 scrollbar-none">
            <div className="flex items-center gap-2 min-w-max">
              {categoriesList.map((cat) => (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat.key);
                    setVisibleCount(8);
                  }}
                  className={`apple-pill ${selectedCategory === cat.key ? 'active' : ''}`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Grid Container (2 Columns Mobile, 3-4 Columns Desktop) */}
          {visibleProducts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-black/[0.04]">
              <p className="text-[16px] text-[#86868b] mb-4">{t.no_results}</p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="apple-btn-light text-[13px] py-2 px-5"
              >
                {t.reset_search}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-5">
              {visibleProducts.map((product) => {
                const productName =
                  lang === 'uz' ? product.name_uz : product.name_ru || product.name_uz;
                const badgeText =
                  lang === 'uz' ? product.badge_uz : product.badge_ru || product.badge_uz;
                const isOutOfStock = product.status === 'out_of_stock';
                const isOnOrder = product.status === 'on_order';

                return (
                  <div
                    key={product.id}
                    onClick={() => openProductModal(product)}
                    className={`apple-card p-3 sm:p-5 flex flex-col justify-between cursor-pointer group ${
                      isOutOfStock ? 'is-out-of-stock' : ''
                    }`}
                  >
                    <div>
                      {/* Card Top: Badges */}
                      <div className="flex items-center justify-between gap-1 mb-2">
                        {badgeText ? (
                          <span className="text-[10px] sm:text-[11px] font-semibold text-[#86868b] uppercase tracking-wider truncate">
                            {badgeText}
                          </span>
                        ) : (
                          <span />
                        )}

                        {/* Status Badge */}
                        <span
                          className={`status-badge text-[10px] sm:text-[11px] px-2 py-0.5 status-badge-${product.status}`}
                        >
                          <span className="status-badge-dot" />
                          <span className="hidden sm:inline">
                            {product.status === 'in_stock'
                              ? t.status_in_stock
                              : isOnOrder
                              ? t.status_on_order
                              : t.status_out_of_stock}
                          </span>
                        </span>
                      </div>

                      {/* Image Wrap */}
                      <div className="product-img-wrap h-[120px] sm:h-[180px] flex items-center justify-center p-2 mb-3">
                        <img
                          src={product.images[0] || '/assets/images/nurdent_logo.jpg'}
                          alt={productName}
                          className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>

                      {/* Product Name */}
                      <h3 className="text-[13px] sm:text-[15px] font-semibold text-[#1d1d1f] line-clamp-2 leading-snug group-hover:text-[#0071e3] transition">
                        {productName}
                      </h3>
                    </div>

                    {/* Bottom: Price & Add to Bag */}
                    <div className="pt-3 border-t border-black/[0.04] mt-3">
                      <div className="text-[13px] sm:text-[15px] font-semibold text-[#1d1d1f] mb-2.5">
                        {formatPrice(product.price, lang)}
                      </div>

                      {isOutOfStock ? (
                        <button
                          type="button"
                          disabled
                          className="w-full apple-btn-light py-1.5 sm:py-2 text-[12px] opacity-60 cursor-not-allowed"
                        >
                          {t.status_out_of_stock}
                        </button>
                      ) : isOnOrder ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            addToBag(product);
                          }}
                          className="w-full apple-btn-inquire py-1.5 sm:py-2 text-[12px]"
                        >
                          {t.btn_inquire}
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            addToBag(product);
                          }}
                          className="w-full apple-btn-primary py-1.5 sm:py-2 text-[12px] shadow-sm hover:scale-[1.02] active:scale-[0.98] transition"
                        >
                          {t.btn_add_bag}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Load More Button */}
          {visibleCount < filteredProducts.length && (
            <div className="mt-10 text-center">
              <button
                type="button"
                onClick={() => setVisibleCount((prev) => prev + 8)}
                className="apple-btn-loadmore"
              >
                <span>{t.load_more}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 5. HIGHLIGHTS & SPECS */}
      <section id="specs" className="py-10 sm:py-20 bg-white border-t border-black/[0.04]">
        <div className="max-w-[1024px] mx-auto px-4 sm:px-6">
          <div className="text-center max-w-[620px] mx-auto mb-16">
            <span className="text-[13px] font-semibold text-[#86868b] uppercase tracking-wider block mb-2">
              Standart
            </span>
            <h2 className="text-[32px] sm:text-[44px] font-semibold tracking-tight text-[#1d1d1f] leading-tight">
              Nafaqat asbob. To‘liq ishonch.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div>
              <div className="text-[52px] sm:text-[68px] font-semibold tracking-tight text-[#1d1d1f] mb-2">
                {t.spec_1_val}
              </div>
              <p className="text-[15px] sm:text-[17px] text-[#86868b] max-w-[280px] mx-auto leading-relaxed font-normal">
                {t.spec_1_lbl}
              </p>
            </div>

            <div>
              <div className="text-[52px] sm:text-[68px] font-semibold tracking-tight text-[#1d1d1f] mb-2">
                {t.spec_2_val}
              </div>
              <p className="text-[15px] sm:text-[17px] text-[#86868b] max-w-[280px] mx-auto leading-relaxed font-normal">
                {t.spec_2_lbl}
              </p>
            </div>

            <div>
              <div className="text-[52px] sm:text-[68px] font-semibold tracking-tight text-[#1d1d1f] mb-2">
                {t.spec_3_val}
              </div>
              <p className="text-[15px] sm:text-[17px] text-[#86868b] max-w-[280px] mx-auto leading-relaxed font-normal">
                {t.spec_3_lbl}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. DIRECT CONTACT SECTION */}
      <section id="contact" className="py-10 sm:py-20 bg-[#f5f5f7] border-t border-black/[0.04]">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6 text-center">
          <span className="text-[13px] font-semibold text-[#86868b] uppercase tracking-wider block mb-2">
            Aloqa
          </span>
          <h2 className="text-[32px] sm:text-[44px] font-semibold tracking-tight text-[#1d1d1f] mb-4">
            {t.contact_title}
          </h2>
          <p className="text-[16px] sm:text-[18px] text-[#86868b] max-w-[560px] mx-auto leading-relaxed mb-8">
            {t.contact_desc}
          </p>

          <div className="flex items-center justify-center">
            <a
              href="tel:+998505707170"
              className="w-full sm:w-auto apple-btn-secondary py-3.5 px-8 text-[15px] flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4 fill-current" />
              <span>{t.contact_phone_main}</span>
            </a>
          </div>
        </div>
      </section>

      {/* 7. APPLE MINIMALIST FOOTER */}
      <footer className="bg-white border-t border-black/[0.06] py-10 text-[12px] text-[#86868b] mt-auto">
        <div className="max-w-[1024px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span>{t.footer_copy}</span>
          </div>
          <div>
            <span>{t.footer_note}</span>
          </div>
          <div className="font-medium text-[#1d1d1f]">
            Tel: +998 50 570 71 70
          </div>
        </div>
      </footer>

      {/* =========================================================================
          8. APPLE SHOPPING BAG DRAWER
         ========================================================================= */}
      {isBagOpen && (
        <div
          onClick={() => setIsBagOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity"
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-full max-w-[440px] bg-white z-50 shadow-2xl flex flex-col apple-drawer ${
          isBagOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-black/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-[#1d1d1f]" strokeWidth={1.4} />
            <h3 className="text-[17px] font-semibold text-[#1d1d1f]">{t.bag_title}</h3>
            {totalCartCount > 0 && (
              <span className="text-[12px] text-[#86868b] font-normal">
                ({totalCartCount} ta)
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => setIsBagOpen(false)}
            className="p-1.5 text-[#86868b] hover:text-[#1d1d1f] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-grow overflow-y-auto p-5">
          {cart.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-12 h-12 rounded-full bg-[#f5f5f7] flex items-center justify-center mx-auto mb-3 text-[#86868b]">
                <ShoppingBag className="w-6 h-6" strokeWidth={1.4} />
              </div>
              <h4 className="text-[16px] font-semibold text-[#1d1d1f] mb-1">
                {t.bag_empty_title}
              </h4>
              <p className="text-[13px] text-[#86868b] mb-6">{t.bag_empty_desc}</p>
              <button
                type="button"
                onClick={() => setIsBagOpen(false)}
                className="apple-btn-primary text-[13px] py-2 px-5"
              >
                {t.nav_lineup}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Telegram Mini App user banner if recognized */}
              {telegramUsername && (
                <div className="bg-[#0071e3]/10 text-[#0071e3] rounded-xl p-2.5 text-[12px] flex items-center justify-between">
                  <span className="font-medium">Telegram orqali: @{telegramUsername}</span>
                  <span className="text-[10px] bg-[#0071e3] text-white px-2 py-0.5 rounded-full">
                    Mini App
                  </span>
                </div>
              )}

              {cart.map((item) => {
                const itemName =
                  lang === 'uz'
                    ? item.product.name_uz
                    : item.product.name_ru || item.product.name_uz;

                return (
                  <div
                    key={item.product.id}
                    className="flex items-center gap-3 bg-[#f5f5f7] p-3 rounded-2xl border border-black/[0.04]"
                  >
                    <img
                      src={item.product.images[0] || '/assets/images/nurdent_logo.jpg'}
                      alt={itemName}
                      className="w-14 h-14 object-contain rounded-xl bg-white p-1 shrink-0"
                    />

                    <div className="flex-grow min-w-0">
                      <h4 className="text-[13px] font-semibold text-[#1d1d1f] truncate">
                        {itemName}
                      </h4>
                      <div className="text-[12px] font-medium text-[#86868b] mt-0.5">
                        {formatPrice(item.product.price, lang)}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, -1)}
                          className="w-6 h-6 rounded-full bg-white border border-black/10 flex items-center justify-center hover:bg-[#e5e5e7] transition"
                        >
                          <Minus className="w-3 h-3 text-[#1d1d1f]" />
                        </button>
                        <span className="text-[12px] font-semibold text-[#1d1d1f] w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, 1)}
                          className="w-6 h-6 rounded-full bg-white border border-black/10 flex items-center justify-center hover:bg-[#e5e5e7] transition"
                        >
                          <Plus className="w-3 h-3 text-[#1d1d1f]" />
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromBag(item.product.id)}
                      className="p-1.5 text-[#86868b] hover:text-rose-500 transition shrink-0"
                      title="O‘chirish"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Drawer Footer with Order Form */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-black/[0.06] bg-[#f5f5f7] space-y-3">
            {/* Subtotal */}
            <div className="flex items-center justify-between">
              <span className="text-[14px] text-[#86868b] font-medium">{t.bag_total}</span>
              <span className="text-[18px] font-semibold text-[#1d1d1f]">
                {formatPrice(totalCartPrice, lang)}
              </span>
            </div>

            {/* Inputs: Name & Phone */}
            <form onSubmit={handleOrderSubmit} className="space-y-2 pt-1">
              <div>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder={t.bag_name_ph}
                  className="apple-input"
                />
              </div>

              <div>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder={t.bag_phone_ph}
                  className="apple-input"
                />
              </div>

              {/* Order Submit Button */}
              <button
                type="submit"
                disabled={isSubmittingOrder}
                className="w-full apple-btn-primary py-3 text-[14px] font-medium flex items-center justify-center gap-2 shadow-sm"
              >
                {isSubmittingOrder ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{t.bag_btn_submitting}</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>{t.bag_btn_order}</span>
                  </>
                )}
              </button>
            </form>

            {/* Direct Phone Call Button */}
            <a
              href="tel:+998505707170"
              className="w-full apple-btn-light py-2.5 text-[13px] font-medium flex items-center justify-center gap-2"
            >
              <Phone className="w-3.5 h-3.5 text-[#86868b]" />
              <span>{t.bag_btn_call}</span>
            </a>
          </div>
        )}
      </div>

      {/* =========================================================================
          9. PRODUCT DETAIL MODAL
         ========================================================================= */}
      {activeModalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div
            onClick={closeProductModal}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
          />

          <div className="bg-white rounded-[28px] max-w-[720px] w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto z-10 border border-black/[0.06]">
            {/* Close Button */}
            <button
              type="button"
              onClick={closeProductModal}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#f5f5f7] hover:bg-[#e5e5e7] text-[#1d1d1f] flex items-center justify-center transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 items-center">
              {/* Image & Gallery */}
              <div>
                <div className="bg-[#f5f5f7] rounded-[20px] p-6 flex items-center justify-center h-[260px] sm:h-[300px]">
                  <img
                    src={
                      activeModalProduct.images[activeModalImgIndex] ||
                      activeModalProduct.images[0] ||
                      '/assets/images/nurdent_logo.jpg'
                    }
                    alt={activeModalProduct.name_uz}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

                {/* Gallery Thumbnails if > 1 */}
                {activeModalProduct.images.length > 1 && (
                  <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1">
                    {activeModalProduct.images.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveModalImgIndex(idx)}
                        className={`w-14 h-14 rounded-xl p-1 bg-[#f5f5f7] border-2 transition shrink-0 ${
                          activeModalImgIndex === idx
                            ? 'border-[#0071e3]'
                            : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={img}
                          alt="thumb"
                          className="w-full h-full object-contain"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="space-y-4">
                <div>
                  {activeModalProduct.badge_uz && (
                    <span className="text-[12px] font-semibold text-[#86868b] uppercase tracking-wider block mb-1">
                      {lang === 'uz'
                        ? activeModalProduct.badge_uz
                        : activeModalProduct.badge_ru || activeModalProduct.badge_uz}
                    </span>
                  )}
                  <h3 className="text-[20px] sm:text-[24px] font-semibold text-[#1d1d1f] leading-snug">
                    {lang === 'uz'
                      ? activeModalProduct.name_uz
                      : activeModalProduct.name_ru || activeModalProduct.name_uz}
                  </h3>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-[22px] font-bold text-[#1d1d1f]">
                    {formatPrice(activeModalProduct.price, lang)}
                  </div>
                  <span
                    className={`status-badge text-[11px] px-2.5 py-0.5 status-badge-${activeModalProduct.status}`}
                  >
                    <span className="status-badge-dot" />
                    <span>
                      {activeModalProduct.status === 'in_stock'
                        ? t.status_in_stock
                        : activeModalProduct.status === 'on_order'
                        ? t.status_on_order
                        : t.status_out_of_stock}
                    </span>
                  </span>
                </div>

                <p className="text-[14px] text-[#86868b] leading-relaxed">
                  {lang === 'uz'
                    ? activeModalProduct.desc_uz
                    : activeModalProduct.desc_ru || activeModalProduct.desc_uz}
                </p>

                {/* Qty and Add to Bag */}
                {activeModalProduct.status !== 'out_of_stock' && (
                  <div className="pt-2 flex items-center gap-3">
                    <div className="flex items-center border border-black/10 rounded-full px-2 py-1 bg-[#f5f5f7]">
                      <button
                        type="button"
                        onClick={() => setModalQty((prev) => Math.max(1, prev - 1))}
                        className="w-7 h-7 rounded-full bg-white flex items-center justify-center hover:bg-[#e5e5e7] transition"
                      >
                        <Minus className="w-3.5 h-3.5 text-[#1d1d1f]" />
                      </button>
                      <span className="w-8 text-center text-[13px] font-semibold text-[#1d1d1f]">
                        {modalQty}
                      </span>
                      <button
                        type="button"
                        onClick={() => setModalQty((prev) => prev + 1)}
                        className="w-7 h-7 rounded-full bg-white flex items-center justify-center hover:bg-[#e5e5e7] transition"
                      >
                        <Plus className="w-3.5 h-3.5 text-[#1d1d1f]" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        addToBag(activeModalProduct, modalQty);
                        closeProductModal();
                      }}
                      className="apple-btn-primary flex-grow py-2.5 text-[14px] shadow-sm"
                    >
                      {t.btn_add_bag}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          10. ORDER CONFIRMATION MODAL
         ========================================================================= */}
      {orderSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setOrderSuccessModal(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
          />

          <div className="bg-white rounded-[24px] max-w-[420px] w-full p-6 sm:p-8 shadow-2xl relative z-10 text-center border border-black/[0.06] animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-9 h-9" />
            </div>

            <h3 className="text-[20px] font-semibold text-[#1d1d1f] mb-2">
              {t.order_success_title}
            </h3>

            <p className="text-[14px] text-[#86868b] leading-relaxed mb-6">
              {t.order_success_desc}
            </p>

            <button
              type="button"
              onClick={() => setOrderSuccessModal(false)}
              className="w-full apple-btn-primary py-2.5 text-[14px]"
            >
              {t.order_close}
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          11. APPLE FLOATING TOAST NOTIFICATION
         ========================================================================= */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
          <div className="apple-toast pointer-events-auto">
            {toastMessage}
          </div>
        </div>
      )}
    </div>
  );
}
