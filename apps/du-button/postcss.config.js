module.exports = {
  plugins: {
    'postcss-px-to-viewport': {
      unitToConvert: 'rpx',
      viewportWidth: 750,
      viewportHeight: 1334,
      unitPrecision: 3,
      viewportUnit: 'rem',
      fontViewportUnit: 'rem',
      selectorBlackList: ['.ignore'],
      minPixelValue: 1, // ios对于小于1px的border不显示
      mediaQuery: false,
    },
    cssnano: {
      'cssnano-preset-advanced': {
        zindex: false,
      },
    },
  },
};
