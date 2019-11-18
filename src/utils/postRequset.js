import axios from 'axios';
import { Message } from 'element-ui';
import router from '@/router/index';
import { GlobalConst } from '@/utils/index';
const { isProd, loginOut, postApi } = GlobalConst;

// 设置默认请求头
axios.defaults.headers.post['Content-Type'] = 'application/json';
// 参数序列化
axios.defaults.transformRequest = [
  function(data = {}) {
    return JSON.stringify(data);
  }
];

const service = axios.create({
  baseURL: postApi, // postApi
  timeout: 60 * 1000, // request timeout
  withCredentials: false
});

// respone interceptor
service.interceptors.response.use(
  response => {
    const { code, msg } = response.data;
    console.log('请求返回', response.data);
    if (code === '1001') {
      return response.data;
    } else if (code === '1002') {
      if (isProd) {
        window.location.href = loginOut;
      } else {
        router.push({ path: '/login' });
      }
    } else {
      Message({
        message: msg,
        type: 'error',
        duration: 3 * 1000
      });

      const err = `requestURL: ${response.request.responseURL}  code: ${code}  msg: ${msg}`;
      return Promise.reject(err);
    }
  },
  error => {
    Message({
      message: error.message,
      type: 'error',
      duration: 3 * 1000
    });
    return Promise.reject(error);
  }
);

export default service;
