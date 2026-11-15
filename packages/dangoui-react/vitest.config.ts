import { defineConfig } from 'vitest/config'

export default defineConfig({
  root: __dirname,
  esbuild: { jsx: 'automatic' },
  test: {
    name: 'dangoui-react',
    environment: 'happy-dom',
    globalSetup: ['./test/global-setup.ts'],
    setupFiles: ['./test/setup.ts'],
    include: ['test/**/*.test.{ts,tsx}'],
  },
})
