import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' lets the build work from any static host path (GitHub Pages, Netlify, Vercel)
export default defineConfig({
  plugins: [react()],
  base: './',
});
