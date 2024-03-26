export function fromPlatte(color: string) {
  return {
    name: `du-c-${color}-checkbox`,
    vars: {
      'checkbox-bg': `${color}-solid-bg`,
      'checkbox-disabled-bg': `${color}-solid-disabledtemp-bg`,
      'checkbox-color': `${color}-solid-color`,
    },
  }
}
