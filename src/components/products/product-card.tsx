'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Product } from '@/types';
import { formatPrice, getDiscountPercentage } from '@/lib/utils';
import { Heart } from 'lucide-react';

export function ProductCard({ product }: { product: Product }) {
  const locale = useLocale() as 'en' | 'fr';
  const t = useTranslations('common');

  return (
    <Link href={`/products/${product.id}`} className="group block">
      <div className="relative aspect-[3/4] bg-gradient-to-b from-soft-lilac/50 to-soft-pink/40 rounded-3xl overflow-hidden mb-3">
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name[locale]}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-navy/10 text-sm group-hover:scale-105 transition-transform duration-700 ease-out">
            <span className="font-[var(--font-heading)] text-base px-4 text-center italic">{product.name[locale]}</span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.originalPrice && (
            <span className="bg-rose text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
              -{getDiscountPercentage(product.originalPrice, product.price)}%
            </span>
          )}
          {product.bestSeller && (
            <span className="bg-mauve text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
              <Heart size={8} className="fill-white" /> Best
            </span>
          )}
        </div>

        {!product.inStock && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-[3px] flex items-center justify-center">
            <span className="bg-white text-navy/60 text-xs font-medium px-4 py-2 rounded-full shadow-sm">{t('outOfStock')}</span>
          </div>
        )}
      </div>

      <h3 className="font-medium text-[13px] group-hover:text-rose transition-colors">{product.name[locale]}</h3>
      <div className="flex items-center gap-2 mt-0.5">
        <span className="font-semibold text-sm">{formatPrice(product.price)}</span>
        {product.originalPrice && (
          <span className="text-navy/50 text-xs line-through">{formatPrice(product.originalPrice)}</span>
        )}
      </div>

      <div className="flex gap-1 mt-2">
        {product.colors.map((c) => (
          <span
            key={c.hex}
            className="w-3 h-3 rounded-full border border-white shadow-sm"
            style={{ backgroundColor: c.hex }}
          />
        ))}
      </div>
    </Link>
  );
}
