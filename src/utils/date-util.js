/**
 * 基于element-ui 工具类
 * https://github.com/ElemeFE/element/blob/dev/src/utils/date-util.js
 */

import fecha from './date';

/**
 * 返回指定长度的数组
 * @param {Number} n 数组长度
 * @return {Array} [0, 1]
 */
export const range = function(n) {
  return Array.apply(null, { length: n }).map((_, n) => n);
};

/**
 * 判断传入数据是不是时间
 * @param {String|Number|Date}
 * @return {Boolean}
 */
export const isDate = function(date) {
  if (date === null || date === undefined) return false;
  if (isNaN(new Date(date).getTime())) return false;
  if (Array.isArray(date)) return false; // deal with `new Date([ new Date() ]) -> new Date()`
  return true;
};

/**
 * 判断传入数据是不是时间对象
 * @param {String|Number|Date}
 * @return {Boolean}
 */
export const isDateObject = function(val) {
  return val instanceof Date;
};

/**
 * 将时间戳、时间字符串、时间对象转为时间
 * @param {String|Number|Date}
 * @return {Date|null}
 */
export const toDate = function(date) {
  return isDate(date) ? new Date(date) : null;
};

/**
 * 格式化时间
 * @param {Date|Number} date 时间对象
 * @param {String} format YYYY-MM-DD hh:mm:ss
 * @return {String} 2019-09-01
 */
export const formatDate = function(date, format = 'YYYY-MM-DD') {
  if (!date) return '';
  return fecha.format(date, format);
};

/**
 * 获取传入日期所在月份的第一天的时间对象
 * @param {Date} date 时间对象
 * @return {Date} Wed Aug 21 2019 10:10:10 GMT+0800 (中国标准时间)
 */
export const getFirstDateOfMonth = function(date) {
  const temp = new Date(date.getTime());
  temp.setDate(1);
  return temp;
};

/**
 * 获取传入年月的月份总天数
 * @param {Date} date 时间对象
 * @return {Date} Wed Aug 21 2019 10:10:10 GMT+0800 (中国标准时间)
 */
export const getDayCountOfMonth = function(year, month) {
  if (month === 3 || month === 5 || month === 8 || month === 10) {
    return 30;
  }
  if (month === 1) {
    if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
      return 29;
    } else {
      return 28;
    }
  }
  return 31;
};

/**
 * 获取初入日期是当年的第几周
 * @param {Date} date 时间对象
 * @return {Number} 1
 */
export const getWeekNumber = function(src) {
  if (!isDateObject(src)) return 0;

  const date = new Date(src.getTime());
  date.setHours(0, 0, 0, 0);
  // Thursday in current week decides the year.
  date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
  // January 4 is always in week 1.
  const week1 = new Date(date.getFullYear(), 0, 4);
  // Adjust to Thursday in week 1 and count number of weeks from date to week 1.
  // Rounding should be fine for Daylight Saving Time. Its shift should never be more than 12 hours.
  return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7);
};

/**
 * 将传入时间对象的时分秒设置为 00:00:00
 * @param {Date} date 时间对象
 * @return {Date} Wed Aug 21 2019 00:00:00 GMT+0800 (中国标准时间)
 */
export const clearTime = function(date) {
  if (!isDateObject(date)) return null;
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

/**
 * 修改传入日期的年月日
 * @param {Date} date 时间对象
 * @param {String|Number} y 年
 * @param {String|Number} m 月
 * @param {String|Number} d 日
 * @return {Date} Wed Aug 21 2019 09:14:20 GMT+0800 (中国标准时间)
 */
export const modifyDate = function(date, y, m, d) {
  if (!isDateObject(date)) return null;
  return new Date(y, m, d, date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
};

/**
 * 获取前一天或者几天的时间对象
 * @param {Date} date 时间对象
 * @param {Number} amount 前几天
 * @return {Date} Tue Aug 20 2019 00:00:00 GMT+0800 (中国标准时间)
 */
export const prevDate = function(date, amount = 1) {
  if (!isDateObject(date)) return null;
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() - amount);
};

/**
 * 获取后几天的时间对象数组(从传入日期开始)
 * @param {Date} date 开始时间对象
 * @param {Number} amount 后面多少天
 * @return {Date} [Sun Sep 01 2019 00:00:00 GMT+0800 (中国标准时间), Sun Sep 01 2019 00:00:00 GMT+0800 (中国标准时间), ...]
 */
export const nextDates = function(date, amount = 1) {
  if (!isDateObject(date)) return [];
  return range(amount).map((_, index) => new Date(date.getTime() + 60 * 60 * 1000 * 24 * index));
};

/**
 * 修改日期年和月
 * @param {Date} date 时间对象
 * @param {String} year 年
 * @param {String} month 月
 * @return {Date} Wed Aug 21 2019 10:10:10 GMT+0800 (中国标准时间)
 */
export const changeYearMonthAndClampDate = function(date, year, month) {
  // clamp date to the number of days in `year`, `month`
  // eg: (2010-1-31, 2010, 2) => 2010-2-28
  const monthDate = Math.min(date.getDate(), getDayCountOfMonth(year, month));
  return modifyDate(date, year, month, monthDate);
};

/**
 * 获取传入日期的上一个月的今天
 * @param {Date} date 时间对象
 * @return {Date} Wed Aug 21 2019 10:10:10 GMT+0800 (中国标准时间)
 */
export const prevMonth = function(date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  return month === 0
    ? changeYearMonthAndClampDate(date, year - 1, 11)
    : changeYearMonthAndClampDate(date, year, month - 1);
};

/**
 * 获取传入日期的下一个月
 * @param {Date} date 时间对象
 * @return {Date} Wed Aug 21 2019 10:10:10 GMT+0800 (中国标准时间)
 */
export const nextMonth = function(date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  return month === 11
    ? changeYearMonthAndClampDate(date, year + 1, 0)
    : changeYearMonthAndClampDate(date, year, month + 1);
};

/**
 * 获取传入日期的上一年
 * @param {Date} date 时间对象
 * @return {Date} Wed Aug 21 2019 10:10:10 GMT+0800 (中国标准时间)
 */
export const prevYear = function(date, amount = 1) {
  const year = date.getFullYear();
  const month = date.getMonth();
  return changeYearMonthAndClampDate(date, year - amount, month);
};

/**
 * 获取传入日期的下一年
 * @param {Date} date 时间对象
 * @return {Date} Wed Aug 21 2019 10:10:10 GMT+0800 (中国标准时间)
 */
export const nextYear = function(date, amount = 1) {
  const year = date.getFullYear();
  const month = date.getMonth();
  return changeYearMonthAndClampDate(date, year + amount, month);
};
