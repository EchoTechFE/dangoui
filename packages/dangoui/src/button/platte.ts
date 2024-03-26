export function fromPlatte(
  color: string,
  ctx?: Record<string, { vars: Record<string, string> }>,
): { name: string; vars: Record<string, string | string[]> } {
  const mappings = {
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
      'bt-text-disabledtemp-color': `${color}-text-disabledtemp-color`,
    } as Record<string, string | string[]>,
  }

  if (ctx) {
    Object.values(ctx).forEach(({ vars }) => {
      Object.keys(vars).forEach((k) => {
        if (k.includes(`${color}-bt-`)) {
          const cmpVarName = k.split('-').slice(1).join('-')
          if (mappings.vars[cmpVarName]) {
            mappings.vars[cmpVarName] = [
              k,
              `${color}-${cmpVarName.split('-').slice(1).join('-')}`,
            ]
          }
        }
      })
    })
  }

  return mappings
}
