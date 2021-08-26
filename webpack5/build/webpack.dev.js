const { merge } = require('webpack-merge');
const base = require('./webpack.base.js');
const path = require('path');
module.exports = merge(base, {
  devtool: 'inline-source-map',
  devServer: {
    static: {
      directory: path.join(__dirname, '../public'),
    },
    compress: true,// 为每个静态文件开启 gzip compression
    port: 9000,
    // 热替换
    hot: true,
    // 打开浏览器
    open: true,
    // 全屏显示错误
    client: {
      overlay: true,
    },
  },
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      },
      // webpack5  不需要在加载loader了？  直接用内置的资源模块
      {
        test: /\.(pnf|jpg|svg|gif)$/,
        type: 'asset/resource'
      }
    ]
  },
  plugins: [
  ],
  output: {
    filename: 'js/[name].[hash].js', // 每次保存 hash 都变化  默认是这么写的  用的是我项目中起名字的name 和打包的一个hash值 暂时认为是固定写法
    path: path.resolve(__dirname, './dist'),
   
  },
  mode: 'development',
})