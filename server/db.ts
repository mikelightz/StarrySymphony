// server/db.ts
import { Pool } from "pg"; // Use the standard 'pg' library
import { drizzle } from "drizzle-orm/node-postgres"; // Use the node-postgres Drizzle adapter
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}

// Configure the pool for Heroku Postgres
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Heroku Postgres often requires SSL
  },
});

export const db = drizzle(pool, { schema });
