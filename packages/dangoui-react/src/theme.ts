export const themeNames = [
  'qd',
  'qd-dark',
  'qdm',
  'mihua',
  'mihua-dark',
  'qh',
  'qh-dark',
  'linjie',
  'linjie-dark',
] as const
export type ThemeName = (typeof themeNames)[number]
export type ThemeTokens = Record<`--du-${string}`, string | number>
