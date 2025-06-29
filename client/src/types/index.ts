// Product types
export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  type: 'DIGITAL' | 'PRINT' | 'COURSE' | 'BUNDLE';
  description: string;
  imageUrl: string;
}

// Cart types
export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  type: string;
}

export interface Cart {
  id: number;
  userId?: number;
  items: CartItem[];
  total: number;
}

// Newsletter types
export interface NewsletterSubscription {
  id: number;
  email: string;
  subscribedAt: string;
}

// Contact form types
export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}
