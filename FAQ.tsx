import { useState } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { ChevronDown } from 'lucide-react';

const faqs = [
  { cat: 'Orders & Shipping', items: [
    { q: 'How long does shipping take?', a: 'Standard shipping within India takes 3-5 business days. Express shipping (1-2 business days) is available for ₹500. International shipping times vary by destination.' },
    { q: 'Do you offer free shipping?', a: 'Yes, we offer complimentary shipping on all orders over ₹15,000 within India. Orders below this threshold incur a ₹250 shipping fee.' },
    { q: 'How can I track my order?', a: 'Once your order ships, you\'ll receive a tracking number via email. You can also track your order anytime from the Orders page in your account.' },
    { q: 'Do you ship internationally?', a: 'Yes, we ship to select international destinations. Shipping costs and delivery times are calculated at checkout based on your location.' },
  ]},
  { cat: 'Returns & Exchanges', items: [
    { q: 'What is your return policy?', a: 'We offer 30-day returns on unworn items in their original packaging. Items must be in the same condition as received. Refunds are processed within 5-7 business days of receipt.' },
    { q: 'How do I initiate a return?', a: 'Log into your account, go to Orders, select the item you\'d like to return, and follow the instructions. A return label will be provided via email.' },
    { q: 'Can I exchange an item for a different size?', a: 'Yes, exchanges for a different size or color of the same item are free within 30 days, subject to availability.' },
  ]},
  { cat: 'Products & Sizing', items: [
    { q: 'Are your products true to size?', a: 'Our footwear and clothing are designed to fit true to standard sizing. However, we recommend consulting the size guide on each product page for specific measurements.' },
    { q: 'Are your products limited edition?', a: 'Yes, most VÉRONA pieces are crafted in limited editions. Once a collection sells out, it is typically not restocked.' },
    { q: 'What materials do you use?', a: 'We source premium full-grain leathers, natural fibers, and responsibly produced materials. Specific material information is listed on each product page.' },
  ]},
  { cat: 'Account & Payment', items: [
    { q: 'What payment methods do you accept?', a: 'We accept all major credit and debit cards, UPI payments, and cash on delivery within India. All online payments are encrypted and secure.' },
    { q: 'Is my payment information secure?', a: 'Yes, all payment transactions are processed through encrypted, PCI-compliant payment gateways. We never store your card details.' },
    { q: 'Do you offer discounts?', a: 'We occasionally offer promotional codes to our newsletter subscribers. Sign up on our homepage to receive early access to collections and exclusive offers.' },
  ]},
];

export default function FAQ() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [activeCat, setActiveCat] = useState(0);

  return (
    <div className="pt-24 lg:pt-32 pb-20">
      <div className="container-lux">
        <Breadcrumbs crumbs={[{ label: 'FAQ' }]} />
        <div className="mt-8 mb-16 text-center">
          <p className="section-eyebrow mb-4">Help Center</p>
          <h1 className="font-display text-5xl lg:text-6xl mb-4">Frequently Asked</h1>
          <p className="text-ink-500 max-w-xl mx-auto">Everything you need to know about VÉRONA. Can't find what you're looking for? <a href="/contact" className="underline text-ink-900">Contact us</a>.</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-12 max-w-5xl mx-auto">
          {/* Categories */}
          <aside className="lg:col-span-1">
            <nav className="flex lg:flex-col gap-2 overflow-x-auto scrollbar-hide">
              {faqs.map((cat, i) => (
                <button
                  key={i}
                  onClick={() => setActiveCat(i)}
                  className={`text-left px-4 py-3 text-sm whitespace-nowrap transition-colors ${activeCat === i ? 'bg-ink-900 text-ivory-50' : 'text-ink-700 hover:bg-ivory-100'}`}
                >
                  {cat.cat}
                </button>
              ))}
            </nav>
          </aside>

          {/* Questions */}
          <div className="lg:col-span-3">
            <div className="space-y-3">
              {faqs[activeCat].items.map((item, i) => {
                const id = `${activeCat}-${i}`;
                const open = openId === id;
                return (
                  <div key={id} className="border-b border-ink-100">
                    <button
                      onClick={() => setOpenId(open ? null : id)}
                      className="w-full flex items-center justify-between gap-4 py-5 text-left"
                    >
                      <span className={`font-display text-lg transition-colors ${open ? 'text-ink-900' : 'text-ink-700'}`}>{item.q}</span>
                      <ChevronDown className={`w-5 h-5 shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
                    </button>
                    <div className={`overflow-hidden transition-all duration-500 ease-lux ${open ? 'max-h-60 pb-5' : 'max-h-0'}`}>
                      <p className="text-ink-600 leading-relaxed text-sm">{item.a}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
