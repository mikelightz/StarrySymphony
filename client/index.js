var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  cartItemSchema: () => cartItemSchema,
  cartItems: () => cartItems,
  carts: () => carts,
  contactMessages: () => contactMessages,
  contactSchema: () => contactSchema,
  insertUserSchema: () => insertUserSchema,
  newsletterSchema: () => newsletterSchema,
  newsletterSubscriptions: () => newsletterSubscriptions,
  productSchema: () => productSchema,
  products: () => products,
  users: () => users
});
import { pgTable, text, serial, integer, timestamp, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull()
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true
});
var products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  price: doublePrecision("price").notNull(),
  originalPrice: doublePrecision("original_price"),
  type: text("type").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull()
});
var productSchema = createInsertSchema(products);
var carts = pgTable("carts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  createdAt: timestamp("created_at").defaultNow()
});
var cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  cartId: integer("cart_id").notNull(),
  productId: integer("product_id").notNull(),
  quantity: integer("quantity").notNull().default(1)
});
var cartItemSchema = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().int().positive().default(1)
});
var newsletterSubscriptions = pgTable("newsletter_subscriptions", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  subscribedAt: timestamp("subscribed_at").defaultNow()
});
var newsletterSchema = z.object({
  email: z.string().email()
});
var contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});
var contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(1),
  message: z.string().min(10)
});

// server/storage.ts
import { eq, and, inArray } from "drizzle-orm";

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle({ client: pool, schema: schema_exports });

// server/storage.ts
var DatabaseStorage = class {
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || void 0;
  }
  async getUserByUsername(username) {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || void 0;
  }
  async createUser(insertUser) {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  async getAllProducts() {
    return db.select().from(products);
  }
  async getProductById(id) {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || void 0;
  }
  async createProduct(insertProduct) {
    const [product] = await db.insert(products).values(insertProduct).returning();
    return product;
  }
  async getCart(cartId) {
    const [cart] = await db.select().from(carts).where(eq(carts.id, cartId));
    if (!cart) {
      return { id: cartId, items: [], total: 0 };
    }
    const items = await db.select({
      id: cartItems.id,
      productId: cartItems.productId,
      quantity: cartItems.quantity
    }).from(cartItems).where(eq(cartItems.cartId, cartId));
    if (items.length === 0) {
      return { id: cartId, items: [], total: 0 };
    }
    const productIds = items.map((item) => item.productId);
    const productDetails = await db.select().from(products).where(inArray(products.id, productIds));
    const cartProducts = items.map((item) => {
      const product = productDetails.find((p) => p.id === item.productId);
      return {
        id: item.id,
        productId: item.productId,
        productName: product?.name || "Unknown Product",
        price: product?.price || 0,
        quantity: item.quantity,
        type: product?.type || "UNKNOWN"
      };
    });
    const total = cartProducts.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return {
      id: cartId,
      items: cartProducts,
      total
    };
  }
  async addToCart(cartId, productId, quantity = 1) {
    const [product] = await db.select().from(products).where(eq(products.id, productId));
    if (!product) {
      throw new Error("Product not found");
    }
    let cart;
    const [existingCart] = await db.select().from(carts).where(eq(carts.id, cartId));
    if (!existingCart) {
      const [newCart] = await db.insert(carts).values({ id: cartId }).returning();
      cart = newCart;
    } else {
      cart = existingCart;
    }
    const [existingItem] = await db.select().from(cartItems).where(and(
      eq(cartItems.cartId, cartId),
      eq(cartItems.productId, productId)
    ));
    if (existingItem) {
      const [updatedItem] = await db.update(cartItems).set({ quantity: existingItem.quantity + quantity }).where(eq(cartItems.id, existingItem.id)).returning();
      return updatedItem;
    } else {
      const [newItem] = await db.insert(cartItems).values({
        cartId,
        productId,
        quantity
      }).returning();
      return newItem;
    }
  }
  async removeFromCart(cartId, itemId) {
    await db.delete(cartItems).where(and(
      eq(cartItems.cartId, cartId),
      eq(cartItems.id, itemId)
    ));
  }
  async clearCart(cartId) {
    await db.delete(cartItems).where(eq(cartItems.cartId, cartId));
  }
  async getNewsletterSubscriptionByEmail(email) {
    const [subscription] = await db.select().from(newsletterSubscriptions).where(eq(newsletterSubscriptions.email, email));
    return subscription || void 0;
  }
  async createNewsletterSubscription(insertSubscription) {
    const [subscription] = await db.insert(newsletterSubscriptions).values({
      ...insertSubscription,
      subscribedAt: /* @__PURE__ */ new Date()
    }).returning();
    return subscription;
  }
  async createContactMessage(insertMessage) {
    const [message] = await db.insert(contactMessages).values({
      ...insertMessage,
      createdAt: /* @__PURE__ */ new Date()
    }).returning();
    return message;
  }
  async getAllContactMessages() {
    return db.select().from(contactMessages);
  }
};
var storage = new DatabaseStorage();

