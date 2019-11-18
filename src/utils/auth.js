import Cookies from 'js-cookie';

const UserInfoKey = 'UserInfo';
const ExpiresTime = 1 / 4;

export function getCookies(key) {
  return Cookies.get(key);
}
export function setCookies(key, value, params) {
  return Cookies.set(key, value, params);
}
export function removeCookies(key) {
  return Cookies.remove(key);
}

// 用户信息
export function getUserInfo() {
  return Cookies.get(UserInfoKey) ? JSON.parse(Cookies.get(UserInfoKey)) : {};
}
export function setUserInfo(list) {
  return Cookies.set(UserInfoKey, JSON.stringify(list), {
    expires: ExpiresTime
  });
}
export function removeUserInfo() {
  Cookies.remove('HAS_LOGIN');
  Cookies.remove('USER_NAME');
  Cookies.remove('REAL_NAME');
  Cookies.remove(UserInfoKey);
}
export function getRealName() {
  return Cookies.get('REAL_NAME') || '管理员';
}
