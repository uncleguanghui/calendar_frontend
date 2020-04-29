import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import {
  Button,
  Layout,
  Menu,
  Col,
  Row,
  Modal,
  Dropdown,
  Icon,
  Form,
  Select,
  Input,
  Divider,
  Switch,
  DatePicker,
  LocaleProvider,
  Notification,
  Message,
  Tooltip,
  Card,
  Avatar
} from "ant-design-vue";
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
import axios from "axios";
import moment from "moment";
import "moment/locale/zh-cn";

moment.locale("zh-cn");

Vue.config.productionTip = false;

Vue.use(Button);
Vue.use(Layout);
Vue.use(Menu);
Vue.use(Col);
Vue.use(Row);
Vue.use(Modal);
Vue.use(Dropdown);
Vue.use(Icon);
Vue.use(Form);
Vue.use(Select);
Vue.use(Input);
Vue.use(Divider);
Vue.use(Switch);
Vue.use(DatePicker);
Vue.use(LocaleProvider);
Vue.use(Tooltip);
Vue.use(Card);
Vue.use(Avatar);

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

Vue.prototype.$message = Message;
Vue.prototype.$notification = Notification;
Vue.prototype.$moment = moment;
Vue.prototype.$axios = axios;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
