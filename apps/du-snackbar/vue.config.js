module.exports = {
  outputDir: 'dist/',
  chainWebpack: (config) => {
    config.merge({
      externals: ['vue'],
    })
  },
  css: {
    extract: false,
  },
}
