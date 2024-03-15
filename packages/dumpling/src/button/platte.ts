export function fromPlatte(
  color: string,
  ctx?: Record<string, { vars: Record<string, string> }>,
) {
  const mappings: {
    name: string
    vars: Record<string, string>
    theme?: string
  }[] = [
    {
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
      } as Record<string, string>,
    },
  ]

  if (!ctx) {
    return mappings[0]
  }

  Object.entries(ctx).forEach(([theme, { vars }]) => {
    Object.entries(vars).forEach(([k]) => {
      const item: {
        name: string
        vars: Record<string, string>
        theme?: string
      } = {
        name: `du-c-${color}-bt`,
        theme,
        vars: {},
      }

      if (k.includes('-bt-')) {
        item.vars[k.split('-').slice(1).join('-')] = k
      }

      if (Object.keys(item.vars).length) {
        mappings.push(item)
      }
    })
  })

  return mappings
}
