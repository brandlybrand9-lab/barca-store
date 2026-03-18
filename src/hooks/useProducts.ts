import { useState, useEffect } from 'react';
import { supabase, Product } from '../lib/supabase';
import { products as staticProducts } from '../data/products';

// Map static products to match Supabase schema
const fallbackProducts: Product[] = staticProducts.map(p => ({
  ...p,
  in_stock: p.inStock,
  featured: p.featured || false,
  sizes: p.sizes || [],
  colors: p.colors || []
}));

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Only attempt to fetch if Supabase URL is configured
        if (!import.meta.env.VITE_SUPABASE_URL) {
          setProducts(fallbackProducts);
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        if (data && data.length > 0) {
          setProducts(data);
        } else {
          setProducts(fallbackProducts);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        // Fallback to static data if Supabase fails
        setProducts(fallbackProducts);
        setError(err instanceof Error ? err.message : 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, loading, error };
};
