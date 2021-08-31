
import Vue from 'vue'


// import ViewUI from 'view-design';
// import 'view-design/dist/styles/iview.css';
// Vue.use(ViewUI)
import 'font-awesome/css/font-awesome.css'

import fxlogin2 from '@skyland/fxlogin2'
Vue.use(fxlogin2);


import Login from './views/Login.vue'
Vue.config.productionTip = false
new Vue({
  render: h => h(Login),
}).$mount('#login')

