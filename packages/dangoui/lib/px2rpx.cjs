module.exports = (options = {}) => {
  return {
    postcssPlugin: 'postcss-px-2-rpx', // 插件名称
    Once: (root) => {
      root.walkDecls((decl) => {
        if (decl.value.includes('px')) {
          decl.value = decl.value.replace(/(\d*\.?\d+)px/g, (match, p1) => {
            const value = parseFloat(p1) * 2 // 将 px 值乘以 2
            return `${value}rpx`
          })
        }
      })
    },
  }
}

module.exports.postcss = true
