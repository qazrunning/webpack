import Vue from 'vue'
import bigScreen from './views/bigScreen.vue'
import dataV from '@jiaminghi/data-view'

Vue.use(dataV)
Vue.config.productionTip = false

new Vue({
  render: h => h(bigScreen),
}).$mount('#bigScreen')
