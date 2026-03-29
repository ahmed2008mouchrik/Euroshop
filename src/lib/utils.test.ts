import { describe, it, expect } from 'vitest';
import { cn, formatPrice, generateOrderNumber, getDiscountPercentage } from './utils';

describe('cn', () => {
  it('joins truthy class names', () => {
    expect(cn('a', 'b', 'c')).toBe('a b c');
  });

  it('filters out falsy values', () => {
    expect(cn('a', false, null, undefined, 'b')).toBe('a b');
  });

  it('returns empty string when all falsy', () => {
    expect(cn(false, null, undefined)).toBe('');
  });
});

describe('formatPrice', () => {
  it('formats price in EUR with French locale', () => {
    const result = formatPrice(29.99);
    expect(result).toContain('29,99');
    expect(result).toContain('€');
  });

  it('formats zero', () => {
    const result = formatPrice(0);
    expect(result).toContain('0,00');
  });

  it('formats large numbers', () => {
    const result = formatPrice(1234.5);
    expect(result).toContain('€');
  });
});

describe('generateOrderNumber', () => {
  it('starts with ES-', () => {
    expect(generateOrderNumber()).toMatch(/^ES-/);
  });

  it('generates unique numbers', () => {
    const a = generateOrderNumber();
    const b = generateOrderNumber();
    expect(a).not.toBe(b);
  });

  it('contains only uppercase alphanumeric and hyphens', () => {
    const order = generateOrderNumber();
    expect(order).toMatch(/^ES-[A-Z0-9]+-[A-Z0-9]+$/);
  });
});

describe('getDiscountPercentage', () => {
  it('calculates correct percentage', () => {
    expect(getDiscountPercentage(100, 75)).toBe(25);
  });

  it('rounds to nearest integer', () => {
    expect(getDiscountPercentage(100, 33)).toBe(67);
  });

  it('returns 0 when original is 0', () => {
    expect(getDiscountPercentage(0, 50)).toBe(0);
  });

  it('returns 100 when current is 0', () => {
    expect(getDiscountPercentage(100, 0)).toBe(100);
  });

  it('returns 0 when prices are equal', () => {
    expect(getDiscountPercentage(50, 50)).toBe(0);
  });
});
