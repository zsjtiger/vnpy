import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// In development, /api and /ws are proxied to the vnpy web backend.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": "http://localhost:8000",
      "/ws": { target: "ws://localhost:8000", ws: true },
    },
  },
});
