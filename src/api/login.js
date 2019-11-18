import request from '@/utils/request';

/**
 * 获取权限菜单
 * @param {*} data
 */
export function getUserAuth(data) {
  return request({
    url: 'login/getauth',
    method: 'get',
    params: data
  }).then(res => res.data);
}

/**
 * 用户登录
 * @param {*} data
 */
export function loginIn(data) {
  return request({
    url: 'login/in',
    method: 'get',
    params: data
  }).then(res => res.data);
}

/**
 * 退出登录
 * @param {*} data
 */
export function loginOut(data) {
  return request({
    url: 'ddoauth/loginout',
    method: 'get',
    params: data
  }).then(res => res.data);
}
