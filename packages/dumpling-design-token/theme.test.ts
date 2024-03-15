import { test, expect } from 'vitest'
import { combineThemes } from './theme'

test('combine themes correctly', () => {
  expect(
    combineThemes(
      [
        {
          name: 'qd',
          colors: {
            primary: {
              'solid-bg': 'red',
              'solid-color': '#fff',
            },
          },
        },
        {
          name: 'qh',
          colors: {
            primary: {
              'solid-bg': 'orange',
            },
          },
        },
      ],
      [
        {
          name: 'qd',
          colors: {
            primary: {
              'solid-bg': 'blue',
            },
          },
        },
        {
          name: 'mihua-light',
          colors: {
            primary: {
              'solid-bg': 'green',
            },
          },
        },
      ],
    ),
  ).toEqual([
    {
      name: 'qd',
      colors: {
        primary: {
          'solid-bg': 'blue',
          'solid-color': '#fff',
        },
      },
    },
    {
      name: 'qh',
      colors: {
        primary: {
          'solid-bg': 'orange',
        },
      },
    },
    {
      name: 'mihua-light',
      colors: {
        primary: {
          'solid-bg': 'green',
        },
      },
    },
  ])
})
