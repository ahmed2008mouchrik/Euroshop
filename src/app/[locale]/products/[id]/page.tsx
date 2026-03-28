'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { products } from '@/data/products';
import { useCart } from '@/context/cart-context';
import { formatPrice, getDiscountPercentage } from '@/lib/utils';
import { ProductCard } from '@/components/products/product-card';
import { ShoppingBag, Check, ArrowLeft, Heart, Sparkles } from 'lucide-react';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const t = useTranslations();
  const locale = useLocale() as 'en' | 'fr';
  const { addItem } = useCart();

  const product = products.find((p) => p.id === id);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="font-[var(--font-heading)] text-2xl font-bold italic">{t('notFound.title')}</h1>
        <Link href="/products" className="text-rose mt-4 inline-block hover:underline underline-offset-4">{t('common.backToHome')}</Link>
      </div>
    );
  }

  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleAdd = () => {
    if (!selectedSize || !selectedColor) return;
    addItem(product, selectedSize, selectedColor);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 lg:py-16">
      <Link href="/products" className="inline-flex items-center gap-1.5 text-xs text-navy/35 hover:text-rose mb-8 transition-colors uppercase tracking-widest font-medium">
        <ArrowLeft size={14} /> {t('nav.products')}
      </Link>

      <div className="grid lg:grid-cols-2 gap-10 lg:gap-20">
        {/* Image */}
        <div className="aspect-[3/4] bg-gradient-to-b from-soft-lilac/50 to-soft-pink/40 rounded-[2rem] flex items-center justify-center">
          <span className="text-navy/10 font-[var(--font-heading)] text-2xl px-8 text-center italic">{product.name[locale]}</span>
        </div>

        {/* Info */}
        <div className="flex flex-col py-4">
          {product.bestSeller && (
            <span className="inline-flex items-center gap-1 text-rose text-[11px] font-semibold uppercase tracking-widest mb-3">
              <Heart size={10} className="fill-rose" /> Best Seller
            </span>
          )}

          <h1 className="font-[var(--font-heading)] text-3xl md:text-4xl font-bold leading-tight italic">{product.name[locale]}</h1>

          <div className="flex items-center gap-3 mt-5">
            <span className="text-2xl font-bold">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <>
                <span className="text-navy/25 line-through text-sm">{formatPrice(product.originalPrice)}</span>
                <span className="bg-rose text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                  -{getDiscountPercentage(product.originalPrice, product.price)}%
                </span>
              </>
            )}
          </div>

          <p className="text-navy/45 mt-6 leading-relaxed font-light">{product.description[locale]}</p>

          {/* Stock */}
          <div className="mt-6">
            {product.inStock ? (
              <span className="text-green-500 text-xs font-medium flex items-center gap-1">
                <Sparkles size={10} /> {t('common.inStock')}{product.stockCount <= 5 && ` — ${t('common.onlyLeft', { count: product.stockCount })}`}
              </span>
            ) : (
              <span className="text-rose-dark text-xs font-medium">{t('common.outOfStock')}</span>
            )}
          </div>

          {/* Size */}
          <div className="mt-7">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-navy/40 mb-3">{t('common.size')}</p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-5 py-2.5 rounded-full text-xs font-medium transition-all ${
                    selectedSize === size
                      ? 'bg-gradient-to-r from-rose to-mauve text-white shadow-md shadow-rose/15'
                      : 'bg-blush text-navy/50 hover:bg-rose-light/40'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Color */}
          <div className="mt-7">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-navy/40 mb-3">{t('common.color')}</p>
            <div className="flex flex-wrap gap-3">
              {product.colors.map((color) => (
                <button
                  key={color.hex}
                  onClick={() => setSelectedColor(color.name)}
                  className={`w-10 h-10 rounded-full transition-all ${
                    selectedColor === color.name ? 'ring-2 ring-rose ring-offset-2 scale-110' : 'ring-1 ring-navy/5'
                  }`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
            </div>
            {selectedColor && <p className="text-[11px] text-navy/30 mt-2 font-light">{selectedColor}</p>}
          </div>

          {/* Add to cart */}
          <button
            onClick={handleAdd}
            disabled={!product.inStock || !selectedSize || !selectedColor}
            className={`mt-10 flex items-center justify-center gap-2 py-4 rounded-full font-semibold text-[15px] transition-all ${
              added
                ? 'bg-green-400 text-white shadow-lg shadow-green-400/20'
                : 'bg-gradient-to-r from-rose to-mauve text-white hover:opacity-90 shadow-xl shadow-rose/20 disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none'
            }`}
          >
            {added ? <><Check size={18} /> {t('products.addedToCart')}</> : <><ShoppingBag size={18} strokeWidth={1.5} /> {t('common.addToCart')}</>}
          </button>
          {(!selectedSize || !selectedColor) && product.inStock && (
            <p className="text-[11px] text-navy/25 mt-2 text-center font-light">
              {!selectedSize && t('products.selectSize')} {!selectedSize && !selectedColor && '·'} {!selectedColor && t('products.selectColor')}
            </p>
          )}
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-24">
          <h2 className="font-[var(--font-heading)] text-2xl font-bold mb-10 italic">{t('products.relatedProducts')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
