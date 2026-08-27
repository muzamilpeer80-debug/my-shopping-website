import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { Link, navigate } from '@/lib/router';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Package, Search } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Order } from '@/lib/types';
import { formatINR } from '@/lib/types';

export default function Orders() {
  const { session } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [trackingInput, setTrackingInput] = useState('');
  const [trackedOrder, setTrackedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) { navigate('/auth'); return; }
    supabase.from('orders').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false })
      .then(({ data }) => { setOrders((data || []) as Order[]); setLoading(false); });
  }, [session]);

  if (!session) return null;

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingInput.trim()) return;
    const { data } = await supabase.from('orders').select('*').eq('tracking_number', trackingInput.toUpperCase()).maybeSingle();
    setTrackedOrder(data as Order | null);
  };

  return (
    <div className="pt-24 lg:pt-32 pb-20">
      <div className="container-lux">
        <Breadcrumbs crumbs={[{ label: 'Orders' }]} />
        <h1 className="font-display text-4xl lg:text-5xl mt-8 mb-12">Orders & Tracking</h1>

        {/* Track order */}
        <div className="bg-ivory-100 p-8 mb-12">
          <h2 className="font-display text-2xl mb-2">Track Your Order</h2>
          <p className="text-sm text-ink-500 mb-6">Enter your tracking number to check the status of your order.</p>
          <form onSubmit={handleTrack} className="flex gap-3 max-w-lg">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
              <input
                type="text"
                value={trackingInput}
                onChange={e => setTrackingInput(e.target.value)}
                placeholder="e.g. VRN1234ABCD"
                className="w-full bg-ivory-50 border border-ink-200 pl-10 pr-3 py-3 text-sm focus:border-ink-900 focus:outline-none"
              />
            </div>
            <button type="submit" className="btn-primary">Track</button>
          </form>
          {trackedOrder && (
            <div className="mt-6 p-4 bg-ivory-50 border border-ink-100 animate-fade-in">
              <div className="flex items-center justify-between mb-3">
                <p className="font-medium">{trackedOrder.tracking_number}</p>
                <span className="chip border-accent text-accent-dark capitalize">{trackedOrder.status}</span>
              </div>
              <p className="text-sm text-ink-600">{trackedOrder.items.length} items · {formatINR(trackedOrder.total)}</p>
              <p className="text-xs text-ink-400 mt-1">Ordered {new Date(trackedOrder.created_at).toLocaleDateString()}</p>
            </div>
          )}
          {trackingInput && !trackedOrder && (
            <p className="text-sm text-red-600 mt-4">Order not found. Check your tracking number and try again.</p>
          )}
        </div>

        {/* Order history */}
        <h2 className="font-display text-2xl mb-6">Order History</h2>
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => <div key={i} className="h-24 skeleton" />)}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-12 h-12 text-ink-200 mx-auto mb-4" />
            <p className="text-ink-500 mb-4">No orders yet.</p>
            <Link to="/shop" className="btn-primary">Start Shopping</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(o => (
              <Link key={o.id} to={`/order/${o.id}`} className="block bg-ivory-100 p-6 hover:bg-ivory-200 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="font-medium text-sm">{o.tracking_number || o.id.slice(0, 8)}</p>
                    <p className="text-xs text-ink-500 mt-1">{new Date(o.created_at).toLocaleDateString()} · {o.items.length} items</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="chip border-ink-200 text-ink-700 capitalize">{o.status}</span>
                    <p className="text-sm font-medium">{formatINR(o.total)}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
