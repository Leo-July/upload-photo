/* eslint-disable */
// https://cli.vuejs.org/config/
module.exports = {
  productionSourceMap: true,
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  devServer: {
    proxy: {
      '/api.apiopen.top': {
        target: 'https://api.apiopen.top',
        changeOrigin: true,
        pathRewrite: {
          '^/api.apiopen.top': '/',
        },
      },
    },
    before: app => {
      // app is an express instance
    },
  },

  lintOnSave: true,
}
