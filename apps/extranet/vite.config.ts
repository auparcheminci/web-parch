import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [sveltekit(), tailwindcss()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use 'sass:map'; @use "@acme/styles/index.scss" as *;`,
      },
    },
  },
});
