const webpack = require('webpack');
const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');

const baseConfig = require('./webpack.base.config')

module.exports = merge(baseConfig, {
  devtool: 'source-map',
  mode: 'production',
  plugins: [
    new ManifestPlugin(),
    new UglifyJSPlugin({
        sourceMap: true
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ]
})