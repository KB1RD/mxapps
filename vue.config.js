const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
  chainWebpack: config => {
    config
      .plugin('copy-webpack-plugin')
      .use(CopyPlugin, [[
        { from: 'node_modules/mx-host-core-worker/dist/', to: '' }
      ]])
  }
}
