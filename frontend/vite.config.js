import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), ''); // Vite tự tìm .env ở frontend/

  return {
    plugins: [react()],
    server: {
      host: '0.0.0.0',
      port: 5173,
      strictPort: true,
      watch: {
        usePolling: true,
      },
      allowedHosts: [
        'all',
        // 'explicitly-georgia-fisheries-attending.trycloudflare.com'
      ],
      // hmr: {
      //   clientPort: 443, // nếu bạn truy cập qua https tunnel
      // },
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    },
    preview: {
      host: '0.0.0.0',
      port: 4173,
      strictPort: true,
      allowedHosts: env.VITE_ALLOWED_HOSTS?.split(',') || ['localhost'],
    },
    define: {
      __APP_ENV__: JSON.stringify(env.APP_ENV ?? ''),
    },
    envPrefix: 'VITE_', // vẫn nên giữ để rõ ràng
  };
});
