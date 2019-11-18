import axios from 'axios';
import { Message } from 'element-ui';
//import router from '@/router/index';
import { GlobalConst } from '@/utils/index';
const { isProd, loginOut } = GlobalConst;

const service = axios.create({
  timeout: 60 * 1000, // request timeout
  withCredentials: true,
  crosssDomain: true,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json;charset=utf-8',
    withcredentials: true
  }
});

// respone interceptor
service.interceptors.response.use(
  response => {
    const { status, statusText } = response;
    if (status === 200) {
      if (response.data.code === 401 || response.data.code === -1) {
        if (isProd) {
          window.location.href = loginOut;
        } else {
          Message({
            message: response.data.msg,
            type: 'error',
            duration: 3 * 1000
          });
          //router.push({ path: '/login' });
        }
      } else if (response.data.code && response.data.code !== 0) {
        Message({
          message: response.data.msg,
          type: 'error',
          duration: 3 * 1000
        });
      }

      return response.data;
    } else {
      Message({
        message: statusText,
        type: 'error',
        duration: 3 * 1000
      });

      const err = `requestURL: ${response.request.responseURL}  status: ${status}  msg: ${statusText}`;
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
