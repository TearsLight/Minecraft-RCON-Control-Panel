import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig(({ mode }) => ({
  plugins: [vue()],
  base: mode === 'production' ? '/mcrcon/' : '/',
  server: {
    host: '0.0.0.0',
    proxy: {
      '/mcrcon/api': {
        target: 'http://localhost:7000',
        changeOrigin: true,
      },
    },
  },
}));
