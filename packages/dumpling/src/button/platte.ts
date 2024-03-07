export function fromPlatte(color: string) {
  return {
    name: `du-c-${color}-bt`,
    vars: {
      'bt-solid-color': `${color}-solid-color`,
      'bt-solid-bg': `${color}-solid-bg`,
      'bt-solid-disabledtemp-color': `${color}-solid-disabledtemp-color`,
      'bt-solid-disabledtemp-bg': `${color}-solid-disabledtemp-bg`,
      'bt-color': `${color}-color`,
      'bt-soft-bg': `${color}-soft-bg`,
      'bt-disabledtemp-color': `${color}-disabledtemp-color`,
      'bt-soft-disabledtemp-bg': `${color}-soft-disabledtemp-bg`,
      'bt-outline-color': `${color}-outline-color`,
      'bt-border': `${color}-border`,
      'bt-outline-disabledtemp-color': `${color}-outline-disabledtemp-color`,
      'bt-disabledtemp-border': `${color}-disabledtemp-border`,
      'bt-text-color': `${color}-text-color`,
    },
  }
}
