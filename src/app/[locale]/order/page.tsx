'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useCart } from '@/context/cart-context';
import { formatPrice, generateOrderNumber } from '@/lib/utils';
import { sendOrderEmail } from '@/lib/email';
import { buildWhatsAppLink } from '@/lib/whatsapp';
import { OrderFormData } from '@/types';
import { ArrowLeft, Minus, Plus, MessageCircle, Heart, Sparkles } from 'lucide-react';

export default function OrderPage() {
  const t = useTranslations();
  const locale = useLocale() as 'en' | 'fr';
  const { items, subtotal, itemCount, updateQuantity, removeItem, clearCart } = useCart();

  const [form, setForm] = useState<OrderFormData>({
    firstName: '', lastName: '', email: '', phone: '', city: '', address: '', notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [orderResult, setOrderResult] = useState<{ orderNumber: string; whatsAppLink: string } | null>(null);

  if (items.length === 0 && !orderResult) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="w-20 h-20 bg-lavender rounded-full flex items-center justify-center mx-auto mb-5">
          <Heart size={24} className="text-mauve" strokeWidth={1.5} />
        </div>
        <p className="text-navy/65 text-lg font-light">{t('cart.empty')}</p>
        <Link href="/products" className="text-rose font-medium mt-4 inline-block hover:underline underline-offset-4">
          {t('cart.continueShopping')}
        </Link>
      </div>
    );
  }

  if (orderResult) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-rose-light to-lavender rounded-full flex items-center justify-center mx-auto mb-6">
          <Sparkles size={28} className="text-rose" />
        </div>
        <h1 className="font-[var(--font-heading)] text-3xl font-bold italic">{t('orderSuccess.title')}</h1>
        <p className="text-navy/60 mt-2 font-light">{t('orderSuccess.subtitle')}</p>
        <div className="bg-blush rounded-2xl p-5 mt-6 inline-block">
          <p className="text-[11px] text-navy/60 uppercase tracking-widest font-medium">{t('orderSuccess.orderNumber')}</p>
          <p className="font-mono font-bold text-lg mt-1">{orderResult.orderNumber}</p>
        </div>
        <p className="text-navy/65 mt-6 max-w-md mx-auto text-sm leading-relaxed font-light">{t('orderSuccess.message')}</p>
        <p className="text-navy/50 mt-2 text-xs">{t('orderSuccess.emailSent')}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-10">
          <a
            href={orderResult.whatsAppLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white px-6 py-3.5 rounded-full font-semibold hover:opacity-90 transition-opacity"
          >
            <MessageCircle size={18} /> {t('orderSuccess.whatsapp')}
          </a>
          <Link href="/products" className="bg-gradient-to-r from-rose-gold to-mauve text-white px-6 py-3.5 rounded-full font-semibold hover:opacity-90 transition-opacity">
            {t('orderSuccess.backToShop')}
          </Link>
        </div>
      </div>
    );
  }

  const update = (field: keyof OrderFormData, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const orderNumber = generateOrderNumber();
    const whatsAppLink = buildWhatsAppLink(items, form, orderNumber, subtotal);
    await sendOrderEmail(items, form, orderNumber, subtotal);
    setOrderResult({ orderNumber, whatsAppLink });
    clearCart();
    setSubmitting(false);
  };

  const isValid = form.firstName && form.lastName && form.phone && form.city && form.address;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 lg:py-16">
      <Link href="/products" className="inline-flex items-center gap-1.5 text-xs text-navy/60 hover:text-rose mb-8 transition-colors uppercase tracking-widest font-medium">
        <ArrowLeft size={14} /> {t('nav.products')}
      </Link>

      <h1 className="font-[var(--font-heading)] text-3xl font-bold italic">{t('order.title')}</h1>
      <p className="text-navy/60 mt-1 mb-10 font-light">{t('order.subtitle')}</p>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Form */}
          <div className="lg:col-span-2 space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <FormInput label={t('order.firstName')} value={form.firstName} onChange={(v) => update('firstName', v)} required />
              <FormInput label={t('order.lastName')} value={form.lastName} onChange={(v) => update('lastName', v)} required />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <FormInput label={t('order.email')} type="email" value={form.email} onChange={(v) => update('email', v)} />
              <FormInput label={t('order.phone')} type="tel" value={form.phone} onChange={(v) => update('phone', v)} required />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <FormInput label={t('order.city')} value={form.city} onChange={(v) => update('city', v)} required />
              <FormInput label={t('order.address')} value={form.address} onChange={(v) => update('address', v)} required />
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-widest text-navy/60 mb-2">{t('order.notes')}</label>
              <textarea
                value={form.notes}
                onChange={(e) => update('notes', e.target.value)}
                placeholder={t('order.notesPlaceholder')}
                rows={3}
                className="w-full bg-blush/50 border border-rose-light/30 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose/30 resize-none placeholder:text-navy/40"
              />
            </div>
            <p className="text-[11px] text-navy/50 font-light">{t('order.termsNote')}</p>
          </div>

          {/* Order summary */}
          <div>
            <div className="bg-white rounded-3xl p-6 sticky top-24 shadow-sm">
              <h2 className="font-semibold text-sm mb-5">{t('cart.orderSummary')}</h2>
              <div className="space-y-3 max-h-56 overflow-y-auto">
                {items.map((item) => (
                  <div key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`} className="flex gap-3">
                    <div className="w-12 h-12 bg-lavender/30 rounded-xl flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{item.product.name[locale]}</p>
                      <p className="text-[10px] text-navy/55">{item.selectedSize} &middot; {item.selectedColor}</p>
                      <div className="flex items-center justify-between mt-1">
                        <div className="flex items-center gap-1">
                          <button type="button" onClick={() => updateQuantity(item.product.id, item.selectedSize, item.selectedColor, item.quantity - 1)} className="w-5 h-5 rounded-full bg-blush flex items-center justify-center hover:bg-rose-light/40">
                            <Minus size={8} />
                          </button>
                          <span className="text-[10px] w-4 text-center font-medium">{item.quantity}</span>
                          <button type="button" onClick={() => updateQuantity(item.product.id, item.selectedSize, item.selectedColor, item.quantity + 1)} className="w-5 h-5 rounded-full bg-blush flex items-center justify-center hover:bg-rose-light/40">
                            <Plus size={8} />
                          </button>
                        </div>
                        <span className="text-xs font-semibold">{formatPrice(item.product.price * item.quantity)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-rose-light/20 mt-5 pt-4 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-navy/55">{t('cart.shipping')}</span>
                  <span className="text-green-500 font-medium">{t('cart.free')}</span>
                </div>
                <div className="flex justify-between font-bold text-base pt-2 border-t border-rose-light/20">
                  <span>{t('cart.total')}</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={!isValid || submitting}
                className="w-full mt-5 bg-gradient-to-r from-rose to-mauve text-white py-3.5 rounded-full font-semibold hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-rose/15"
              >
                {submitting ? t('order.submitting') : t('order.submit')}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

function FormInput({ label, type = 'text', value, onChange, required }: {
  label: string; type?: string; value: string; onChange: (v: string) => void; required?: boolean;
}) {
  return (
    <div>
      <label className="block text-[11px] font-semibold uppercase tracking-widest text-navy/60 mb-2">
        {label}{required && <span className="text-rose"> *</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full bg-blush/50 border border-rose-light/30 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose/30 placeholder:text-navy/40"
      />
    </div>
  );
}
