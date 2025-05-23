// drizzle.config.ts
import { defineConfig } from "drizzle-kit";

let originalUrl = process.env.DATABASE_URL;

if (!originalUrl) {
  throw new Error("DATABASE_URL, ensure the database is provisioned");
}

let effectiveUrl = originalUrl;

// More robustly check if it's a Heroku/AWS-like URL and needs SSL parameters
const herokuDbPatterns = [
  ".compute.amazonaws.com",
  "herokudns.com",
  "postgres.heroku.com",
];
const isLikelyHerokuDb = herokuDbPatterns.some((pattern) =>
  originalUrl.includes(pattern)
);

if (isLikelyHerokuDb) {
  if (originalUrl.includes("?")) {
    // If other parameters exist, append sslmode if not already there
    if (!originalUrl.includes("sslmode=")) {
      effectiveUrl = `${originalUrl}&sslmode=require`;
    } else if (originalUrl.includes("sslmode=disable")) {
      effectiveUrl = effectiveUrl.replace("sslmode=disable", "sslmode=require");
    }
    // If sslmode is already 'require' or 'verify-full', it's fine.
  } else {
    // No parameters exist, so append ?sslmode=require
    effectiveUrl = `${originalUrl}?sslmode=require`;
  }
}

// Log the URL that will be used (redacting password part for security)
const redactedUrlForLogging = effectiveUrl.replace(/:([^:]+)@/, ":[REDACTED]@");
console.log(
  `Drizzle Kit effective DATABASE_URL for connection: ${redactedUrlForLogging}`
);

export default defineConfig({
  dialect: "postgresql",
  schema: "./shared/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: effectiveUrl, // Use the potentially modified URL
  },
  verbose: true,
  strict: true,
});
