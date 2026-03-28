import { describe, it, expect, vi, beforeEach } from 'vitest';
import { sendOrderEmail, sendContactEmail } from '../email';
import { CartItem, OrderFormData } from '@/types';

vi.mock('@emailjs/browser', () => ({
  default: {
    send: vi.fn(),
  },
}));

import emailjs from '@emailjs/browser';

const mockCustomer: OrderFormData = {
  firstName: 'Jane',
  lastName: 'Doe',
  email: 'jane@example.com',
  phone: '+212600000000',
  city: 'Rabat',
  address: '456 Test Ave',
  notes: 'Test note',
};

const mockItem: CartItem = {
  product: {
    id: 'p1',
    name: { en: 'Test Dress', fr: 'Robe Test' },
    description: { en: 'A dress', fr: 'Une robe' },
    price: 49.99,
    images: [],
    category: 'vetements',
    sizes: ['S'],
    colors: [{ name: 'Blue', hex: '#0000FF' }],
    inStock: true,
    stockCount: 5,
    featured: false,
    bestSeller: false,
    tags: [],
  },
  quantity: 1,
  selectedSize: 'S',
  selectedColor: 'Blue',
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('sendOrderEmail', () => {
  it('returns true on success', async () => {
    vi.mocked(emailjs.send).mockResolvedValueOnce({ status: 200, text: 'OK' });
    const result = await sendOrderEmail([mockItem], mockCustomer, 'ES-123', 49.99);
    expect(result).toBe(true);
  });

  it('returns false on error', async () => {
    vi.mocked(emailjs.send).mockRejectedValueOnce(new Error('Network error'));
    const result = await sendOrderEmail([mockItem], mockCustomer, 'ES-123', 49.99);
    expect(result).toBe(false);
  });

  it('calls emailjs.send with correct params', async () => {
    vi.mocked(emailjs.send).mockResolvedValueOnce({ status: 200, text: 'OK' });
    await sendOrderEmail([mockItem], mockCustomer, 'ES-ORDER-123', 49.99);

    expect(emailjs.send).toHaveBeenCalledTimes(1);
    const params = vi.mocked(emailjs.send).mock.calls[0][2];
    expect(params).toMatchObject({
      order_number: 'ES-ORDER-123',
      customer_name: 'Jane Doe',
      customer_phone: '+212600000000',
    });
  });
});

describe('sendContactEmail', () => {
  it('returns true on success', async () => {
    vi.mocked(emailjs.send).mockResolvedValueOnce({ status: 200, text: 'OK' });
    const result = await sendContactEmail({
      name: 'Test',
      email: 'test@test.com',
      subject: 'Hello',
      message: 'Test message',
    });
    expect(result).toBe(true);
  });

  it('returns false on error', async () => {
    vi.mocked(emailjs.send).mockRejectedValueOnce(new Error('Fail'));
    const result = await sendContactEmail({
      name: 'Test',
      email: 'test@test.com',
      subject: 'Hello',
      message: 'Test message',
    });
    expect(result).toBe(false);
  });
});
