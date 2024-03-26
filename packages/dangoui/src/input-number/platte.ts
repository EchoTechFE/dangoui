export function fromPlatte(color: string) {
  return {
    name: `du-c-${color}-input-number`,
    vars: {
      'in-solid-color': `${color}-solid-color`,
      'in-solid-bg': `${color}-solid-bg`,
      'in-solid-disabledtemp-color': `${color}-solid-disabledtemp-color`,
      'in-solid-disabledtemp-bg': `${color}-solid-disabledtemp-bg`,
    },
  }
}
