import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  server: {
    port: 5173,
    host: true,
    headers: {
      'Service-Worker-Allowed': '/',
    },
  },

  preview: {
    port: 4173,
    host: true,
  },

  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    minify: 'esbuild',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-zustand': ['zustand'],
          'vendor-lucide': ['lucide-react'],
          'vendor-export': ['jspdf', 'html2canvas'],
          'vendor-uuid': ['uuid'],
          'vendor-telegram': ['@twa-dev/sdk'],
          'vendor-transitions': ['react-transition-group'],
        },
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.') || [];
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `assets/images/[name]-[hash][extname]`;
          }
          if (/woff2?|eot|ttf|otf/i.test(ext)) {
            return `assets/fonts/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      },
    },
    chunkSizeWarningLimit: 500,
    target: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari14'],
  },

  esbuild: {
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
  },

  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/shared/ui',
      '@features': '/src/features',
      '@pages': '/src/pages',
      '@shared': '/src/shared',
      '@widgets': '/src/widgets',
    },
  },

  css: {
    devSourcemap: true,
  },
});
