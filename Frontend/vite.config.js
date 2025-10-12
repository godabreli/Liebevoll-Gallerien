import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Der gemeinsame Zielordner für beide Builds
const SHARED_OUT_DIR = 'dist';

export default defineConfig(({ command }) => {
  if (command === 'build') {
    // -----------------------------------------------------
    // KONFIGURATION: Production Build (wird von npm run build:app verwendet)
    // -----------------------------------------------------
    return {
      plugins: [react()],
      build: {
        outDir: SHARED_OUT_DIR, // Haupt-App landet im Root des dist-Ordners
        emptyOutDir: true, // Löscht den Ordner nur beim ersten App-Build

        rollupOptions: {
          input: {
            // App-Einstiegspunkt
            app: path.resolve('index.html'),
          },
          output: {
            // Normale Asset-Benennung für die Haupt-App
            assetFileNames: 'assets/[name]-[hash].[ext]',
            chunkFileNames: 'assets/[name]-[hash].js',
            entryFileNames: 'assets/[name]-[hash].js',
          },
        },
      },
    };
  } else {
    // -----------------------------------------------------
    // KONFIGURATION: Development (npm run dev)
    // -----------------------------------------------------
    return {
      plugins: [react()],
      server: {
        port: 3000,
        cors: true,
      },
    };
  }
});
