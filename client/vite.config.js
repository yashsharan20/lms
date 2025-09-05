import { defineConfig } from 'vite'
import tailwindcss from "@tailwindcss/vite"
import path from "path"
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})

// yashsharan2013
// vjU3RuSrJcrvg8dS
// mongodb+srv://yashsharan2013:vjU3RuSrJcrvg8dS@cluster0.lpq1yja.mongodb.net/
