export function fromPlatte(color: string) {
  return {
    name: `du-c-${color}-radio`,
    vars: {
      'radio-bg': `${color}-solid-bg`,
      'radio-disabled-bg': `${color}-solid-disabledtemp-bg`,
    },
  }
}
