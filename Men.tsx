import { useProducts } from '@/lib/products';
import { ProductCard } from '@/components/ProductCard';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { useReveal } from '@/lib/useReveal';
import { Link } from '@/lib/router';
import { ArrowRight } from 'lucide-react';

export default function Men() {
  const { products, loading } = useProducts({ category: 'men' });
  const hero = useReveal();
  const shoes = products.filter(p => p.type === 'shoes');
  const clothing = products.filter(p => p.type === 'clothing');

  return (
    <div className="pt-24 lg:pt-32">
      {/* Hero */}
      <section ref={hero.ref} className={`container-lux mb-16 transition-all duration-1000 ${hero.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <Breadcrumbs crumbs={[{ label: "Men's Collection" }]} />
        <div className="mt-8 grid lg:grid-cols-2 gap-8 items-end">
          <div>
            <p className="section-eyebrow mb-4">Autumn / Winter 2026</p>
            <h1 className="font-display text-5xl lg:text-7xl leading-[0.95]">
              The Men's<br /><span className="italic font-light">Collection</span>
            </h1>
          </div>
          <p className="text-ink-600 leading-relaxed max-w-md lg:justify-self-end">
            Heritage tailoring reimagined for the modern wardrobe. Sharp silhouettes, considered fabrics, and a restrained palette built for the city.
          </p>
        </div>
      </section>

      {/* Hero image */}
      <section className="container-lux mb-20">
        <div className="relative aspect-[21/9] overflow-hidden">
          <img
            src="https://images.pexels.com/photos/15137845/pexels-photo-15137845.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Men's collection"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Shoes */}
      <section className="container-lux mb-20">
        <div className="flex items-end justify-between mb-10">
          <h2 className="font-display text-3xl lg:text-4xl">Shoes</h2>
          <Link to="/shoes" className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-ink-700 hover:text-ink-900 link-underline">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10">
            {[...Array(4)].map((_, i) => <div key={i} className="aspect-[3/4] skeleton" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 lg:gap-x-6">
            {shoes.slice(0, 4).map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        )}
      </section>

      {/* Clothing */}
      <section className="container-lux mb-20">
        <div className="flex items-end justify-between mb-10">
          <h2 className="font-display text-3xl lg:text-4xl">Clothing</h2>
          <Link to="/clothing" className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-ink-700 hover:text-ink-900 link-underline">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10">
            {[...Array(4)].map((_, i) => <div key={i} className="aspect-[3/4] skeleton" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 lg:gap-x-6">
            {clothing.slice(0, 4).map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        )}
      </section>

      {/* All */}
      <section className="container-lux pb-20">
        <h2 className="font-display text-3xl lg:text-4xl mb-10">All Men's</h2>
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10">
            {[...Array(8)].map((_, i) => <div key={i} className="aspect-[3/4] skeleton" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 lg:gap-x-6">
            {products.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        )}
      </section>
    </div>
  );
}
