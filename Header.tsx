import { Link } from '@/lib/router';
import { useCart } from '@/lib/cart';
import { useAuth } from '@/lib/auth';
import { useEffect, useState } from 'react';
import { Menu, X, Search, ShoppingBag, Heart, User } from 'lucide-react';
import { navigate } from '@/lib/router';

export function Header() {
  const { cartCount, wishlist } = useCart();
  const { session } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
  }, [mobileOpen]);

  const navLinks = [
    { label: 'New Arrivals', to: '/shop?sort=newest' },
    { label: "Men's Collection", to: '/men' },
    { label: "Women's Collection", to: '/women' },
    { label: 'Shoes', to: '/shoes' },
    { label: 'Clothing', to: '/clothing' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchValue.trim())}`);
      setSearchOpen(false);
      setSearchValue('');
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-ivory-50/95 backdrop-blur-md border-b border-ink-100'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="container-lux">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 -ml-2"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Left nav - desktop */}
            <nav className="hidden lg:flex items-center gap-8 flex-1">
              {navLinks.slice(0, 3).map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-[11px] font-medium uppercase tracking-[0.15em] text-ink-700 hover:text-ink-900 link-underline"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Logo - center */}
            <Link to="/" className="absolute left-1/2 -translate-x-1/2">
              <span className="font-display text-2xl lg:text-3xl tracking-[0.25em] font-medium">
                VÉRONA
              </span>
            </Link>

            {/* Right nav - desktop */}
            <nav className="hidden lg:flex items-center gap-8 flex-1 justify-end">
              {navLinks.slice(3).map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-[11px] font-medium uppercase tracking-[0.15em] text-ink-700 hover:text-ink-900 link-underline"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Icons */}
            <div className="flex items-center gap-4 lg:gap-5 lg:ml-6">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-1.5 hover:opacity-70 transition-opacity"
                aria-label="Search"
              >
                <Search className="w-[18px] h-[18px]" />
              </button>
              <Link to="/wishlist" className="relative p-1.5 hover:opacity-70 transition-opacity" aria-label="Wishlist">
                <Heart className="w-[18px] h-[18px]" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-ink-900 text-ivory-50 text-[9px] font-medium flex items-center justify-center rounded-full">
                    {wishlist.length}
                  </span>
                )}
              </Link>
              <Link to={session ? '/account' : '/auth'} className="p-1.5 hover:opacity-70 transition-opacity hidden sm:block" aria-label="Account">
                <User className="w-[18px] h-[18px]" />
              </Link>
              <Link to="/cart" className="relative p-1.5 hover:opacity-70 transition-opacity" aria-label="Cart">
                <ShoppingBag className="w-[18px] h-[18px]" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-ink-900 text-ivory-50 text-[9px] font-medium flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="absolute top-full left-0 right-0 bg-ivory-50 border-b border-ink-100 animate-fade-down">
            <div className="container-lux py-6">
              <form onSubmit={handleSearch} className="flex items-center gap-4">
                <Search className="w-5 h-5 text-ink-400" />
                <input
                  autoFocus
                  type="text"
                  value={searchValue}
                  onChange={e => setSearchValue(e.target.value)}
                  placeholder="Search for products, collections..."
                  className="flex-1 bg-transparent text-lg font-display placeholder-ink-400 focus:outline-none"
                />
                <button type="button" onClick={() => setSearchOpen(false)} className="p-1">
                  <X className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        )}
      </header>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-ink-900/40 backdrop-blur-sm animate-fade-in" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-[85%] max-w-sm bg-ivory-50 animate-slide-in overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-ink-100">
              <span className="font-display text-xl tracking-[0.2em]">VÉRONA</span>
              <button onClick={() => setMobileOpen(false)} className="p-2">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex flex-col p-6 gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className="py-3 text-sm font-medium uppercase tracking-[0.15em] text-ink-700 hover:text-ink-900 border-b border-ink-100/50"
                >
                  {link.label}
                </Link>
              ))}
              <Link to="/about" onClick={() => setMobileOpen(false)} className="py-3 text-sm font-medium uppercase tracking-[0.15em] text-ink-700 hover:text-ink-900 border-b border-ink-100/50">About</Link>
              <Link to="/contact" onClick={() => setMobileOpen(false)} className="py-3 text-sm font-medium uppercase tracking-[0.15em] text-ink-700 hover:text-ink-900 border-b border-ink-100/50">Contact</Link>
              <Link to="/faq" onClick={() => setMobileOpen(false)} className="py-3 text-sm font-medium uppercase tracking-[0.15em] text-ink-700 hover:text-ink-900 border-b border-ink-100/50">FAQ</Link>
              <Link to={session ? '/account' : '/auth'} onClick={() => setMobileOpen(false)} className="py-3 text-sm font-medium uppercase tracking-[0.15em] text-ink-700 hover:text-ink-900">{session ? 'Account' : 'Sign In'}</Link>
              <Link to="/admin" onClick={() => setMobileOpen(false)} className="py-3 text-sm font-medium uppercase tracking-[0.15em] text-ink-700 hover:text-ink-900">Admin</Link>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
