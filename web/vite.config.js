// Builds the React storefront into ../public, one HTML shell per page so every address, the server's SEO tags
// and the test suites stay exactly as they were. Run: npm run build (inside web/).
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { PAGES } from "./shells.js";

const here = fileURLToPath(new URL(".", import.meta.url));
export default defineConfig({
  plugins: [react()],
  base: "/",
  server: { proxy: { "/api": "http://localhost:3000", "/img": "http://localhost:3000" } },
  build: {
    outDir: "../public",
    emptyOutDir: false, // img/, seed-data.js, demo.js, favicon and manifest live there too
    modulePreload: { polyfill: false },
    rollupOptions: { input: Object.fromEntries(PAGES.map(([file]) => [file, here + file + ".html"])) },
  },
});
