const CompressionPlugin = require('compression-webpack-plugin')

module.exports = {
  chainWebpack: (config) => {
    const svgRule = config.module.rule('svg')

    svgRule.uses.clear()
    svgRule
      .use('babel-loader')
      .loader('babel-loader')
      .end()
      .use('vue-svg-loader')
      .loader('vue-svg-loader')

    if (process.env.NODE_ENV === 'production') {
      const gzipPlugin = config.plugin('gzip')
      gzipPlugin
        .use(CompressionPlugin, [{
          filename: '[path].gz[query]',
          algorithm: 'gzip',
          test: /\.js$|\.css$|\.html$/,
          compressionOptions: { level: 9 },
          // threshold: 0,
          // minRatio: 0.1,
          deleteOriginalAssets: false
        }])

      const brotliPlugin = config.plugin('brotli')
      brotliPlugin
        .use(CompressionPlugin, [{
          filename: '[path].br[query]',
          algorithm: 'brotliCompress',
          test: /\.(js|css|html|svg)$/,
          compressionOptions: { level: 11 },
          // threshold: 0,
          // minRatio: 0.1,
          deleteOriginalAssets: false
        }])
    }
  }
}
