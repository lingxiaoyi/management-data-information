const fecha = (function() {
  const formatFlags = {
    'M+': function(dateObj) {
      return dateObj.getMonth() + 1
    }, // 月份
    'D+': function(dateObj) {
      return dateObj.getDate()
    }, // 日
    'h+': function(dateObj) {
      return dateObj.getHours()
    }, // 小时
    'm+': function(dateObj) {
      return dateObj.getMinutes()
    }, // 分
    's+': function(dateObj) {
      return dateObj.getSeconds()
    }, // 秒
    'q+': function(dateObj) {
      return Math.floor((dateObj.getMonth() + 3) / 3)
    }, // 季度
    S: function(dateObj) {
      return dateObj.getMilliseconds()
    } // 毫秒
  }
  return {
    /** *
     * Format a date
     * @method format
     * @param {Date|number} dateObj
     */
    format(dateObj, format) {
      if (typeof dateObj === 'number') {
        dateObj = new Date(dateObj)
      }

      if (Object.prototype.toString.call(dateObj) !== '[object Date]' || isNaN(dateObj.getTime())) {
        throw new Error('Date.format expects to get a string or Date')
      }

      if (/(Y+)/.test(format)) {
        format = format.replace(RegExp.$1, (`${dateObj.getFullYear()}`).substr(4 - RegExp.$1.length))
      }

      for (const k in formatFlags) {
        if (new RegExp(`(${k})`).test(format)) {
          const value = formatFlags[k](dateObj)
          format = format.replace(
            RegExp.$1,
            RegExp.$1.length === 1 ? value : (`00${value}`).substr((`${value}`).length)
          )
        }
      }
      return format
    }
  }
})()
export default fecha
