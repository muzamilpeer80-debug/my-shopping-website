import { useCart } from '@/lib/cart';
import { Link, navigate } from '@/lib/router';
import { formatINR } from '@/lib/types';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Minus, Plus, X, ShoppingBag, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Coupon } from '@/lib/types';

export default function Cart() {
  const { items, removeFromCart, updateQuantity, subtotal } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);

  const shipping = subtotal >= 15000 ? 0 : 250;
  const discount = coupon ? calculateDiscount(coupon, subtotal) : 0;
  const total = subtotal - discount + shipping;

  const applyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponError(null);
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', couponCode.toUpperCase())
        .eq('active', true)
        .maybeSingle();
      if (error) throw error;
      if (!data) { setCouponError('Invalid coupon code'); setCoupon(null); return; }
      if (data.expires_at && new Date(data.expires_at) < new Date()) { setCouponError('Coupon expired'); setCoupon(null); return; }
      if (subtotal < data.min_subtotal) { setCouponError(`Minimum order of ${formatINR(data.min_subtotal)} required`); setCoupon(null); return; }
      setCoupon(data as Coupon);
    } catch {
      setCouponError('Failed to apply coupon');
    } finally {
      setCouponLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="pt-32 pb-20 container-lux">
        <Breadcrumbs crumbs={[{ label: 'Cart' }]} />
        <div className="text-center py-24">
          <ShoppingBag className="w-16 h-16 text-ink-200 mx-auto mb-6" />
          <h1 className="font-display text-4xl mb-4">Your bag is empty</h1>
          <p className="text-ink-500 mb-8">Discover pieces designed to be worn for years, not seasons.</p>
          <Link to="/shop" className="btn-primary">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 lg:pt-32 pb-20">
      <div className="container-lux">
        <Breadcrumbs crumbs={[{ label: 'Cart' }]} />
        <h1 className="font-display text-4xl lg:text-5xl mt-8 mb-12">Shopping Bag</h1>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Items */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item, i) => (
              <div key={i} className="flex gap-5 pb-6 border-b border-ink-100">
                <Link to={`/product/${item.slug}`} className="w-24 h-32 sm:w-32 sm:h-40 overflow-hidden bg-ivory-100 shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between gap-4">
                    <div>
                      <Link to={`/product/${item.slug}`} className="font-display text-lg hover:text-ink-700 transition-colors">
                        {item.name}
                      </Link>
                      <p className="text-xs text-ink-500 mt-1">Size: {item.size} · Color: {item.color}</p>
                    </div>
                    <p className="text-sm font-medium">{formatINR(item.price * item.quantity)}</p>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center border border-ink-200">
                      <button onClick={() => updateQuantity(i, item.quantity - 1)} className="p-2 hover:bg-ivory-100 transition-colors" aria-label="Decrease">
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-10 text-center text-sm">{item.quantity}</span>
                      <button onClick={() => updateQuantity(i, item.quantity + 1)} className="p-2 hover:bg-ivory-100 transition-colors" aria-label="Increase">
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <button onClick={() => removeFromCart(i)} className="text-[11px] uppercase tracking-[0.15em] text-ink-500 hover:text-ink-900 flex items-center gap-1">
                      <X className="w-3.5 h-3.5" /> Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-ivory-100 p-8 sticky top-24">
              <h2 className="font-display text-2xl mb-6">Order Summary</h2>

              <form onSubmit={applyCoupon} className="mb-6">
                <label className="label-lux">Coupon Code</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={e => setCouponCode(e.target.value)}
                    placeholder="Enter code"
                    className="flex-1 bg-ivory-50 border border-ink-200 px-3 py-2.5 text-sm focus:border-ink-900 focus:outline-none"
                  />
                  <button type="submit" className="btn-outline px-4" disabled={couponLoading}>
                    {couponLoading ? '...' : 'Apply'}
                  </button>
                </div>
                {couponError && <p className="text-xs text-red-600 mt-2">{couponError}</p>}
                {coupon && <p className="text-xs text-accent-dark mt-2">Coupon "{coupon.code}" applied</p>}
              </form>

              <div className="space-y-3 text-sm border-t border-ink-200 pt-4">
                <div className="flex justify-between text-ink-600">
                  <span>Subtotal</span>
                  <span>{formatINR(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-accent-dark">
                    <span>Discount</span>
                    <span>-{formatINR(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-ink-600">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : formatINR(shipping)}</span>
                </div>
                <div className="flex justify-between font-medium text-ink-900 text-base pt-3 border-t border-ink-200">
                  <span>Total</span>
                  <span>{formatINR(total)}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  sessionStorage.setItem('verona_coupon', JSON.stringify(coupon));
                  navigate('/checkout');
                }}
                className="btn-primary w-full mt-6"
              >
                Checkout <ArrowRight className="w-4 h-4" />
              </button>

              <Link to="/shop" className="block text-center mt-4 text-[11px] uppercase tracking-[0.15em] text-ink-500 hover:text-ink-900">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function calculateDiscount(coupon: Coupon, subtotal: number): number {
  if (subtotal < coupon.min_subtotal) return 0;
  if (coupon.discount_type === 'percent') return Math.round(subtotal * coupon.value / 100);
  return coupon.value;
}
