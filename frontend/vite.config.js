import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { networkAddressPlugin } from './vite-network-plugin.js'

export default defineConfig(({ mode }) => {
  return {
    plugins: [
      react(),
      networkAddressPlugin() // Plugin hiển thị network addresses
    ],
    server: {
      host: true, // Thay vì '0.0.0.0', sử dụng true để tự động detect và hiển thị tất cả IP
      port: 5173,
      strictPort: true,
      open: false, // Không tự động mở browser
      cors: true, // Enable CORS
      watch: {
        usePolling: true,
        interval: 1000, // Polling interval
      },
      allowedHosts: [
        'all',
        // 'explicitly-georgia-fisheries-attending.trycloudflare.com'
      ],
      hmr: {
        port: 5173, // HMR port
        host: 'localhost', // HMR host
      },
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    },
    preview: {
      host: true, // Tương tự như server
      port: 4173,
      strictPort: true,
      cors: true,
      allowedHosts: ['localhost', '127.0.0.1'], // Hardcode vì không có biến env
    },
    build: {
      target: 'esnext', // Hoặc 'es2015' nếu cần hỗ trợ browser cũ hơn
      outDir: 'dist',
      sourcemap: false, // Set true nếu cần debug production
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            router: ['react-router-dom'],
            ui: ['framer-motion'],
          },
        },
      },
    },
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode),
    },
    envPrefix: 'VITE_', // Giữ lại để Vite load các biến VITE_*
  };
});
