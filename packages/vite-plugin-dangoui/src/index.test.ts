import { resolveThemes, combineVars } from '.'

import { expect, test } from 'vitest'

test('resolve themes correctly', () => {
  expect(resolveThemes(['qd'])).toEqual(['qd'])

  expect(
    resolveThemes([
      'qd',
      {
        name: 'linjie',
        colors: {
          primary: {
            solidBg: 'blue',
          },
        },
      },
    ]),
  ).toEqual([
    'qd',
    {
      name: 'linjie',
      colors: {
        primary: {
          'solid-bg': 'blue',
        },
      },
    },
  ])

  expect(
    resolveThemes([
      {
        name: 'linjie',
        colors: {
          primary: {
            button: {
              solidBg: 'blue',
            },
          },
        },
      },
    ]),
  ).toEqual([
    {
      name: 'linjie',
      colors: {
        primary: {
          'bt-solid-bg': 'blue',
        },
      },
    },
  ])
})

test('combine vars', () => {
  expect(combineVars(['a', 'b'])).toEqual('var(--a, var(--b))')
  expect(combineVars(['a'])).toEqual('var(--a)')
  expect(combineVars(['a', 'b', 'c'])).toEqual('var(--a, var(--b, var(--c)))')
})
