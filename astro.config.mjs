// @ts-check
import { defineConfig } from "astro/config";

import react from "@astrojs/react";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  redirects: {
    "/[...path]": "https://itonx.dev/codealchemy",
  },
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
