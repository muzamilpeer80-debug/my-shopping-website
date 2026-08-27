import { useProducts } from '@/lib/products';
import { ProductCard } from '@/components/ProductCard';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { useRouter } from '@/lib/router';
import { SlidersHorizontal, X } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import type { Product } from '@/lib/types';

export default function Shop() {
  const { route } = useRouter();
  const search = route.query.get('search') || '';
  const sortParam = route.query.get('sort') || '';
  const [sort, setSort] = useState(sortParam || 'newest');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 60000]);

  useEffect(() => { if (sortParam) setSort(sortParam); }, [sortParam]);

  const { products, loading } = useProducts({ search, sort });

  const filtered = useMemo(() => {
    return products.filter((p: Product) => {
      if (selectedCategories.length && !selectedCategories.includes(p.category)) return false;
      if (selectedTypes.length && !selectedTypes.includes(p.type)) return false;
      if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
      return true;
    });
  }, [products, selectedCategories, selectedTypes, priceRange]);

  const toggle = (arr: string[], val: string, setter: (v: string[]) => void) => {
    setter(arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val]);
  };

  const FilterPanel = () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-[11px] font-medium uppercase tracking-[0.2em] text-ink-900 mb-4">Category</h3>
        <div className="space-y-2.5">
          {[{ v: 'men', l: "Men's" }, { v: 'women', l: "Women's" }].map(c => (
            <label key={c.v} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedCategories.includes(c.v)}
                onChange={() => toggle(selectedCategories, c.v, setSelectedCategories)}
                className="w-4 h-4 accent-ink-900"
              />
              <span className="text-sm text-ink-700 group-hover:text-ink-900 transition-colors">{c.l}</span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-[11px] font-medium uppercase tracking-[0.2em] text-ink-900 mb-4">Type</h3>
        <div className="space-y-2.5">
          {[{ v: 'shoes', l: 'Shoes' }, { v: 'clothing', l: 'Clothing' }].map(t => (
            <label key={t.v} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedTypes.includes(t.v)}
                onChange={() => toggle(selectedTypes, t.v, setSelectedTypes)}
                className="w-4 h-4 accent-ink-900"
              />
              <span className="text-sm text-ink-700 group-hover:text-ink-900 transition-colors">{t.l}</span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-[11px] font-medium uppercase tracking-[0.2em] text-ink-900 mb-4">Price Range</h3>
        <div className="space-y-3">
          <input
            type="range"
            min={0}
            max={60000}
            step={1000}
            value={priceRange[1]}
            onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-ink-600">
            <span>₹{(priceRange[0] / 100).toLocaleString('en-IN')}</span>
            <span>₹{(priceRange[1] / 100).toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>
      {(selectedCategories.length > 0 || selectedTypes.length > 0 || priceRange[1] < 60000) && (
        <button
          onClick={() => { setSelectedCategories([]); setSelectedTypes([]); setPriceRange([0, 60000]); }}
          className="text-[11px] uppercase tracking-[0.15em] text-ink-500 hover:text-ink-900 underline"
        >
          Clear Filters
        </button>
      )}
    </div>
  );

  return (
    <div className="pt-24 lg:pt-32 pb-20">
      <div className="container-lux">
        <Breadcrumbs crumbs={[{ label: 'Shop' }]} />

        <div className="mt-8 mb-10">
          <h1 className="font-display text-4xl lg:text-6xl mb-3">
            {search ? `Results for "${search}"` : 'The Collection'}
          </h1>
          <p className="text-ink-500 text-sm">{filtered.length} pieces</p>
        </div>

        <div className="flex gap-10">
          {/* Sidebar - desktop */}
          <aside className="hidden lg:block w-60 shrink-0">
            <FilterPanel />
          </aside>

          {/* Main */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-ink-100">
              <button
                onClick={() => setFilterOpen(true)}
                className="lg:hidden flex items-center gap-2 text-[11px] uppercase tracking-[0.15em] text-ink-700"
              >
                <SlidersHorizontal className="w-4 h-4" /> Filters
              </button>
              <p className="hidden lg:block text-[11px] uppercase tracking-[0.15em] text-ink-500">Refine</p>
              <div className="flex items-center gap-3">
                <label className="text-[11px] uppercase tracking-[0.15em] text-ink-500">Sort by</label>
                <select
                  value={sort}
                  onChange={e => setSort(e.target.value)}
                  className="bg-transparent text-sm text-ink-900 border-b border-ink-200 focus:border-ink-900 focus:outline-none py-1 cursor-pointer"
                >
                  <option value="newest">Newest</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-10">
                {[...Array(6)].map((_, i) => (
                  <div key={i}>
                    <div className="aspect-[3/4] skeleton" />
                    <div className="h-4 skeleton mt-4 w-3/4" />
                    <div className="h-3 skeleton mt-2 w-1/3" />
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-20 text-center">
                <p className="font-display text-2xl text-ink-700 mb-2">No pieces found</p>
                <p className="text-sm text-ink-400">Try adjusting your filters or search.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-10 lg:gap-x-6">
                {filtered.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {filterOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-ink-900/40 backdrop-blur-sm" onClick={() => setFilterOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-[85%] max-w-sm bg-ivory-50 overflow-y-auto animate-slide-in" style={{ animation: 'slideIn 0.3s ease-out' }}>
            <div className="flex items-center justify-between p-6 border-b border-ink-100">
              <h2 className="font-display text-xl">Filters</h2>
              <button onClick={() => setFilterOpen(false)} className="p-2"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6">
              <FilterPanel />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
