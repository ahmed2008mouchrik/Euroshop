import { describe, it, expect } from 'vitest';
import { categories } from '../categories';

describe('categories', () => {
  it('has 3 categories', () => {
    expect(categories).toHaveLength(3);
  });

  it('each category has required fields', () => {
    categories.forEach((cat) => {
      expect(cat.id).toBeTruthy();
      expect(cat.name.en).toBeTruthy();
      expect(cat.name.fr).toBeTruthy();
      expect(cat.slug).toBeTruthy();
    });
  });

  it('slugs are unique', () => {
    const slugs = categories.map((c) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('includes expected categories', () => {
    const slugs = categories.map((c) => c.slug);
    expect(slugs).toContain('vetements');
    expect(slugs).toContain('decorations');
    expect(slugs).toContain('cosmetiques');
  });
});
