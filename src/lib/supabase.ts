import { createClient } from '@supabase/supabase-js';

// Provide dummy values to prevent createClient from throwing an error 
// when environment variables are missing (e.g., before configuring Supabase).
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  sizes: string[];
  colors: string[];
  in_stock: boolean;
  featured: boolean;
  created_at?: string;
};

export type Order = {
  id: string;
  full_name: string;
  phone: string;
  wilaya: string;
  address: string;
  notes: string;
  total_amount: number;
  delivery_fee: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  created_at: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  size?: string;
  color?: string;
  price_at_time: number;
};
