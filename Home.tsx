import { Link } from '@/lib/router';
import { useProducts } from '@/lib/products';
import { ProductCard } from '@/components/ProductCard';
import { useReveal } from '@/lib/useReveal';
import { ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Home() {
  const { products: featured } = useProducts({ featured: true, limit: 8 });
  const { products: trending } = useProducts({ trending: true, limit: 8 });
  const { products: newArrivals } = useProducts({ is_new: true, limit: 4 });
  const hero = useReveal();
  const editorial1 = useReveal();
  const editorial2 = useReveal();

  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-ink-900">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/20238956/pexels-photo-20238956.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="VÉRONA"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ink-900/50 via-ink-900/30 to-ink-900" />
        </div>

        <div
          ref={hero.ref}
          className={`relative z-10 text-center px-6 transition-all duration-1000 ease-lux ${hero.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <p className="text-[11px] uppercase tracking-[0.4em] text-ivory-200 mb-6 animate-fade-down">
            Autumn / Winter 2026
          </p>
          <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl text-ivory-50 leading-[0.95] tracking-tight animate-fade-up">
            WEAR YOUR
            <br />
            <span className="italic font-light">Difference.</span>
          </h1>
          <p className="mt-8 text-base lg:text-lg text-ivory-200 max-w-xl mx-auto leading-relaxed animate-fade-up" style={{ animationDelay: '200ms' }}>
            Contemporary footwear and clothing designed for those who refuse ordinary.
          </p>
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up" style={{ animationDelay: '400ms' }}>
            <Link to="/men" className="btn-light w-full sm:w-auto">
              Shop Men
            </Link>
            <Link to="/women" className="btn-light w-full sm:w-auto">
              Shop Women
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <div className="w-px h-16 bg-ivory-200/30 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-8 bg-ivory-50 animate-[slideUp_2s_ease-in-out_infinite]" />
          </div>
        </div>
      </section>

      {/* Marquee */}
      <section className="bg-ink-900 text-ivory-200 py-4 overflow-hidden border-y border-ink-700">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-12 px-6 text-[11px] uppercase tracking-[0.3em]">
              <span>Complimentary Shipping Over ₹15,000</span>
              <span className="text-accent">✦</span>
              <span>Limited Edition Drops</span>
              <span className="text-accent">✦</span>
              <span>Crafted in Italy</span>
              <span className="text-accent">✦</span>
              <span>30-Day Returns</span>
              <span className="text-accent">✦</span>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Collection */}
      <section className="py-20 lg:py-32">
        <div className="container-lux">
          <div className="flex items-end justify-between mb-12 lg:mb-16">
            <div>
              <p className="section-eyebrow mb-3">Curated</p>
              <h2 className="font-display text-4xl lg:text-5xl">Featured Collection</h2>
            </div>
            <Link to="/shop" className="hidden sm:flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-ink-700 hover:text-ink-900 link-underline">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 lg:gap-x-6">
            {featured.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Editorial Split 1 */}
      <section ref={editorial1.ref} className={`bg-ink-900 text-ivory-50 transition-opacity duration-1000 ${editorial1.visible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="grid lg:grid-cols-2 min-h-[80vh]">
          <div className="relative overflow-hidden">
            <img
              src="https://images.pexels.com/photos/15137845/pexels-photo-15137845.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt="Men's editorial"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex items-center justify-center p-12 lg:p-20">
            <div className="max-w-md">
              <p className="section-eyebrow text-ink-400 mb-4">The Men's Edit</p>
              <h2 className="font-display text-4xl lg:text-5xl leading-tight mb-6">
                Tailored for the<br />modern gentleman.
              </h2>
              <p className="text-ivory-200 leading-relaxed mb-8">
                Sharp silhouettes, considered fabrics, and a restrained palette. The men's collection reinterprets heritage tailoring for a generation that writes its own rules.
              </p>
              <Link to="/men" className="btn-light">
                Explore Men's <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trending */}
      <section className="py-20 lg:py-32">
        <div className="container-lux">
          <div className="text-center mb-12 lg:mb-16">
            <p className="section-eyebrow mb-3">Most Wanted</p>
            <h2 className="font-display text-4xl lg:text-5xl">Trending Now</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 lg:gap-x-6">
            {trending.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Editorial Split 2 */}
      <section ref={editorial2.ref} className={`transition-opacity duration-1000 ${editorial2.visible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="grid lg:grid-cols-2 min-h-[80vh]">
          <div className="flex items-center justify-center p-12 lg:p-20 order-2 lg:order-1">
            <div className="max-w-md">
              <p className="section-eyebrow mb-4">The Women's Edit</p>
              <h2 className="font-display text-4xl lg:text-5xl leading-tight mb-6">
                Fluid forms,<br />fierce presence.
              </h2>
              <p className="text-ink-600 leading-relaxed mb-8">
                Bias cuts, architectural heels, and a palette drawn from the atelier. The women's collection celebrates movement and the power of restraint.
              </p>
              <Link to="/women" className="btn-outline">
                Explore Women's <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          <div className="relative overflow-hidden order-1 lg:order-2">
            <img
              src="https://images.pexels.com/photos/20620137/pexels-photo-20620137.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt="Women's editorial"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-20 lg:py-32 bg-ivory-100">
        <div className="container-lux">
          <div className="flex items-end justify-between mb-12 lg:mb-16">
            <div>
              <p className="section-eyebrow mb-3">Just Landed</p>
              <h2 className="font-display text-4xl lg:text-5xl">New Arrivals</h2>
            </div>
            <Link to="/shop?sort=newest" className="hidden sm:flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-ink-700 hover:text-ink-900 link-underline">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 lg:gap-x-6">
            {newArrivals.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Promise */}
      <section className={`py-20 lg:py-28 bg-ink-900 text-ivory-50 transition-opacity duration-1000 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
        <div className="container-narrow text-center">
          <h2 className="font-display text-3xl lg:text-4xl mb-6">The VÉRONA Promise</h2>
          <p className="text-ivory-200 leading-relaxed max-w-2xl mx-auto">
            Every piece is crafted in limited editions by artisans who share our obsession with material, form, and finish. We make fewer, better things — designed to be worn for years, not seasons.
          </p>
        </div>
      </section>
    </div>
  );
}
