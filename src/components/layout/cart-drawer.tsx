'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useCart } from '@/context/cart-context';
import { X, Plus, Minus, Trash2, ShoppingBag, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatPrice } from '@/lib/utils';
import Image from 'next/image';

export function CartDrawer() {
  const t = useTranslations('cart');
  const tCommon = useTranslations('common');
  const locale = useLocale() as 'en' | 'fr';
  const { items, isOpen, closeCart, removeItem, updateQuantity, itemCount, subtotal } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-50 bg-rose-gold/20 backdrop-blur-sm"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-0 right-0 z-50 h-full w-full max-w-[380px] bg-cloud shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-rose-light/20">
              <h2 className="font-[var(--font-heading)] text-lg font-semibold flex items-center gap-2">
                <Sparkles size={16} className="text-rose" /> {t('title')}
              </h2>
              <button onClick={closeCart} className="p-1 text-navy/55 hover:text-rose transition-colors">
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 bg-lavender rounded-full flex items-center justify-center mb-5">
                  <ShoppingBag size={28} className="text-mauve" strokeWidth={1.5} />
                </div>
                <p className="font-medium text-navy/50">{t('empty')}</p>
                <p className="text-sm text-navy/55 mt-1">{t('emptyDesc')}</p>
                <Link
                  href="/products"
                  onClick={closeCart}
                  className="mt-6 bg-rose text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-rose-dark transition-colors"
                >
                  {t('continueShopping')}
                </Link>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {items.map((item) => (
                    <div key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`} className="flex gap-3 bg-warm-blush/60 rounded-2xl p-3">
                      <div className="w-16 h-16 bg-lavender/50 rounded-xl overflow-hidden flex-shrink-0 relative">
                        {item.product.images?.[0] ? (
                          <Image
                            src={item.product.images[0]}
                            alt={item.product.name[locale]}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-mauve/30 text-xs">IMG</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{item.product.name[locale]}</p>
                        <p className="text-[11px] text-navy/60 mt-0.5">
                          {item.selectedSize} &middot; {item.selectedColor}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.selectedSize, item.selectedColor, item.quantity - 1)}
                              className="w-6 h-6 rounded-full bg-white border border-rose-light/40 flex items-center justify-center hover:border-rose transition-colors"
                            >
                              <Minus size={10} />
                            </button>
                            <span className="text-xs font-semibold w-5 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.selectedSize, item.selectedColor, item.quantity + 1)}
                              className="w-6 h-6 rounded-full bg-white border border-rose-light/40 flex items-center justify-center hover:border-rose transition-colors"
                            >
                              <Plus size={10} />
                            </button>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold">{formatPrice(item.product.price * item.quantity)}</span>
                            <button
                              onClick={() => removeItem(item.product.id, item.selectedSize, item.selectedColor)}
                              className="text-navy/45 hover:text-rose-dark transition-colors"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-rose-light/20 p-5 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-navy/65">{t('subtotal')}</span>
                    <span className="font-semibold">{formatPrice(subtotal)}</span>
                  </div>
                  <Link
                    href="/order"
                    onClick={closeCart}
                    className="block w-full bg-gradient-to-r from-rose to-mauve text-white text-center py-3 rounded-full font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-rose/20"
                  >
                    {t('proceedToOrder')}
                  </Link>
                  <button
                    onClick={closeCart}
                    className="block w-full text-center text-xs text-navy/60 hover:text-navy/60 transition-colors"
                  >
                    {t('continueShopping')}
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
