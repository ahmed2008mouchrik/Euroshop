import { Category } from '@/types';

export const categories: Category[] = [
  {
    id: 'vetements',
    name: { en: 'Clothing', fr: 'Vêtements' },
    description: { en: 'Premium clothing collection', fr: 'Collection de vêtements premium' },
    image: '/images/category-vetements.jpg',
    slug: 'vetements',
  },
  {
    id: 'decorations',
    name: { en: 'Decorations', fr: 'Décorations' },
    description: { en: 'Elegant home decorations', fr: 'Décorations élégantes pour la maison' },
    image: '/images/category-decorations.jpg',
    slug: 'decorations',
  },
  {
    id: 'cosmetiques',
    name: { en: 'Cosmetics', fr: 'Cosmétiques' },
    description: { en: 'Beauty & skincare essentials', fr: 'Essentiels beauté & soins' },
    image: '/images/category-cosmetiques.jpg',
    slug: 'cosmetiques',
  },
];
