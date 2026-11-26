'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Lock,
  Mail,
  Key,
  LogOut,
  ShoppingBag,
  Package,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  PhoneCall,
  Trash2,
  RefreshCw,
  Plus,
  Upload,
  Search,
  ExternalLink,
  ChevronDown,
  AlertCircle,
  Database,
  ArrowLeft,
  Loader2,
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { Order, OrderStatus, Product, ProductCategory, ProductStatus } from '@/types';
import { INITIAL_PRODUCTS } from '@/data/initialProducts';

export default function AdminPage() {
  // 1. Auth State
  const [session, setSession] = useState<any>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false);

  // 2. Dashboard Navigation
  const [activeTab, setActiveTab] = useState<'orders' | 'products'>('orders');

  // 3. Orders CRM State
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');

  // 4. Products CMS State
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [productCategoryFilter, setProductCategoryFilter] = useState<string>('all');
  const [productSearchQuery, setProductSearchQuery] = useState('');
  const [isSeedingProducts, setIsSeedingProducts] = useState(false);

  // 5. Add Product Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [newProdNameUz, setNewProdNameUz] = useState('');
  const [newProdNameRu, setNewProdNameRu] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<ProductCategory>('equipment');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdStatus, setNewProdStatus] = useState<ProductStatus>('in_stock');
  const [newProdBadgeUz, setNewProdBadgeUz] = useState('');
  const [newProdBadgeRu, setNewProdBadgeRu] = useState('');
  const [newProdDescUz, setNewProdDescUz] = useState('');
  const [newProdDescRu, setNewProdDescRu] = useState('');
  const [newProdImageUrl, setNewProdImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Check auth session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setSession(session);
      } catch (err) {
        console.warn('Supabase auth session check notice:', err);
      } finally {
        setIsLoadingAuth(false);
      }
    };

    checkSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fetch data only after user is authenticated ("login qilmaguncha bazaga so‘rov ketmasin")
  useEffect(() => {
    if (session) {
      fetchOrders();
      fetchProducts();
    }
  }, [session]);

  // Auth: Sign In
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsSubmittingAuth(true);

    try {
      if (!isSupabaseConfigured) {
        throw new Error(
          "Supabase sozlanmagan. Iltimos .env.local faylida NEXT_PUBLIC_SUPABASE_URL va NEXT_PUBLIC_SUPABASE_ANON_KEY kalitlarini to'ldiring."
        );
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (error) {
        throw error;
      }

      setSession(data.session);
    } catch (err: any) {
      setAuthError(err.message || 'Kirishda xatolik yuz berdi');
    } finally {
      setIsSubmittingAuth(false);
    }
  };

  // Auth: Sign Out
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setOrders([]);
    setProducts([]);
  };

  // Orders: Fetch
  const fetchOrders = async () => {
    if (!session) return;
    setIsLoadingOrders(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (err: any) {
      console.error('Fetch orders error:', err);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  // Orders: Update Status
  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      // Optimistic update
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );

      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) {
        fetchOrders();
        alert('Statusni o‘zgartirishda xatolik: ' + error.message);
      }
    } catch (err: any) {
      alert('Xatolik: ' + err.message);
    }
  };

  // Orders: Delete
  const handleDeleteOrder = async (orderId: string) => {
    if (!window.confirm('Haqiqatan ham bu buyurtmani o‘chirmoqchimisiz?')) return;

    try {
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      const { error } = await supabase.from('orders').delete().eq('id', orderId);
      if (error) {
        fetchOrders();
        alert('O‘chirishda xatolik: ' + error.message);
      }
    } catch (err: any) {
      alert('Xatolik: ' + err.message);
    }
  };

  // Products: Fetch
  const fetchProducts = async () => {
    if (!session) return;
    setIsLoadingProducts(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (err: any) {
      console.error('Fetch products error:', err);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  // Products: Quick Update Price
  const handleQuickPriceChange = async (productId: string, newPriceStr: string) => {
    const numPrice = Number(newPriceStr.replace(/\D/g, ''));
    if (isNaN(numPrice)) return;

    try {
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, price: numPrice } : p))
      );

      const { error } = await supabase
        .from('products')
        .update({
          price: numPrice,
          price_display_uz: `${numPrice.toLocaleString('ru-RU')} so'm`,
        })
        .eq('id', productId);

      if (error) {
        fetchProducts();
        alert('Narxni yangilashda xatolik: ' + error.message);
      }
    } catch (err: any) {
      alert('Xatolik: ' + err.message);
    }
  };

  // Products: Quick Update Status
  const handleQuickStatusChange = async (
    productId: string,
    newStatus: ProductStatus
  ) => {
    try {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId
            ? { ...p, status: newStatus, in_stock: newStatus === 'in_stock' }
            : p
        )
      );

      const { error } = await supabase
        .from('products')
        .update({
          status: newStatus,
          in_stock: newStatus === 'in_stock',
        })
        .eq('id', productId);

      if (error) {
        fetchProducts();
        alert('Holatni yangilashda xatolik: ' + error.message);
      }
    } catch (err: any) {
      alert('Xatolik: ' + err.message);
    }
  };

  // Products: Delete
  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm('Haqiqatan ham bu mahsulotni o‘chirmoqchimisiz?')) return;

    try {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      const { error } = await supabase.from('products').delete().eq('id', productId);
      if (error) {
        fetchProducts();
        alert('Mahsulotni o‘chirishda xatolik: ' + error.message);
      }
    } catch (err: any) {
      alert('Xatolik: ' + err.message);
    }
  };

  // Products: Seed Initial Catalog (33 products)
  const handleSeedProducts = async () => {
    if (
      !window.confirm(
        'Barcha 33 ta standart NurDent mahsulotlarini Supabase bazasiga kiritishni tasdiqlaysizmi?'
      )
    )
      return;

    setIsSeedingProducts(true);
    try {
      const formatted = INITIAL_PRODUCTS.map((p) => ({
        id: p.id,
        category: p.category,
        name_uz: p.name_uz,
        name_ru: p.name_ru || null,
        desc_uz: p.desc_uz || null,
        desc_ru: p.desc_ru || null,
        price: p.price,
        price_display_uz: p.price_display_uz || null,
        price_display_ru: p.price_display_ru || null,
        status: p.status,
        badge_uz: p.badge_uz || null,
        badge_ru: p.badge_ru || null,
        images: p.images || [],
      }));

      const { error } = await supabase.from('products').upsert(formatted);
      if (error) throw error;

      alert('Barcha 33 ta mahsulot muvaffaqiyatli Supabase bazasiga yuklandi!');
      fetchProducts();
    } catch (err: any) {
      alert('Yuklashda xatolik yuz berdi: ' + err.message);
    } finally {
      setIsSeedingProducts(false);
    }
  };

  // Image Selection for New Product
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  // Add Product Form Submit
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newProdNameUz.trim()) {
      alert('Iltimos, mahsulot nomini (UZ) kiriting!');
      return;
    }

    const priceNum = Number(newProdPrice.replace(/\D/g, '')) || 0;
    setIsUploadingImage(true);

    try {
      let finalImageUrl = newProdImageUrl || '/assets/images/nurdent_logo.jpg';

      // Upload file to Supabase Storage bucket 'product-images' if selected
      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, selectedFile, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) {
          console.warn(
            'Storage upload warning, fallback to preview/local:',
            uploadError
          );
        } else {
          const { data: publicUrlData } = supabase.storage
            .from('product-images')
            .getPublicUrl(filePath);
          if (publicUrlData?.publicUrl) {
            finalImageUrl = publicUrlData.publicUrl;
          }
        }
      }

      const newId = String(Date.now());
      const newProductPayload = {
        id: newId,
        category: newProdCategory,
        name_uz: newProdNameUz.trim(),
        name_ru: newProdNameRu.trim() || null,
        desc_uz: newProdDescUz.trim() || null,
        desc_ru: newProdDescRu.trim() || null,
        price: priceNum,
        price_display_uz: `${priceNum.toLocaleString('ru-RU')} so'm`,
        price_display_ru: `${priceNum.toLocaleString('ru-RU')} сум`,
        status: newProdStatus,
        badge_uz: newProdBadgeUz.trim() || null,
        badge_ru: newProdBadgeRu.trim() || null,
        images: [finalImageUrl],
      };

      const { data, error } = await supabase
        .from('products')
        .insert([newProductPayload])
        .select()
        .single();

      if (error) throw error;

      alert('Yangi mahsulot muvaffaqiyatli qo‘shildi!');
      setIsAddModalOpen(false);

      // Reset form
      setNewProdNameUz('');
      setNewProdNameRu('');
      setNewProdPrice('');
      setNewProdBadgeUz('');
      setNewProdBadgeRu('');
      setNewProdDescUz('');
      setNewProdDescRu('');
      setNewProdImageUrl('');
      setSelectedFile(null);
      setImagePreview(null);

      fetchProducts();
    } catch (err: any) {
      alert('Mahsulot qo‘shishda xatolik: ' + err.message);
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Filter Orders
  const filteredOrders = orders.filter((o) => {
    if (orderStatusFilter !== 'all' && o.status !== orderStatusFilter) return false;
    if (orderSearchQuery.trim()) {
      const q = orderSearchQuery.toLowerCase();
      const name = (o.customer_name || '').toLowerCase();
      const phone = (o.customer_phone || '').toLowerCase();
      const tg = (o.telegram_username || '').toLowerCase();
      return name.includes(q) || phone.includes(q) || tg.includes(q);
    }
    return true;
  });

  // Filter Products
  const filteredProducts = products.filter((p) => {
    if (productCategoryFilter !== 'all' && p.category !== productCategoryFilter) return false;
    if (productSearchQuery.trim()) {
      const q = productSearchQuery.toLowerCase();
      const nameUz = (p.name_uz || '').toLowerCase();
      const nameRu = (p.name_ru || '').toLowerCase();
      return nameUz.includes(q) || nameRu.includes(q);
    }
    return true;
  });

  // Loading State
  if (isLoadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f7]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-[#0071e3] animate-spin" />
          <p className="text-[13px] text-[#86868b]">Tekshirilmoqda...</p>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 1: PROTECTED LOGIN SCREEN (Supabase Auth Email + Password)
  // =========================================================================
  if (!session) {
    return (
      <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center p-4">
        <div className="max-w-[420px] w-full bg-white rounded-[28px] p-6 sm:p-8 shadow-xl border border-black/[0.08]">
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-[#0071e3]/10 text-[#0071e3] flex items-center justify-center mx-auto mb-3 shadow-sm">
              <Lock className="w-7 h-7" />
            </div>
            <h1 className="text-[22px] font-semibold text-[#1d1d1f]">
              NurDent Admin Panel
            </h1>
            <p className="text-[13px] text-[#86868b] mt-1">
              Supabase Auth orqali tizimga xavfsiz kirish
            </p>
          </div>

          {authError && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-[12px] flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-[12px] font-medium text-[#1d1d1f] mb-1.5">
                Email manzil
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#86868b]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@nurdent.uz"
                  className="apple-input pl-10 text-[13px]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-medium text-[#1d1d1f] mb-1.5">
                Maxfiy parol
              </label>
              <div className="relative">
                <Key className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#86868b]" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="apple-input pl-10 text-[13px]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmittingAuth}
              className="w-full apple-btn-primary py-2.5 text-[14px] shadow-sm flex items-center justify-center gap-2 mt-2"
            >
              {isSubmittingAuth ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Tekshirilmoqda...</span>
                </>
              ) : (
                <span>Tizimga kirish</span>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-black/[0.06] text-center">
            <Link
              href="/"
              className="text-[13px] text-[#0071e3] hover:underline inline-flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Asosiy do‘konga qaytish</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: AUTHENTICATED ADMIN DASHBOARD
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#f5f5f7] flex flex-col">
      {/* Top Bar */}
      <header className="bg-white border-b border-black/[0.08] sticky top-0 z-30">
        <div className="max-w-[1300px] mx-auto px-4 sm:px-6 h-[56px] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <img
                src="/assets/images/nurdent_logo.jpg"
                alt="NurDent"
                className="w-7 h-7 rounded-full object-cover"
              />
              <span className="font-semibold text-[16px] text-[#1d1d1f]">
                NurDent Admin
              </span>
            </Link>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#0071e3]/10 text-[#0071e3]">
              Supabase Auth MVP
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[12px] text-[#86868b] hidden md:inline truncate max-w-[200px]">
              {session.user?.email}
            </span>

            <Link
              href="/"
              className="apple-btn-light text-[12px] py-1.5 px-3 flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Do‘konga o‘tish</span>
            </Link>

            <button
              type="button"
              onClick={handleSignOut}
              className="apple-btn-light text-[12px] py-1.5 px-3 text-rose-600 hover:bg-rose-50 hover:border-rose-200 flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Chiqish</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="max-w-[1300px] mx-auto px-4 sm:px-6 py-6 w-full flex-grow">
        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-black/[0.08] pb-4 mb-6 gap-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded-xl text-[13px] font-medium transition flex items-center gap-2 ${
                activeTab === 'orders'
                  ? 'bg-[#1d1d1f] text-white shadow-sm'
                  : 'bg-white text-[#86868b] hover:text-[#1d1d1f] border border-black/[0.06]'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>1-Tab: Buyurtmalar CRM</span>
              <span
                className={`text-[11px] px-1.5 py-0.2 rounded-full ${
                  activeTab === 'orders' ? 'bg-white/20 text-white' : 'bg-black/5 text-[#1d1d1f]'
                }`}
              >
                {orders.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('products')}
              className={`px-4 py-2 rounded-xl text-[13px] font-medium transition flex items-center gap-2 ${
                activeTab === 'products'
                  ? 'bg-[#1d1d1f] text-white shadow-sm'
                  : 'bg-white text-[#86868b] hover:text-[#1d1d1f] border border-black/[0.06]'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>2-Tab: Mahsulotlar CMS</span>
              <span
                className={`text-[11px] px-1.5 py-0.2 rounded-full ${
                  activeTab === 'products' ? 'bg-white/20 text-white' : 'bg-black/5 text-[#1d1d1f]'
                }`}
              >
                {products.length}
              </span>
            </button>
          </div>

          {/* Quick Refresh */}
          <button
            type="button"
            onClick={() => (activeTab === 'orders' ? fetchOrders() : fetchProducts())}
            className="apple-btn-light py-2 px-3 text-[12px] flex items-center gap-1.5"
            title="Yangilash"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${
                isLoadingOrders || isLoadingProducts ? 'animate-spin' : ''
              }`}
            />
            <span className="hidden sm:inline">Yangilash</span>
          </button>
        </div>

        {/* =====================================================================
            TAB 1: BUYURTMALAR CRM
           ===================================================================== */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {/* Filters Bar */}
            <div className="bg-white p-4 rounded-2xl border border-black/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                {[
                  { key: 'all', label: 'Barchasi' },
                  { key: 'Yangi', label: 'Yangi' },
                  { key: 'Bog‘lanildi', label: 'Bog‘lanildi' },
                  { key: 'Yetkazilmoqda', label: 'Yetkazilmoqda' },
                  { key: 'Yakunlandi', label: 'Yakunlandi' },
                  { key: 'Bekor qilindi', label: 'Bekor qilindi' },
                ].map((st) => (
                  <button
                    key={st.key}
                    type="button"
                    onClick={() => setOrderStatusFilter(st.key)}
                    className={`apple-pill ${orderStatusFilter === st.key ? 'active' : ''}`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>

              {/* Search in Orders */}
              <div className="apple-search-wrapper max-w-xs w-full">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#86868b]" />
                <input
                  type="text"
                  value={orderSearchQuery}
                  onChange={(e) => setOrderSearchQuery(e.target.value)}
                  placeholder="Mijoz ismi, telefon..."
                  className="apple-search-input text-[12px] py-1.5 pl-8"
                />
              </div>
            </div>

            {/* Orders List */}
            {isLoadingOrders ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-black/[0.06]">
                <Loader2 className="w-6 h-6 text-[#0071e3] animate-spin mx-auto mb-2" />
                <p className="text-[13px] text-[#86868b]">Buyurtmalar yuklanmoqda...</p>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-black/[0.06]">
                <ShoppingBag className="w-10 h-10 text-[#86868b] mx-auto mb-2 opacity-50" />
                <h3 className="text-[16px] font-semibold text-[#1d1d1f]">
                  Buyurtmalar topilmadi
                </h3>
                <p className="text-[13px] text-[#86868b] mt-1">
                  Mijozlar buyurtma berganda ushbu jadvalda avtomatik aks etadi.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredOrders.map((order) => {
                  const dateStr = new Intl.DateTimeFormat('uz-UZ', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                    timeZone: 'Asia/Tashkent',
                  }).format(new Date(order.created_at));

                  return (
                    <div
                      key={order.id}
                      className="bg-white rounded-2xl p-4 sm:p-5 border border-black/[0.06] shadow-sm hover:border-black/[0.12] transition space-y-3"
                    >
                      {/* Top Row: Customer info & Status */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-black/[0.04] pb-3">
                        <div className="flex items-start sm:items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#f5f5f7] flex items-center justify-center font-bold text-[#1d1d1f] text-[13px] shrink-0">
                            {order.customer_name?.charAt(0)?.toUpperCase() || 'M'}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-[15px] font-semibold text-[#1d1d1f]">
                                {order.customer_name}
                              </h4>
                              {order.telegram_username && (
                                <a
                                  href={`https://t.me/${order.telegram_username.replace('@', '')}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-[11px] font-medium text-[#0071e3] hover:underline flex items-center gap-0.5 bg-[#0071e3]/10 px-2 py-0.5 rounded-full"
                                >
                                  @{order.telegram_username.replace('@', '')}
                                  <ExternalLink className="w-2.5 h-2.5" />
                                </a>
                              )}
                            </div>
                            <div className="flex items-center gap-3 text-[12px] text-[#86868b] mt-0.5">
                              <a
                                href={`tel:${order.customer_phone}`}
                                className="font-medium text-[#1d1d1f] hover:text-[#0071e3] flex items-center gap-1"
                              >
                                <PhoneCall className="w-3 h-3" />
                                {order.customer_phone}
                              </a>
                              <span>•</span>
                              <span>{dateStr}</span>
                            </div>
                          </div>
                        </div>

                        {/* Status Dropdown & Delete */}
                        <div className="flex items-center gap-2 self-end sm:self-auto">
                          <select
                            value={order.status}
                            onChange={(e) =>
                              handleUpdateOrderStatus(
                                order.id,
                                e.target.value as OrderStatus
                              )
                            }
                            className={`apple-select font-semibold text-[12px] ${
                              order.status === 'Yangi'
                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                : order.status === 'Bog‘lanildi'
                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                : order.status === 'Yetkazilmoqda'
                                ? 'bg-purple-50 text-purple-700 border-purple-200'
                                : order.status === 'Yakunlandi'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-rose-50 text-rose-700 border-rose-200'
                            }`}
                          >
                            <option value="Yangi">🔵 Yangi</option>
                            <option value="Bog‘lanildi">🟡 Bog‘lanildi</option>
                            <option value="Yetkazilmoqda">🟣 Yetkazilmoqda</option>
                            <option value="Yakunlandi">🟢 Yakunlandi</option>
                            <option value="Bekor qilindi">🔴 Bekor qilindi</option>
                          </select>

                          <button
                            type="button"
                            onClick={() => handleDeleteOrder(order.id)}
                            className="p-1.5 text-[#86868b] hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                            title="O‘chirish"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Items List */}
                      <div className="bg-[#f5f5f7] rounded-xl p-3 space-y-1.5">
                        <div className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider mb-1">
                          Tovarlar ro‘yxati:
                        </div>
                        {order.items?.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between text-[12px] text-[#1d1d1f]"
                          >
                            <div className="flex items-center gap-2 truncate pr-2">
                              <span className="text-[#86868b]">{idx + 1}.</span>
                              <span className="font-medium truncate">{item.name}</span>
                              <span className="text-[#86868b]">× {item.quantity}</span>
                            </div>
                            <span className="font-semibold shrink-0">
                              {(item.price * item.quantity).toLocaleString('ru-RU')} so‘m
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Total */}
                      <div className="flex items-center justify-between pt-1 text-[13px]">
                        <span className="text-[#86868b] font-medium">Jami to‘lov:</span>
                        <span className="text-[16px] font-bold text-[#1d1d1f]">
                          {Number(order.total_price).toLocaleString('ru-RU')} so‘m
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* =====================================================================
            TAB 2: MAHSULOTLAR CMS
           ===================================================================== */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            {/* Action Bar */}
            <div className="bg-white p-4 rounded-2xl border border-black/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(true)}
                  className="apple-btn-primary py-2 px-4 text-[12px] flex items-center gap-1.5 shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Yangi mahsulot qo‘shish</span>
                </button>

                {products.length === 0 && (
                  <button
                    type="button"
                    disabled={isSeedingProducts}
                    onClick={handleSeedProducts}
                    className="apple-btn-light py-2 px-3 text-[12px] flex items-center gap-1.5 text-[#0071e3] shrink-0"
                  >
                    <Database className="w-3.5 h-3.5" />
                    <span>33 ta mahsulotni yuklash (Seed)</span>
                  </button>
                )}
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={productCategoryFilter}
                  onChange={(e) => setProductCategoryFilter(e.target.value)}
                  className="apple-select text-[12px] py-1.5"
                >
                  <option value="all">Barcha kategoriyalar</option>
                  <option value="equipment">Uskunalar & Apparatlar</option>
                  <option value="sets">To‘plamlar</option>
                  <option value="surgery">Jarrohlik & Implant</option>
                  <option value="therapy">Terapiya & Polirovka</option>
                  <option value="consumables">Sarf materiallari</option>
                </select>

                <div className="apple-search-wrapper max-w-xs w-full">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#86868b]" />
                  <input
                    type="text"
                    value={productSearchQuery}
                    onChange={(e) => setProductSearchQuery(e.target.value)}
                    placeholder="Mahsulot nomi..."
                    className="apple-search-input text-[12px] py-1.5 pl-8"
                  />
                </div>
              </div>
            </div>

            {/* Products Table */}
            {isLoadingProducts ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-black/[0.06]">
                <Loader2 className="w-6 h-6 text-[#0071e3] animate-spin mx-auto mb-2" />
                <p className="text-[13px] text-[#86868b]">Mahsulotlar yuklanmoqda...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-black/[0.06]">
                <Package className="w-10 h-10 text-[#86868b] mx-auto mb-2 opacity-50" />
                <h3 className="text-[16px] font-semibold text-[#1d1d1f]">
                  Mahsulotlar topilmadi
                </h3>
                <p className="text-[13px] text-[#86868b] mt-1 mb-4">
                  Baza hozircha bo‘sh. Boshlang‘ich 33 ta mahsulotni yuklashingiz yoki yangi qo‘shishingiz mumkin.
                </p>
                <button
                  type="button"
                  onClick={handleSeedProducts}
                  className="apple-btn-primary py-2 px-5 text-[13px]"
                >
                  Barcha 33 ta mahsulotni yuklash (Seed)
                </button>
              </div>
            ) : (
              <div className="apple-table-wrap shadow-sm">
                <table className="apple-table">
                  <thead>
                    <tr>
                      <th style={{ width: '60px' }}>Rasm</th>
                      <th>Nomi (UZ / RU)</th>
                      <th style={{ width: '150px' }}>Kategoriya</th>
                      <th style={{ width: '160px' }}>Narxi (so‘m)</th>
                      <th style={{ width: '180px' }}>Holati (Status)</th>
                      <th style={{ width: '90px', textAlign: 'right' }}>Amallar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((prod) => (
                      <tr key={prod.id}>
                        {/* Image */}
                        <td>
                          <img
                            src={prod.images?.[0] || '/assets/images/nurdent_logo.jpg'}
                            alt={prod.name_uz}
                            className="w-10 h-10 object-contain rounded-lg bg-[#f5f5f7] p-0.5 border border-black/[0.06]"
                          />
                        </td>

                        {/* Name */}
                        <td>
                          <div className="font-semibold text-[#1d1d1f] text-[13px] line-clamp-1">
                            {prod.name_uz}
                          </div>
                          {prod.name_ru && (
                            <div className="text-[11px] text-[#86868b] line-clamp-1">
                              {prod.name_ru}
                            </div>
                          )}
                          {prod.badge_uz && (
                            <span className="inline-block mt-0.5 text-[10px] bg-black/5 text-[#86868b] px-1.5 py-0.2 rounded font-medium">
                              {prod.badge_uz}
                            </span>
                          )}
                        </td>

                        {/* Category */}
                        <td>
                          <span className="text-[12px] font-medium text-[#86868b]">
                            {prod.category === 'equipment'
                              ? 'Uskunalar'
                              : prod.category === 'sets'
                              ? 'To‘plamlar'
                              : prod.category === 'surgery'
                              ? 'Jarrohlik'
                              : prod.category === 'therapy'
                              ? 'Terapiya'
                              : 'Sarf'}
                          </span>
                        </td>

                        {/* Quick Edit Price */}
                        <td>
                          <input
                            type="text"
                            defaultValue={prod.price.toLocaleString('ru-RU')}
                            onBlur={(e) =>
                              handleQuickPriceChange(prod.id, e.target.value)
                            }
                            className="apple-input py-1 px-2.5 text-[12px] font-semibold w-32"
                            title="O‘zgartirib boshqa joyga bosing"
                          />
                        </td>

                        {/* Quick Edit Status */}
                        <td>
                          <select
                            value={prod.status}
                            onChange={(e) =>
                              handleQuickStatusChange(
                                prod.id,
                                e.target.value as ProductStatus
                              )
                            }
                            className="apple-select text-[12px] py-1 w-full"
                          >
                            <option value="in_stock">🟢 Sotuvda bor</option>
                            <option value="on_order">🟡 Buyurtmaga</option>
                            <option value="out_of_stock">⚪ Vaqtincha tugagan</option>
                          </select>
                        </td>

                        {/* Delete */}
                        <td style={{ textAlign: 'right' }}>
                          <button
                            type="button"
                            onClick={() => handleDeleteProduct(prod.id)}
                            className="p-1.5 text-[#86868b] hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                            title="O‘chirish"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>

      {/* =========================================================================
          MODAL: YANGI MAHSULOT QO‘SHISH (Supabase Storage product-images upload)
         ========================================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
          <div
            onClick={() => setIsAddModalOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
          />

          <div className="bg-white rounded-[28px] max-w-[620px] w-full p-5 sm:p-7 shadow-2xl relative z-10 max-h-[92vh] overflow-y-auto border border-black/[0.08] flex flex-col space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-black/[0.06] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#0071e3]/10 text-[#0071e3] flex items-center justify-center font-bold text-[15px]">
                  +
                </div>
                <div>
                  <h3 className="text-[17px] font-semibold text-[#1d1d1f]">
                    Yangi Mahsulot Qo‘shish
                  </h3>
                  <p className="text-[11px] text-[#86868b]">
                    Supabase Storage va products jadvaliga avtomatik yoziladi
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="w-7 h-7 rounded-full bg-[#f5f5f7] hover:bg-[#e5e5e7] text-[#1d1d1f] flex items-center justify-center transition"
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateProduct} className="space-y-3.5">
              {/* Image Upload Area */}
              <div>
                <label className="block text-[12px] font-semibold text-[#1d1d1f] mb-1">
                  Mahsulot rasmi{' '}
                  <span className="text-[#86868b] font-normal">
                    (Supabase Storage: product-images)
                  </span>
                </label>
                <label className="border-2 border-dashed border-black/15 rounded-[16px] p-4 text-center cursor-pointer hover:border-[#0071e3] hover:bg-[#0071e3]/5 transition flex flex-col items-center justify-center min-h-[130px] bg-[#f5f5f7]">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-h-[120px] rounded-xl object-contain shadow-sm"
                    />
                  ) : (
                    <div className="space-y-1">
                      <Upload className="w-6 h-6 mx-auto text-[#86868b]" />
                      <div className="text-[12px] font-medium text-[#1d1d1f]">
                        Rasm yuklash uchun bosing
                      </div>
                      <div className="text-[10px] text-[#86868b]">
                        JPG, PNG yoki WEBP fayllar
                      </div>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Names */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#1d1d1f] mb-1">
                    Nomi (O‘zbekcha) *
                  </label>
                  <input
                    type="text"
                    required
                    value={newProdNameUz}
                    onChange={(e) => setNewProdNameUz(e.target.value)}
                    placeholder="Masalan: Jarrohlik shiptsisi"
                    className="apple-input text-[12px]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#1d1d1f] mb-1">
                    Nomi (Ruscha)
                  </label>
                  <input
                    type="text"
                    value={newProdNameRu}
                    onChange={(e) => setNewProdNameRu(e.target.value)}
                    placeholder="Masalan: Щипцы хирургические"
                    className="apple-input text-[12px]"
                  />
                </div>
              </div>

              {/* Category & Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#1d1d1f] mb-1">
                    Kategoriya *
                  </label>
                  <select
                    value={newProdCategory}
                    onChange={(e) =>
                      setNewProdCategory(e.target.value as ProductCategory)
                    }
                    className="apple-select w-full text-[12px] py-2"
                  >
                    <option value="equipment">Uskunalar & Apparatlar</option>
                    <option value="sets">To‘plamlar</option>
                    <option value="surgery">Jarrohlik & Implant</option>
                    <option value="therapy">Terapiya & Polirovka</option>
                    <option value="consumables">Sarf materiallari</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#1d1d1f] mb-1">
                    Narxi (so‘m) *
                  </label>
                  <input
                    type="text"
                    required
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(e.target.value)}
                    placeholder="750 000"
                    className="apple-input text-[12px]"
                  />
                </div>
              </div>

              {/* Status & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#1d1d1f] mb-1">
                    Holati (Status) *
                  </label>
                  <select
                    value={newProdStatus}
                    onChange={(e) =>
                      setNewProdStatus(e.target.value as ProductStatus)
                    }
                    className="apple-select w-full text-[12px] py-2"
                  >
                    <option value="in_stock">🟢 Sotuvda bor</option>
                    <option value="on_order">🟡 Buyurtmaga</option>
                    <option value="out_of_stock">⚪ Vaqtincha tugagan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#1d1d1f] mb-1">
                    Belgi (Badge)
                  </label>
                  <input
                    type="text"
                    value={newProdBadgeUz}
                    onChange={(e) => setNewProdBadgeUz(e.target.value)}
                    placeholder="Yangi, Xit to'plam..."
                    className="apple-input text-[12px]"
                  />
                </div>
              </div>

              {/* Descriptions */}
              <div>
                <label className="block text-[11px] font-semibold text-[#1d1d1f] mb-1">
                  Tavsif (O‘zbekcha)
                </label>
                <textarea
                  rows={2}
                  value={newProdDescUz}
                  onChange={(e) => setNewProdDescUz(e.target.value)}
                  placeholder="Mahsulot haqida ma'lumot..."
                  className="apple-input text-[12px] resize-none"
                />
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-black/[0.06]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="apple-btn-light py-2 px-4 text-[12px]"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={isUploadingImage}
                  className="apple-btn-primary py-2 px-6 text-[12px] shadow-sm flex items-center gap-1.5"
                >
                  {isUploadingImage ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saqlanmoqda...</span>
                    </>
                  ) : (
                    <span>Bazasiga saqlash</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
