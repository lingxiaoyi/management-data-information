import { Message } from 'element-ui';
import * as api from '@/api/login';
import router from '@/router/index';
import { getUserInfo, getRealName } from '@/utils/auth';
import { GlobalConst } from '@/utils/index';
const { isProd, loginOut, loginRedirect } = GlobalConst;
import URL from '@/constants/url';
import request from '@/utils/request';

const user = {
  namespaced: true,
  state: {
    whiteList: JSON.parse(localStorage.getItem('menuList') || '[]'),
    menuList: JSON.parse(localStorage.getItem('menuList') || '[]'),
    userInfo: getUserInfo(),
    realname: getRealName(),
    username: ''
  },

  mutations: {
    save: (state, payload) => {
      Object.keys(payload).forEach(e => {
        state[e] = payload[e];
      });
    }
  },

  actions: {
    // 用户名登录
    async LoginByUsername({ commit }, userInfo) {
      /* userInfo = {
        username: 'admin',
        password: '1q2w3e4r'
      }; */
      let res = await request({
        url: URL.login2,
        method: 'get',
        params: userInfo
      });
      if (res.code === 0) {
        commit('save', {
          username: 'uname'
        });
        router.push({ path: '/' });
      } else {
        Message({
          message: res.msg,
          type: 'warning',
          duration: 3 * 1000
        });
      }
    },
    // sign登录
    async loginBySign({ commit }, userInfo) {
      /* userInfo = {
        username: 'wangdeli',
        openId: '123456',
        sign: 'fb95b1d8abbd5c744286da9b5d00b0bc'
      }; */
      let res = await request({
        url: URL.login,
        method: 'get',
        params: userInfo
      });
      if (res.code !== 0) {
        //router.push({ path: '/401' });
        return;
      }
      const d = res.data.menu;
      const flattenPath = arr => {
        return arr.reduce((a, b) => {
          return b.children ? [...a, b.modelpage, ...flattenPath(b.children)] : [...a, b.modelpage];
        }, []);
      };
      if (d && d.length) {
        /* const whiteList = flattenPath(d)
          .filter(e => e)
          .map(e => e.slice(1)); */
        d.forEach(item => {
          delete item.modelpage;
        });
        commit('save', {
          menuList: d
        });
        localStorage.setItem('menuList', JSON.stringify(d ? d : []));
        console.log(d[0],d[0].children[0].modelpage.replace('#', ''));
        router.push({
          path: d[0].children[0].modelpage.replace('#', '')
        });
        //window.location.href = '/';
      } else {
        if (isProd) {
          window.location.href = loginOut;
        } else {
          router.push({
            path: '/401'
          });
        }
      }
    },
    // 获取权限列表
    getUserAuth({ commit }, user) {
      api.getUserAuth(user).then(res => {
        const d = res.data;
        const flattenPath = arr => {
          return arr.reduce((a, b) => {
            return b.children ? [...a, b.modelpage, ...flattenPath(b.children)] : [...a, b.modelpage];
          }, []);
        };
        const whiteList = flattenPath(d)
          .filter(e => e)
          .map(e => e.slice(1));
        if (d && d.length) {
          commit('save', {
            menuList: d,
            whiteList
          });
          localStorage.setItem('menuList', JSON.stringify(d ? d : []));
          localStorage.setItem('whiteList', JSON.stringify(whiteList || []));
          if (isProd) {
            window.location.href = loginRedirect + whiteList[0];
          } else {
            router.push({ path: '/' });
          }
        } else {
          if (isProd) {
            window.location.href = loginOut;
          } else {
            router.push({ path: '/login' });
          }
        }
      });
    },

    // 登出
    async LogOut({ commit }) {
      await request({
        url: URL.logout,
        method: 'get',
        params: {}
      });
      commit('save', {
        realname: '',
        username: ''
      });
      if (isProd) {
        window.location.href = loginOut;
      } else {
        router.push({ path: '/401' });
      }
    }
  }
};

export default user;
