'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { useCart } from '@/context/cart-context';
import { ShoppingBag, Menu, X, Globe, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function Header() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const { itemCount, openCart } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { href: '/', label: t('home') },
    { href: '/products', label: t('products') },
    { href: '/about', label: t('about') },
    { href: '/contact', label: t('contact') },
  ];

  const switchLocale = () => {
    const next = locale === 'en' ? 'fr' : 'en';
    router.replace(pathname, { locale: next });
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-cloud/90 backdrop-blur-lg border-b border-rose-light/30">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 h-16 lg:h-[72px]">
          {/* Logo */}
          <Link href="/" className="font-[var(--font-heading)] text-2xl lg:text-[28px] font-bold text-navy tracking-tight">
            Euro<span className="text-rose">shop</span>
            <Heart size={10} className="inline-block ml-0.5 -mt-3 text-rose fill-rose" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[13px] font-medium uppercase tracking-widest transition-colors hover:text-rose ${
                  pathname === link.href ? 'text-rose' : 'text-navy/50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button onClick={switchLocale} className="p-2 text-navy/65 hover:text-rose transition-colors text-xs font-semibold uppercase tracking-wider">
              {locale === 'en' ? 'FR' : 'EN'}
            </button>

            <button onClick={openCart} className="relative p-2 text-navy/50 hover:text-rose transition-colors" aria-label="Cart">
              <ShoppingBag size={20} strokeWidth={1.5} />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-rose text-white text-[10px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>

            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-navy/50" aria-label="Menu">
              {mobileOpen ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden border-t border-rose-light/30 bg-cloud"
            >
              <div className="px-4 py-5 space-y-1">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`block text-sm font-medium uppercase tracking-widest py-2.5 ${
                      pathname === link.href ? 'text-rose' : 'text-navy/60'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
