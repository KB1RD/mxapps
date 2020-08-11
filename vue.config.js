const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
  chainWebpack: config => {
    config
      .plugin('copy-webpack-plugin')
      .use(CopyPlugin, [[
        { from: 'test', to: '' }
      ]])
  }
}
