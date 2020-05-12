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
  Avatar,
  Collapse,
  Checkbox,
  Tag,
  Tabs,
  TimePicker,
  Popover,
  Popconfirm
} from "ant-design-vue";
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
import axios from "axios";
import moment from "moment";
import "moment/locale/zh-cn";
import request from "./utils/request";
import dateFormat from "./utils/dateFormat";
import Plan from "./utils/planObj";
import VueClipboard from "vue-clipboard2";

moment.locale("zh-cn");
VueClipboard.config.autoSetContainer = true;

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
Vue.use(Collapse);
Vue.use(Checkbox);
Vue.use(Tag);
Vue.use(Tabs);
Vue.use(TimePicker);
Vue.use(Popover);
Vue.use(Popconfirm);

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.use(VueClipboard);

Vue.prototype.$message = Message;
Vue.prototype.$notification = Notification;
Vue.prototype.$moment = moment;
Vue.prototype.$axios = axios;
Vue.prototype.$request = request;
Vue.prototype.$dateFormat = dateFormat;
Vue.prototype.$Plan = Plan;

process.env.VUE_APP_MOCK && require("./mock/index.js");

// 允许在控制台使用函数，方便调试
window.chineseLunar = require("chinese-lunar");
window.Mock = require("mockjs");

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
