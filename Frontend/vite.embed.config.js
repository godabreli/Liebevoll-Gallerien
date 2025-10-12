import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export const embedConfig = {
  plugins: [react()],

  // WICHTIG: Definiert die globale Variable process.env.NODE_ENV
  define: {
    // Stellt sicher, dass das Skript im Produktionsmodus baut und KEINEN Debug-Code einfügt.
    'process.env.NODE_ENV': JSON.stringify('production'),
  },

  build: {
    outDir: 'dist', // WICHTIG: Nutzt denselben Hauptordner
    emptyOutDir: false, // WICHTIG: NICHT löschen, da der App-Build schon drin ist
    cssCodeSplit: false,
    lib: {
      entry: path.resolve('src/embed.jsx'),
      name: 'GalleryEmbedScript',
      // Der fileName-Pfad schiebt die JS-Datei in einen Unterordner 'embed/'
      fileName: `embed/embedGallery.js`,
      formats: ['iife'],
    },
    rollupOptions: {
      // Wenn das Embed-Skript Bilder importiert, landen sie im gemeinsamen dist/assets
      output: {
        inlineDynamicImports: true,
        // Optional: Sie könnten hier auch den genauen Dateinamen kontrollieren,
        // falls es in Zukunft Probleme gibt:
        // entryFileNames: `embed/embedGallery.js`,
      },
    },
  },
};

export default defineConfig(embedConfig);
