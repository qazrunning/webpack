import Vue from 'vue'
// import SvgIcon from '@/components/SvgIcon' // svg组件

// // 注册到全局
// Vue.component('svg-icon', SvgIcon)

const requireAll = requireContext => requireContext.keys().map(requireContext)
const req = require.context('./fxSvg', false, /\.svg$/)
const filesReq = require.context('./filesSvg', false, /\.svg$/)
requireAll(req)
requireAll(filesReq)
