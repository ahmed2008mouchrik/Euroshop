import { MongoClient, Collection } from 'mongodb';
import { Product } from '@/types';

const options = { maxPoolSize: 10 };

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

function getClientPromise(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI environment variable is not set');
  }

  if (process.env.NODE_ENV === 'development') {
    if (!globalThis._mongoClientPromise) {
      globalThis._mongoClientPromise = new MongoClient(uri, options).connect();
    }
    return globalThis._mongoClientPromise;
  }

  return new MongoClient(uri, options).connect();
}

export async function getProductsCollection(): Promise<Collection<Product>> {
  const client = await getClientPromise();
  return client.db('euroshop').collection<Product>('products');
}
