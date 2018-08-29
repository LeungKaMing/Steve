const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const ModuleConcatenationPlugin = require('webpack/lib/optimize/ModuleConcatenationPlugin');
const webpack = require('webpack')
// vue-loader
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
    entry: {app: path.resolve(__dirname, '../src/entry/index.js'), vueEntry: path.resolve(__dirname, '../src/entry/vueEntry.js'), reactEntry: path.resolve(__dirname, '../src/entry/reactEntry.js')},
    output: {filename: '[name].[hash].js',path: path.resolve(__dirname, '../dist/assets/'),publicPath: '/assets/',chunkFilename: '[name].[hash].js'},
    module: {
      rules: [{test: /.(js|jsx)$/, exclude: /node_modules/, loader: 'babel-loader'}, {test: /.css$/, exclude: /node_modules/,use: ExtractTextPlugin.extract({fallback: 'style-loader',use: [{loader: 'css-loader'}, {loader: 'postcss-loader'}]})}, {test: /.(png|svg|jpe?g|gif)$/, exclude: /node_modules/, use: [{loader: 'file-loader'}, {loader: 'image-webpack-loader', options: { mozjpeg: {progressive: true,quality: 100},optipng: {enabled: false,},pngquant: {quality: '65-90',speed: 4},gifsicle: {interlaced: false,},webp: {quality: 75}}}]}, {test: /.(woff|woff2|eot|ttf|otf)$/, exclude: /node_modules/, use: ['file-loader']}, {test: /.vue$/,loader: 'vue-loader'}]
    },
    resolve:{
      alias:{
        'vue$':'vue/dist/vue.js'
      },
      extensions: ['.js', '.jsx', '.vue']
    },
    optimization: {
      splitChunks: {
        chunks: "all", // 必须三选一： "initial" | "all"(推荐) | "async" (默认就是async)；默认为async，表示只会提取异步加载模块的公共代码，initial表示只会提取初始入口模块的公共代码，all表示同时提取前两者的代码 => 见延伸阅读.md
        minSize: 30000, //模块大于30k会被抽离到公共模块
        minChunks: 1, //模块出现1次就会被抽离到公共模块
        maxAsyncRequests: 5, //异步模块，一次最多只能被加载5个
        maxInitialRequests: 3, //入口模块最多只能加载3个
        cacheGroups:{ // 这里开始设置缓存的 chunks
          // 公共块抽离 - 只抽离入口模块
          common: {
            chunks: 'initial',
            minChunks: 2, // 引用最少2次被引用或以上都要抽离
            priority: 20,  // 优先级最高
            reuseExistingChunk: true, // 可设置是否重用该chunk
            name: 'common',
            enforce: true
          },
          // 第三方依赖抽离 - 既抽离入口模块，又抽离异步引入的模块
          vendors: {
            minChunks: 1, // 引用最少2次被引用或以上都要抽离
            test: /[\\/]node_modules[\\/]/, 
            priority: 10,
            name: 'vendors',
            enforce: true
          }
        }
      }
    },
    // externals: {
    //   // 从cdn引入的就可以避免打包进js文件里了，这样就可以减少包的体积
    //   '_': 'lodash'
    // },
    plugins: [
        new VueLoaderPlugin(),  // vue-loader
        new ModuleConcatenationPlugin(),
        new webpack.ProvidePlugin({
          'window.l': 'lodash'
        }), // 让全局能直接访问lodash实例【跟分块并没关系！只是给全局提供更简便的方式！】
				new ExtractTextPlugin('[name].[hash].css'),
        new HtmlWebpackPlugin({title: process.env.NODE_ENV === 'production' ? 'webpack(prod)' : 'webpack(dev)',template: path.resolve(__dirname, '../src/template/index.html'),filename: path.resolve(__dirname, '../dist/index.html'), minify: true,showErrors: true,  chunks: ['common', 'vendors', 'app']}), new HtmlWebpackPlugin({title: process.env.NODE_ENV === 'production' ? 'webpack(prod)' : 'webpack(dev)',template: path.resolve(__dirname, '../src/template/vue.html'),filename: path.resolve(__dirname, '../dist/vue.html'), minify: true,showErrors: true, chunks: ['common', 'vendors', 'vueEntry']}), new HtmlWebpackPlugin({title: process.env.NODE_ENV === 'production' ? 'webpack(prod)' : 'webpack(dev)',template: path.resolve(__dirname, '../src/template/react.html'),filename: path.resolve(__dirname, '../dist/react.html'), minify: true,showErrors: true, chunks: ['common', 'vendors', 'reactEntry']})
    ]
  };
// 8/29/2018, 11:56:13 PM, written by Leung.
