import { defineConfig } from "drizzle-kit"; //
import "dotenv/config";

if (!process.env.DATABASE_URL) {
  //
  throw new Error("DATABASE_URL, ensure the database is provisioned"); //
}

export default defineConfig({
  out: "./drizzle", //
  schema: "./shared/schema.ts", //
  dialect: "postgresql", //
  dbCredentials: {
    url: process.env.DATABASE_URL, // <--- REMOVE "?sslmode=no-verify"
    ssl: {
      rejectUnauthorized: false, // This is crucial for Heroku Postgres
    },
  },
});
