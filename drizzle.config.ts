import { defineConfig } from "drizzle-kit";

let originalUrl = process.env.DATABASE_URL;

if (!originalUrl) {
  throw new Error("DATABASE_URL, ensure the database is provisioned");
}

let effectiveUrl = originalUrl;
// Check for common Heroku/AWS host patterns for Postgres
if (
  originalUrl.includes("compute.amazonaws.com") ||
  originalUrl.includes("herokudns.com") ||
  originalUrl.includes("postgres.heroku.com")
) {
  if (!originalUrl.includes("sslmode")) {
    effectiveUrl = `${originalUrl}?sslmode=require`;
  } else if (originalUrl.includes("sslmode=disable")) {
    // If it explicitly says disable, try to override it.
    effectiveUrl = originalUrl.replace("sslmode=disable", "sslmode=require");
  }
  // If sslmode is already set to require or verify-full, leave it.
}

console.log(
  `Drizzle Kit will use effective DATABASE_URL for connection: ${effectiveUrl.replace(
    /:[^:]+@/,
    ":[REDACTED]@"
  )}`
); // Log the URL (redact password)

export default defineConfig({
  dialect: "postgresql",
  schema: "./shared/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: effectiveUrl,
  },
  verbose: true,
  strict: true,
});
