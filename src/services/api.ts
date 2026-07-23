import { supabase } from '@/db/supabase';
import type { Product, Category, Brand, Banner, BlogPost, CartItem, WishlistItem, Order, CheckoutForm, Profile, QuoteRequest, Message, SiteSetting } from '@/types/types';

// ─── Products ───────────────────────────────────────────────────────
export async function fetchProducts(opts: {
  categorySlug?: string;
  brandSlug?: string;
  search?: string;
  featured?: boolean;
  page?: number;
  limit?: number;
} = {}): Promise<{ data: Product[]; count: number }> {
  const { categorySlug, brandSlug, search, featured, page = 1, limit = 20 } = opts;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let q = supabase
    .from('products')
    .select('*, categories!category_id(id,name,slug), brands!brand_id(id,name,slug)', { count: 'exact' })
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .range(from, to);

  if (featured) q = q.eq('is_featured', true);
  if (search) q = q.ilike('name', `%${search}%`);
  if (categorySlug) {
    const { data: cat } = await supabase.from('categories').select('id').eq('slug', categorySlug).maybeSingle();
    if (cat) q = q.eq('category_id', cat.id);
  }
  if (brandSlug) {
    const { data: brand } = await supabase.from('brands').select('id').eq('slug', brandSlug).maybeSingle();
    if (brand) q = q.eq('brand_id', brand.id);
  }

  const { data, count, error } = await q;
  if (error) throw error;
  return { data: Array.isArray(data) ? (data as Product[]) : [], count: count ?? 0 };
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*, categories!category_id(id,name,slug), brands!brand_id(id,name,slug)')
    .eq('slug', slug)
    .maybeSingle();
  if (error) throw error;
  return data as Product | null;
}

export async function fetchFeaturedProducts(limit = 8): Promise<Product[]> {
  const { data } = await fetchProducts({ featured: true, limit });
  return data;
}

// ─── Categories ──────────────────────────────────────────────────────
export async function fetchCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order');
  if (error) throw error;
  return Array.isArray(data) ? data : [];
}
export async function adminFetchCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order');
  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

// ─── Brands ──────────────────────────────────────────────────────────
export async function fetchBrands(): Promise<Brand[]> {
  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .eq('is_active', true)
    .order('sort_order');
  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

// ─── Banners ─────────────────────────────────────────────────────────
export async function fetchBanners(): Promise<Banner[]> {
  const { data, error } = await supabase
    .from('banners')
    .select('*')
    .eq('is_active', true)
    .order('sort_order');
  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

// ─── Blog ─────────────────────────────────────────────────────────────
export async function fetchBlogPosts(page = 1, limit = 9): Promise<{ data: BlogPost[]; count: number }> {
  const from = (page - 1) * limit;
  const { data, count, error } = await supabase
    .from('blog_posts')
    .select('*', { count: 'exact' })
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .range(from, from + limit - 1);
  if (error) throw error;
  return { data: Array.isArray(data) ? data : [], count: count ?? 0 };
}

export async function fetchBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .maybeSingle();
  if (error) throw error;
  return data;
}

// ─── Cart ─────────────────────────────────────────────────────────────
export async function fetchCart(): Promise<CartItem[]> {
  const { data, error } = await supabase
    .from('cart_items')
    .select('*, products(id,name,slug,price,dealer_price,distributor_price,cost_price,thumbnail_url,stock_qty)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return Array.isArray(data) ? (data as CartItem[]) : [];
}

/** Return the correct price for a product based on the buyer's role.
 *  admin       → cost_price (or price if cost_price null)
 *  dealer      → dealer_price (15% off)
 *  distributor → distributor_price (10% off)
 *  customer    → price (retail) with optional volume discount
 */
export function resolvePrice(
  product: { price: number; dealer_price?: number | null; distributor_price?: number | null; cost_price?: number | null },
  role: string,
  orderCount = 0
): number {
  if (role === 'admin')       return product.cost_price ?? product.price;
  if (role === 'dealer')      return product.dealer_price ?? product.price;
  if (role === 'distributor') return product.distributor_price ?? product.price;
  // customer: volume discount — 5% off if 5+ past orders, 8% off if 10+ orders
  if (role === 'customer') {
    if (orderCount >= 10) return Math.round(product.price * 0.92 * 100) / 100;
    if (orderCount >= 5)  return Math.round(product.price * 0.95 * 100) / 100;
  }
  return product.price;
}

export async function upsertCartItem(productId: string, quantity: number): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  const { error } = await supabase
    .from('cart_items')
    .upsert({ user_id: user.id, product_id: productId, quantity }, { onConflict: 'user_id,product_id' });
  if (error) throw error;
}

export async function removeCartItem(itemId: string): Promise<void> {
  const { error } = await supabase.from('cart_items').delete().eq('id', itemId);
  if (error) throw error;
}

export async function clearCart(): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  const { error } = await supabase.from('cart_items').delete().eq('user_id', user.id);
  if (error) throw error;
}

