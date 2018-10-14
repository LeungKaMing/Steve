const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')

const baseConfig = require('./webpack.base.config')
baseConfig.entry = {ssrServerEntry: path.resolve(__dirname, '../src/entry/entry-server.js')}
baseConfig.output.libraryTarget = 'commonjs2'
baseConfig.plugins.pop()
baseConfig.optimization = {}  // ssr有分块设置会报错

module.exports = merge(baseConfig, {
  target: 'node',
  devtool: 'inline-source-map',
  mode: 'development',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.VUE_ENV': '"server"'
    }),
    new VueSSRServerPlugin()
  ]
})