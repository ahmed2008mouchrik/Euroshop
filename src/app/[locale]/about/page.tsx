'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Award, Users, Tag, Sparkles } from 'lucide-react';

export default function AboutPage() {
  const t = useTranslations('about');

  const values = [
    { icon: Award, title: t('value1'), desc: t('value1Desc'), bg: 'bg-rose-light/30' },
    { icon: Users, title: t('value2'), desc: t('value2Desc'), bg: 'bg-lavender/40' },
    { icon: Tag, title: t('value3'), desc: t('value3Desc'), bg: 'bg-peach/40' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-14 lg:py-24">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-1.5 text-rose mb-4">
          <Sparkles size={12} />
          <span className="font-script text-lg">Our Story</span>
        </div>
        <h1 className="font-[var(--font-heading)] text-4xl md:text-5xl font-bold italic">{t('title')}</h1>
        <p className="text-navy/35 mt-3 text-lg font-light">{t('subtitle')}</p>
      </div>

      {/* Story */}
      <section className="mb-16">
        <h2 className="font-[var(--font-heading)] text-2xl font-bold mb-4 italic">{t('storyTitle')}</h2>
        <p className="text-navy/45 leading-relaxed font-light">{t('storyText')}</p>
      </section>

      {/* Mission */}
      <section className="mb-16 bg-gradient-to-br from-soft-pink via-lavender/50 to-soft-lilac rounded-[2rem] p-8 lg:p-14 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-rose/30 rounded-full blur-[80px]" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-mauve/30 rounded-full blur-[60px]" />
        <div className="relative">
          <h2 className="font-[var(--font-heading)] text-2xl font-bold mb-4 italic">{t('missionTitle')}</h2>
          <p className="text-navy/40 leading-relaxed font-light">{t('missionText')}</p>
        </div>
      </section>

      {/* Values */}
      <section className="mb-16">
        <h2 className="font-[var(--font-heading)] text-2xl font-bold text-center mb-12 italic">{t('valuesTitle')}</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {values.map((v) => (
            <div key={v.title} className="text-center bg-white p-8 rounded-3xl shadow-pink">
              <div className={`w-14 h-14 ${v.bg} rounded-2xl flex items-center justify-center mx-auto mb-5`}>
                <v.icon size={22} className="text-rose/50" strokeWidth={1.5} />
              </div>
              <h3 className="font-semibold text-sm mb-2">{v.title}</h3>
              <p className="text-xs text-navy/35 leading-relaxed font-light">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center bg-gradient-to-br from-soft-pink/40 to-lavender/30 rounded-[2rem] p-12">
        <h2 className="font-[var(--font-heading)] text-2xl font-bold mb-3 italic">{t('ctaTitle')}</h2>
        <p className="text-navy/35 mb-8 font-light">{t('ctaText')}</p>
        <Link href="/products" className="inline-block bg-gradient-to-r from-rose to-mauve text-white px-10 py-3.5 rounded-full font-semibold hover:opacity-90 transition-opacity shadow-xl shadow-rose/15">
          {t('ctaButton')}
        </Link>
      </section>
    </div>
  );
}
