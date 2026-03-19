import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    // jsPDF optionally imports these for SVG/HTML rendering — we don't use
    // those features, so tell Vite not to try bundling them
    exclude: ['canvg', 'html2canvas', 'dompurify'],
  },
})
