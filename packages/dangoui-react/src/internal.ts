import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react'

/** Drafts belong to an opening session, regardless of inline prop identities. */
export function useOnOpen(open: boolean, initialize: () => void) {
  const wasOpen = useRef(false),
    latest = useRef(initialize)
  latest.current = initialize
  useLayoutEffect(() => {
    const opening = open && !wasOpen.current
    wasOpen.current = open
    if (opening) latest.current()
  }, [open])
}

export function colorStyle(color = 'primary'): CSSProperties {
  return {
    '--du-control-color': `var(--du-${color}-color, ${color})`,
    '--du-control-soft': `var(--du-${color}-soft-bg, transparent)`,
  } as CSSProperties
}

export function cx(...values: (string | false | undefined)[]) {
  return values.filter(Boolean).join(' ')
}

// Freeze the mode on first render, including when a caller passes undefined later.
export function useControllable<T>(
  value: T | undefined,
  defaultValue: T,
  onChange?: (value: T) => void,
) {
  const controlled = useRef(value !== undefined).current
  const [inner, setInner] = useState(defaultValue)
  const current = controlled ? (value as T) : inner
  return [
    current,
    (next: T) => {
      if (!controlled) setInner(next)
      if (!Object.is(next, current)) onChange?.(next)
    },
  ] as const
}
