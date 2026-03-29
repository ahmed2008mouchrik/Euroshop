import { NextRequest, NextResponse } from 'next/server';
import { getProductsCollection } from '@/lib/mongodb';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'euroshop2024';

function checkAuth(req: NextRequest): boolean {
  const auth = req.headers.get('authorization');
  return auth === `Bearer ${ADMIN_PASSWORD}`;
}

// GET — list products with optional filters
export async function GET(req: NextRequest) {
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
}

// POST — add a new product
export async function POST(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const product = await req.json();

  if (!product.id || !product.name?.en || !product.price) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const collection = await getProductsCollection();

  const existing = await collection.findOne({ id: product.id });
  if (existing) {
    return NextResponse.json({ error: 'Product ID already exists' }, { status: 409 });
  }

  await collection.insertOne(product);
  return NextResponse.json(product, { status: 201 });
}

// PUT — update a product
export async function PUT(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const updated = await req.json();
  const collection = await getProductsCollection();
  const result = await collection.replaceOne({ id: updated.id }, updated);

  if (result.matchedCount === 0) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  return NextResponse.json(updated);
}

// DELETE — remove a product
export async function DELETE(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await req.json();
  const collection = await getProductsCollection();
  const result = await collection.deleteOne({ id });

  if (result.deletedCount === 0) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
