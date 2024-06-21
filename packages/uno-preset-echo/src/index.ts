import { definePreset } from '@unocss/core'
import presetMp, { PresetMpOptions } from 'unocss-preset-mp'
import presetEchoColors from 'unocss-preset-echo-colors'
import deepmerge from 'deepmerge'

type PresetEchoOptions = {
  theme?: Record<string, Record<string, string | number>>
  prefix?: string
  unit?: PresetMpOptions['unit']
}

export const presetEcho = definePreset((options: PresetEchoOptions = {}) => {
  const mp = presetMp({
    prefix: options.prefix,
    unit: options.unit ?? 'rpx',
  })
  const presetColors = presetEchoColors({
    theme: options.theme,
  })

  return {
    ...mp,
    name: 'unocss-preset-echo',
    rules: [
      ...(mp.rules ?? []),
      ...(presetColors.rules ?? []),
      ['font-num', { 'font-family': 'Roboto' }],
      ['shadow-primary', { 'box-shadow': '0 1px 20rpx 0 rgba(0, 0, 0, 0.08)' }],
      ['shadow-2', { 'box-shadow': '0 1px 20rpx 0 rgba(0, 0, 0, 0.06)' }],
    ],
    theme: deepmerge(
      {
        ...mp.theme,
        ...presetColors.theme,
      },
      {
        borderRadius: {
          DEFAULT: '0.25rem',
          none: '0',
          mini: '0.5rem',
          sm: '1rem',
          norm: '2rem',
          md: '6rem',
          lg: '8rem',
          full: '9999px',
        },
        spacing: {
          DEFAULT: '1rem',
          none: '0',
          mini: '0.5rem',
          sm: '1rem',
          norm: '2rem',
          md: '3rem',
          lg: '4rem',
        },
      },
    ),
    preflights: [...(mp.preflights ?? []), ...(presetColors.preflights ?? [])],
    shortcuts: [
      {
        'text-h1': 'text-24 fw-500 lh-30',
        'text-h2': 'text-20 fw-500 lh-26',
        'text-h3': 'text-18 fw-500 lh-25',
        'text-h4': 'text-16 fw-500 lh-24',
        'text-h5': 'text-14 fw-500 lh-22',
        'text-h6': 'text-12 fw-500 lh-18',
        'text-h7': 'text-11 fw-500 lh-13',
        'text-h8': 'text-10 fw-500 lh-11',

        'text-b1': 'text-24 fw-400 lh-30',
        'text-b2': 'text-20 fw-400 lh-26',
        'text-b3': 'text-18 fw-400 lh-25',
        'text-b4': 'text-16 fw-400 lh-24',
        'text-b5': 'text-14 fw-400 lh-22',
        'text-b6': 'text-12 fw-400 lh-18',
        'text-b7': 'text-11 fw-400 lh-13',
        'text-b8': 'text-10 fw-400 lh-11',

        'text-n1': 'text-24 font-num fw-500 lh-30',
        'text-n2': 'text-20 font-num fw-500 lh-26',
        'text-n3': 'text-18 font-num fw-500 lh-25',
        'text-n4': 'text-16 font-num fw-500 lh-24',
        'text-n5': 'text-14 font-num fw-500 lh-22',
        'text-n6': 'text-12 font-num fw-500 lh-18',
        'text-n7': 'text-11 font-num fw-500 lh-13',
        'text-n8': 'text-10 font-num fw-500 lh-11',
      },
    ],
  }
})

export default presetEcho
