'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { sendContactEmail } from '@/lib/email';
import { MapPin, Phone, Mail, Clock, MessageCircle, Sparkles } from 'lucide-react';

export default function ContactPage() {
  const t = useTranslations('contact');

  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    const ok = await sendContactEmail(form);
    setStatus(ok ? 'success' : 'error');
    if (ok) setForm({ name: '', email: '', subject: '', message: '' });
  };

  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '';

  return (
    <div className="max-w-6xl mx-auto px-4 py-14 lg:py-24">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-1.5 text-rose mb-4">
          <Sparkles size={12} />
          <span className="font-script text-lg">Contact</span>
        </div>
        <h1 className="font-[var(--font-heading)] text-4xl md:text-5xl font-bold italic">{t('title')}</h1>
        <p className="text-navy/60 mt-3 text-lg font-light">{t('subtitle')}</p>
      </div>

      <div className="grid lg:grid-cols-5 gap-14">
        {/* Form */}
        <div className="lg:col-span-3">
          <h2 className="text-[11px] font-semibold uppercase tracking-widest text-navy/60 mb-6">{t('formTitle')}</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-widest text-navy/60 mb-2">{t('name')}</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-blush/50 border border-rose-light/30 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose/30 placeholder:text-navy/40"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-widest text-navy/60 mb-2">{t('email')}</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-blush/50 border border-rose-light/30 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose/30 placeholder:text-navy/40"
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-widest text-navy/60 mb-2">{t('subject')}</label>
              <input
                type="text"
                required
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="w-full bg-blush/50 border border-rose-light/30 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose/30 placeholder:text-navy/40"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-widest text-navy/60 mb-2">{t('message')}</label>
              <textarea
                required
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full bg-blush/50 border border-rose-light/30 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose/30 resize-none placeholder:text-navy/40"
              />
            </div>
            <button
              type="submit"
              disabled={status === 'sending'}
              className="bg-gradient-to-r from-rose to-mauve text-white px-10 py-3.5 rounded-full font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 shadow-lg shadow-rose/15"
            >
              {status === 'sending' ? t('sending') : t('send')}
            </button>
            {status === 'success' && <p className="text-green-500 text-sm font-light">{t('success')}</p>}
            {status === 'error' && <p className="text-rose-dark text-sm font-light">{t('error')}</p>}
          </form>
        </div>

        {/* Info */}
        <div className="lg:col-span-2">
          <h2 className="text-[11px] font-semibold uppercase tracking-widest text-navy/60 mb-6">{t('infoTitle')}</h2>
          <div className="space-y-5">
            {[
              { icon: MapPin, text: t('address'), bg: 'bg-rose-light/30' },
              { icon: Phone, text: t('phone'), bg: 'bg-lavender/40' },
              { icon: Mail, text: t('emailAddress'), bg: 'bg-peach/40' },
              { icon: Clock, text: `${t('hoursLabel')}: ${t('hours')}`, bg: 'bg-mauve-light/30' },
            ].map((item) => (
              <div key={item.text} className="flex gap-3">
                <div className={`w-10 h-10 ${item.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <item.icon size={16} className="text-navy/65" strokeWidth={1.5} />
                </div>
                <p className="text-sm text-navy/65 pt-2.5 font-light">{item.text}</p>
              </div>
            ))}
          </div>

          <a
            href={`https://wa.me/${phone}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 flex items-center justify-center gap-2 bg-[#25D366] text-white py-3.5 rounded-full font-semibold hover:opacity-90 transition-opacity"
          >
            <MessageCircle size={18} /> {t('whatsapp')}
          </a>
        </div>
      </div>
    </div>
  );
}
