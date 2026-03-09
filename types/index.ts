/**
 * Tipos globales del ecommerce Nutrielys
 */

export type OrderStatus = "pending" | "confirmed" | "delivered" | "cancelled";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  price: number;
  compare_price: number | null;
  stock: number;
  category_id: string | null;
  image_url: string | null;
  is_featured: boolean;
  is_active: boolean;
  benefits: string[] | null;
  ingredients: string[] | null;
  created_at: string;
  updated_at: string;
  category?: Category | null;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  alt_text: string | null;
  sort_order: number;
}

export interface ProductWithImages extends Product {
  product_images?: ProductImage[];
}

export interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_notes: string | null;
  total: number;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name_snapshot: string;
  price_snapshot: number;
  quantity: number;
  subtotal: number;
}

export interface SiteSettings {
  id: string;
  business_name: string;
  whatsapp_number: string;
  hero_title: string | null;
  hero_subtitle: string | null;
  hero_image: string | null;
  updated_at: string;
}

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  role: "customer" | "admin";
  created_at: string;
  updated_at: string;
}

/** Item del carrito (cliente) */
export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string | null;
  slug: string;
}
