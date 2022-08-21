import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: "happy-dom",
    // setupFiles: "./test-setup.ts",
  },
  resolve: {
    alias: {
      "#imports": path.resolve(__dirname, "./.nuxt/imports.d.ts"),
    },
  },
});
