module.exports = {
  plugins: {
    'postcss-px-to-viewport': {
      unitToConvert: 'rpx',
      viewportWidth: 7500,
      viewportHeight: 1334,
      unitPrecision: 3,
      viewportUnit: 'rem',
      fontViewportUnit: 'rem',
      selectorBlackList: ['.ignore'],
      minPixelValue: 1,
      mediaQuery: false,
    },
    cssnano: {
      'cssnano-preset-advanced': {
        zindex: false,
      },
    },
  },
};
