import Vue from 'vue';

import 'normalize.css/normalize.css'; // A modern alternative to CSS resets
import 'element-ui/lib/theme-chalk/index.css';
import '@/styles/index.scss'; // global css

import VueLazyload from 'vue-lazyload';

import App from './App';
import router from './router';
import store from './store';
import Mixin from './mixins';
import VueClipboard from 'vue-clipboard2';

import * as Sentry from '@sentry/browser';
import * as Integrations from '@sentry/integrations';

//引入基本模板
let echarts = require('echarts/lib/echarts');
// 引入折线图等组件
require('echarts/lib/chart/line')
require('echarts/lib/chart/bar')
// require('echarts/lib/chart/radar')

// 引入提示框和title组件，图例
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
require('echarts/lib/component/legend')
Vue.prototype.$echarts = echarts;

import dayjs from 'dayjs';
Vue.prototype.dayjs = dayjs;

// 全局mixin
Vue.mixin(Mixin);
//Sentry
if( process.env.NODE_ENV !== 'development') {
  Sentry.init({
    dsn: 'https://db12cef31eca4af7a992d9230ff4f5d9@sentry.tt.cn/5',
    environment: process.env.NODE_ENV, // 指定当前代码运行的环境，方便错误筛选。
    integrations: [new Integrations.Vue({ Vue })]
  });
}
// 将Sentry绑定到Vue原型上，方便后面的实例使用。
Vue.prototype.$Sentry = Sentry;

import './icons'; // icon
import './permission'; // permission control 权限控制
Vue.use(VueClipboard);
// elment-ui按需引入
import {
  Pagination,
  Dialog,
  Autocomplete,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Menu,
  Submenu,
  MenuItem,
  MenuItemGroup,
  Input,
  Radio,
  RadioGroup,
  RadioButton,
  Checkbox,
  CheckboxButton,
  CheckboxGroup,
  Select,
  Option,
  OptionGroup,
  Button,
  ButtonGroup,
  Table,
  TableColumn,
  DatePicker,
  TimePicker,
  Popover,
  Tooltip,
  Breadcrumb,
  BreadcrumbItem,
  Form,
  FormItem,
  Tabs,
  TabPane,
  Tag,
  Alert,
  Icon,
  Row,
  Col,
  Badge,
  Card,
  Collapse,
  CollapseItem,
  Container,
  Header,
  Aside,
  Main,
  Footer,
  Loading,
  MessageBox,
  Message,
  Notification,
  Scrollbar,
  Upload
} from 'element-ui';

// 设置组件默认尺寸
Vue.prototype.$ELEMENT = { size: 'small' };

Vue.use(Pagination);
Vue.use(Dialog);
Vue.use(Autocomplete);
Vue.use(Dropdown);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(MenuItemGroup);
Vue.use(Input);
Vue.use(Radio);
Vue.use(RadioGroup);
Vue.use(RadioButton);
Vue.use(Checkbox);
Vue.use(CheckboxButton);
Vue.use(CheckboxGroup);
Vue.use(Select);
Vue.use(Option);
Vue.use(OptionGroup);
Vue.use(Button);
Vue.use(ButtonGroup);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(DatePicker);
Vue.use(TimePicker);
Vue.use(Popover);
Vue.use(Tooltip);
Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Tag);
Vue.use(Alert);
Vue.use(Icon);
Vue.use(Row);
Vue.use(Col);
Vue.use(Badge);
Vue.use(Card);
Vue.use(Collapse);
Vue.use(CollapseItem);
Vue.use(Container);
Vue.use(Header);
Vue.use(Aside);
Vue.use(Main);
Vue.use(Footer);
Vue.use(Scrollbar);
Vue.use(Upload);
Vue.use(Loading.directive);

Vue.prototype.$loading = Loading.service;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$notify = Notification;
Vue.prototype.$message = Message;

// lazyload-懒加载
Vue.use(VueLazyload, {
  try: 3
});

// 图表
Vue.config.productionTip = false;

router.beforeEach((to, from, next) => {
  // 在路由全局钩子beforeEach中，根据keepAlive属性，统一设置页面的缓存性
  // 作用是每次进入该组件，就将它缓存
  if (to.meta.keepAlive) {
    store.commit('keepAlive/addkeepAlive', to.name)
  }
  next()
})

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
});
