// 格式化时间
export function getQueryObject(url) {
  url = url == null ? window.location.href : url;
  const search = url.substring(url.lastIndexOf('?') + 1);
  const obj = {};
  const reg = /([^?&=]+)=([^?&=]*)/g;
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1);
    let val = decodeURIComponent($2);
    val = String(val);
    obj[name] = val;
    return rs;
  });
  return obj;
}

export function scrollTo(element, to, duration) {
  if (duration <= 0) return;
  const difference = to - element.scrollTop;
  const perTick = (difference / duration) * 10;
  setTimeout(() => {
    console.log(new Date());
    element.scrollTop = element.scrollTop + perTick;
    if (element.scrollTop === to) return;
    scrollTo(element, to, duration - 10);
  }, 10);
}

// 防抖
export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result;

  const later = function() {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp;

    // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      }
    }
  };

  return function(...args) {
    context = this;
    timestamp = +new Date();
    const callNow = immediate && !timeout;
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }

    return result;
  };
}

/**
 * 简单的深拷贝
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 */
export function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'shallowClone');
  }
  if (source === null) {
    return {};
  }
  const targetObj = source.constructor === Array ? [] : {};
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys]);
    } else {
      targetObj[keys] = source[keys];
    }
  });
  return targetObj;
}

/**
 * 数组去重
 * @param  {[array]} arr
 * @return {[array]}
 */
export function uniqueArr(arr) {
  return Array.from(new Set(arr));
}

/**
 * 获取url中参数的值
 * @param  {[type]} name 参数名
 * @return {[type]}      参数值
 */
export function getQueryString(name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
  var url = window.location.search;
  var r = url.substr(1).match(reg);
  if (r != null) return decodeURI(r[2]);
  return null;
}

/**
 * 格式化日期
 * @param  {date} date 要格式化的时间
 * @param  {stirng} str 连接字符串
 * @return {date}
 */
export function formatDate(date, str = '-') {
  // const arr = new Date(date).toLocaleDateString().match(/\d+/g)
  const time = new Date(date);
  const year = time.getFullYear();
  const month = time.getMonth() + 1;
  const day = time.getDate();
  const arr = [year, month, day];
  return arr.map(e => String(e).padStart(2, 0)).join(str);
}

/**
 * 获取距离今天，d天的时间
 * @param  {number} d 间隔天数
 * @param  {stirng} str 连接字符串
 * @return {date}
 */
export function subtractDate(d = 0, str = '-') {
  const date = +new Date() - d * 24 * 3600 * 1000;
  return formatDate(date, str);
}

/**
 * 类型判断
 * @param  {any}  任意类型
 * @return {stirng} 返回类型字符串
 */
export function typeCheck(param) {
  return Object.prototype.toString.call(param).slice(8, -1);
}

/**
 * 类型日期是否为周末
 * @param  {string|number}  日期格式 如20190101
 * @return {boolean}
 */
export function dateIsWeekend(date) {
  const d = String(date).replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
  const day = new Date(d).getDay();
  return day === 6 || day === 0;
}

// 是否为正式服
/* export const isProd = ['zhihuizhangyu.com'].indexOf(window.location.host) > -1; */

export const isProd = ['zhihuizhangyu.com'].some(item => {
  return window.location.host.indexOf(item) > -1;
});
/**
 * 全局常量
 */
export const GlobalConst = {
  //  是否为正式服
  isProd: isProd,
  // 退出登录跳转(正式服)
  loginOut: '//gxoa.021.com/index.php',
  // 登录成功跳转(正式服)
  loginRedirect: `//${window.location.host}/datools/#`,
  // api接口地址
  // baseApi: isProd ? `//${window.location.host}/toolsapi/` : '//123.59.82.203/toolsapi/'
  // baseApi: isProd ? `//${window.location.host}/toolsapi/` : '//172.19.14.71:8080/'
  baseApi: isProd ? `//${window.location.host}/toolsapi/` : `//dc.021.com/toolsapi/`,
  // baseApi: isProd ? `//${window.location.host}/toolsapi/` : `//10.42.3.185:11001/dmptools-api/common/requestbody/`,
  postApi: isProd
    ? `//${window.location.host}/dmptools-api/common/requestbody/`
    : `//10.42.3.185:11001/dmptools-api/common/requestbody/`
};
