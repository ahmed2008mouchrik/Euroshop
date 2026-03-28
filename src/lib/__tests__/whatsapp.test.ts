import { describe, it, expect, vi, beforeEach } from 'vitest';
import { buildWhatsAppLink } from '../whatsapp';
import { CartItem, OrderFormData } from '@/types';

const mockCustomer: OrderFormData = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  phone: '+212600000000',
  city: 'Casablanca',
  address: '123 Main St',
  notes: '',
};

const mockItem: CartItem = {
  product: {
    id: 'p1',
    name: { en: 'Test Shirt', fr: 'Chemise Test' },
    description: { en: 'A shirt', fr: 'Une chemise' },
    price: 29.99,
    images: [],
    category: 'vetements',
    sizes: ['M'],
    colors: [{ name: 'Red', hex: '#FF0000' }],
    inStock: true,
    stockCount: 10,
    featured: false,
    bestSeller: false,
    tags: [],
  },
  quantity: 2,
  selectedSize: 'M',
  selectedColor: 'Red',
};

describe('buildWhatsAppLink', () => {
  it('returns a valid wa.me URL', () => {
    const link = buildWhatsAppLink([mockItem], mockCustomer, 'ES-ABC-1234', 59.98);
    expect(link).toMatch(/^https:\/\/wa\.me\//);
  });

  it('includes order number in message', () => {
    const link = buildWhatsAppLink([mockItem], mockCustomer, 'ES-ABC-1234', 59.98);
    const decoded = decodeURIComponent(link);
    expect(decoded).toContain('ES-ABC-1234');
  });

  it('includes customer info', () => {
    const link = buildWhatsAppLink([mockItem], mockCustomer, 'ES-ABC-1234', 59.98);
    const decoded = decodeURIComponent(link);
    expect(decoded).toContain('John Doe');
    expect(decoded).toContain('+212600000000');
    expect(decoded).toContain('Casablanca');
  });

  it('includes item details', () => {
    const link = buildWhatsAppLink([mockItem], mockCustomer, 'ES-ABC-1234', 59.98);
    const decoded = decodeURIComponent(link);
    expect(decoded).toContain('Test Shirt');
    expect(decoded).toContain('M/Red');
    expect(decoded).toContain('x2');
  });

  it('includes notes when present', () => {
    const customerWithNotes = { ...mockCustomer, notes: 'Please gift wrap' };
    const link = buildWhatsAppLink([mockItem], customerWithNotes, 'ES-ABC-1234', 59.98);
    const decoded = decodeURIComponent(link);
    expect(decoded).toContain('Please gift wrap');
  });

  it('omits notes section when empty', () => {
    const link = buildWhatsAppLink([mockItem], mockCustomer, 'ES-ABC-1234', 59.98);
    const decoded = decodeURIComponent(link);
    expect(decoded).not.toContain('Notes');
  });
});
