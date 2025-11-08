import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  publicDir: 'public',
  server: {
    port: 3000,
    open: true,
    host: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Ensure proper handling of static assets
    copyPublicDir: true,
    rollupOptions: {
      output: {
        // Keep favicon and assets with original names for production
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          // Keep .ico files with original names (important for favicons)
          if (ext === 'ico') {
            return 'assets/[name][extname]';
          }
          // Other assets can be hashed for cache busting
          return 'assets/[name]-[hash][extname]';
        }
      }
    }
  }
});

