import { defineConfig, presetUno, presetTypography, presetIcons } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(), // required
    presetIcons(),
    presetTypography({
      cssExtend: {
        pre: {
          border: '1px solid rgba(0, 0, 0, 0.08)',
          'border-radius': '4px',
        },
        'code:before': {
          content: 'none',
        },
        'code:after': {
          content: 'none',
        },
        'h1 a, h2 a': {
          'text-decoration': 'none',
          position: 'relative',
        },
        'h1 a:before, h2 a:before': {
          content: '"#"',
          position: 'absolute',
          left: '-20px',
          opacity: '0',
          transition: 'opacity 0.1s ease',
          color: '#7c66ff',
        },
        'h1 a:hover:before, h2 a:hover:before': {
          opacity: '1',
        },
      },
    }),
  ],
  theme: {
    colors: {
      qdPurple: {
        100: '#f2f0ff',
        200: '#d9d2ff',
        300: '#c7b8ff',
        400: '#958dff',
        500: '#7c66ff',
        600: '#5c4cd9',
        700: '#4036b3',
        800: '#28238c',
        900: '#1a1866',
        DEFAULT: '#7c66ff',
      },
      'border-primary': 'rgba(0, 0, 0, 0.12)',
      'border-2': 'rgba(0, 0, 0, 0.08)',
      'border-3': 'rgba(0, 0, 0, 0.04)',
      'bg-primary': '#f2f0ff',
      'bg-2': '#f7f7f9',
      'bg-3': '#fff',
      'bg-4': 'var(--du-c-bg-4)',
    },
  },
  separators: [':', '-'],
  content: {
    pipeline: {
      include: [
        // the default
        /\.(vue|svelte|[jt]sx|ts|mdx?|astro|elm|php|phtml|html)($|\?)/,
      ],
    },
  },
})
