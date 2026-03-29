import { describe, it, expect } from 'vitest';

// Test the validateProduct logic extracted from the route
const VALID_CATEGORIES = ['vetements', 'decorations', 'cosmetiques'] as const;

interface ValidationError {
  field: string;
  message: string;
}

function validateProduct(product: Record<string, unknown>): ValidationError[] {
  const errors: ValidationError[] = [];

  if (typeof product.id !== 'string' || (product.id as string).trim().length === 0) {
    errors.push({ field: 'id', message: 'id is required and must be a non-empty string' });
  }

  const name = product.name as Record<string, unknown> | undefined;
  if (!name || typeof name.en !== 'string' || name.en.trim().length === 0) {
    errors.push({ field: 'name.en', message: 'name.en is required and must be a non-empty string' });
  }
  if (!name || typeof name.fr !== 'string' || name.fr.trim().length === 0) {
    errors.push({ field: 'name.fr', message: 'name.fr is required and must be a non-empty string' });
  }

  if (typeof product.price !== 'number' || !isFinite(product.price) || product.price <= 0) {
    errors.push({ field: 'price', message: 'price is required and must be a positive number' });
  }

  if (
    typeof product.category !== 'string' ||
    !(VALID_CATEGORIES as readonly string[]).includes(product.category)
  ) {
    errors.push({
      field: 'category',
      message: `category must be one of: ${VALID_CATEGORIES.join(', ')}`,
    });
  }

  return errors;
}

describe('validateProduct', () => {
  const validProduct = {
    id: 'silk-dress',
    name: { en: 'Silk Dress', fr: 'Robe en Soie' },
    price: 29.99,
    category: 'vetements',
  };

  it('returns no errors for a valid product', () => {
    expect(validateProduct(validProduct)).toEqual([]);
  });

  it('rejects missing id', () => {
    const errors = validateProduct({ ...validProduct, id: undefined });
    expect(errors).toContainEqual(expect.objectContaining({ field: 'id' }));
  });

  it('rejects empty id', () => {
    const errors = validateProduct({ ...validProduct, id: '   ' });
    expect(errors).toContainEqual(expect.objectContaining({ field: 'id' }));
  });

  it('rejects missing name.en', () => {
    const errors = validateProduct({ ...validProduct, name: { fr: 'Robe' } });
    expect(errors).toContainEqual(expect.objectContaining({ field: 'name.en' }));
  });

  it('rejects missing name.fr', () => {
    const errors = validateProduct({ ...validProduct, name: { en: 'Dress' } });
    expect(errors).toContainEqual(expect.objectContaining({ field: 'name.fr' }));
  });

  it('rejects missing price', () => {
    const errors = validateProduct({ ...validProduct, price: undefined });
    expect(errors).toContainEqual(expect.objectContaining({ field: 'price' }));
  });

  it('rejects zero price', () => {
    const errors = validateProduct({ ...validProduct, price: 0 });
    expect(errors).toContainEqual(expect.objectContaining({ field: 'price' }));
  });

  it('rejects negative price', () => {
    const errors = validateProduct({ ...validProduct, price: -10 });
    expect(errors).toContainEqual(expect.objectContaining({ field: 'price' }));
  });

  it('rejects Infinity price', () => {
    const errors = validateProduct({ ...validProduct, price: Infinity });
    expect(errors).toContainEqual(expect.objectContaining({ field: 'price' }));
  });

  it('rejects NaN price', () => {
    const errors = validateProduct({ ...validProduct, price: NaN });
    expect(errors).toContainEqual(expect.objectContaining({ field: 'price' }));
  });

  it('rejects invalid category', () => {
    const errors = validateProduct({ ...validProduct, category: 'electronics' });
    expect(errors).toContainEqual(expect.objectContaining({ field: 'category' }));
  });

  it('accepts all valid categories', () => {
    for (const cat of VALID_CATEGORIES) {
      expect(validateProduct({ ...validProduct, category: cat })).toEqual([]);
    }
  });

  it('returns multiple errors at once', () => {
    const errors = validateProduct({});
    expect(errors.length).toBeGreaterThanOrEqual(4);
  });
});
