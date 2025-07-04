import "dotenv/config";

export const config = {
  // Use PORT provided by Heroku or default to 3000
  port: process.env.PORT || 3000,

  // Database configuration
  database: {
    url: process.env.DATABASE_URL,
  },

  // CORS configuration for production
  cors: {
    // Add your frontend URL when it's deployed to Netlify
    origin:
      process.env.NODE_ENV === "production"
        ? [
            "https://omflorwell.netlify.app",
            "https://www.omflorwellness.com",
            "https://omflorwellness.com",
          ]
        : ["http://localhost:3000"],
    credentials: true,
  },

  // Session configuration
  session: {
    secret: process.env.SESSION_SECRET,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      secure: process.env.NODE_ENV === "production",
    },
  },
};
