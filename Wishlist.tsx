import { useCart } from '@/lib/cart';
import { Link } from '@/lib/router';
import { formatINR } from '@/lib/types';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { ProductCard } from '@/components/ProductCard';
import { useProducts } from '@/lib/products';
import { Heart } from 'lucide-react';
import { useState } from 'react';

export default function Wishlist() {
  const { wishlist, toggleWishlist } = useCart();
  const { products } = useProducts();
  const [removing, setRemoving] = useState<string | null>(null);

  const wishlistProducts = products.filter(p => wishlist.includes(p.id));

  const handleRemove = (id: string) => {
    setRemoving(id);
    setTimeout(() => { toggleWishlist(id); setRemoving(null); }, 300);
  };

  if (wishlistProducts.length === 0) {
    return (
      <div className="pt-32 pb-20 container-lux">
        <Breadcrumbs crumbs={[{ label: 'Wishlist' }]} />
        <div className="text-center py-24">
          <Heart className="w-16 h-16 text-ink-200 mx-auto mb-6" />
          <h1 className="font-display text-4xl mb-4">Your wishlist is empty</h1>
          <p className="text-ink-500 mb-8">Save pieces you love for later.</p>
          <Link to="/shop" className="btn-primary">Discover the Collection</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 lg:pt-32 pb-20">
      <div className="container-lux">
        <Breadcrumbs crumbs={[{ label: 'Wishlist' }]} />
        <div className="flex items-end justify-between mt-8 mb-12">
          <div>
            <h1 className="font-display text-4xl lg:text-5xl">Wishlist</h1>
            <p className="text-ink-500 text-sm mt-2">{wishlistProducts.length} saved {wishlistProducts.length === 1 ? 'piece' : 'pieces'}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 lg:gap-x-6">
          {wishlistProducts.map((p, i) => (
            <div key={p.id} className={`transition-all duration-300 ${removing === p.id ? 'opacity-30 scale-95' : 'opacity-100'}`}>
              <ProductCard product={p} index={i} />
              <button
                onClick={() => handleRemove(p.id)}
                className="mt-2 text-[11px] uppercase tracking-[0.15em] text-ink-500 hover:text-ink-900"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
