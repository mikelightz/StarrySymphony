// server/vite.ts
import { type Express } from "express";
import fs from "fs";
import path from "path";
import { type Server } from "http";
import { nanoid } from "nanoid";
import { log } from "./logger";

log("Testing deployment marker - v2 - Top of server/vite.ts"); // You can keep or remove this marker

// Change setupVite to accept viteMainConfig as an argument
export async function setupVite(
  app: Express,
  server: Server,
  viteMainConfig: any
) {
  const { createServer: createViteServer, createLogger } = await import("vite");
  // REMOVED: const { default: viteMainConfig } = await import("../vite.config.js");

  const viteLogger = createLogger();
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteMainConfig, // Use the passed-in viteMainConfig
    configFile: false, // Important as you're passing the config object directly
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      // Path to your client's source index.html for Vite dev server
      const clientTemplate = path.resolve(
        process.cwd(),
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
