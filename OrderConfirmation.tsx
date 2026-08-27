import { useState, useEffect } from 'react';
import { useRouter, Link, navigate } from '@/lib/router';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import type { Order } from '@/lib/types';
import { formatINR } from '@/lib/types';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Check, Package, Truck, Home, MapPin } from 'lucide-react';

export default function OrderConfirmation() {
  const { route } = useRouter();
  const { session } = useAuth();
  const orderId = route.params.id;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('orders').select('*').eq('id', orderId).maybeSingle().then(({ data }) => {
      setOrder(data as Order | null);
      setLoading(false);
    });
  }, [orderId]);

  if (loading) {
    return <div className="pt-32 container-lux"><div className="h-96 skeleton" /></div>;
  }

  if (!order) {
    return (
      <div className="pt-32 container-lux text-center py-20">
        <h1 className="font-display text-3xl mb-4">Order not found</h1>
        <Link to="/shop" className="btn-primary">Back to Shop</Link>
      </div>
    );
  }

  const steps = [
    { icon: Check, label: 'Order Confirmed', done: true },
    { icon: Package, label: 'Processing', done: order.status !== 'processing' || true },
    { icon: Truck, label: 'Shipped', done: ['shipped', 'delivered'].includes(order.status) },
    { icon: Home, label: 'Delivered', done: order.status === 'delivered' },
  ];

  return (
    <div className="pt-24 lg:pt-32 pb-20">
      <div className="container-lux">
        <Breadcrumbs crumbs={[{ label: 'Orders', to: '/orders' }, { label: 'Confirmation' }]} />

        {/* Success header */}
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mx-auto mb-6 animate-scale-in">
            <Check className="w-8 h-8 text-ink-900" />
          </div>
          <h1 className="font-display text-4xl lg:text-5xl mb-3">Order Confirmed</h1>
          <p className="text-ink-500">Thank you for your purchase. A confirmation has been sent to your email.</p>
          <p className="text-sm text-ink-400 mt-2">Tracking: <span className="font-medium text-ink-900">{order.tracking_number}</span></p>
        </div>

        {/* Tracking steps */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="flex items-center justify-between">
            {steps.map((s, i) => (
              <div key={i} className="flex flex-col items-center flex-1 relative">
                {i < steps.length - 1 && (
                  <div className={`absolute top-6 left-1/2 w-full h-px ${s.done && steps[i + 1].done ? 'bg-ink-900' : 'bg-ink-200'}`} />
                )}
                <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors ${s.done ? 'bg-ink-900 border-ink-900 text-ivory-50' : 'border-ink-200 text-ink-300'}`}>
                  <s.icon className="w-5 h-5" />
                </div>
                <span className={`text-[10px] uppercase tracking-[0.1em] mt-2 text-center ${s.done ? 'text-ink-900' : 'text-ink-400'}`}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2">
            <h2 className="font-display text-2xl mb-6">Order Details</h2>
            <div className="space-y-4">
              {order.items.map((item, i) => (
                <div key={i} className="flex gap-4 pb-4 border-b border-ink-100">
                  <img src={item.image} alt={item.name} className="w-20 h-28 object-cover bg-ivory-100" />
                  <div className="flex-1">
                    <p className="font-display text-lg">{item.name}</p>
                    <p className="text-xs text-ink-500 mt-1">{item.size} · {item.color} · Qty {item.quantity}</p>
                    <p className="text-sm font-medium mt-2">{formatINR(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div>
            <div className="bg-ivory-100 p-6 mb-6">
              <h2 className="font-display text-xl mb-4">Summary</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-ink-600"><span>Subtotal</span><span>{formatINR(order.subtotal)}</span></div>
                {order.discount > 0 && <div className="flex justify-between text-accent-dark"><span>Discount</span><span>-{formatINR(order.discount)}</span></div>}
                <div className="flex justify-between text-ink-600"><span>Shipping</span><span>{order.shipping === 0 ? 'Free' : formatINR(order.shipping)}</span></div>
                <div className="flex justify-between font-medium text-base pt-3 border-t border-ink-200"><span>Total</span><span>{formatINR(order.total)}</span></div>
              </div>
            </div>

            <div className="bg-ivory-100 p-6">
              <h3 className="text-[11px] uppercase tracking-[0.2em] text-ink-500 mb-3 flex items-center gap-2"><MapPin className="w-4 h-4" /> Shipping Address</h3>
              <div className="text-sm text-ink-700 space-y-1">
                <p>{order.shipping_address.fullName}</p>
                <p>{order.shipping_address.address}</p>
                <p>{order.shipping_address.city}, {order.shipping_address.state} — {order.shipping_address.pincode}</p>
                <p>{order.shipping_address.phone}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-12 flex gap-4 justify-center">
          <Link to="/shop" className="btn-outline">Continue Shopping</Link>
          <Link to="/orders" className="btn-ghost">View All Orders</Link>
        </div>
      </div>
    </div>
  );
}
