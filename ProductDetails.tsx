import { useEffect, useState } from 'react';
import { useRouter, Link, navigate } from '@/lib/router';
import { fetchProductBySlug, fetchReviews, fetchRelatedProducts, addReview } from '@/lib/products';
import type { Product, Review } from '@/lib/types';
import { formatINR } from '@/lib/types';
import { useCart } from '@/lib/cart';
import { useAuth } from '@/lib/auth';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { ProductCard } from '@/components/ProductCard';
import { Heart, ShoppingBag, Minus, Plus, Star, Truck, RotateCcw, Shield } from 'lucide-react';

export default function ProductDetails() {
  const { route } = useRouter();
  const slug = route.params.slug;
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const { session } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [related, setRelated] = useState<Product[]>([]);
  const [tab, setTab] = useState<'details' | 'reviews' | 'shipping'>('details');
  const [added, setAdded] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', body: '', name: '' });
  const [reviewError, setReviewError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchProductBySlug(slug).then(p => {
      setProduct(p);
      if (p) {
        setSelectedSize(p.sizes[0] || '');
        setSelectedColor(p.colors[0] || '');
        fetchReviews(p.id).then(setReviews);
        fetchRelatedProducts(p).then(setRelated);
      }
      setLoading(false);
    });
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;
    if (product.sizes.length > 0 && !selectedSize) return;
    addToCart(product, selectedSize || 'One Size', selectedColor || 'Default', quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    setReviewError(null);
    try {
      await addReview(product.id, reviewForm.rating, reviewForm.title, reviewForm.body, reviewForm.name || 'Anonymous');
      const updated = await fetchReviews(product.id);
      setReviews(updated);
      setReviewForm({ rating: 5, title: '', body: '', name: '' });
    } catch (err) {
      setReviewError(err instanceof Error ? err.message : 'Failed to submit review');
    }
  };

  if (loading) {
    return (
      <div className="pt-32 container-lux">
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="aspect-[3/4] skeleton" />
          <div className="space-y-4">
            <div className="h-8 skeleton w-3/4" />
            <div className="h-6 skeleton w-1/3" />
            <div className="h-20 skeleton" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-32 container-lux text-center py-20">
        <h1 className="font-display text-3xl mb-4">Product not found</h1>
        <Link to="/shop" className="btn-outline">Back to Shop</Link>
      </div>
    );
  }

  const hasDiscount = product.compare_at_price && product.compare_at_price > product.price;
  const wished = isInWishlist(product.id);

  return (
    <div className="pt-24 lg:pt-32 pb-20">
      <div className="container-lux">
        <Breadcrumbs crumbs={[{ label: 'Shop', to: '/shop' }, { label: product.name }]} />

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 mt-8">
          {/* Gallery */}
          <div>
            <div className="aspect-[3/4] overflow-hidden bg-ivory-100 mb-4 relative group">
              <img
                src={product.images[activeImage]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-1000 ease-lux group-hover:scale-105"
              />
              {hasDiscount && (
                <span className="absolute top-4 left-4 bg-accent text-ink-900 text-[10px] font-medium uppercase tracking-[0.15em] px-3 py-1.5">
                  Save {formatINR((product.compare_at_price as number) - product.price)}
                </span>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`w-20 h-24 overflow-hidden border-2 transition-colors ${activeImage === i ? 'border-ink-900' : 'border-transparent opacity-60 hover:opacity-100'}`}
                  >
                    <img src={img} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="lg:pt-4">
            {product.collection && (
              <p className="section-eyebrow mb-3">{product.collection} Collection</p>
            )}
            <h1 className="font-display text-3xl lg:text-4xl mb-4 leading-tight">{product.name}</h1>

            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-3.5 h-3.5 ${i < Math.round(product.rating) ? 'fill-accent text-accent' : 'text-ink-200'}`} />
                ))}
              </div>
              <span className="text-sm text-ink-500">{product.rating > 0 ? `${product.rating} · ${product.review_count} reviews` : 'No reviews yet'}</span>
            </div>

            <div className="flex items-center gap-3 mb-8">
              <span className="text-2xl font-medium">{formatINR(product.price)}</span>
              {hasDiscount && (
                <span className="text-lg text-ink-400 line-through">{formatINR(product.compare_at_price as number)}</span>
              )}
              {hasDiscount && (
                <span className="text-[11px] uppercase tracking-[0.15em] text-accent-dark">
                  {Math.round((1 - product.price / (product.compare_at_price as number)) * 100)}% Off
                </span>
              )}
            </div>

            <p className="text-ink-600 leading-relaxed mb-8">{product.description}</p>

            {/* Color */}
            {product.colors.length > 0 && (
              <div className="mb-6">
                <p className="label-lux">Color — {selectedColor}</p>
                <div className="flex gap-2">
                  {product.colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${selectedColor === color ? 'border-ink-900 scale-110' : 'border-ink-200'}`}
                      style={{ background: colorSwatch(color) }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size */}
            {product.sizes.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="label-lux mb-0">Size</p>
                  <button className="text-[10px] uppercase tracking-[0.15em] text-ink-500 hover:text-ink-900 underline">Size Guide</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[3rem] px-3 py-2.5 text-sm border transition-all ${selectedSize === size ? 'border-ink-900 bg-ink-900 text-ivory-50' : 'border-ink-200 text-ink-700 hover:border-ink-900'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity + Add */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center border border-ink-200">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-3 hover:bg-ivory-100 transition-colors" aria-label="Decrease quantity">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center text-sm font-medium">{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)} className="p-3 hover:bg-ivory-100 transition-colors" aria-label="Increase quantity">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                className={`flex-1 btn ${added ? 'bg-accent text-ink-900' : 'btn-primary'}`}
              >
                {added ? 'Added to Bag ✓' : (<><ShoppingBag className="w-4 h-4" /> Add to Bag</>)}
              </button>
              <button
                onClick={() => toggleWishlist(product.id)}
                className="p-3.5 border border-ink-200 hover:border-ink-900 transition-colors"
                aria-label="Toggle wishlist"
              >
                <Heart className={`w-5 h-5 ${wished ? 'fill-ink-900 text-ink-900' : 'text-ink-700'}`} />
              </button>
            </div>

            {product.stock <= 10 && product.stock > 0 && (
              <p className="text-[11px] uppercase tracking-[0.15em] text-accent-dark mb-6">Only {product.stock} left in stock</p>
            )}

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-4 py-6 border-y border-ink-100 mt-6">
              {[
                { icon: Truck, label: 'Free Shipping Over ₹15,000' },
                { icon: RotateCcw, label: '30-Day Returns' },
                { icon: Shield, label: 'Authenticity Guaranteed' },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center text-center gap-2">
                  <item.icon className="w-5 h-5 text-ink-500" />
                  <span className="text-[10px] uppercase tracking-[0.1em] text-ink-500 leading-tight">{item.label}</span>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="mt-8">
              <div className="flex gap-6 border-b border-ink-100">
                {(['details', 'reviews', 'shipping'] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`pb-3 text-[11px] uppercase tracking-[0.2em] transition-colors ${tab === t ? 'text-ink-900 border-b border-ink-900' : 'text-ink-400 hover:text-ink-700'}`}
                  >
                    {t === 'details' ? 'Details' : t === 'reviews' ? `Reviews (${reviews.length})` : 'Shipping'}
                  </button>
                ))}
              </div>

              <div className="pt-6">
                {tab === 'details' && (
                  <div className="space-y-3 text-sm text-ink-600 leading-relaxed">
                    <p>{product.description}</p>
                    <ul className="space-y-1.5 pt-2">
                      <li>· Category: {product.category === 'men' ? "Men's" : "Women's"} {product.type}</li>
                      <li>· Collection: {product.collection || 'Main Line'}</li>
                      <li>· Crafted in limited editions</li>
                      <li>· Premium materials sourced responsibly</li>
                    </ul>
                  </div>
                )}

                {tab === 'reviews' && (
                  <div>
                    {reviews.length === 0 ? (
                      <p className="text-sm text-ink-500 mb-6">No reviews yet. Be the first to share your experience.</p>
                    ) : (
                      <div className="space-y-6 mb-8">
                        {reviews.map(r => (
                          <div key={r.id} className="border-b border-ink-100 pb-6">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className={`w-3.5 h-3.5 ${i < r.rating ? 'fill-accent text-accent' : 'text-ink-200'}`} />
                                ))}
                              </div>
                              <span className="text-xs text-ink-400">{new Date(r.created_at).toLocaleDateString()}</span>
                            </div>
                            {r.title && <h4 className="font-display text-lg mb-1">{r.title}</h4>}
                            <p className="text-sm text-ink-600 leading-relaxed">{r.body}</p>
                            <p className="text-[11px] uppercase tracking-[0.15em] text-ink-400 mt-2">— {r.author_name || 'Anonymous'}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    <form onSubmit={handleReviewSubmit} className="space-y-4">
                      <h4 className="font-display text-xl">Write a Review</h4>
                      {!session && (
                        <p className="text-sm text-ink-500">
                          Please <Link to="/auth" className="underline text-ink-900">sign in</Link> to leave a review.
                        </p>
                      )}
                      <div>
                        <label className="label-lux">Rating</label>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map(n => (
                            <button key={n} type="button" onClick={() => setReviewForm(f => ({ ...f, rating: n }))}>
                              <Star className={`w-6 h-6 ${n <= reviewForm.rating ? 'fill-accent text-accent' : 'text-ink-200'}`} />
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="label-lux">Name</label>
                        <input
                          type="text"
                          value={reviewForm.name}
                          onChange={e => setReviewForm(f => ({ ...f, name: e.target.value }))}
                          placeholder="Your name"
                          className="input-lux"
                        />
                      </div>
                      <div>
                        <label className="label-lux">Title</label>
                        <input
                          type="text"
                          value={reviewForm.title}
                          onChange={e => setReviewForm(f => ({ ...f, title: e.target.value }))}
                          placeholder="Summary"
                          className="input-lux"
                        />
                      </div>
                      <div>
                        <label className="label-lux">Review</label>
                        <textarea
                          value={reviewForm.body}
                          onChange={e => setReviewForm(f => ({ ...f, body: e.target.value }))}
                          placeholder="Share your experience..."
                          rows={4}
                          className="input-lux resize-none"
                        />
                      </div>
                      {reviewError && <p className="text-sm text-red-600">{reviewError}</p>}
                      <button type="submit" className="btn-primary" disabled={!session}>
                        Submit Review
                      </button>
                    </form>
                  </div>
                )}

                {tab === 'shipping' && (
                  <div className="space-y-3 text-sm text-ink-600 leading-relaxed">
                    <p>Complimentary shipping on all orders over ₹15,000. Standard shipping (3-5 business days) ₹250.</p>
                    <p>Express shipping (1-2 business days) ₹500. International shipping calculated at checkout.</p>
                    <p>30-day returns on unworn items with original packaging. Refunds processed within 5-7 business days.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-24 lg:mt-32">
            <h2 className="font-display text-3xl lg:text-4xl mb-10 text-center">You May Also Like</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 lg:gap-x-6">
              {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          </section>
        )}
      </div>
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
