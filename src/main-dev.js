import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 全局配置
import 'element-ui/lib/theme-chalk/index.css'
import { request } from './api/request'

// 导入全局样式表
import './assets/scss/global.scss'
// 第三方包
import ElementUI from 'element-ui'

// 全局使用
Vue.use(ElementUI)
Vue.prototype.$http = request
Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
