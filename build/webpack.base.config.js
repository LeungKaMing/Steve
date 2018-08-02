const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const ExtractTextPlugin = require("extract-text-webpack-plugin");

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
        new HtmlWebpackPlugin({
            title: process.env.NODE_ENV === 'production' ? 'webpack(prod)' : 'webpack(dev)', // 默认模版为html，HtmlWebpackPlugin会自动将其转为lodash格式，这些自定义变量均可通过lodash模版的变量书写规则进行注入。
            template: path.resolve(__dirname, '../src/template/index.html'),
            filename: path.resolve(__dirname, '../dist/index.html'),
            inject: true,
            // minify: true,  // 有mode后就不需要了
            showErrors: true
        })
    ]
  };
  