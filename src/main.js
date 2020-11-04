import Vue from "vue";
import App from "./App.vue";
import router from "./router/index.js";
import store from "./store/index.js";
import toast from './components/common/toast/index.js'

// 使用自定义插件
Vue.use(toast);

Vue.config.productionTip = false;

// Vue.prototype.$bus = new Vue();

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
