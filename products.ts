import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Product, Review } from '@/lib/types';

export async function fetchProducts(filters?: {
  category?: string;
  type?: string;
  collection?: string;
  featured?: boolean;
  trending?: boolean;
  is_new?: boolean;
  search?: string;
  sort?: string;
  limit?: number;
}) {
  let query = supabase.from('products').select('*');

  if (filters?.category) query = query.eq('category', filters.category);
  if (filters?.type) query = query.eq('type', filters.type);
  if (filters?.collection) query = query.eq('collection', filters.collection);
  if (filters?.featured) query = query.eq('featured', true);
  if (filters?.trending) query = query.eq('trending', true);
  if (filters?.is_new) query = query.eq('is_new', true);

  if (filters?.search) {
    query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%,collection.ilike.%${filters.search}%`);
  }

  switch (filters?.sort) {
    case 'price-asc': query = query.order('price', { ascending: true }); break;
    case 'price-desc': query = query.order('price', { ascending: false }); break;
    case 'newest': query = query.order('created_at', { ascending: false }); break;
    case 'rating': query = query.order('rating', { ascending: false }); break;
    default: query = query.order('created_at', { ascending: false });
  }

  if (filters?.limit) query = query.limit(filters.limit);

  const { data, error } = await query;
  if (error) throw error;
  return (data || []) as Product[];
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();
  if (error) throw error;
  return data as Product | null;
}

export async function fetchReviews(productId: string): Promise<Review[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('product_id', productId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []) as Review[];
}

export async function addReview(productId: string, rating: number, title: string, body: string, authorName: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Please sign in to leave a review');
  const { error } = await supabase.from('reviews').insert({
    product_id: productId,
    user_id: user.id,
    author_name: authorName,
    rating,
    title,
    body,
  });
  if (error) throw error;
}

export async function fetchRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('type', product.type)
    .neq('id', product.id)
    .limit(limit);
  if (error) throw error;
  return (data || []) as Product[];
}

export function useProducts(filters?: Parameters<typeof fetchProducts>[0]) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchProducts(filters)
      .then(data => { if (active) { setProducts(data); setError(null); } })
      .catch(err => { if (active) setError(err.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filters)]);

  return { products, loading, error };
}
