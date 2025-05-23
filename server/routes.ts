import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  productSchema,
  contactSchema,
  newsletterSchema,
  cartItemSchema,
} from "@shared/schema";

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
      res.status(200).json({ id: 0, items: [], total: 0 });
    }
  });

  app.post("/api/cart/add", async (req, res) => {
    try {
      const { productId } = cartItemSchema.parse(req.body);

      // Clear invalid cart IDs from previous sessions
      if (req.session.cartId && typeof req.session.cartId !== "number") {
        delete req.session.cartId;
      }

      let currentCartId = req.session?.cartId; // Use a new variable to hold the cartId for the current operation
      let isNewSessionCart = false;

      if (!currentCartId) {
        currentCartId = Math.floor(Math.random() * 10000);
        req.session.cartId = currentCartId; // <<< CRITICAL: Assign the new cartId to the session object
        isNewSessionCart = true;
      }

      console.log("Cart ID for operation:", currentCartId); // This will be the cartId used.

      const product = await storage.getProductById(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" }); // [cite: 111]
      }

      try {
        const cartItem = await storage.addToCart(currentCartId, productId); // [cite: 112]

        if (isNewSessionCart) {
          // If it's a new cart, explicitly save the session *after* cartId has been set on req.session
          req.session.save((err) => {
            if (err) {
              console.error("Error saving new session:", err);
              // Decide if you want to send error here, but item is in DB
              // For now, we'll let the original response go through
            }
            res.status(201).json(cartItem); // [cite: 113]
          });
        } else {
          // For existing, modified sessions, express-session usually auto-saves.
          // If you still face issues, you could add an explicit save here too,
          // or ensure resave:true (though generally not recommended unless necessary).
          res.status(201).json(cartItem); // [cite: 113]
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
