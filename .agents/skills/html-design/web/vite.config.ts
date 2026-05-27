import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { writeFileSync, existsSync, mkdirSync } from 'fs'
import { resolve } from 'path'
import { homedir } from 'os'

const resultDir = resolve(homedir(), '.html-design')

function saveResultPlugin(): Plugin {
  return {
    name: 'save-result-api',
    configureServer(server) {
      server.middlewares.use('/api/save-result', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end('Method Not Allowed')
          return
        }
        let body = ''
        req.on('data', (chunk: Buffer) => { body += chunk.toString() })
        req.on('end', () => {
          try {
            const { prompt } = JSON.parse(body)
            if (!existsSync(resultDir)) mkdirSync(resultDir, { recursive: true })
            writeFileSync(resolve(resultDir, 'result.txt'), prompt, 'utf-8')
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ ok: true }))
          } catch {
            res.statusCode = 400
            res.end(JSON.stringify({ ok: false, error: 'Invalid request' }))
          }
        })
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), saveResultPlugin()],
})
