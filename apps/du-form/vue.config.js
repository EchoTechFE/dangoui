module.exports = {
  outputDir: 'dist/',
  chainWebpack: (config) => {
    config.merge({
      externals: ['vue', '@vue/composition-api'],
    })
  },
  css: {
    extract: false,
  },
}
