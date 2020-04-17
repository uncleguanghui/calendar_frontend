import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import { Button, Layout, Menu, Col, Row } from "ant-design-vue";

Vue.config.productionTip = false;
Vue.use(Button);
Vue.use(Layout);
Vue.use(Menu);
Vue.use(Col);
Vue.use(Row);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
