import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL, ensure the database is provisioned");
}

let dbUrl = process.env.DATABASE_URL;
// For Heroku, append ?sslmode=require if not present, and rely on default CA handling
// or the fact that rejectUnauthorized:false is often needed.
// This specific error 'UNABLE_TO_GET_ISSUER_CERT_LOCALLY' often means it IS trying SSL,
// but cannot verify the cert. The runtime app uses rejectUnauthorized: false.
// We can try to achieve a similar effect for drizzle-kit's connection.
// One way is to see if '?ssl=true&sslfactory=org.postgresql.ssl.NonValidatingFactory'
// works for node-pg, or more commonly '?sslmode=no-verify' if supported,
// or ensure '?sslmode=require' is there.

// Let's try ensuring sslmode=require as a starting point.
// It is often implicit with Heroku DATABASE_URLs.
// The problem is likely that drizzle-kit's pg instance isn't using rejectUnauthorized: false.

// Since we can't easily pass pool options to drizzle-kit's internal pg instance
// via drizzle.config.ts other than the URL, the diagnostic NODE_TLS_REJECT_UNAUTHORIZED=0
// is the most direct way to test if this is purely a cert validation issue.

export default defineConfig({
  dialect: "postgresql",
  schema: "./shared/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: dbUrl, // Use the original URL first, then try NODE_TLS_REJECT_UNAUTHORIZED
  },
  verbose: true,
  strict: true,
});