// ─── Wishlist ─────────────────────────────────────────────────────────
export async function fetchWishlist(): Promise<WishlistItem[]> {
  const { data, error } = await supabase
    .from('wishlist_items')
    .select('*, products(id,name,slug,price,thumbnail_url,stock_qty)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return Array.isArray(data) ? (data as WishlistItem[]) : [];
}

export async function toggleWishlist(productId: string): Promise<'added' | 'removed'> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  const { data: existing } = await supabase
    .from('wishlist_items')
    .select('id')
    .eq('user_id', user.id)
    .eq('product_id', productId)
    .maybeSingle();
  if (existing) {
    await supabase.from('wishlist_items').delete().eq('id', existing.id);
    return 'removed';
  }
  await supabase.from('wishlist_items').insert({ user_id: user.id, product_id: productId });
  return 'added';
}

// ─── Orders ───────────────────────────────────────────────────────────
export async function createOrder(
  cartItems: CartItem[],
  form: CheckoutForm,
  isDealer: boolean,
  dealerDiscount = 0,
  role = 'customer',
  orderCount = 0
): Promise<Order> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const subtotal = cartItems.reduce((sum, item) => {
    const price = resolvePrice(item.products ?? { price: 0 }, role, orderCount);
    return sum + price * item.quantity;
  }, 0);
  const discountAmount = isDealer ? subtotal * (dealerDiscount / 100) : 0;
  const total = subtotal - discountAmount;

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: user.id,
      order_number: '',
      status: 'pending',
      is_dealer_order: isDealer,
      subtotal,
      discount_amount: discountAmount,
      tax_amount: 0,
      total,
      shipping_name: form.full_name || null,
      shipping_phone: form.phone || null,
      shipping_address: form.address || null,
      shipping_city: form.city || null,
      shipping_country: form.country || 'Azerbaijan',
      notes: form.notes || null,
    })
    .select()
    .maybeSingle();
  if (orderError || !order) throw orderError ?? new Error('Order creation failed');

  const items = cartItems.map(item => {
    const price = resolvePrice(item.products ?? { price: 0 }, role, orderCount);
    return {
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.products?.name ?? '',
      product_sku: item.products?.sku ?? null,
      quantity: item.quantity,
      unit_price: price,
      total_price: price * item.quantity,
    };
  });

  const { error: itemsError } = await supabase.from('order_items').insert(items);
  if (itemsError) throw itemsError;

  await clearCart();
  return order as Order;
}

export async function trackOrder(orderNumber: string, phone: string): Promise<any> {
  const { data, error } = await supabase.rpc('get_order_tracking', { p_order_number: orderNumber, p_phone: phone });
  if (error) throw error;
  return data;
}
export async function fetchMyOrders(page = 1, limit = 10): Promise<{ data: Order[]; count: number }> {
  const from = (page - 1) * limit;
  const { data, count, error } = await supabase
    .from('orders')
    .select('*, order_items(*)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, from + limit - 1);
  if (error) throw error;
  return { data: Array.isArray(data) ? (data as Order[]) : [], count: count ?? 0 };
}

export async function fetchOrderById(id: string): Promise<Order | null> {
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data as Order | null;
}

// ─── Profile ──────────────────────────────────────────────────────────
export async function fetchProfile(): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .maybeSingle();
  if (error) throw error;
  return data as Profile | null;
}

