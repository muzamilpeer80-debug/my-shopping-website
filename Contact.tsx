import { useState } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSent(false), 5000);
  };

  return (
    <div className="pt-24 lg:pt-32 pb-20">
      <div className="container-lux">
        <Breadcrumbs crumbs={[{ label: 'Contact' }]} />
        <div className="mt-8 mb-16">
          <p className="section-eyebrow mb-4">Client Care</p>
          <h1 className="font-display text-5xl lg:text-6xl">Get in Touch</h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Info */}
          <div>
            <p className="text-ink-600 leading-relaxed mb-10 max-w-md">
              Our client care team is available to assist with product inquiries, order tracking, styling advice, and more. We're committed to providing a seamless experience.
            </p>
            <div className="space-y-8">
              {[
                { icon: Mail, label: 'Email', value: 'clientcare@verona.com', sub: 'We respond within 24 hours' },
                { icon: Phone, label: 'Phone', value: '+91 98765 43210', sub: 'Mon–Sat, 10am–7pm IST' },
                { icon: MapPin, label: 'Flagship', value: 'Khan Market, New Delhi', sub: 'Open daily, 11am–9pm' },
                { icon: Clock, label: 'Atelier Hours', value: 'Monday – Saturday', sub: '10:00 AM – 7:00 PM IST' },
              ].map(item => (
                <div key={item.label} className="flex gap-4">
                  <div className="w-10 h-10 border border-ink-200 flex items-center justify-center shrink-0">
                    <item.icon className="w-4 h-4 text-ink-700" />
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.2em] text-ink-500 mb-1">{item.label}</p>
                    <p className="font-display text-lg">{item.value}</p>
                    <p className="text-xs text-ink-400 mt-0.5">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="bg-ivory-100 p-8 lg:p-10">
            <h2 className="font-display text-2xl mb-6">Send a Message</h2>
            {sent ? (
              <div className="flex flex-col items-center justify-center py-12 animate-fade-in">
                <div className="w-14 h-14 rounded-full bg-accent flex items-center justify-center mb-4">
                  <Send className="w-6 h-6 text-ink-900" />
                </div>
                <p className="font-display text-xl mb-2">Message Sent</p>
                <p className="text-sm text-ink-500 text-center">We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="label-lux">Name</label>
                  <input type="text" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="input-lux" />
                </div>
                <div>
                  <label className="label-lux">Email</label>
                  <input type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="input-lux" />
                </div>
                <div>
                  <label className="label-lux">Subject</label>
                  <input type="text" required value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} className="input-lux" />
                </div>
                <div>
                  <label className="label-lux">Message</label>
                  <textarea required rows={5} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} className="input-lux resize-none" />
                </div>
                <button type="submit" className="btn-primary w-full">Send Message</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
