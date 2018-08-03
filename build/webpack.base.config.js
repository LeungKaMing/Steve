const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

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
					use: ExtractTextPlugin.extract({
						fallback: "style-loader",
						use: "css-loader"
					})
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
    optimization: {
      splitChunks: {
        chunks: "all", // 必须三选一： "initial" | "all"(推荐) | "async" (默认就是async)
        minSize: 30000, // 最小尺寸，30000
        minChunks: 1, // 最小 chunk ，默认1
        maxAsyncRequests: 5, // 最大异步请求数， 默认5
        maxInitialRequests : 3, // 最大初始化请求书，默认3
        automaticNameDelimiter: '~',// 打包分隔符
        name: function(){}, // 打包后的名称，此选项可接收 function
        cacheGroups:{ // 这里开始设置缓存的 chunks
          // 公共块抽离
          common: {
            minChunks: 2, // 引用最少2次被引用或以上都要抽离
            priority: 20,  // 优先级最高
            reuseExistingChunk: true, // 可设置是否重用该chunk
            enforce: true
          },
          // 第三方依赖抽离 => 引用一次或以上都要抽离
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            reuseExistingChunk: true, // 可设置是否重用该chunk
            enforce: true
          }
        }
      },
      runtimeChunk: {
        name: 'runtime',
      }
    },
    plugins: [
				new ExtractTextPlugin('[name].bundle.css'),
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
  