export async function updateProfile(updates: Partial<Profile>): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  const { error } = await supabase.from('profiles').update(updates).eq('id', user.id);
  if (error) throw error;
}

export async function applyForDealer(): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  const { error } = await supabase
    .from('profiles')
    .update({ dealer_status: 'pending' })
    .eq('id', user.id);
  if (error) throw error;
}

// ─── Quote Requests ───────────────────────────────────────────────────
export async function createQuoteRequest(message: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  const { error } = await supabase.from('quote_requests').insert({ user_id: user.id, message });
  if (error) throw error;
}

export async function fetchMyQuotes(): Promise<QuoteRequest[]> {
  const { data, error } = await supabase
    .from('quote_requests')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);
  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

// ─── Messages ─────────────────────────────────────────────────────────
export async function fetchMyMessages(): Promise<Message[]> {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);
  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

export async function sendMessage(subject: string, content: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  const { error } = await supabase.from('messages').insert({ user_id: user.id, subject, content });
  if (error) throw error;
}

// ─── Site Settings ────────────────────────────────────────────────────
export async function fetchSiteSettings(): Promise<Record<string, string>> {
  const { data, error } = await supabase.from('site_settings').select('*');
  if (error) throw error;
  return Object.fromEntries((data ?? []).map((s: SiteSetting) => [s.key, s.value ?? '']));
}

export async function upsertSiteSetting(key: string, value: string, description?: string): Promise<void> {
  const { error } = await supabase.from('site_settings').upsert({
    key,
    value,
    description,
    updated_at: new Date().toISOString()
  }, { onConflict: 'key' });
  if (error) throw error;
}

// ─── Admin APIs ───────────────────────────────────────────────────────
export async function adminFetchAllOrders(page = 1, limit = 20): Promise<{ data: Order[]; count: number }> {
  const from = (page - 1) * limit;
  const { data, count, error } = await supabase
    .from('orders')
    .select('*, profiles!user_id(id,email,full_name), order_items(*)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, from + limit - 1);
  if (error) throw error;
  return { data: Array.isArray(data) ? (data as Order[]) : [], count: count ?? 0 };
}

export async function adminUpdateOrderStatus(id: string, status: string): Promise<void> {
  const { error } = await supabase.from('orders').update({ status }).eq('id', id);
  if (error) throw error;
}

export async function adminFetchAllProfiles(page = 1, limit = 20): Promise<{ data: Profile[]; count: number }> {
  const from = (page - 1) * limit;
  const { data, count, error } = await supabase
    .from('profiles')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, from + limit - 1);
  if (error) throw error;
  return { data: Array.isArray(data) ? (data as Profile[]) : [], count: count ?? 0 };
}

export async function adminUpdateProfile(id: string, updates: Partial<Profile>): Promise<void> {
  const { error } = await supabase.from('profiles').update(updates).eq('id', id);
  if (error) throw error;
}

export async function adminUpsertProduct(product: Partial<Product>): Promise<void> {
  // Remove nested relational objects before upsert
  const { categories, brands, ...payload } = product as any;
  
  if (payload.id) {
    const { error } = await supabase.from('products').update(payload).eq('id', payload.id);
    if (error) throw error;
  } else {
    if (payload.sku) {
      const { data: existing } = await supabase.from('products').select('id').eq('sku', payload.sku).maybeSingle();
      if (existing) {
        // It's an automated upsert (like Excel bulk upload). Prevent overriding existing slug.
        delete payload.slug;
        const { error } = await supabase.from('products').update(payload).eq('id', existing.id);
        if (error) throw error;
        return;
      }
    }
    const { error } = await supabase.from('products').insert(payload);
    if (error) {
      if (error.code === '23505' && payload.sku) {
        // Race condition: another process inserted it between our select and insert.
        // Fallback to update.
        const { data: existingNow } = await supabase.from('products').select('id').eq('sku', payload.sku).maybeSingle();
        if (existingNow) {
          delete payload.slug;
          const { error: updateErr } = await supabase.from('products').update(payload).eq('id', existingNow.id);
          if (updateErr) throw updateErr;
          return;
        }
      }
      throw error;
    }
  }
}

