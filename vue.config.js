
const CompressionPlugin = require('compression-webpack-plugin')

module.exports = {
  publicPath: './',
  devServer: {
    port: 8001,
    open: true
  },
  chainWebpack: config => {
    // 发布模式
    config.when(process.env.NODE_ENV === 'production', config => {
      config.entry('app').clear().add('./src/main-prod.js')

      config.set('externals', {
        vue: 'Vue',
        'vue-router': 'VueRouter',
        axios: 'axios',
        nprogress: 'nprogress',
        'babel-polyfill': 'babel-polyfill'
      })

      config.plugin('html').tap(args => {
        args[0].isProd = true
        return args
      })
      // 开启图片压缩
      config.module.rule('images')
        .test(/\.(png|jpe?g|gif|svg)(\?.*)?$/)
        .use('image-webpack-loader')
        .loader('image-webpack-loader')
        .options({ bypassOnDebug: true })
      // 开启js、css压缩
      config.plugin('compressionPlugin')
        .use(new CompressionPlugin({
          test: /\.js$|\.html$|.\css/, // 匹配文件名
          threshold: 10240, // 对超过10k的数据压缩
          deleteOriginalAssets: false // 不删除源文件
        }))
    })

    // 开发模式
    config.when(process.env.NODE_ENV === 'development', config => {
      config.entry('app').clear().add('./src/main-dev.js')

      config.plugin('html').tap(args => {
        args[0].isProd = false
        return args
      })
    })
  }

}
