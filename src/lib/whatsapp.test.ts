import { describe, it, expect, vi, beforeEach } from 'vitest';
import { buildWhatsAppLink } from './whatsapp';
import { CartItem, OrderFormData } from '@/types';

const mockCustomer: OrderFormData = {
  firstName: 'Sara',
  lastName: 'Alami',
  email: 'sara@test.com',
  phone: '+212600000000',
  city: 'Casablanca',
  address: '123 Rue Example',
  notes: '',
};

const mockItem: CartItem = {
  product: {
    id: 'silk-dress',
    name: { en: 'Silk Dress', fr: 'Robe en Soie' },
    description: { en: 'A nice dress', fr: 'Une belle robe' },
    price: 29.99,
    images: [],
    category: 'vetements',
    sizes: ['S', 'M', 'L'],
    colors: [{ name: 'Rose', hex: '#FFB6C1' }],
    inStock: true,
    stockCount: 10,
    featured: false,
    bestSeller: false,
    tags: [],
  },
  quantity: 2,
  selectedSize: 'M',
  selectedColor: 'Rose',
};

beforeEach(() => {
  vi.stubEnv('NEXT_PUBLIC_WHATSAPP_NUMBER', '212600000000');
});

describe('buildWhatsAppLink', () => {
  it('returns a wa.me URL', () => {
    const link = buildWhatsAppLink([mockItem], mockCustomer, 'ES-TEST-001', 59.98);
    expect(link).toContain('https://wa.me/');
  });

  it('includes the phone number', () => {
    const link = buildWhatsAppLink([mockItem], mockCustomer, 'ES-TEST-001', 59.98);
    expect(link).toContain('212600000000');
  });

  it('includes order number in message', () => {
    const link = buildWhatsAppLink([mockItem], mockCustomer, 'ES-TEST-001', 59.98);
    const decoded = decodeURIComponent(link);
    expect(decoded).toContain('ES-TEST-001');
  });

  it('includes customer name', () => {
    const link = buildWhatsAppLink([mockItem], mockCustomer, 'ES-TEST-001', 59.98);
    const decoded = decodeURIComponent(link);
    expect(decoded).toContain('Sara Alami');
  });

  it('includes product details', () => {
    const link = buildWhatsAppLink([mockItem], mockCustomer, 'ES-TEST-001', 59.98);
    const decoded = decodeURIComponent(link);
    expect(decoded).toContain('Silk Dress');
    expect(decoded).toContain('M/Rose');
    expect(decoded).toContain('x2');
  });

  it('includes notes when provided', () => {
    const customerWithNotes = { ...mockCustomer, notes: 'Gift wrap please' };
    const link = buildWhatsAppLink([mockItem], customerWithNotes, 'ES-TEST-001', 59.98);
    const decoded = decodeURIComponent(link);
    expect(decoded).toContain('Gift wrap please');
  });

  it('excludes notes section when empty', () => {
    const link = buildWhatsAppLink([mockItem], mockCustomer, 'ES-TEST-001', 59.98);
    const decoded = decodeURIComponent(link);
    expect(decoded).not.toContain('Notes');
  });
});
