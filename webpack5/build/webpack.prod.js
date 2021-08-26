const { merge } = require('webpack-merge');
const base = require('./webpack.base.js');
const path = require('path');
// 压缩CSS插件
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')

const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
module.exports = merge(base, {
  optimization: {
    emitOnErrors: true,
    splitChunks: {
      chunks: 'all', // 所有的 chunks 代码公共的部分分离出来成为一个单独的文件
      cacheGroups: {
        vendor: {
          name: 'vendor',
          test: /[\\/]node_modules[\\/]/,
          priority: 10,
          chunks: 'initial', // 只打包初始时依赖的第三方
        },
      },
    },
    minimize: false, // 是否使用内部的压缩
    minimizer: [
      // js的压缩
      new UglifyJsPlugin({
        uglifyOptions: {
          warnings: false,
          compress: {
            drop_debugger: true,
            // drop_console: true,
          },
        },
        cache: true, // 开启缓存
        parallel: true, // 允许并发
        sourceMap: true, // set to true if you want JS source maps
      }),
      // css的压缩
      new CssMinimizerPlugin(),
    ],
  },
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // you can specify a publicPath here
              // by default it use publicPath in webpackOptions.output
              publicPath: '../',
            },
          },
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        type: 'asset',
      },
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: 'css/[name].[contenthash].css',
      chunkFilename: 'css/[name].[contenthash].css',
    }),
  ],
  mode: 'production',
  output: {
    filename: 'js/[name].[contenthash].js',
    path: path.resolve(__dirname, '../dist'),
    assetModuleFilename: 'images/[hash][ext][query]', //  指定asset 导出的文件名以及位置
    environment: {
      // 是否使用箭头函数
      arrowFunction: false,
      // 是否保留解构？
      destructuring: false,
    },
    // 清除目标文件
    clean: true,
  },
})