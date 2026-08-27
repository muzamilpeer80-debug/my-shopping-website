import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { Link, navigate } from '@/lib/router';
import { supabase } from '@/lib/supabase';
import type { Product, Order, Profile, Coupon } from '@/lib/types';
import { formatINR } from '@/lib/types';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { LayoutDashboard, Package, ShoppingBag, Users, Ticket, TrendingUp, Plus, Edit2, Trash2, X } from 'lucide-react';

export default function Admin() {
  const { session } = useAuth();
  const [tab, setTab] = useState<'dashboard' | 'products' | 'orders' | 'customers' | 'coupons'>('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Profile[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);

  useEffect(() => {
    if (!session) { navigate('/auth'); return; }
    Promise.all([
      supabase.from('products').select('*').order('created_at', { ascending: false }),
      supabase.from('orders').select('*').order('created_at', { ascending: false }),
      supabase.from('profiles').select('*'),
      supabase.from('coupons').select('*'),
    ]).then(([p, o, c, cp]) => {
      setProducts(p.data || []);
      setOrders((o.data || []) as Order[]);
      setCustomers(c.data || []);
      setCoupons(cp.data || []);
      setLoading(false);
    });
  }, [session]);

  if (!session) return null;

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

  const deleteProduct = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    await supabase.from('products').delete().eq('id', id);
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const updateOrderStatus = async (id: string, status: string) => {
    await supabase.from('orders').update({ status }).eq('id', id);
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  const navItems = [
    { k: 'dashboard' as const, l: 'Dashboard', icon: LayoutDashboard },
    { k: 'products' as const, l: 'Products', icon: Package },
    { k: 'orders' as const, l: 'Orders', icon: ShoppingBag },
    { k: 'customers' as const, l: 'Customers', icon: Users },
    { k: 'coupons' as const, l: 'Coupons', icon: Ticket },
  ];

  return (
    <div className="pt-24 lg:pt-32 pb-20">
      <div className="container-lux">
        <Breadcrumbs crumbs={[{ label: 'Admin' }]} />
        <h1 className="font-display text-4xl lg:text-5xl mt-8 mb-12">Admin Dashboard</h1>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <nav className="flex lg:flex-col gap-1 overflow-x-auto scrollbar-hide">
              {navItems.map(item => (
                <button
                  key={item.k}
                  onClick={() => setTab(item.k)}
                  className={`flex items-center gap-3 px-4 py-3 text-sm whitespace-nowrap transition-colors ${tab === item.k ? 'bg-ink-900 text-ivory-50' : 'text-ink-700 hover:bg-ivory-100'}`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.l}
                </button>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <div className="lg:col-span-4">
            {loading ? (
              <div className="space-y-4">
                <div className="h-32 skeleton" />
                <div className="h-64 skeleton" />
              </div>
            ) : (
              <>
                {/* Dashboard */}
                {tab === 'dashboard' && (
                  <div className="animate-fade-in">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                      {[
                        { label: 'Revenue', value: formatINR(totalRevenue), icon: TrendingUp },
                        { label: 'Orders', value: orders.length.toString(), icon: ShoppingBag },
                        { label: 'Products', value: products.length.toString(), icon: Package },
                        { label: 'Customers', value: customers.length.toString(), icon: Users },
                      ].map(s => (
                        <div key={s.label} className="bg-ivory-100 p-6">
                          <div className="flex items-center justify-between mb-3">
                            <p className="text-[11px] uppercase tracking-[0.15em] text-ink-500">{s.label}</p>
                            <s.icon className="w-4 h-4 text-ink-400" />
                          </div>
                          <p className="font-display text-3xl">{s.value}</p>
                        </div>
                      ))}
                    </div>

                    <div className="grid lg:grid-cols-2 gap-6">
                      <div className="bg-ivory-100 p-6">
                        <h3 className="font-display text-xl mb-4">Avg Order Value</h3>
                        <p className="font-display text-4xl mb-2">{formatINR(avgOrderValue)}</p>
                        <p className="text-xs text-ink-500">Across {orders.length} orders</p>
                      </div>
                      <div className="bg-ivory-100 p-6">
                        <h3 className="font-display text-xl mb-4">Recent Orders</h3>
                        <div className="space-y-2">
                          {orders.slice(0, 5).map(o => (
                            <div key={o.id} className="flex justify-between text-sm">
                              <span className="text-ink-600">{o.tracking_number || o.id.slice(0, 8)}</span>
                              <span className="font-medium">{formatINR(o.total)}</span>
                            </div>
                          ))}
                          {orders.length === 0 && <p className="text-sm text-ink-400">No orders yet</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Products */}
                {tab === 'products' && (
                  <div className="animate-fade-in">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="font-display text-2xl">Products ({products.length})</h2>
                      <button onClick={() => { setEditingProduct(null); setShowProductForm(true); }} className="btn-primary">
                        <Plus className="w-4 h-4" /> Add Product
                      </button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-ink-100 text-left text-[11px] uppercase tracking-[0.15em] text-ink-500">
                            <th className="py-3 pr-4">Product</th>
                            <th className="py-3 px-4">Category</th>
                            <th className="py-3 px-4">Price</th>
                            <th className="py-3 px-4">Stock</th>
                            <th className="py-3 px-4">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {products.map(p => (
                            <tr key={p.id} className="border-b border-ink-100">
                              <td className="py-3 pr-4">
                                <div className="flex items-center gap-3">
                                  <img src={p.images[0]} alt={p.name} className="w-10 h-12 object-cover" />
                                  <span className="font-medium">{p.name}</span>
                                </div>
                              </td>
                              <td className="py-3 px-4 capitalize">{p.category} · {p.type}</td>
                              <td className="py-3 px-4">{formatINR(p.price)}</td>
                              <td className="py-3 px-4">
                                <span className={p.stock <= 10 ? 'text-accent-dark' : ''}>{p.stock}</span>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex gap-2">
                                  <button onClick={() => { setEditingProduct(p); setShowProductForm(true); }} className="p-1.5 hover:bg-ivory-100"><Edit2 className="w-4 h-4" /></button>
                                  <button onClick={() => deleteProduct(p.id)} className="p-1.5 hover:bg-ivory-100"><Trash2 className="w-4 h-4" /></button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Orders */}
                {tab === 'orders' && (
                  <div className="animate-fade-in">
                    <h2 className="font-display text-2xl mb-6">Orders ({orders.length})</h2>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-ink-100 text-left text-[11px] uppercase tracking-[0.15em] text-ink-500">
                            <th className="py-3 pr-4">Order</th>
                            <th className="py-3 px-4">Date</th>
                            <th className="py-3 px-4">Items</th>
                            <th className="py-3 px-4">Total</th>
                            <th className="py-3 px-4">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.map(o => (
                            <tr key={o.id} className="border-b border-ink-100">
                              <td className="py-3 pr-4 font-medium">{o.tracking_number || o.id.slice(0, 8)}</td>
                              <td className="py-3 px-4 text-ink-500">{new Date(o.created_at).toLocaleDateString()}</td>
                              <td className="py-3 px-4">{o.items.length}</td>
                              <td className="py-3 px-4 font-medium">{formatINR(o.total)}</td>
                              <td className="py-3 px-4">
                                <select
                                  value={o.status}
                                  onChange={e => updateOrderStatus(o.id, e.target.value)}
                                  className="bg-transparent border border-ink-200 px-2 py-1 text-xs capitalize focus:outline-none focus:border-ink-900"
                                >
                                  {['processing', 'shipped', 'delivered', 'cancelled'].map(s => (
                                    <option key={s} value={s}>{s}</option>
                                  ))}
                                </select>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {orders.length === 0 && <p className="text-ink-400 py-8 text-center">No orders yet</p>}
                    </div>
                  </div>
                )}

                {/* Customers */}
                {tab === 'customers' && (
                  <div className="animate-fade-in">
                    <h2 className="font-display text-2xl mb-6">Customers ({customers.length})</h2>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-ink-100 text-left text-[11px] uppercase tracking-[0.15em] text-ink-500">
                            <th className="py-3 pr-4">Name</th>
                            <th className="py-3 px-4">Phone</th>
                            <th className="py-3 px-4">Joined</th>
                            <th className="py-3 px-4">Orders</th>
                          </tr>
                        </thead>
                        <tbody>
                          {customers.map(c => {
                            const custOrders = orders.filter(o => o.user_id === c.id);
                            return (
                              <tr key={c.id} className="border-b border-ink-100">
                                <td className="py-3 pr-4 font-medium">{c.full_name || '—'}</td>
                                <td className="py-3 px-4 text-ink-500">{c.phone || '—'}</td>
                                <td className="py-3 px-4 text-ink-500">{new Date(c.created_at).toLocaleDateString()}</td>
                                <td className="py-3 px-4">{custOrders.length}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                      {customers.length === 0 && <p className="text-ink-400 py-8 text-center">No customers yet</p>}
                    </div>
                  </div>
                )}

                {/* Coupons */}
                {tab === 'coupons' && (
                  <div className="animate-fade-in">
                    <h2 className="font-display text-2xl mb-6">Coupons ({coupons.length})</h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {coupons.map(c => (
                        <div key={c.id} className="bg-ivory-100 p-6">
                          <p className="font-display text-2xl mb-2">{c.code}</p>
                          <p className="text-sm text-ink-600">
                            {c.discount_type === 'percent' ? `${c.value}% off` : `${formatINR(c.value)} off`}
                          </p>
                          <p className="text-xs text-ink-400 mt-2">
                            Min: {formatINR(c.min_subtotal)} · {c.active ? 'Active' : 'Inactive'}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Product form modal */}
      {showProductForm && (
        <ProductForm
          product={editingProduct}
          onClose={() => setShowProductForm(false)}
          onSave={async (p) => {
            if (editingProduct) {
              await supabase.from('products').update(p).eq('id', editingProduct.id);
              setProducts(prev => prev.map(item => item.id === editingProduct.id ? { ...item, ...p } as Product : item));
            } else {
              const { data } = await supabase.from('products').insert(p).select().single();
              if (data) setProducts(prev => [data as Product, ...prev]);
            }
            setShowProductForm(false);
          }}
        />
      )}
    </div>
  );
}

function ProductForm({ product, onClose, onSave }: { product: Product | null; onClose: () => void; onSave: (p: Record<string, unknown>) => void }) {
  const [form, setForm] = useState({
    name: product?.name || '',
    slug: product?.slug || '',
    description: product?.description || '',
    price: product?.price ? (product.price / 100).toString() : '',
    category: product?.category || 'men',
    type: product?.type || 'shoes',
    collection: product?.collection || '',
    images: product?.images.join('\n') || '',
    sizes: product?.sizes.join(', ') || '',
    colors: product?.colors.join(', ') || '',
    stock: product?.stock?.toString() || '0',
    featured: product?.featured || false,
    trending: product?.trending || false,
    is_new: product?.is_new || false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: form.name,
      slug: form.slug || form.name.toLowerCase().replace(/\s+/g, '-'),
      description: form.description,
      price: Math.round(Number(form.price) * 100),
      category: form.category,
      type: form.type,
      collection: form.collection || null,
      images: form.images.split('\n').filter(Boolean),
      sizes: form.sizes.split(',').map(s => s.trim()).filter(Boolean),
      colors: form.colors.split(',').map(s => s.trim()).filter(Boolean),
      stock: Number(form.stock),
      featured: form.featured,
      trending: form.trending,
      is_new: form.is_new,
    });
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-ivory-50 max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 animate-scale-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl">{product ? 'Edit Product' : 'New Product'}</h2>
          <button onClick={onClose} className="p-2"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className="label-lux">Name</label><input type="text" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="input-lux" /></div>
            <div><label className="label-lux">Slug</label><input type="text" value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} className="input-lux" placeholder="auto-generated" /></div>
            <div><label className="label-lux">Price (₹)</label><input type="number" required value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} className="input-lux" /></div>
            <div><label className="label-lux">Stock</label><input type="number" required value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} className="input-lux" /></div>
            <div>
              <label className="label-lux">Category</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="input-lux">
                <option value="men">Men</option>
                <option value="women">Women</option>
              </select>
            </div>
            <div>
              <label className="label-lux">Type</label>
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className="input-lux">
                <option value="shoes">Shoes</option>
                <option value="clothing">Clothing</option>
              </select>
            </div>
            <div><label className="label-lux">Collection</label><input type="text" value={form.collection} onChange={e => setForm(f => ({ ...f, collection: e.target.value }))} className="input-lux" /></div>
          </div>
          <div><label className="label-lux">Description</label><textarea rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="input-lux resize-none" /></div>
          <div><label className="label-lux">Images (one URL per line)</label><textarea rows={3} value={form.images} onChange={e => setForm(f => ({ ...f, images: e.target.value }))} className="input-lux resize-none" placeholder="https://..." /></div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className="label-lux">Sizes (comma separated)</label><input type="text" value={form.sizes} onChange={e => setForm(f => ({ ...f, sizes: e.target.value }))} className="input-lux" placeholder="S, M, L" /></div>
            <div><label className="label-lux">Colors (comma separated)</label><input type="text" value={form.colors} onChange={e => setForm(f => ({ ...f, colors: e.target.value }))} className="input-lux" placeholder="Black, Ivory" /></div>
          </div>
          <div className="flex gap-6">
            {[
              { k: 'featured' as const, l: 'Featured' },
              { k: 'trending' as const, l: 'Trending' },
              { k: 'is_new' as const, l: 'New Arrival' },
            ].map(f => (
              <label key={f.k} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form[f.k]} onChange={e => setForm(s => ({ ...s, [f.k]: e.target.checked }))} className="accent-ink-900" />
                <span className="text-sm">{f.l}</span>
              </label>
            ))}
          </div>
          <button type="submit" className="btn-primary w-full">{product ? 'Save Changes' : 'Create Product'}</button>
        </form>
      </div>
    </div>
  );
}
