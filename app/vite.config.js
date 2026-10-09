import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/* The Java backend (server/Server.java, port 8080) does two jobs:
   - /api/*    app data (colleges JSON) and demo logins
   - /site/*   the official-website proxy, so college sites load inside the app
   During `npm run dev` Vite forwards both to Java, so one command pair is enough:
        cd server && java Server.java          (terminal 1)
        cd app    && npm run dev               (terminal 2)  -> http://localhost:5173
   For the packaged build, Java serves app/dist itself — see START-WINDOWS.bat. */
const JAVA = process.env.CC_JAVA || 'http://localhost:8080';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api':  { target: JAVA, changeOrigin: true },
      '/site': { target: JAVA, changeOrigin: true }
    }
  },
  build: { outDir: 'dist', emptyOutDir: true }
});