// server/routes.ts
async function registerRoutes(app2) {
  app2.get("/api/products", async (req, res) => {
    try {
      const products2 = await storage.getAllProducts();
      res.json(products2);
    } catch (error) {
      console.error("Error getting products:", error);
      res.status(500).json({ message: "Failed to get products" });
    }
  });
  app2.get("/api/products/:id", async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const product = await storage.getProductById(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error getting product:", error);
      res.status(500).json({ message: "Failed to get product" });
    }
  });
  app2.post("/api/contact", async (req, res) => {
    try {
      const contactData = contactSchema.parse(req.body);
      const contact = await storage.createContactMessage(contactData);
      res.status(201).json(contact);
    } catch (error) {
      console.error("Error creating contact message:", error);
      res.status(400).json({ message: "Invalid contact data" });
    }
  });
  app2.post("/api/newsletter/subscribe", async (req, res) => {
    try {
      const subscriptionData = newsletterSchema.parse(req.body);
      const existingSubscription = await storage.getNewsletterSubscriptionByEmail(subscriptionData.email);
      if (existingSubscription) {
        return res.status(400).json({ message: "Email already subscribed" });
      }
      const subscription = await storage.createNewsletterSubscription(subscriptionData);
      res.status(201).json(subscription);
    } catch (error) {
      console.error("Error creating newsletter subscription:", error);
      res.status(400).json({ message: "Invalid subscription data" });
    }
  });
  app2.get("/api/cart", async (req, res) => {
    try {
      if (req.session.cartId && typeof req.session.cartId !== "number") {
        delete req.session.cartId;
      }
      const cartId = req.session?.cartId;
      if (!cartId) {
        return res.status(200).json({ id: 0, items: [], total: 0 });
      }
      try {
        const cart = await storage.getCart(cartId);
        if (!cart) {
          return res.status(200).json({ id: cartId, items: [], total: 0 });
        }
        res.status(200).json(cart);
      } catch (dbError) {
        console.error("Database error getting cart:", dbError);
        delete req.session.cartId;
        return res.status(200).json({ id: 0, items: [], total: 0 });
      }
    } catch (error) {
      console.error("Error getting cart:", error);
      res.status(200).json({ id: 0, items: [], total: 0 });
    }
  });
  app2.post("/api/cart/add", async (req, res) => {
    try {
      const { productId } = cartItemSchema.parse(req.body);
      if (req.session.cartId && typeof req.session.cartId !== "number") {
        delete req.session.cartId;
      }
      const cartId = req.session?.cartId || Math.floor(Math.random() * 1e4);
      if (!req.session?.cartId) {
        req.session.cartId = cartId;
      }
      console.log("Cart ID:", cartId);
      const product = await storage.getProductById(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      try {
        const cartItem = await storage.addToCart(cartId, productId);
        res.status(201).json(cartItem);
      } catch (dbError) {
        console.error("Database error adding to cart:", dbError);
        res.status(400).json({ message: "Could not add to cart. Database error." });
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      res.status(400).json({ message: "Invalid cart data" });
    }
  });
  app2.delete("/api/cart/remove/:itemId", async (req, res) => {
    try {
      if (req.session.cartId && typeof req.session.cartId !== "number") {
        delete req.session.cartId;
        return res.status(400).json({ message: "Invalid cart session" });
      }
      const cartId = req.session?.cartId;
      if (!cartId) {
        return res.status(404).json({ message: "Cart not found" });
      }
      const itemId = parseInt(req.params.itemId, 10);
      if (isNaN(itemId)) {
        return res.status(400).json({ message: "Invalid item ID" });
      }
      try {
        await storage.removeFromCart(cartId, itemId);
        res.status(200).json({ message: "Item removed from cart" });
      } catch (dbError) {
        console.error("Database error removing from cart:", dbError);
        res.status(500).json({ message: "Could not remove from cart" });
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  app2.get("/api/cart", async (req, res) => {
    try {
      const cartId = req.session?.cartId;
      if (!cartId) {
        return res.json({ id: 0, items: [], total: 0 });
      }
      const cart = await storage.getCart(cartId);
      res.json(cart || { id: cartId, items: [], total: 0 });
    } catch (error) {
      console.error("Error getting cart:", error);
      res.status(500).json({ message: "Failed to get cart" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  // This means Vite's project root is <repo_root>/client
  build: {
    outDir: "public",
    // Changed: This will now be relative to the 'root'
    // So, the output will be <repo_root>/client/public/
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}

// server/index.ts
import session from "express-session";
import connectPgSimple from "connect-pg-simple";

// server/config.ts
var config = {
  // Use PORT provided by Heroku or default to 3000
  port: process.env.PORT || 3e3,
  // Database configuration
  database: {
    url: process.env.DATABASE_URL
  },
  // CORS configuration for production
  cors: {
    // Add your frontend URL when it's deployed to Netlify
    origin: process.env.NODE_ENV === "production" ? ["https://omflorwell.netlify.app"] : ["http://localhost:3000"],
    credentials: true
  },
  // Session configuration
  session: {
    secret: process.env.SESSION_SECRET || "dev-secret-key",
    cookie: {
      maxAge: 24 * 60 * 60 * 1e3,
      // 1 day
      secure: process.env.NODE_ENV === "production"
    }
  }
};

// server/index.ts
import cors from "cors";
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use(
  cors({
    origin: config.cors.origin,
    credentials: config.cors.credentials
  })
);
var PgSession = connectPgSimple(session);
app.use(
  session({
    store: new PgSession({
      pool,
      tableName: "session",
      createTableIfMissing: true
    }),
    secret: config.session.secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: config.session.cookie.maxAge,
      secure: config.session.cookie.secure
    }
  })
);
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  }
  const port = process.env.NODE_ENV === "production" ? config.port : 5e3;
  server.listen(
    {
      port,
      host: "0.0.0.0",
      reusePort: true
    },
    () => {
      log(`serving on port ${port}`);
    }
  );
})();
