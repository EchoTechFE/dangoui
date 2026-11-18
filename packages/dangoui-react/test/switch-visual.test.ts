// @vitest-environment node
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const styles = readFileSync(resolve(__dirname, '../src/styles.css'), 'utf8')

describe('switch visual contract', () => {
  it('keeps the React switch geometry aligned with the mobile Dangoui switch', () => {
    expect(styles).toMatch(
      /\.du-react-choice\.du-react-switch \.du-react-choice__mark \{[^}]*width: var\(--du-switch-width, 42px\);[^}]*height: var\(--du-switch-height, 24px\);[^}]*border: 2px solid var\(--du-border-2\);[^}]*border-radius: 1000px;/,
    )
    expect(styles).toContain('translateX(var(--du-switch-travel, 18px))')
    expect(styles).toContain('var(--du-switch-width, clamp(36px, 11.2vw, 44px))')
    expect(styles).toContain(
      ".du-react-choice.du-react-switch[data-disabled='true'] {\n  opacity: 1;\n}",
    )
    expect(styles).toContain('box-shadow:\n    0 2px 1px rgba(0, 0, 0, 0.08),')
  })
})
