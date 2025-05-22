// server/vite.ts
import { type Express } from "express";
import fs from "fs";
import path from "path";
// REMOVE: import { createServer as createViteServer, createLogger } from "vite";
// REMOVE: import viteConfig from "../vite.config";
import { type Server } from "http";
import { nanoid } from "nanoid";

export async function setupVite(app: Express, server: Server) {
  // Dynamically import Vite and its config only when setupVite is called
  const { createServer: createViteServer, createLogger } = await import("vite");
  const { default: viteMainConfig } = await import("../vite.config.js"); // or .ts if your setup handles it at runtime

  const viteLogger = createLogger();

  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteMainConfig, // Use the dynamically imported config
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path.resolve(
        // Assuming import.meta.url is available or derive path differently if not in ESM context after build
        // For simplicity, ensure paths are correct or make them absolute if needed
        __dirname, // If using CJS context after esbuild, or adjust path resolution
        "..", // from dist/server/vite.js to root
        "..", // from root to client for vite.config.ts location
        "client",
        "index.html"
      );

      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}
