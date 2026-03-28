import { describe, it, expect } from 'vitest';
import { cn, formatPrice, generateOrderNumber, getDiscountPercentage } from '../utils';

describe('cn', () => {
  it('returns empty string with no args', () => {
    expect(cn()).toBe('');
  });

  it('returns single class', () => {
    expect(cn('foo')).toBe('foo');
  });

  it('joins multiple classes', () => {
    expect(cn('foo', 'bar', 'baz')).toBe('foo bar baz');
  });

  it('filters out falsy values', () => {
    expect(cn('foo', false, null, undefined, '', 'bar')).toBe('foo bar');
  });
});

describe('formatPrice', () => {
  it('formats as EUR currency', () => {
    const result = formatPrice(29.99);
    expect(result).toContain('29,99');
    expect(result).toContain('€');
  });

  it('handles zero', () => {
    const result = formatPrice(0);
    expect(result).toContain('0');
    expect(result).toContain('€');
  });

  it('handles whole numbers', () => {
    const result = formatPrice(100);
    expect(result).toContain('100');
  });
});

describe('generateOrderNumber', () => {
  it('matches ES-XXX-XXXX pattern', () => {
    const order = generateOrderNumber();
    expect(order).toMatch(/^ES-[A-Z0-9]+-[A-Z0-9]+$/);
  });

  it('generates unique numbers', () => {
    const a = generateOrderNumber();
    const b = generateOrderNumber();
    expect(a).not.toBe(b);
  });
});

describe('getDiscountPercentage', () => {
  it('calculates correct percentage', () => {
    expect(getDiscountPercentage(100, 80)).toBe(20);
  });

  it('returns 0 when prices are equal', () => {
    expect(getDiscountPercentage(50, 50)).toBe(0);
  });

  it('returns 0 when original is 0 (guard)', () => {
    expect(getDiscountPercentage(0, 10)).toBe(0);
  });

  it('rounds to nearest integer', () => {
    expect(getDiscountPercentage(100, 67)).toBe(33);
  });
});
