export function fromPlatte(color: string) {
  return {
    name: `du-c-${color}-switch`,
    vars: {
      'switch-bg': `${color}-solid-bg`,
      'switch-disabled-bg': `${color}-solid-disabledtemp-bg`,
    },
  }
}
