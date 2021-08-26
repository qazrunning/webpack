const path = require('path');
// 合并配置文件
const merge = require('webpack-merge');
const base = require('./webpack.base.js');
// 打包之前清除文件
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// 分离CSS插件
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// 压缩css和js的插件 optimize-css-assets-webpack-plugin uglifyjs-webpack-plugin
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
module.exports = merge(base, {
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // 这里可以指定一个 publicPath
              // 默认使用 webpackOptions.output中的publicPath
              publicPath: '../'
            },
          },
          'css-loader',
          'postcss-loader',
          'less-loader',
        ]
      },
      //图片压缩和预处理
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: '[name].[hash].[ext]',
          outputPath: 'image/',
          // 一个是否用es6的编译模式
          esModule: false
        }
      },
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "css/[name].[hash].css",
      chunkFilename: 'css/[id].[hash].css'
    })
  ],
  // webpack提供的一个叫优化的东西？
  optimization: {
    // 分离chunks
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          name: "vendor",
          test: /[\\/]node_modules[\\/]/,
          priority: 10,
          chunks: "initial" // 只打包初始时依赖的第三方
        },
      }
    },
    // ...省略号
    minimizer: [
      // 压缩JS
      new UglifyJsPlugin({
        uglifyOptions: {
          compress: {
            warnings: false, // 去除警告
            drop_debugger: true, // 去除debugger
            drop_console: true // 去除console.log
          },
        },
        cache: true, // 开启缓存
        parallel: true, // 平行压缩
        sourceMap: false // set to true if you want JS source maps
      }),
      // 压缩css
      new OptimizeCSSAssetsPlugin({})
    ]
  },
  output: {
    filename: 'js/[name].[contenthash].js', //contenthash 若文件内容无变化，则contenthash 名称不变
    path: path.resolve(__dirname, '../dist')
  },
  mode: 'production',
})