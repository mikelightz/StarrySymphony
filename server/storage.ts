import {
  type User,
  type InsertUser,
  type Product,
  type InsertProduct,
  type NewsletterSubscription,
  type InsertNewsletterSubscription,
  type ContactMessage,
  type InsertContactMessage,
  type CartItem,
  type InsertCartItem,
  users,
  products,
  cartItems,
  carts,
  newsletterSubscriptions,
  contactMessages,
} from "@shared/schema";
import { eq, and, inArray } from "drizzle-orm";
import { db } from "./db";
import "dotenv/config";

// Interface for storage operations
export interface IStorage {
  // User operations (from original)
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Product operations
  getAllProducts(): Promise<Product[]>;
  getProductById(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;

  // Cart operations
  getCart(cartId: number): Promise<
    | {
        id: number;
        items: Array<{
          id: number;
          productId: number;
          productName: string;
          price: number;
          quantity: number;
          type: string;
        }>;
        total: number;
      }
    | undefined
  >;
  addToCart(
    cartId: number,
    productId: number,
    quantity?: number
  ): Promise<CartItem>;
  removeFromCart(cartId: number, itemId: number): Promise<void>;
  clearCart(cartId: number): Promise<void>;

  // Newsletter operations
  getNewsletterSubscriptionByEmail(
    email: string
  ): Promise<NewsletterSubscription | undefined>;
  createNewsletterSubscription(
    subscription: InsertNewsletterSubscription
  ): Promise<NewsletterSubscription>;

  // Contact form operations
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  getAllContactMessages(): Promise<ContactMessage[]>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private products: Map<number, Product>;
  private carts: Map<number, Map<number, CartItem>>;
  private newsletterSubscriptions: Map<number, NewsletterSubscription>;
  private contactMessages: Map<number, ContactMessage>;
  private currentUserId: number;
  private currentProductId: number;
  private currentCartItemId: number;
  private currentNewsletterSubscriptionId: number;
  private currentContactMessageId: number;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.carts = new Map();
    this.newsletterSubscriptions = new Map();
    this.contactMessages = new Map();
    this.currentUserId = 1;
    this.currentProductId = 1;
    this.currentCartItemId = 1;
    this.currentNewsletterSubscriptionId = 1;
    this.currentContactMessageId = 1;

    // Add sample products
    this.seedProducts();
  }

  // User methods (keeping from original)
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Product methods
  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProductById(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.currentProductId++;
    const product: Product = { ...insertProduct, id };
    this.products.set(id, product);
    return product;
  }

  // Cart methods
  async getCart(cartId: number): Promise<
    | {
        id: number;
        items: Array<{
          id: number;
          productId: number;
          productName: string;
          price: number;
          quantity: number;
          type: string;
        }>;
        total: number;
      }
    | undefined
  > {
    const cartItems = this.carts.get(cartId);

    if (!cartItems || cartItems.size === 0) {
      return { id: cartId, items: [], total: 0 };
    }

    const items = Array.from(cartItems.values()).map((item) => {
      const product = this.products.get(item.productId);
      return {
        id: item.id,
        productId: item.productId,
        productName: product?.name || "Unknown Product",
        price: product?.price || 0,
        quantity: item.quantity,
        type: product?.type || "UNKNOWN",
      };
    });

    const total = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    return {
      id: cartId,
      items,
      total,
    };
  }

  async addToCart(
    cartId: number,
    productId: number,
    quantity: number = 1
  ): Promise<CartItem> {
    if (!this.carts.has(cartId)) {
      this.carts.set(cartId, new Map());
    }

    const cartItems = this.carts.get(cartId)!;

    // Check if product exists
    const product = this.products.get(productId);
    if (!product) {
      throw new Error("Product not found");
    }

    // Check if the item already exists in the cart
    const existingItem = Array.from(cartItems.values()).find(
      (item) => item.productId === productId
    );

    if (existingItem) {
      // Update quantity
      existingItem.quantity += quantity;
      cartItems.set(existingItem.id, existingItem);
      return existingItem;
    } else {
      // Add new item
      const id = this.currentCartItemId++;
      const cartItem: CartItem = {
        id,
        cartId,
        productId,
        quantity,
      };

      cartItems.set(id, cartItem);
      return cartItem;
    }
  }

