import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config";

// Pruebas unitarias, de contenido y de seguridad estática (ver TESTING.md).
export default mergeConfig(viteConfig, defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/unit/**/*.test.{ts,tsx}", "tests/security/**/*.test.ts"],
    css: false,
    coverage: {
      provider: "v8",
      include: ["src/lib/**", "src/data/**", "src/hooks/**"],
      reporter: ["text", "html"],
    },
  },
}));
