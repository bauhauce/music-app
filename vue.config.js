const path = require('path')

module.exports = {
  // publicPath: '/music-test/',
  configureWebpack: {
    resolve: {
      alias: {
        api: path.resolve(__dirname, './src/api'),
        styles: path.resolve(__dirname, './src/assets/styles'),
        views: path.resolve(__dirname, './src/views'),
        store: path.resolve(__dirname, './src/store'),
        common: path.resolve(__dirname, './src/common'),
        components: path.resolve(__dirname, './src/components')
      }

    }
  }
}
