import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Product } from '@/types';

const PRODUCTS_FILE = path.join(process.cwd(), 'data', 'products.json');
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'euroshop2024';

function readProducts(): Product[] {
  const data = fs.readFileSync(PRODUCTS_FILE, 'utf-8');
  return JSON.parse(data);
}

function writeProducts(products: Product[]) {
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf-8');
}

function checkAuth(req: NextRequest): boolean {
  const auth = req.headers.get('authorization');
  return auth === `Bearer ${ADMIN_PASSWORD}`;
}

// GET — list all products
export async function GET() {
  const products = readProducts();
  return NextResponse.json(products);
}

// POST — add a new product
export async function POST(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const product: Product = await req.json();

  if (!product.id || !product.name?.en || !product.price) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const products = readProducts();

  if (products.find((p) => p.id === product.id)) {
    return NextResponse.json({ error: 'Product ID already exists' }, { status: 409 });
  }

  products.push(product);
  writeProducts(products);

  return NextResponse.json(product, { status: 201 });
}

// PUT — update a product
export async function PUT(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const updated: Product = await req.json();
  const products = readProducts();
  const index = products.findIndex((p) => p.id === updated.id);

  if (index === -1) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  products[index] = updated;
  writeProducts(products);

  return NextResponse.json(updated);
}

// DELETE — remove a product
export async function DELETE(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await req.json();
  const products = readProducts();
  const filtered = products.filter((p) => p.id !== id);

  if (filtered.length === products.length) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  writeProducts(filtered);

  return NextResponse.json({ success: true });
}
