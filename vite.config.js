import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const owllocateStylesheet = fileURLToPath(
  new URL('./src/styles/owllocate.css', import.meta.url),
)
const globalStylesheet = fileURLToPath(
  new URL('./src/index.css', import.meta.url),
)

function emitStandaloneStylesheets() {
  return {
    name: 'emit-standalone-stylesheets',
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'src/index.css',
        source: readFileSync(globalStylesheet, 'utf8'),
      })
      this.emitFile({
        type: 'asset',
        fileName: 'src/styles/owllocate.css',
        source: readFileSync(owllocateStylesheet, 'utf8'),
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), emitStandaloneStylesheets()],
})
