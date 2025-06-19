import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import {
  productSchema,
  contactSchema,
  newsletterSchema,
  cartItemSchema,
} from "@shared/schema";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Missing required Stripe secret: STRIPE_SECRET_KEY");
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

// Add session type to express request
declare module "express-serve-static-core" {
  interface Request {
    session: {
      cartId?: number;
      [key: string]: any;
    };
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Products API
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getAllProducts();
      res.json(products);
    } catch (error) {
      console.error("Error getting products:", error);
      res.status(500).json({ message: "Failed to get products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
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

  app.put("/api/products/:id/visibility", async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const { isVisible } = req.body; // Expecting { isVisible: boolean }

      if (typeof isVisible !== "boolean") {
        return res
          .status(400)
          .json({
            message: "Invalid 'isVisible' value. Must be true or false.",
          });
      }

      const [updatedProduct] = await db
        .update(products)
        .set({ isVisible: isVisible })
        .where(eq(products.id, productId))
        .returning();

      if (!updatedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.json({
        message: `Product ${productId} visibility updated to ${isVisible}`,
        product: updatedProduct,
      });
    } catch (error) {
      console.error("Error updating product visibility:", error);
      res.status(500).json({ message: "Failed to update product visibility" });
    }
  });

  // Contact form submissions
  app.post("/api/contact", async (req, res) => {
    try {
      const contactData = contactSchema.parse(req.body);
      const contact = await storage.createContactMessage(contactData);
      res.status(201).json(contact);
    } catch (error) {
      console.error("Error creating contact message:", error);
      res.status(400).json({ message: "Invalid contact data" });
    }
  });

  // Newsletter subscriptions
  app.post("/api/newsletter/subscribe", async (req, res) => {
    try {
      const subscriptionData = newsletterSchema.parse(req.body);

      // Check if email already exists
      const existingSubscription =
        await storage.getNewsletterSubscriptionByEmail(subscriptionData.email);
      if (existingSubscription) {
        return res.status(400).json({ message: "Email already subscribed" });
      }

      const subscription = await storage.createNewsletterSubscription(
        subscriptionData
      );
      res.status(201).json(subscription);
    } catch (error) {
      console.error("Error creating newsletter subscription:", error);
      res.status(400).json({ message: "Invalid subscription data" });
    }
  });

  // Shopping cart
  app.get("/api/cart", async (req, res) => {
    res.setHeader(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, private"
    );
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    try {
      // Clear invalid cart IDs from previous sessions
      if (req.session.cartId && typeof req.session.cartId !== "number") {
        delete req.session.cartId;
      }

      const cartId = req.session?.cartId;

      if (!cartId) {
        // Return an empty cart if no cart exists yet
        return res.status(200).json({ id: 0, items: [], total: 0 });
      }

      try {
        const cart = await storage.getCart(cartId);

        if (!cart) {
          // Return an empty cart if the stored cart doesn't exist
          return res.status(200).json({ id: cartId, items: [], total: 0 });
        }

        res.status(200).json(cart);
      } catch (dbError) {
        console.error("Database error getting cart:", dbError);
        // If there's a database error, remove the problematic cart ID and return empty cart
        delete req.session.cartId;
        return res.status(200).json({ id: 0, items: [], total: 0 });
      }
    } catch (error) {
      console.error("Error getting cart:", error);
      // Return empty cart on error instead of error message to improve UX
      res.status(500).json({ message: "Failed to get cart" });
    }
  });

  // Stripe payment route for one-time payments
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { amount, cartId } = req.body;

      if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid amount" });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount), // Amount in cents
        currency: "usd",
        metadata: {
          cartId: cartId?.toString() || "unknown",
        },
      });

      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      console.error("Stripe payment intent error:", error);
      res.status(500).json({
        message: "Error creating payment intent: " + error.message,
      });
      res.status(200).json({ id: 0, items: [], total: 0 });
    }
  });

  app.post("/api/cart/add", async (req, res) => {
    try {
      const { productId } = cartItemSchema.parse(req.body);

      if (req.session.cartId && typeof req.session.cartId !== "number") {
        console.log("Deleting invalid session.cartId:", req.session.cartId);
        delete req.session.cartId;
      }

      let currentCartId = req.session?.cartId;
      let isNewSessionCart = false;

      if (!currentCartId) {
        currentCartId = Math.floor(Math.random() * 10000);
        req.session.cartId = currentCartId; // Assign to session
        isNewSessionCart = true;
        console.log(
          `New cartId ${currentCartId} assigned to req.session.cartId`
        );
      } else {
        console.log(
          `Existing cartId ${currentCartId} found in req.session.cartId`
        );
      }

      // Log the entire session object just before potential save
      console.log(
        "req.session BEFORE save attempt:",
        JSON.stringify(req.session)
      );
      console.log("Cart ID for operation:", currentCartId);

      const product = await storage.getProductById(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      try {
        const cartItem = await storage.addToCart(currentCartId, productId);

        if (isNewSessionCart) {
          console.log(
            "Attempting to save NEW session:",
            JSON.stringify(req.session)
          );
          req.session.save((err) => {
            if (err) {
              console.error("Error saving new session:", err);
            } else {
              // Log the session object AGAIN from within the callback to see if it still has cartId
              console.log(
                "NEW session saved successfully. req.session in save callback:",
                JSON.stringify(req.session)
              );
            }
            res.status(201).json(cartItem);
          });
        } else {
          // For existing sessions, the middleware usually auto-saves if modified.
          // Let's log it too to see its state before response.
          console.log(
            "EXISTING session (modified with item). req.session before response:",
            JSON.stringify(req.session)
          );
          res.status(201).json(cartItem);
        }
      } catch (dbError) {
        console.error("Database error adding to cart:", dbError); // [cite: 113]
        res
          .status(400)
          .json({ message: "Could not add to cart. Database error." }); // [cite: 114]
      }
    } catch (error) {
      console.error("Error adding to cart:", error); // [cite: 115]
      // Check if error is from Zod parsing
      if (error.errors) {
        // Zod errors have an 'errors' property
        return res
          .status(400)
          .json({ message: "Invalid product data", details: error.errors });
      }
      res.status(400).json({ message: "Invalid cart data" }); // [cite: 116]
    }
  });

  app.delete("/api/cart/remove/:itemId", async (req, res) => {
    try {
      // Clear invalid cart IDs from previous sessions
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

  const httpServer = createServer(app);
  return httpServer;
}