  async removeFromCart(cartId: number, itemId: number): Promise<void> {
    const cartItems = this.carts.get(cartId);

    if (!cartItems) {
      throw new Error("Cart not found");
    }

    cartItems.delete(itemId);
  }

  async clearCart(cartId: number): Promise<void> {
    this.carts.delete(cartId);
  }

  // Newsletter methods
  async getNewsletterSubscriptionByEmail(
    email: string
  ): Promise<NewsletterSubscription | undefined> {
    return Array.from(this.newsletterSubscriptions.values()).find(
      (subscription) => subscription.email === email
    );
  }

  async createNewsletterSubscription(
    insertSubscription: InsertNewsletterSubscription
  ): Promise<NewsletterSubscription> {
    const id = this.currentNewsletterSubscriptionId++;
    const subscription: NewsletterSubscription = {
      ...insertSubscription,
      id,
      subscribedAt: new Date().toISOString(),
    };

    this.newsletterSubscriptions.set(id, subscription);
    return subscription;
  }

  // Contact form methods
  async createContactMessage(
    insertMessage: InsertContactMessage
  ): Promise<ContactMessage> {
    const id = this.currentContactMessageId++;
    const message: ContactMessage = {
      ...insertMessage,
      id,
      createdAt: new Date().toISOString(),
    };

    this.contactMessages.set(id, message);
    return message;
  }

  async getAllContactMessages(): Promise<ContactMessage[]> {
    return Array.from(this.contactMessages.values());
  }

  // Helper to seed initial data
  private seedProducts() {
    const products: InsertProduct[] = [
      {
        name: "Somatic Moon Journal",
        price: 27.0,
        type: "DIGITAL",
        description:
          "Our beautifully designed digital journal that combines lunar wisdom with somatic awareness practices. Includes fillable PDF pages, moon phase calendars, and embodiment exercises.",
        imageUrl:
          "https://images.unsplash.com/photo-1544967082-d9d25d867d66?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80",
      },
      {
        name: "Somatic Moon Journal",
        price: 45.0,
        type: "PRINT",
        description:
          "A beautifully crafted physical journal printed on premium recycled paper. Features guidance for each moon phase, somatic check-ins, and plenty of space for reflection.",
        imageUrl:
          "https://images.unsplash.com/photo-1577375729152-4c8b5fcda381?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80",
      },
      {
        name: "Moon Masterclass",
        price: 197.0,
        type: "COURSE",
        description:
          "A comprehensive online course to deepen your connection with lunar cycles. Includes 8 video modules, guided practices, and printable resources.",
        imageUrl:
          "https://images.unsplash.com/photo-1504805572947-34fad45aed93?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80",
      },
      {
        name: "Lunar Self-Care Bundle",
        price: 225.0,
        originalPrice: 269.0,
        type: "BUNDLE",
        description:
          "The complete lunar wellness package: Print journal, Moon Masterclass, and a 1:1 session to get personalized guidance for your journey.",
        imageUrl:
          "https://images.unsplash.com/photo-1501139083538-0139583c060f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80",
      },
    ];

    products.forEach((product) => {
      const id = this.currentProductId++;
      this.products.set(id, { ...product, id });
    });
  }
}

