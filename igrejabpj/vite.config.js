import path from "path" // Adicione esta linha no topo
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  resolve: { // Adicione toda esta seção 'resolve'
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})