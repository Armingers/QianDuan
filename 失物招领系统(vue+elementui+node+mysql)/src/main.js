import Vue from 'vue'

import App from './App.vue'
import axios from 'axios'
// 引入element-ui
import Element from 'element-ui'
import 'element-theme-chalk';
// 引入路由管理
import router from './router/index';
// 引入接口管理
// import api from './api/api.js'
// 引入拖拽指令
// import drag from './drag';

// Vue.config.productionTip = false

Vue.prototype.$axios = axios;
//将 axios 库挂载到 Vue 实例的原型上，使得在 Vue 实例中可以通过 this.$axios 来调用 axios 库中的方法
// 调用接口管理
// Vue.prototype.$api = api;

Vue.use(Element)  // 使用elementui
// Vue.use(drag);

//使用 $mount 方法将 Vue 实例挂载到 #app 元素上。
new Vue({
  render: h => h(App),
  router
}).$mount('#app')
