const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const webpack = require('webpack');

module.exports = {
  entry: {
    app: path.resolve(__dirname, '../src/entry/index.js')
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, '../dist/assets/'),
    publicPath: '/assets/'
  },
  devtool: 'inline-source-map',
  devServer: {
    // 这里指定dev-server根路径后，通过跟publicPath拼接，生成一个只有webpack-dev-server才能访问的静态资源路径 => /dist/assets/ 【跟实际打包构建输出的路径一样】
    contentBase: path.resolve(__dirname, "../dist"),
    inline:true,
    hot: true,
    port: 9090
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader'
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          'file-loader'
        ]
      }
    ]
  },
  plugins: [
    new ManifestPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      title: '引入HtmlWebpackPlugin', // 默认模版为html，HtmlWebpackPlugin会自动将其转为lodash格式，这些自定义变量均可通过lodash模版的变量书写规则进行注入。
      template: path.resolve(__dirname, '../src/template/index.html'),
      filename: path.resolve(__dirname, '../dist/index.html'),
      inject: true,
      // minify: true,  // 有mode后就不需要了
      showErrors: true
    })
  ]
};
