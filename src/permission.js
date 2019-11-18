import router from './router';
//import store from './store';
import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css'; // progress bar style
//import { setCookies, getCookies } from '@/utils/auth';
//import { /* getQueryString,  */ GlobalConst } from '@/utils/index';
//const { isProd/* , loginOut */ } = GlobalConst;

NProgress.configure({ showSpinner: false }); // NProgress Configuration
/* function getQueryString(name) {
  let reg = `(^|[&?])${name}=([^&]*)(&|$)`;
  let r = window.location.hash.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
} */
// 钉钉登录
/* const username = getQueryString('username');
const openId = getQueryString('openId');
const sign = getQueryString('sign');
//const ExpiresTime = 1 / 4;
const menuList = localStorage.getItem('menuList') || {};

if (!!username && !!sign) {
  // 登录成功
  store.dispatch('user/loginBySign', { username, openId, sign });
} else if (!menuList) {
  if (isProd) {
    window.location.href = '/#/401';
  } else {
    window.location.href = '/#/login';
  }
} */

router.beforeEach((to, from, next) => {
  //const whiteList = JSON.parse(localStorage.getItem('whiteList') || '[]');
  //const RedirectRouter = ['/login', '/401', '/404'];
  NProgress.start();

  // 重定向跳转页面
  /* if (RedirectRouter.includes(to.path)) {
    next();
    return;
  }
  // 判断登录及权限
  if (menuList) {
    // 如果登录，并且在路由白名单中
    next();
  } else {
    // 未登录-跳转登录页
    if (isProd) {
      next({ path: '/401' });
    } else {
      next({ path: '/login' });
    }
  } */
  next();
  NProgress.done();
});

router.afterEach(() => {
  NProgress.done(); // finish progress bar
});
