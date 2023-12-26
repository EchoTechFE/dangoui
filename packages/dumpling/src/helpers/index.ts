// TODO: 想要让所有支持 `color` 的组件支持 hex、rgb
export function isPlatteColor(color: string) {
  if (!color.startsWith('#') && !color.startsWith('rgb')) {
    return true
  }

  return false
}
