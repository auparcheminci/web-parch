import { fileURLToPath } from "url";
import path from "path";
import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const stylesDir = path.resolve(__dirname, "../../packages/styles");

export default defineConfig({
  plugins: [sveltekit(), tailwindcss()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use 'sass:map'; @use "${stylesDir}/index" as *;`,
      },
    },
  },
});
