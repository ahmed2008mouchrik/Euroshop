'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { products } from '@/data/products';
import { categories } from '@/data/categories';
import { ProductCard } from '@/components/products/product-card';
import { Sparkles, Truck, HeadphonesIcon, ShoppingBag, Heart } from 'lucide-react';

export default function HomePage() {
  const t = useTranslations();
  const locale = useLocale() as 'en' | 'fr';

  const featuredProducts = products.filter((p) => p.featured || p.bestSeller).slice(0, 8);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-soft-pink via-lavender/60 to-soft-lilac">
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-10 left-[10%] w-80 h-80 bg-rose-light rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-[10%] w-96 h-96 bg-mauve-light rounded-full blur-[120px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-peach rounded-full blur-[80px]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-28 lg:py-40 text-center">
          <div className="inline-flex items-center gap-1.5 bg-white/60 text-navy/60 text-xs font-medium px-4 py-1.5 rounded-full mb-8 backdrop-blur-sm border border-rose-light/40">
            <Sparkles size={12} /> Premium Fashion &amp; Lifestyle
          </div>
          <h1 className="font-[var(--font-heading)] text-4xl md:text-6xl lg:text-7xl font-bold text-navy mb-6 text-balance leading-[1.1] italic">
            {t('hero.title')}
          </h1>
          <p className="text-navy/70 text-lg md:text-xl max-w-xl mx-auto mb-12 leading-relaxed font-light">
            {t('hero.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="bg-gradient-to-r from-rose to-mauve text-white px-10 py-4 rounded-full font-semibold hover:opacity-90 transition-opacity text-[15px] shadow-xl shadow-rose/30"
            >
              {t('hero.cta')}
            </Link>
            <Link
              href="/about"
              className="border border-rose/30 text-navy/70 px-10 py-4 rounded-full font-medium hover:bg-rose-light/20 transition-colors text-[15px]"
            >
              {t('hero.secondaryCta')}
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-20 lg:py-28">
        <div className="text-center mb-14">
          <span className="font-script text-rose text-lg">Browse</span>
          <h2 className="font-[var(--font-heading)] text-3xl md:text-4xl font-bold italic">{t('categories.title')}</h2>
          <p className="text-navy/60 mt-2 font-light">{t('categories.subtitle')}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 lg:gap-8">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className="group relative aspect-[4/5] rounded-[2rem] overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-petal/80 to-rose-gold/85 group-hover:from-petal/60 group-hover:to-rose-gold/65 transition-all duration-500" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-shadow-soft">
                <h3 className="font-[var(--font-heading)] text-2xl md:text-3xl font-bold italic">{cat.name[locale]}</h3>
                <p className="text-white/60 text-sm mt-2 font-light">{cat.description[locale]}</p>
                <span className="mt-5 text-xs uppercase tracking-widest text-white/80 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Explorer &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Best Sellers */}
      <section className="bg-gradient-to-b from-soft-pink/30 to-lavender/15">
        <div className="max-w-7xl mx-auto px-4 py-20 lg:py-28">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="font-script text-rose text-lg mb-1"><Heart size={10} className="fill-rose inline-block mr-1" />Favorites</p>
              <h2 className="font-[var(--font-heading)] text-3xl md:text-4xl font-bold italic">{t('bestSellers.title')}</h2>
              <p className="text-navy/60 mt-1 font-light">{t('bestSellers.subtitle')}</p>
            </div>
            <Link href="/products" className="text-rose text-sm font-medium hover:underline hidden sm:block underline-offset-4">
              {t('common.seeAll')} &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="max-w-7xl mx-auto px-4 py-20 lg:py-28">
        <h2 className="font-[var(--font-heading)] text-3xl font-bold text-center mb-14 italic">{t('trust.title')}</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { icon: Sparkles, title: t('trust.quality'), desc: t('trust.qualityDesc'), bg: 'bg-rose-light/30' },
            { icon: Truck, title: t('trust.shipping'), desc: t('trust.shippingDesc'), bg: 'bg-lavender/40' },
            { icon: HeadphonesIcon, title: t('trust.support'), desc: t('trust.supportDesc'), bg: 'bg-peach/40' },
            { icon: ShoppingBag, title: t('trust.secure'), desc: t('trust.secureDesc'), bg: 'bg-mauve-light/30' },
          ].map((item) => (
            <div key={item.title} className="text-center p-7 bg-white rounded-3xl shadow-pink hover:shadow-pink-lg transition-shadow">
              <div className={`w-14 h-14 rounded-2xl ${item.bg} flex items-center justify-center mx-auto mb-4`}>
                <item.icon size={22} className="text-rose/60" strokeWidth={1.5} />
              </div>
              <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
              <p className="text-xs text-navy/60 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
