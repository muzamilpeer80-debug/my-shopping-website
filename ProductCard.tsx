import { Link } from '@/lib/router';
import type { Product } from '@/lib/types';
import { formatINR } from '@/lib/types';
import { useCart } from '@/lib/cart';
import { Heart, ShoppingBag } from 'lucide-react';
import { useState } from 'react';

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const [hovered, setHovered] = useState(false);
  const wished = isInWishlist(product.id);

  const hasDiscount = product.compare_at_price && product.compare_at_price > product.price;
  const discountPct = hasDiscount
    ? Math.round((1 - product.price / (product.compare_at_price as number)) * 100)
    : 0;

  return (
    <div
      className="group cursor-pointer animate-fade-up"
      style={{ animationDelay: `${index * 80}ms`, opacity: 0 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link to={`/product/${product.slug}`} className="block">
        <div className="product-card-image aspect-[3/4]">
          {/* Badges */}
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
            {product.is_new && (
              <span className="bg-ink-900 text-ivory-50 text-[9px] font-medium uppercase tracking-[0.15em] px-2.5 py-1">New</span>
            )}
            {hasDiscount && (
              <span className="bg-accent text-ink-900 text-[9px] font-medium uppercase tracking-[0.15em] px-2.5 py-1">-{discountPct}%</span>
            )}
            {product.featured && !product.is_new && (
              <span className="bg-ivory-50/90 text-ink-900 text-[9px] font-medium uppercase tracking-[0.15em] px-2.5 py-1">Featured</span>
            )}
          </div>

          {/* Wishlist */}
          <button
            onClick={(e) => { e.preventDefault(); toggleWishlist(product.id); }}
            className="absolute top-3 right-3 z-10 w-9 h-9 bg-ivory-50/80 backdrop-blur-sm flex items-center justify-center hover:bg-ivory-50 transition-all duration-300"
            aria-label="Toggle wishlist"
          >
            <Heart className={`w-4 h-4 transition-all ${wished ? 'fill-ink-900 text-ink-900' : 'text-ink-700'}`} />
          </button>

          {/* Images */}
          <img
            src={product.images[0]}
            alt={product.name}
            className={`w-full h-full object-cover transition-all duration-[1.2s] ease-lux ${hovered && product.images[1] ? 'opacity-0' : 'opacity-100'}`}
            loading="lazy"
          />
          {product.images[1] && (
            <img
              src={product.images[1]}
              alt={product.name}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[1.2s] ease-lux ${hovered ? 'opacity-100' : 'opacity-0'}`}
              loading="lazy"
            />
          )}

          {/* Quick add */}
          <div className={`absolute bottom-0 left-0 right-0 p-3 transition-all duration-500 ease-lux ${hovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
            <button
              onClick={(e) => {
                e.preventDefault();
                addToCart(product, product.sizes[0] || 'One Size', product.colors[0] || 'Default', 1);
              }}
              className="w-full bg-ink-900/95 backdrop-blur-sm text-ivory-50 py-3 text-[10px] font-medium uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-ink-700 transition-colors"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              Quick Add
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="pt-4 pb-2">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              {product.collection && (
                <p className="text-[10px] uppercase tracking-[0.15em] text-ink-400 mb-1">{product.collection}</p>
              )}
              <h3 className="font-display text-base lg:text-lg leading-snug text-ink-900 group-hover:text-ink-700 transition-colors truncate">
                {product.name}
              </h3>
            </div>
            <div className="text-right shrink-0">
              <p className="text-sm font-medium text-ink-900">{formatINR(product.price)}</p>
              {hasDiscount && (
                <p className="text-xs text-ink-400 line-through">{formatINR(product.compare_at_price as number)}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2">
            {product.colors.slice(0, 4).map(color => (
              <span key={color} className="w-3 h-3 rounded-full border border-ink-200" style={{ background: colorSwatch(color) }} title={color} />
            ))}
            <span className="text-[10px] text-ink-400 ml-1">{product.rating > 0 ? `★ ${product.rating}` : ''}</span>
          </div>
        </div>
      </Link>
    </div>
  );
}

function colorSwatch(name: string): string {
  const map: Record<string, string> = {
    Black: '#0c0c0a', Charcoal: '#3a3a35', Ivory: '#f8f7f2', Beige: '#e8e1d0',
    White: '#ffffff', Navy: '#1a2740', Silver: '#c5ccd4', Grey: '#8a8a82',
    Tan: '#b8976a', Brown: '#6b4e35', Red: '#8a1c1c', Teal: '#2a6b6b',
    Olive: '#5a5a3a',
  };
  return map[name] || '#d4d4d0';
}
