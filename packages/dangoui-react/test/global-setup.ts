import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

// Root `pnpm test` must work in a clean checkout, without a prior library build.
export default function setup() {
  execFileSync(process.execPath, ['scripts/gen-icons.mjs'], {
    cwd: fileURLToPath(new URL('../', import.meta.url)),
    stdio: 'inherit',
  })
}
