/// <reference types="vitest/config" />
import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react()],
    resolve: {
      alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
    },
    server: {
      // Dev only: forward /api to the Spring Boot backend (docs/08 — TECHNICAL DECISION).
      proxy: {
        '/api': {
          target: env.VITE_API_PROXY_TARGET || 'http://localhost:8080',
          changeOrigin: true,
        },
      },
    },
    test: {
      // Unit and component tests for implemented UI logic only. No test talks to a backend or a
      // database: domain data comes from the in-memory mock adapters (docs/10 §10).
      environment: 'jsdom',
      include: ['src/**/*.test.{ts,tsx}'],
      setupFiles: ['./src/test/setup.ts'],
      restoreMocks: true,
      // Process the token file so designTokens.test.ts can read it via ?raw (other CSS stays stubbed).
      css: { include: [/design-tokens\.css/] },
    },
  }
})
