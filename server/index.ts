import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { log } from "./logger"; // IMPORT log FROM THE NEW LOCATION
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { pool } from "./db";
import { config } from "./config";
import "dotenv/config";
import cors from "cors";

log("Testing deployment marker - v2 - Top of server/index.ts");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Setup CORS for cross-origin requests from Netlify frontend
app.use(
  cors({
    origin: config.cors.origin,
    credentials: config.cors.credentials,
  })
);

// Setup session middleware with PostgreSQL store
const PgSession = connectPgSimple(session);

app.use(
  session({
    store: new PgSession({
      pool,
      tableName: "session",
      createTableIfMissing: true,
    }),
    secret: config.session.secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: config.session.cookie.maxAge,
      secure: config.session.cookie.secure,
    },
  })
);

// Add session type definitions
declare module "express-session" {
  interface SessionData {
    cartId?: number;
  }
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson: any, ...args: any[]) {
    // Keep your wrapper signature
    capturedJsonResponse = bodyJson;
    // Call the original res.json, only passing the bodyJson it expects.
    // The 'args' are not standard for res.json and should not be passed to the original.
    return originalResJson.apply(res, [bodyJson]); // Corrected line
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }
      log(logLine); // Use the imported log function
    }
  });
  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    // It's generally not recommended to throw an error after sending a response.
    // Consider logging it instead or ensuring this is the final error handler.
    // throw err;
    log(
      `Error: ${status} - ${message}${
        err.stack ? `\nStack: ${err.stack}` : ""
      }`,
      "errorHandler"
    );
  });

  if (process.env.NODE_ENV === "development") {
    try {
      const { setupVite } = await import("./vite");
      const viteConfigModule = await import("../vite.config.ts");
      const viteMainConfig = viteConfigModule.default;
      await setupVite(app, server, viteMainConfig);
    } catch (viteError: any) {
      log(
        `Failed to setup Vite: ${viteError.message || String(viteError)}`,
        "ViteSetup"
      );
    }
  }

  const port = process.env.NODE_ENV === "production" ? config.port : 5000;
  server.listen(
    {
      port,
      host: "0.0.0.0",
      reusePort: true,
    },
    () => {
      log(`serving on port ${port}`); // Use the imported log function
    }
  );
})();
