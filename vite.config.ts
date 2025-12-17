import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false
  },
  resolve: {
    alias: {
      // Ensure we resolve to the same React instance
      react: 'react',
      'react-dom': 'react-dom'
    }
  }
})