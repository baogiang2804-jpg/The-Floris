import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, loadEnv } from 'vite';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig(({mode, command}) => {
  const env = loadEnv(mode, '.', '');

  // Base path resolution:
  // Khi build production (đẩy lên GitHub Pages), dùng './' (relative) để đảm bảo:
  // - Dù repo tên là gì (/Floris1/, /Floris/, hay user page root /) thì toàn bộ JS/CSS/ảnh đều tải thành công 100%
  // - Không bao giờ bị lỗi 404 dẫn đến màn hình trắng (Blank White Screen).
  // Khi chạy dev server cục bộ (command === 'serve'), dùng '/' để server.ts/vite middleware hoạt động chuẩn xác.
  const customBase = process.env.BASE_PATH || env.BASE_PATH;
  const base = customBase || (command === 'build' ? './' : '/');

  return {
    base,
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY || process.env.GEMINI_API_KEY || ''),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || process.env.GEMINI_API_KEY || ''),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    optimizeDeps: {
      include: ['react-is', 'recharts'],
    },
    build: {
      target: ['es2020', 'safari14', 'chrome87', 'firefox78'],
      cssCodeSplit: true,
      chunkSizeWarningLimit: 1200,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react-dom') || id.includes('react/') || id.includes('scheduler')) {
                return 'vendor-react';
              }
              if (id.includes('recharts') || id.includes('react-is') || id.includes('d3-')) {
                return 'vendor-charts';
              }
              if (id.includes('lucide-react')) {
                return 'vendor-icons';
              }
            }
          },
        },
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