// Database Storage implementation
export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getAllProducts(): Promise<Product[]> {
    return db.select().from(products);
  }

  async getProductById(id: number): Promise<Product | undefined> {
    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.id, id));
    return product || undefined;
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db
      .insert(products)
      .values(insertProduct)
      .returning();
    return product;
  }

  async getCart(cartId: number): Promise<
    | {
        id: number;
        items: Array<{
          id: number;
          productId: number;
          productName: string;
          price: number;
          quantity: number;
          type: string;
        }>;
        total: number;
      }
    | undefined
  > {
    // Get cart details
    const [cart] = await db.select().from(carts).where(eq(carts.id, cartId));

    if (!cart) {
      return { id: cartId, items: [], total: 0 };
    }

    // Get all cart items
    const items = await db
      .select({
        id: cartItems.id,
        productId: cartItems.productId,
        quantity: cartItems.quantity,
      })
      .from(cartItems)
      .where(eq(cartItems.cartId, cartId));

    if (items.length === 0) {
      return { id: cartId, items: [], total: 0 };
    }

    // Get product details for each cart item
    const productIds = items.map((item) => item.productId);

    const productDetails = await db
      .select()
      .from(products)
      .where(inArray(products.id, productIds));

    // Map product details to cart items
    const cartProducts = items.map((item) => {
      const product = productDetails.find((p) => p.id === item.productId);
      return {
        id: item.id,
        productId: item.productId,
        productName: product?.name || "Unknown Product",
        price: product?.price || 0,
        quantity: item.quantity,
        type: product?.type || "UNKNOWN",
      };
    });

    // Calculate total
    const total = cartProducts.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    return {
      id: cartId,
      items: cartProducts,
      total,
    };
  }

  async addToCart(
    cartId: number,
    productId: number,
    quantity: number = 1
  ): Promise<CartItem> {
    // Check if product exists
    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.id, productId));

    if (!product) {
      throw new Error("Product not found");
    }

    // Check if cart exists
    let cart;
    const [existingCart] = await db
      .select()
      .from(carts)
      .where(eq(carts.id, cartId));

    if (!existingCart) {
      // Create new cart
      const [newCart] = await db
        .insert(carts)
        .values({ id: cartId })
        .returning();
      cart = newCart;
    } else {
      cart = existingCart;
    }

    // Check if item already exists in cart
    const [existingItem] = await db
      .select()
      .from(cartItems)
      .where(
        and(eq(cartItems.cartId, cartId), eq(cartItems.productId, productId))
      );

    if (existingItem) {
      // Update quantity
      const [updatedItem] = await db
        .update(cartItems)
        .set({ quantity: existingItem.quantity + quantity })
        .where(eq(cartItems.id, existingItem.id))
        .returning();
      return updatedItem;
    } else {
      // Add new item
      const [newItem] = await db
        .insert(cartItems)
        .values({
          cartId: cartId,
          productId: productId,
          quantity: quantity,
        })
        .returning();
      return newItem;
    }
  }

  async removeFromCart(cartId: number, itemId: number): Promise<void> {
    await db
      .delete(cartItems)
      .where(and(eq(cartItems.cartId, cartId), eq(cartItems.id, itemId)));
  }

  async clearCart(cartId: number): Promise<void> {
    await db.delete(cartItems).where(eq(cartItems.cartId, cartId));
  }

  async getNewsletterSubscriptionByEmail(
    email: string
  ): Promise<NewsletterSubscription | undefined> {
    const [subscription] = await db
      .select()
      .from(newsletterSubscriptions)
      .where(eq(newsletterSubscriptions.email, email));
    return subscription || undefined;
  }

  async createNewsletterSubscription(
    insertSubscription: InsertNewsletterSubscription
  ): Promise<NewsletterSubscription> {
    const [subscription] = await db
      .insert(newsletterSubscriptions)
      .values({
        ...insertSubscription,
        subscribedAt: new Date(),
      })
      .returning();
    return subscription;
  }

  async createContactMessage(
    insertMessage: InsertContactMessage
  ): Promise<ContactMessage> {
    const [message] = await db
      .insert(contactMessages)
      .values({
        ...insertMessage,
        createdAt: new Date(),
      })
      .returning();
    return message;
  }

  async getAllContactMessages(): Promise<ContactMessage[]> {
    return db.select().from(contactMessages);
  }
}

// Export a singleton instance
export const storage = new DatabaseStorage();
