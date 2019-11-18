import request from '@/utils/request';

/**
 * 根据用户手机号码/imei/accid
 * 获取基础属性
 * @param {*} data
 */
export function queryUserBaseInfo(data) {
  return request({
    url: 'octopus/baseinfo',
    method: 'get',
    params: data
  }).then(res => res.data);
}
