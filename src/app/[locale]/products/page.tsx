'use client';

import { useState, useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { products } from '@/data/products';
import { categories } from '@/data/categories';
import { ProductCard } from '@/components/products/product-card';

export default function ProductsPage() {
  const t = useTranslations();
  const locale = useLocale() as 'en' | 'fr';
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState('popular');

  const filtered = useMemo(() => {
    let result = activeCategory === 'all'
      ? products
      : products.filter((p) => p.category === activeCategory);

    switch (sortBy) {
      case 'price-low':
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case 'popular':
        result = [...result].sort((a, b) => (b.bestSeller ? 1 : 0) - (a.bestSeller ? 1 : 0));
        break;
    }
    return result;
  }, [activeCategory, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 lg:py-20">
      <div className="text-center mb-12">
        <span className="font-script text-rose-gold text-base">Collection</span>
        <h1 className="font-[var(--font-heading)] text-3xl md:text-4xl font-bold italic">{t('products.title')}</h1>
        <p className="text-navy/35 mt-2 font-light">{t('products.subtitle')}</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-5 py-2.5 rounded-full text-xs font-medium uppercase tracking-wider transition-all ${
              activeCategory === 'all' ? 'bg-gradient-to-r from-rose to-mauve text-white shadow-md shadow-rose/15' : 'bg-white text-navy/40 hover:text-navy/60 shadow-sm'
            }`}
          >
            {t('common.all')}
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.slug)}
              className={`px-5 py-2.5 rounded-full text-xs font-medium uppercase tracking-wider transition-all ${
                activeCategory === cat.slug ? 'bg-gradient-to-r from-rose to-mauve text-white shadow-md shadow-rose/15' : 'bg-white text-navy/40 hover:text-navy/60 shadow-sm'
              }`}
            >
              {cat.name[locale]}
            </button>
          ))}
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-white border-none rounded-full px-5 py-2.5 text-xs text-navy/50 shadow-sm focus:outline-none focus:ring-2 focus:ring-rose/30"
        >
          <option value="popular">{t('products.sortPopular')}</option>
          <option value="price-low">{t('products.sortPriceLow')}</option>
          <option value="price-high">{t('products.sortPriceHigh')}</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-navy/35 font-light">{t('products.noResults')}</p>
          <button
            onClick={() => setActiveCategory('all')}
            className="text-rose font-medium mt-3 text-sm hover:underline underline-offset-4"
          >
            {t('products.clearFilters')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
