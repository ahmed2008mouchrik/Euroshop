export interface Product {
  id: string;
  name: { en: string; fr: string };
  description: { en: string; fr: string };
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  sizes: string[];
  colors: { name: string; hex: string }[];
  inStock: boolean;
  stockCount: number;
  featured: boolean;
  bestSeller: boolean;
  tags: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

export interface OrderFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  notes: string;
}

export interface OrderPayload {
  orderNumber: string;
  items: CartItem[];
  customer: OrderFormData;
  subtotal: number;
  createdAt: string;
}

export interface Category {
  id: string;
  name: { en: string; fr: string };
  description: { en: string; fr: string };
  image: string;
  slug: string;
}
