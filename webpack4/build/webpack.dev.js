/**
 * merge 用来合并配置
 */
const merge = require('webpack-merge');
const base = require('./webpack.base.js');
const path = require('path');

module.exports = merge(base, {
  // 应该是一种模式  开发中方便定位错误？ 完成后实战一下
  devtool: 'inline-source-map',
  devServer: { // 开发服务器
    contentBase: './dist'
  },
  output: { // 输出
    filename: 'js/[name].[hash].js', // 每次保存 hash 都变化  默认是这么写的  用的是我项目中起名字的name 和打包的一个hash值 暂时认为是固定写法
    path: path.resolve(__dirname, './dist')
  },
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [
          'style-loader',
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
  mode: 'development',
})