import { useState } from 'react';
import { useCart } from '@/lib/cart';
import { useAuth } from '@/lib/auth';
import { navigate, Link } from '@/lib/router';
import { formatINR } from '@/lib/types';
import type { Coupon, ShippingAddress, CartItem } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Check, Lock } from 'lucide-react';

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const { session } = useAuth();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [address, setAddress] = useState<ShippingAddress>({
    fullName: session?.user?.user_metadata?.full_name || '',
    email: session?.user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
  });
  const [payment, setPayment] = useState({ method: 'card', cardNumber: '', expiry: '', cvv: '', name: '' });

  const couponStr = sessionStorage.getItem('verona_coupon');
  const coupon: Coupon | null = couponStr ? JSON.parse(couponStr) : null;
  const discount = coupon ? calculateDiscount(coupon, subtotal) : 0;
  const shipping = subtotal >= 15000 ? 0 : 250;
  const total = subtotal - discount + shipping;

  if (items.length === 0) {
    return (
      <div className="pt-32 pb-20 container-lux text-center">
        <h1 className="font-display text-3xl mb-4">Your bag is empty</h1>
        <Link to="/shop" className="btn-primary">Continue Shopping</Link>
      </div>
    );
  }

  const placeOrder = async () => {
    setProcessing(true);
    setError(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setError('Please sign in to place an order'); setProcessing(false); return; }

      const orderItems: CartItem[] = items;
      const { data: order, error: orderError } = await supabase.from('orders').insert({
        user_id: user.id,
        items: orderItems,
        subtotal,
        discount,
        shipping,
        total,
        status: 'processing',
        shipping_address: address,
        tracking_number: `VRN${Date.now().toString(36).toUpperCase()}`,
      }).select().single();

      if (orderError) throw orderError;

      const orderItemsData = items.map(item => ({
        order_id: order.id,
        product_id: item.productId,
        user_id: user.id,
        name: item.name,
        image: item.image,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        price: item.price,
      }));
      await supabase.from('order_items').insert(orderItemsData);

      sessionStorage.removeItem('verona_coupon');
      clearCart();
      navigate(`/order/${order.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to place order');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="pt-24 lg:pt-32 pb-20">
      <div className="container-lux">
        <Breadcrumbs crumbs={[{ label: 'Cart', to: '/cart' }, { label: 'Checkout' }]} />
        <h1 className="font-display text-4xl lg:text-5xl mt-8 mb-8">Checkout</h1>

        {/* Steps */}
        <div className="flex items-center gap-4 mb-12">
          {['Shipping', 'Payment', 'Review'].map((label, i) => {
            const n = (i + 1) as 1 | 2 | 3;
            return (
              <div key={label} className="flex items-center gap-4">
                <div className={`flex items-center gap-2 ${step >= n ? 'text-ink-900' : 'text-ink-300'}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium border ${step > n ? 'bg-ink-900 text-ivory-50 border-ink-900' : step === n ? 'border-ink-900' : 'border-ink-200'}`}>
                    {step > n ? <Check className="w-3.5 h-3.5" /> : n}
                  </div>
                  <span className="text-[11px] uppercase tracking-[0.15em]">{label}</span>
                </div>
                {i < 2 && <div className={`w-12 h-px ${step > n ? 'bg-ink-900' : 'bg-ink-200'}`} />}
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            {/* Step 1: Shipping */}
            {step === 1 && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="font-display text-2xl">Shipping Address</h2>
                {!session && (
                  <p className="text-sm text-ink-500">
                    Have an account? <Link to="/auth" className="underline text-ink-900">Sign in</Link> for faster checkout.
                  </p>
                )}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label-lux">Full Name</label>
                    <input type="text" value={address.fullName} onChange={e => setAddress(a => ({ ...a, fullName: e.target.value }))} className="input-lux" required />
                  </div>
                  <div>
                    <label className="label-lux">Email</label>
                    <input type="email" value={address.email} onChange={e => setAddress(a => ({ ...a, email: e.target.value }))} className="input-lux" required />
                  </div>
                  <div>
                    <label className="label-lux">Phone</label>
                    <input type="tel" value={address.phone} onChange={e => setAddress(a => ({ ...a, phone: e.target.value }))} className="input-lux" required />
                  </div>
                  <div>
                    <label className="label-lux">Pincode</label>
                    <input type="text" value={address.pincode} onChange={e => setAddress(a => ({ ...a, pincode: e.target.value }))} className="input-lux" required />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="label-lux">Address</label>
                    <input type="text" value={address.address} onChange={e => setAddress(a => ({ ...a, address: e.target.value }))} className="input-lux" required />
                  </div>
                  <div>
                    <label className="label-lux">City</label>
                    <input type="text" value={address.city} onChange={e => setAddress(a => ({ ...a, city: e.target.value }))} className="input-lux" required />
                  </div>
                  <div>
                    <label className="label-lux">State</label>
                    <input type="text" value={address.state} onChange={e => setAddress(a => ({ ...a, state: e.target.value }))} className="input-lux" required />
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (address.fullName && address.email && address.phone && address.address && address.city && address.state && address.pincode) {
                      setStep(2);
                    }
                  }}
                  className="btn-primary"
                >
                  Continue to Payment
                </button>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="font-display text-2xl">Payment Method</h2>
                <div className="space-y-3">
                  {[
                    { v: 'card', l: 'Credit / Debit Card' },
                    { v: 'upi', l: 'UPI Payment' },
                    { v: 'cod', l: 'Cash on Delivery' },
                  ].map(m => (
                    <label key={m.v} className={`flex items-center gap-3 p-4 border cursor-pointer transition-colors ${payment.method === m.v ? 'border-ink-900 bg-ivory-100' : 'border-ink-200'}`}>
                      <input type="radio" name="payment" value={m.v} checked={payment.method === m.v} onChange={e => setPayment(p => ({ ...p, method: e.target.value }))} className="accent-ink-900" />
                      <span className="text-sm">{m.l}</span>
                    </label>
                  ))}
                </div>

                {payment.method === 'card' && (
                  <div className="space-y-4 animate-fade-in">
                    <div>
                      <label className="label-lux">Card Number</label>
                      <input type="text" placeholder="0000 0000 0000 0000" value={payment.cardNumber} onChange={e => setPayment(p => ({ ...p, cardNumber: e.target.value }))} className="input-lux" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="label-lux">Expiry</label>
                        <input type="text" placeholder="MM/YY" value={payment.expiry} onChange={e => setPayment(p => ({ ...p, expiry: e.target.value }))} className="input-lux" />
                      </div>
                      <div>
                        <label className="label-lux">CVV</label>
                        <input type="text" placeholder="•••" value={payment.cvv} onChange={e => setPayment(p => ({ ...p, cvv: e.target.value }))} className="input-lux" />
                      </div>
                    </div>
                    <div>
                      <label className="label-lux">Name on Card</label>
                      <input type="text" value={payment.name} onChange={e => setPayment(p => ({ ...p, name: e.target.value }))} className="input-lux" />
                    </div>
                  </div>
                )}

                {payment.method === 'upi' && (
                  <div className="animate-fade-in">
                    <label className="label-lux">UPI ID</label>
                    <input type="text" placeholder="yourname@bank" className="input-lux" />
                  </div>
                )}

                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="btn-ghost">Back</button>
                  <button onClick={() => setStep(3)} className="btn-primary">Review Order</button>
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="font-display text-2xl">Review Your Order</h2>

                <div>
                  <h3 className="text-[11px] uppercase tracking-[0.2em] text-ink-500 mb-3">Shipping To</h3>
                  <div className="text-sm text-ink-700 space-y-1">
                    <p>{address.fullName}</p>
                    <p>{address.address}</p>
                    <p>{address.city}, {address.state} — {address.pincode}</p>
                    <p>{address.country}</p>
                    <p>{address.phone} · {address.email}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-[11px] uppercase tracking-[0.2em] text-ink-500 mb-3">Items</h3>
                  <div className="space-y-3">
                    {items.map((item, i) => (
                      <div key={i} className="flex gap-3 items-center">
                        <img src={item.image} alt={item.name} className="w-14 h-18 object-cover" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{item.name}</p>
                          <p className="text-xs text-ink-500">{item.size} · {item.color} · Qty {item.quantity}</p>
                        </div>
                        <p className="text-sm">{formatINR(item.price * item.quantity)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {error && <p className="text-sm text-red-600">{error}</p>}

                <div className="flex gap-3">
                  <button onClick={() => setStep(2)} className="btn-ghost">Back</button>
                  <button onClick={placeOrder} disabled={processing} className="btn-primary">
                    {processing ? 'Processing...' : `Place Order — ${formatINR(total)}`}
                  </button>
                </div>
                <p className="flex items-center gap-2 text-xs text-ink-400">
                  <Lock className="w-3.5 h-3.5" /> Your payment information is encrypted and secure.
                </p>
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-ivory-100 p-8 sticky top-24">
              <h2 className="font-display text-xl mb-6">Summary</h2>
              <div className="space-y-3 text-sm border-b border-ink-200 pb-4 mb-4">
                <div className="flex justify-between text-ink-600"><span>Subtotal</span><span>{formatINR(subtotal)}</span></div>
                {discount > 0 && <div className="flex justify-between text-accent-dark"><span>Discount</span><span>-{formatINR(discount)}</span></div>}
                <div className="flex justify-between text-ink-600"><span>Shipping</span><span>{shipping === 0 ? 'Free' : formatINR(shipping)}</span></div>
              </div>
              <div className="flex justify-between font-medium text-base"><span>Total</span><span>{formatINR(total)}</span></div>
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
