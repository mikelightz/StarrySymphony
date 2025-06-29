import { Pool } from "pg"; // Assuming this import is there
import { drizzle } from "drizzle-orm/node-postgres"; // Assuming this import is there
import * as schema from "../shared/schema"; // <-- Move this import to the top

// ... potentially other imports ...

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Initialize Drizzle with the node-postgres driver
export const db = drizzle(pool, { schema: schema });
