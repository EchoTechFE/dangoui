// postcss.config.js
module.exports = {
    /* Assets */
    'postcss-import': {},
    'postcss-url': {},

    /* Utils */
    'postcss-aspect-ratio-mini': {},
    'postcss-write-svg': {
      utf8: false,
    },

    /* Feature */
    'postcss-preset-env': {
      autoprefixer: true,
    },
    plugins: {
      /* Only H5 vw移动端适配 */
      'postcss-px-to-viewport': {
        unitToConvert: 'rpx',
        viewportWidth: 7500,
        viewportHeight: 1334,
        unitPrecision: 3,
        viewportUnit: 'rem',
        fontViewportUnit: 'rem',
        selectorBlackList: ['.ignore'],
        minPixelValue: 1, // ios对于小于1px的border不显示
        mediaQuery: false,
      },
    },
  };
