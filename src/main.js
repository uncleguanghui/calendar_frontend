import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import { Button } from "ant-design-vue"; // 按需引用组件

Vue.config.productionTip = false;
Vue.use(Button); // 按需引用组件

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
