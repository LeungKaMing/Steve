const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')

const baseConfig = require('./webpack.base.config')
baseConfig.entry = {ssrClientEntry: path.resolve(__dirname, '../src/entry/entry-client.js')}
baseConfig.output.libraryTarget = 'commonjs2'
// baseConfig.optimization = {}  // ssr有分块设置会报错

module.exports = merge(baseConfig, {
  devtool: 'inline-source-map',
  mode: 'development',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.VUE_ENV': '"client"'
    }),
    new VueSSRClientPlugin()
  ]
})