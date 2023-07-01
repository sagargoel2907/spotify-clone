import { defineConfig } from 'vite';
import { resolve } from 'path';
// import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  // plugins: [react()],
  server: {
    host: '0.0.0.0',
  },
  root: 'src',
  build: {
    outDir: "../dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        dashboard: resolve(__dirname, "src/dashboard/dashboard.html"),
        login: resolve(__dirname, "src/login/login.html")
      }
    }
  }
})
