import { useReveal } from '@/lib/useReveal';
import { Link } from '@/lib/router';
import { ArrowRight } from 'lucide-react';

export default function About() {
  const hero = useReveal();
  const story = useReveal();
  const values = useReveal();

  return (
    <div className="pt-24 lg:pt-32">
      {/* Hero */}
      <section ref={hero.ref} className={`container-lux mb-20 transition-all duration-1000 ${hero.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <p className="section-eyebrow mb-4">The House of VÉRONA</p>
        <h1 className="font-display text-5xl lg:text-8xl leading-[0.95] mb-8">
          Designed for those<br />who refuse<br /><span className="italic font-light">ordinary.</span>
        </h1>
        <p className="text-lg text-ink-600 max-w-2xl leading-relaxed">
          VÉRONA was founded on a simple belief: that what you wear should be as considered as how you live. We craft limited-edition footwear and clothing for individuals who understand that true luxury is restraint.
        </p>
      </section>

      {/* Hero image */}
      <section className="container-lux mb-20">
        <div className="relative aspect-[21/10] overflow-hidden">
          <img
            src="https://images.pexels.com/photos/9850083/pexels-photo-9850083.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="VÉRONA atelier"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Story */}
      <section ref={story.ref} className={`container-lux mb-24 transition-opacity duration-1000 ${story.visible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="section-eyebrow mb-4">Our Story</p>
            <h2 className="font-display text-4xl mb-6 leading-tight">From atelier to wardrobe.</h2>
            <div className="space-y-4 text-ink-600 leading-relaxed">
              <p>Founded in 2026, VÉRONA began as a conversation between a shoemaker and a tailor who shared a frustration with the disposable nature of modern fashion. They believed that clothing and footwear should be made to last — not just in construction, but in style.</p>
              <p>Every piece in our collection is designed in-house and crafted in limited editions by artisans who share our obsession with material, form, and finish. We source premium leathers, natural fibers, and responsible materials because we believe that what goes into a garment matters as much as how it looks.</p>
              <p>We make fewer, better things. Our collections are small by design — ensuring that what you wear remains yours, not everyone's.</p>
            </div>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden">
            <img
              src="https://images.pexels.com/photos/9849661/pexels-photo-9849661.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt="Atelier"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Values */}
      <section ref={values.ref} className={`bg-ink-900 text-ivory-50 py-24 transition-opacity duration-1000 ${values.visible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="container-lux">
          <p className="section-eyebrow text-ink-400 mb-4 text-center">What We Believe</p>
          <h2 className="font-display text-4xl lg:text-5xl text-center mb-16">The VÉRONA Principles</h2>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { n: '01', t: 'Craftsmanship', d: 'Every piece is constructed by artisans using techniques refined over generations. We never compromise on construction.' },
              { n: '02', t: 'Restraint', d: 'We design with a restrained palette and clean lines. True luxury doesn\'t shout — it whispers.' },
              { n: '03', t: 'Responsibility', d: 'We source materials responsibly, craft in limited editions, and design for longevity. Fewer, better things.' },
            ].map(v => (
              <div key={v.n}>
                <p className="font-display text-5xl text-accent mb-4">{v.n}</p>
                <h3 className="font-display text-2xl mb-3">{v.t}</h3>
                <p className="text-ivory-200 leading-relaxed">{v.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-lux py-24 text-center">
        <h2 className="font-display text-4xl lg:text-5xl mb-6">Wear your difference.</h2>
        <p className="text-ink-500 mb-8 max-w-xl mx-auto">Explore the collection and find pieces designed to be yours.</p>
        <Link to="/shop" className="btn-primary">Explore the Collection <ArrowRight className="w-4 h-4" /></Link>
      </section>
    </div>
  );
}
