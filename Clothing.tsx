import { useProducts } from '@/lib/products';
import { ProductCard } from '@/components/ProductCard';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { useReveal } from '@/lib/useReveal';

export default function Clothing() {
  const { products, loading } = useProducts({ type: 'clothing' });
  const hero = useReveal();
  const menClothing = products.filter(p => p.category === 'men');
  const womenClothing = products.filter(p => p.category === 'women');

  return (
    <div className="pt-24 lg:pt-32 pb-20">
      <section ref={hero.ref} className={`container-lux mb-16 transition-all duration-1000 ${hero.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <Breadcrumbs crumbs={[{ label: 'Clothing' }]} />
        <div className="mt-8 grid lg:grid-cols-2 gap-8 items-end">
          <div>
            <p className="section-eyebrow mb-4">Ready-to-Wear</p>
            <h1 className="font-display text-5xl lg:text-7xl leading-[0.95]">
              The Clothing<br /><span className="italic font-light">Edit</span>
            </h1>
          </div>
          <p className="text-ink-600 leading-relaxed max-w-md lg:justify-self-end">
            Tailored coats, fluid dresses, and essential knits. Pieces designed to be worn for years, not seasons.
          </p>
        </div>
      </section>

      <section className="container-lux mb-20">
        <div className="relative aspect-[16/8] overflow-hidden mb-12">
          <img
            src="https://images.pexels.com/photos/8358794/pexels-photo-8358794.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Clothing collection"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {loading ? (
        <div className="container-lux">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10">
            {[...Array(8)].map((_, i) => <div key={i} className="aspect-[3/4] skeleton" />)}
          </div>
        </div>
      ) : (
        <>
          {menClothing.length > 0 && (
            <section className="container-lux mb-20">
              <h2 className="font-display text-3xl lg:text-4xl mb-10">Men's Clothing</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 lg:gap-x-6">
                {menClothing.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
              </div>
            </section>
          )}
          {womenClothing.length > 0 && (
            <section className="container-lux mb-20">
              <h2 className="font-display text-3xl lg:text-4xl mb-10">Women's Clothing</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 lg:gap-x-6">
                {womenClothing.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
