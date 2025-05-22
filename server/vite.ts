// server/vite.ts
import { type Express } from "express";
import fs from "fs";
import path from "path";
// REMOVE static imports of vite and viteConfig from the top level:
// import { createServer as createViteServer, createLogger } from "vite";
// import viteConfig from "../vite.config";
import { type Server } from "http";
import { nanoid } from "nanoid";

export async function setupVite(app: Express, server: Server) {
  // Dynamically import Vite and its config ONLY when setupVite is called
  const { createServer: createViteServer, createLogger } = await import("vite");
  // Assuming vite.config.ts is compiled to .js or your runtime can handle .ts
  // Adjust the path if esbuild places it differently relative to the bundled server/vite.ts
  const { default: viteMainConfig } = await import("../vite.config.js");

  const viteLogger = createLogger();

  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const, // Keep the 'as const' fix
  };

  const vite = await createViteServer({
    ...viteMainConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        // process.exit(1); // Consider if you want server to exit on Vite error in dev
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      // Path resolution for client/index.html needs to be correct relative to this file's location AFTER build
      // If dist/server/vite.js is run, __dirname is dist/server
      const clientRoot = path.resolve(__dirname, "..", "..", "client"); // Adjust if esbuild structure is different
      const clientTemplate = path.resolve(clientRoot, "index.html");

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
