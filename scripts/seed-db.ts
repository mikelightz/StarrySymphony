import { db } from "../server/db";
import { products } from "../shared/schema";

async function seedProducts() {
  console.log("Seeding products into database...");
  
  const existingProducts = await db.select().from(products);
  
  if (existingProducts.length > 0) {
    console.log(`Found ${existingProducts.length} existing products, skipping seed.`);
    return;
  }
  
  const productData = [
    {
      name: "Somatic Moon Journal",
      price: 27.00,
      type: "DIGITAL",
      description: "Our beautifully designed digital journal that combines lunar wisdom with somatic awareness practices. Includes fillable PDF pages, moon phase calendars, and embodiment exercises.",
      imageUrl: "https://images.unsplash.com/photo-1544967082-d9d25d867d66?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80",
      originalPrice: null
    },
    {
      name: "Somatic Moon Journal",
      price: 45.00,
      type: "PRINT",
      description: "A beautifully crafted physical journal printed on premium recycled paper. Features guidance for each moon phase, somatic check-ins, and plenty of space for reflection.",
      imageUrl: "https://images.unsplash.com/photo-1577375729152-4c8b5fcda381?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80",
      originalPrice: null
    },
    {
      name: "Moon Masterclass",
      price: 197.00,
      type: "COURSE",
      description: "A comprehensive online course to deepen your connection with lunar cycles. Includes 8 video modules, guided practices, and printable resources.",
      imageUrl: "https://images.unsplash.com/photo-1504805572947-34fad45aed93?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80",
      originalPrice: null
    },
    {
      name: "Lunar Self-Care Bundle",
      price: 225.00,
      type: "BUNDLE",
      description: "The complete lunar wellness package: Print journal, Moon Masterclass, and a 1:1 session to get personalized guidance for your journey.",
      imageUrl: "https://images.unsplash.com/photo-1501139083538-0139583c060f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80",
      originalPrice: 269.00
    }
  ];
  
  const insertedProducts = await db.insert(products).values(productData).returning();
  
  console.log(`Successfully inserted ${insertedProducts.length} products.`);
}

// Run seed function
seedProducts()
  .catch(error => {
    console.error("Error seeding database:", error);
    process.exit(1);
  })
  .finally(() => {
    console.log("Seed script complete.");
    process.exit(0);
  });