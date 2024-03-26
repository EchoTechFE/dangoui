// TODO: 想要让所有支持 `color` 的组件支持 hex、rgb
export function isPlatteColor(color: string) {
  if (
    !color.startsWith('#') &&
    !color.startsWith('rgb') &&
    !color.startsWith('var')
  ) {
    return true
  }

  return false
}

export function tryCall(
  fn: () => Promise<void>,
  { duration, count }: { duration: number; count: number },
): Promise<void> {
  const callAgain = () => {
    const nextCount = count - 1
    if (nextCount === 0) {
      return
    }
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve()
      }, duration)
    }).then(() => tryCall(fn, { duration, count: nextCount }))
  }

  return fn().then(callAgain).catch(callAgain)
}
