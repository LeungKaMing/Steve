const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: path.resolve(__dirname, '../src/entry/index.js'),
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, '../dist/assets/')
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
      title: '引入HtmlWebpackPlugin',
      template: path.resolve(__dirname, '../src/template/index.html'),
      filename: path.resolve(__dirname, '../dist/index.html'),
      inject: true,
      minify: true,
      showErrors: true
    })
  ]
};
