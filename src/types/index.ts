export type ProductCategory =
  | 'all'
  | 'equipment'
  | 'sets'
  | 'surgery'
  | 'therapy'
  | 'consumables';

export type ProductStatus = 'in_stock' | 'on_order' | 'out_of_stock';

export interface Product {
  id: string;
  category: ProductCategory | string;
  name_uz: string;
  name_ru?: string;
  desc_uz?: string;
  desc_ru?: string;
  price: number;
  price_display_uz?: string;
  price_display_ru?: string;
  in_stock?: boolean;
  badge_uz?: string;
  badge_ru?: string;
  images: string[];
  status: ProductStatus;
  created_at?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export type OrderStatus =
  | 'Yangi'
  | 'Bog‘lanildi'
  | 'Yetkazilmoqda'
  | 'Yakunlandi'
  | 'Bekor qilindi';

export interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  telegram_username?: string;
  items: OrderItem[];
  total_price: number;
  status: OrderStatus;
  created_at: string;
}

export type Language = 'uz' | 'ru';
