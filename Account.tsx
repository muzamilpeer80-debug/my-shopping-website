import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { Link, navigate } from '@/lib/router';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { User, Package, Heart, LogOut, Settings } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Profile, Order } from '@/lib/types';
import { formatINR } from '@/lib/types';

export default function Account() {
  const { session, signOut } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [tab, setTab] = useState<'overview' | 'orders' | 'profile'>('overview');

  useEffect(() => {
    if (!session) { navigate('/auth'); return; }
    supabase.from('profiles').select('*').eq('id', session.user.id).maybeSingle().then(({ data }) => setProfile(data as Profile | null));
    supabase.from('orders').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false }).then(({ data }) => setOrders((data || []) as Order[]));
  }, [session]);

  if (!session) return null;

  const totalSpent = orders.reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="pt-24 lg:pt-32 pb-20">
      <div className="container-lux">
        <Breadcrumbs crumbs={[{ label: 'Account' }]} />
        <h1 className="font-display text-4xl lg:text-5xl mt-8 mb-12">My Account</h1>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-ivory-100 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-ink-900 text-ivory-50 flex items-center justify-center font-display text-lg">
                  {(profile?.full_name || session.user.email || 'U')[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium">{profile?.full_name || 'Member'}</p>
                  <p className="text-xs text-ink-500">{session.user.email}</p>
                </div>
              </div>
              <nav className="space-y-1">
                {[
                  { k: 'overview' as const, l: 'Overview', icon: User },
                  { k: 'orders' as const, l: 'Orders', icon: Package },
                  { k: 'profile' as const, l: 'Profile', icon: Settings },
                ].map(item => (
                  <button
                    key={item.k}
                    onClick={() => setTab(item.k)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm transition-colors ${tab === item.k ? 'bg-ink-900 text-ivory-50' : 'text-ink-700 hover:bg-ivory-200'}`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.l}
                  </button>
                ))}
                <Link to="/wishlist" className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-ink-700 hover:bg-ivory-200 transition-colors">
                  <Heart className="w-4 h-4" /> Wishlist
                </Link>
                <button onClick={signOut} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-ink-700 hover:bg-ivory-200 transition-colors">
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </nav>
            </div>
          </aside>

          {/* Content */}
          <div className="lg:col-span-3">
            {tab === 'overview' && (
              <div className="animate-fade-in">
                <h2 className="font-display text-2xl mb-6">Welcome back, {profile?.full_name?.split(' ')[0] || 'Member'}</h2>
                <div className="grid sm:grid-cols-3 gap-4 mb-8">
                  <div className="bg-ivory-100 p-6">
                    <p className="text-[11px] uppercase tracking-[0.15em] text-ink-500 mb-2">Total Orders</p>
                    <p className="font-display text-3xl">{orders.length}</p>
                  </div>
                  <div className="bg-ivory-100 p-6">
                    <p className="text-[11px] uppercase tracking-[0.15em] text-ink-500 mb-2">Total Spent</p>
                    <p className="font-display text-3xl">{formatINR(totalSpent)}</p>
                  </div>
                  <div className="bg-ivory-100 p-6">
                    <p className="text-[11px] uppercase tracking-[0.15em] text-ink-500 mb-2">Member Since</p>
                    <p className="font-display text-3xl">{new Date(profile?.created_at || session.user.created_at).getFullYear()}</p>
                  </div>
                </div>
                {orders.length > 0 && (
                  <div>
                    <h3 className="font-display text-xl mb-4">Recent Orders</h3>
                    <div className="space-y-3">
                      {orders.slice(0, 3).map(o => (
                        <Link key={o.id} to={`/order/${o.id}`} className="flex items-center justify-between p-4 bg-ivory-100 hover:bg-ivory-200 transition-colors">
                          <div>
                            <p className="text-sm font-medium">{o.tracking_number || o.id.slice(0, 8)}</p>
                            <p className="text-xs text-ink-500">{new Date(o.created_at).toLocaleDateString()} · {o.items.length} items</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">{formatINR(o.total)}</p>
                            <p className="text-xs text-ink-500 capitalize">{o.status}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {tab === 'orders' && (
              <div className="animate-fade-in">
                <h2 className="font-display text-2xl mb-6">Order History</h2>
                {orders.length === 0 ? (
                  <p className="text-ink-500 py-12 text-center">No orders yet. <Link to="/shop" className="underline text-ink-900">Start shopping</Link></p>
                ) : (
                  <div className="space-y-3">
                    {orders.map(o => (
                      <Link key={o.id} to={`/order/${o.id}`} className="flex items-center justify-between p-4 bg-ivory-100 hover:bg-ivory-200 transition-colors">
                        <div>
                          <p className="text-sm font-medium">{o.tracking_number || o.id.slice(0, 8)}</p>
                          <p className="text-xs text-ink-500">{new Date(o.created_at).toLocaleDateString()} · {o.items.length} items</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{formatINR(o.total)}</p>
                          <p className="text-xs text-ink-500 capitalize">{o.status}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {tab === 'profile' && (
              <div className="animate-fade-in">
                <h2 className="font-display text-2xl mb-6">Profile Settings</h2>
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  await supabase.from('profiles').upsert({ id: session.user.id, ...profile });
                }} className="max-w-md space-y-4">
                  <div>
                    <label className="label-lux">Full Name</label>
                    <input type="text" value={profile?.full_name || ''} onChange={e => setProfile(p => ({ ...p!, full_name: e.target.value }))} className="input-lux" />
                  </div>
                  <div>
                    <label className="label-lux">Email</label>
                    <input type="email" value={session.user.email || ''} disabled className="input-lux opacity-50" />
                  </div>
                  <div>
                    <label className="label-lux">Phone</label>
                    <input type="tel" value={profile?.phone || ''} onChange={e => setProfile(p => ({ ...p!, phone: e.target.value }))} className="input-lux" />
                  </div>
                  <button type="submit" className="btn-primary">Save Changes</button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
