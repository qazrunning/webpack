module.exports = {
  presets: [
    '@vue/app'
  ],
  ignore:['./public/hj/js/webVideoCtrl.js'],
  plugins: [
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-transform-runtime',
    '@babel/plugin-transform-modules-commonjs'
  ]
}