import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// https://vitejs.dev/config/
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
        // Output directory
        outDir: 'dist',
        assetsDir: 'assets',
        // Минимизация через esbuild (встроенный)
        minify: 'esbuild',
        // Source maps для production debugging (опционально)
        sourcemap: false,
        // Chunk splitting для оптимизации загрузки
        rollupOptions: {
            output: {
                // Manual chunk splitting
                manualChunks: {
                    // React core
                    'vendor-react': ['react', 'react-dom'],
                    // State management
                    'vendor-zustand': ['zustand'],
                    // UI Libraries
                    'vendor-lucide': ['lucide-react'],
                    // PDF/Export (heavy, load on demand)
                    'vendor-export': ['jspdf', 'html2canvas'],
                    // UUID
                    'vendor-uuid': ['uuid'],
                    // Telegram SDK
                    'vendor-telegram': ['@twa-dev/sdk'],
                    // Animations
                    'vendor-transitions': ['react-transition-group'],
                },
                // Asset file naming
                assetFileNames: function (assetInfo) {
                    var _a;
                    var info = ((_a = assetInfo.name) === null || _a === void 0 ? void 0 : _a.split('.')) || [];
                    var ext = info[info.length - 1];
                    if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
                        return "assets/images/[name]-[hash][extname]";
                    }
                    if (/woff2?|eot|ttf|otf/i.test(ext)) {
                        return "assets/fonts/[name]-[hash][extname]";
                    }
                    return "assets/[name]-[hash][extname]";
                },
                // Chunk file naming
                chunkFileNames: 'assets/js/[name]-[hash].js',
                // Entry file naming
                entryFileNames: 'assets/js/[name]-[hash].js',
            },
        },
        // Increase chunk size warning limit (KB)
        chunkSizeWarningLimit: 500,
        // Target modern browsers
        target: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari14'],
    },
    // Оптимизации для production
    esbuild: {
        // Remove console in production
        drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
    },
    // Resolve aliases
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
    // CSS оптимизации
    css: {
        devSourcemap: true,
    },
});
