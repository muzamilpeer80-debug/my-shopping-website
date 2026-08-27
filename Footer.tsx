import { Link } from '@/lib/router';
import { useState } from 'react';
import { Instagram, Twitter, Facebook, ArrowRight } from 'lucide-react';

export function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) setSubscribed(true);
  };

  const sections = [
    {
      title: 'Shop',
      links: [
        { label: "Men's Collection", to: '/men' },
        { label: "Women's Collection", to: '/women' },
        { label: 'Shoes', to: '/shoes' },
        { label: 'Clothing', to: '/clothing' },
        { label: 'New Arrivals', to: '/shop?sort=newest' },
      ],
    },
    {
      title: 'Client Care',
      links: [
        { label: 'Contact Us', to: '/contact' },
        { label: 'FAQs', to: '/faq' },
        { label: 'Order Tracking', to: '/orders' },
        { label: 'Shipping & Returns', to: '/faq' },
        { label: 'Size Guide', to: '/faq' },
      ],
    },
    {
      title: 'The House',
      links: [
        { label: 'About VÉRONA', to: '/about' },
        { label: 'Sustainability', to: '/about' },
        { label: 'Careers', to: '/about' },
        { label: 'Press', to: '/about' },
        { label: 'Admin', to: '/admin' },
      ],
    },
  ];

  return (
    <footer className="bg-ink-900 text-ivory-100">
      {/* Newsletter */}
      <div className="border-b border-ink-700">
        <div className="container-lux py-16 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <p className="section-eyebrow text-ink-400 mb-3">Join the House</p>
              <h2 className="font-display text-3xl lg:text-4xl text-ivory-50 leading-tight">
                Become part of the VÉRONA circle.
              </h2>
              <p className="text-ink-300 mt-3 max-w-md text-sm leading-relaxed">
                Early access to collections, private events, and stories from the atelier.
              </p>
            </div>
            <div>
              {subscribed ? (
                <div className="flex items-center gap-3 text-ivory-50 animate-fade-in">
                  <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                  <p className="font-display text-xl">Welcome. You're on the list.</p>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-3">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Email address"
                    className="flex-1 bg-transparent border-b border-ink-600 py-3 text-ivory-50 placeholder-ink-400 focus:border-ivory-50 focus:outline-none transition-colors"
                  />
                  <button type="submit" className="btn-light">
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="container-lux py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16">
          <div className="col-span-2 lg:col-span-1">
            <Link to="/" className="font-display text-2xl tracking-[0.25em] text-ivory-50">
              VÉRONA
            </Link>
            <p className="text-ink-400 text-sm mt-4 max-w-xs leading-relaxed">
              Contemporary footwear and clothing designed for those who refuse ordinary. Crafted in limited editions.
            </p>
            <div className="flex gap-4 mt-6">
              {[Instagram, Twitter, Facebook].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 border border-ink-700 flex items-center justify-center hover:bg-ivory-50 hover:text-ink-900 transition-all duration-300" aria-label="Social">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
          {sections.map(section => (
            <div key={section.title}>
              <h3 className="text-[11px] font-medium uppercase tracking-[0.2em] text-ivory-50 mb-5">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map(link => (
                  <li key={link.label}>
                    <Link to={link.to} className="text-sm text-ink-300 hover:text-ivory-50 transition-colors duration-300">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-ink-700">
        <div className="container-lux py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-ink-400 tracking-wide">
            © {new Date().getFullYear()} VÉRONA. All rights reserved. Wear Your Difference.
          </p>
          <div className="flex gap-6 text-xs text-ink-400">
            <a href="#" className="hover:text-ivory-50 transition-colors">Privacy</a>
            <a href="#" className="hover:text-ivory-50 transition-colors">Terms</a>
            <a href="#" className="hover:text-ivory-50 transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
