import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL, ensure the database is provisioned");
}

const dbUrl = process.env.DATABASE_URL;
// Ensure it's a non-localhost URL before appending, as local Postgres might not use SSL
const isHerokuUrl = dbUrl.includes("amazonaws.com"); // Heroku DBs are often on AWS

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url:
      isHerokuUrl && !dbUrl.includes("sslmode")
        ? `${dbUrl}?sslmode=require`
        : dbUrl,
  },
});
