const path = require('path');
const webpack = require('webpack');
const ManifestPlugin = require('webpack-manifest-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
      app: path.resolve(__dirname, '../src/entry/index.js')
    },
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, '../dist/assets/'),
      publicPath: '/assets/'
    },
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
  