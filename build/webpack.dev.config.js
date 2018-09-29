const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')

const baseConfig = require('./webpack.base.config')

module.exports = merge(baseConfig, {
  devtool: 'inline-source-map',
  devServer: {
    // 这里指定dev-server根路径后，通过跟publicPath拼接，生成一个只有webpack-dev-server才能访问的静态资源路径 => /dist/assets/ 【跟实际打包构建输出的路径一样】
    contentBase: path.resolve(__dirname, "../dist"),
    inline:true,
    hot: true,
    port: 9090
  },
  mode: 'development',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    }),
    new VueSSRClientPlugin()
  ]
})