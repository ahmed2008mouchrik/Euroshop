import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getProductsCollection } from '@/lib/mongodb';

const VALID_CATEGORIES = ['vetements', 'decorations', 'cosmetiques'] as const;

function getAdminPassword(): string {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    throw new Error('ADMIN_PASSWORD environment variable is not set');
  }
  return password;
}

function checkAuth(req: NextRequest): boolean {
  const auth = req.headers.get('authorization');
  if (!auth || !auth.startsWith('Bearer ')) {
    return false;
  }

  const receivedToken = auth.slice(7);
  const adminPassword = getAdminPassword();
  const expectedToken = crypto
    .createHmac('sha256', adminPassword)
    .update('euroshop-admin-token')
    .digest('hex');

  const expected = Buffer.from(expectedToken, 'utf-8');
  const received = Buffer.from(receivedToken, 'utf-8');

  if (expected.length !== received.length) {
    return false;
  }
  return crypto.timingSafeEqual(expected, received);
}

interface ValidationError {
  field: string;
  message: string;
}

function validateProduct(product: Record<string, unknown>): ValidationError[] {
  const errors: ValidationError[] = [];

  if (typeof product.id !== 'string' || product.id.trim().length === 0) {
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

// GET — list products with optional filters
export async function GET(req: NextRequest) {
  try {
    const collection = await getProductsCollection();
    const { searchParams } = req.nextUrl;

    const id = searchParams.get('id');
    if (id) {
      const product = await collection.findOne({ id }, { projection: { _id: 0 } });
      if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });
      return NextResponse.json(product);
    }

    const filter: Record<string, unknown> = {};
    const featured = searchParams.get('featured');
    const category = searchParams.get('category');

    if (featured === 'true') {
      filter.$or = [{ featured: true }, { bestSeller: true }];
    }
    if (category) {
      filter.category = category;
    }

    const products = await collection.find(filter, { projection: { _id: 0 } }).toArray();
    return NextResponse.json(products);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST — add a new product
export async function POST(req: NextRequest) {
  try {
    if (!checkAuth(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const product = await req.json();

    const validationErrors = validateProduct(product);
    if (validationErrors.length > 0) {
      return NextResponse.json({ error: 'Validation failed', details: validationErrors }, { status: 400 });
    }

    const collection = await getProductsCollection();

    const existing = await collection.findOne({ id: product.id });
    if (existing) {
      return NextResponse.json({ error: 'Product ID already exists' }, { status: 409 });
    }

    await collection.insertOne(product);
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// PUT — update a product
export async function PUT(req: NextRequest) {
  try {
    if (!checkAuth(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updated = await req.json();

    const validationErrors = validateProduct(updated);
    if (validationErrors.length > 0) {
      return NextResponse.json({ error: 'Validation failed', details: validationErrors }, { status: 400 });
    }

    const collection = await getProductsCollection();
    const result = await collection.replaceOne({ id: updated.id }, updated);

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE — remove a product
export async function DELETE(req: NextRequest) {
  try {
    if (!checkAuth(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await req.json();

    if (typeof id !== 'string' || id.trim().length === 0) {
      return NextResponse.json({ error: 'id is required and must be a non-empty string' }, { status: 400 });
    }

    const collection = await getProductsCollection();
    const result = await collection.deleteOne({ id });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
