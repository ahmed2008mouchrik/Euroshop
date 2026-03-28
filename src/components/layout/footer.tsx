'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Heart } from 'lucide-react';

export function Footer() {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');

  return (
    <footer>
      {/* Wave separator */}
      <div className="h-12 bg-cream">
        <svg viewBox="0 0 1440 48" className="w-full h-full" preserveAspectRatio="none">
          <path d="M0,48 C360,0 720,32 1440,0 L1440,48 Z" className="fill-lavender/30" />
        </svg>
      </div>

      <div className="bg-gradient-to-b from-lavender/30 via-blush to-soft-pink/30">
        <div className="max-w-7xl mx-auto px-4 py-14 lg:py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Brand */}
            <div>
              <h3 className="font-[var(--font-heading)] text-2xl font-bold mb-4">
                Euro<span className="text-rose">shop</span>
                <Heart size={8} className="inline-block ml-0.5 -mt-3 text-rose fill-rose" />
              </h3>
              <p className="text-navy/60 text-sm leading-relaxed">{t('description')}</p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-medium text-rose text-xs uppercase tracking-widest mb-5">{t('quickLinks')}</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/" className="text-navy/60 hover:text-rose transition-colors">{tNav('home')}</Link></li>
                <li><Link href="/products" className="text-navy/60 hover:text-rose transition-colors">{tNav('products')}</Link></li>
                <li><Link href="/about" className="text-navy/60 hover:text-rose transition-colors">{tNav('about')}</Link></li>
                <li><Link href="/contact" className="text-navy/60 hover:text-rose transition-colors">{tNav('contact')}</Link></li>
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h4 className="font-medium text-rose text-xs uppercase tracking-widest mb-5">{t('customerService')}</h4>
              <ul className="space-y-3 text-sm text-navy/60">
                <li>{t('shippingInfo')}</li>
                <li>{t('returns')}</li>
                <li>{t('faq')}</li>
                <li>{t('privacy')}</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-rose-light/30 mt-12 pt-6 text-center text-xs text-navy/50">
            &copy; {new Date().getFullYear()} Euroshop. {t('rights')}
          </div>
        </div>
      </div>
    </footer>
  );
}