export async function adminDeleteProduct(id: string): Promise<void> {
  const { error } = await supabase.from('products').update({ is_active: false }).eq('id', id);
  if (error) throw error;
}

export async function adminDeleteAllProducts(): Promise<void> {
  const { error } = await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (error) throw error;
}

export async function adminDeleteProducts(ids: string[]): Promise<void> {
  if (!ids || ids.length === 0) return;
  const { error } = await supabase.from('products').delete().in('id', ids);
  if (error) throw error;
}

export async function adminFetchAllProducts(page = 1, limit = 20, categoryId?: string, search?: string): Promise<{ data: Product[]; count: number }> {
  const from = (page - 1) * limit;
  let query = supabase
    .from('products')
    .select('*, categories!category_id(id,name,slug), brands!brand_id(id,name,slug)', { count: 'exact' });

  if (categoryId && categoryId !== 'all') {
    query = query.eq('category_id', categoryId);
  }
  if (search) {
    query = query.or(`name.ilike.%${search}%,sku.ilike.%${search}%`);
  }

  const { data, count, error } = await query
    .order('created_at', { ascending: false })
    .range(from, from + limit - 1);
  if (error) throw error;
  return { data: Array.isArray(data) ? (data as Product[]) : [], count: count ?? 0 };
}

export async function adminFetchAllQuotes(): Promise<QuoteRequest[]> {
  const { data, error } = await supabase
    .from('quote_requests')
    .select('*, profiles!user_id(id,email,full_name)')
    .order('created_at', { ascending: false })
    .limit(100);
  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

export async function adminUpsertBanner(banner: Partial<Banner>): Promise<void> {
  const { error } = banner.id
    ? await supabase.from('banners').update(banner).eq('id', banner.id)
    : await supabase.from('banners').insert(banner);
  if (error) throw error;
}

export async function adminDeleteBanner(id: string): Promise<void> {
  const { error } = await supabase.from('banners').delete().eq('id', id);
  if (error) throw error;
}

export async function adminUpsertBlogPost(post: Partial<BlogPost>): Promise<void> {
  const { error } = post.id
    ? await supabase.from('blog_posts').update(post).eq('id', post.id)
    : await supabase.from('blog_posts').insert(post);
  if (error) throw error;
}

export async function adminDeleteBlogPost(id: string): Promise<void> {
  const { error } = await supabase.from('blog_posts').delete().eq('id', id);
  if (error) throw error;
}

export async function adminUpsertCategory(category: Partial<Category>): Promise<void> {
  const { error } = category.id
    ? await supabase.from('categories').update(category).eq('id', category.id)
    : await supabase.from('categories').insert(category);
  if (error) throw error;
}

export async function adminDeleteCategory(id: string): Promise<void> {
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) throw error;
}

export async function adminFetchDashboardStats(): Promise<{
  totalOrders: number; totalRevenue: number; totalCustomers: number; totalProducts: number;
}> {
  const [ordersRes, customersRes, productsRes] = await Promise.all([
    supabase.from('orders').select('total', { count: 'exact' }),
    supabase.from('profiles').select('id', { count: 'exact' }).eq('role', 'customer'),
    supabase.from('products').select('id', { count: 'exact' }).eq('is_active', true),
  ]);
  const totalRevenue = (ordersRes.data ?? []).reduce((sum: number, o: { total: number }) => sum + (o.total ?? 0), 0);
  return {
    totalOrders: ordersRes.count ?? 0,
    totalRevenue,
    totalCustomers: customersRes.count ?? 0,
    totalProducts: productsRes.count ?? 0,
  };
}

export async function adminCreateCategoryAndGetId(categoryName: string): Promise<string> {
  const slug = categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const { data, error } = await supabase.from('categories').insert({
    name: categoryName,
    slug: slug,
    is_active: true,
    sort_order: 0
  }).select('id').maybeSingle();

  if (error) {
    if (error.code === '23505') { // unique constraint violation
      const { data: existing } = await supabase.from('categories').select('id').eq('slug', slug).maybeSingle();
      if (existing) return existing.id;
    }
    throw error;
  }
  
  if (!data) throw new Error("Category could not be created or fetched.");
  return data.id;
}
