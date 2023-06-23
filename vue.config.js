const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  // publicPath: process.env.NODE_ENV === 'production'
  //   ? '/tcc-ui/'
  //   : '/'
  devServer: {
    // open: process.platform === 'darwin',
    // host: '0.0.0.0',
    // port: 8085, // CHANGE YOUR PORT HERE!
    // https: true,
    // hotOnly: false,
  },
})
