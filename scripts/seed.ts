import { MongoClient } from 'mongodb';
import { readFileSync } from 'fs';
import { join } from 'path';

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI environment variable is not set');
    process.exit(1);
  }

  const productsPath = join(process.cwd(), 'data', 'products.json');
  const products = JSON.parse(readFileSync(productsPath, 'utf-8'));

  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('euroshop');
    const collection = db.collection('products');

    await collection.drop().catch(() => {}); // ignore if doesn't exist
    await collection.insertMany(products);
    await collection.createIndex({ id: 1 }, { unique: true });
    await collection.createIndex({ category: 1 });

    console.log(`Seeded ${products.length} products into MongoDB`);
  } finally {
    await client.close();
  }
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
