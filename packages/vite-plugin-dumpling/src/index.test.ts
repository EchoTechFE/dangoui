import { resolveThemes } from '.'

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
