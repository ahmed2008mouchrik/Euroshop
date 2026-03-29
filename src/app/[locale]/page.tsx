'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Product } from '@/types';
import { categories } from '@/data/categories';
import { ProductCard } from '@/components/products/product-card';
import { Sparkles, HeadphonesIcon, ShoppingBag, Heart } from 'lucide-react';
import Image from 'next/image';

export default function HomePage() {
  const t = useTranslations();
  const locale = useLocale() as 'en' | 'fr';

  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products?featured=true')
      .then((res) => res.json())
      .then((data) => setFeaturedProducts(data.slice(0, 8)))
      .finally(() => setLoading(false));
  }, []);

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
              <Image
                src={cat.image}
                alt={cat.name[locale]}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/50 via-navy/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col items-center text-center">
                <h3 className="font-[var(--font-heading)] text-2xl md:text-3xl font-bold italic text-white drop-shadow-md">{cat.name[locale]}</h3>
                <p className="text-white/70 text-sm mt-1 font-light">{cat.description[locale]}</p>
                <span className="mt-3 text-xs uppercase tracking-widest text-white/80 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
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
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[3/4] bg-soft-lilac/30 rounded-3xl mb-3" />
                  <div className="h-3 bg-soft-lilac/30 rounded-full w-3/4 mb-2" />
                  <div className="h-3 bg-soft-lilac/30 rounded-full w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Trust badges */}
      <section className="max-w-7xl mx-auto px-4 py-20 lg:py-28">
        <h2 className="font-[var(--font-heading)] text-3xl font-bold text-center mb-14 italic">{t('trust.title')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            { icon: Sparkles, title: t('trust.quality'), desc: t('trust.qualityDesc'), bg: 'bg-rose-light/30' },
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
