import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 全局配置
import { request } from './api/request'

// 导入全局样式表
import './assets/scss/global.scss'

// 全局使用
Vue.prototype.$http = request
Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
