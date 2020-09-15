const CopyPlugin = require('copy-webpack-plugin')
const OfflinePlugin = require('offline-plugin')

module.exports = {
  chainWebpack: config => {
    config
      .plugin('copy-webpack-plugin')
      .use(CopyPlugin, [[
        {
          context: 'node_modules/mx-host-core-worker/dist/',
          from: 'mx-host-core-worker-*',
          to: ''
        }
      ]])
    config
      .plugin('offline-plugin')
      .use(OfflinePlugin)
  }
}
