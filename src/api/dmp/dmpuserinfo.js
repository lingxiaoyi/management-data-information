import request from '@/utils/request';

/**
 * 根据用户手机号码/imei/accid
 * 获取基础属性
 * @param {*} data
 */
export function queryUserBaseInfo(data) {
  return request({
    url: 'dmp/baseinfo',
    method: 'get',
    params: data
  }).then(res => res.data);
}

export function queryImeiList(data) {
  return request({
    url: 'dmp/getimeilist',
    method: 'get',
    params: data
  }).then(res => res.data);
}

/**
 * 根据用户手机号码/accid/imei
 * 获取用户活动属性数据
 * @param {*} data
 */
export function queryActiveInfoList(data) {
  return request({
    url: 'dmp/activeinfo',
    method: 'get',
    params: data
  }).then(res => res.data);
}

/**
 * 根据用户手机号码/accid/imei
 * 获取用户内容偏好- FenleiTop
 * @param {*} data
 */
export function queryNewsHobby(data) {
  return request({
    url: 'dmp/newshobby',
    method: 'get',
    params: data
  }).then(res => res.data);
}

/**
 * 根据用户手机号码/accid/imei
 * 获取用户内容偏好 - Recommend
 * @param {*} data
 */
export function queryRecNewsHobby(data) {
  return request({
    url: 'dmp/recnewshobby',
    method: 'get',
    params: data
  }).then(res => res.data);
}

/**
 * 根据用户手机号码/accid/imei
 * 获取用户视频偏好- FenleiTop
 * @param {*} data
 */
export function queryVideoHobby(data) {
  return request({
    url: 'dmp/videohobby',
    method: 'get',
    params: data
  }).then(res => res.data);
}

/**
 * 根据用户手机号码/accid/imei
 * 获取用户视频偏好 - Recommend
 * @param {*} data
 */
export function queryRecVideoHobby(data) {
  return request({
    url: 'dmp/recvideohobby',
    method: 'get',
    params: data
  }).then(res => res.data);
}

/**
 * 根据用户手机号码/accid/imei
 * 获取内容tag-图文
 * @param {*} data
 */
export function queryTnNewsTag(data) {
  return request({
    url: 'dmp/tnnewstag',
    method: 'get',
    params: data
  }).then(res => res.data);
}

/**
 * 根据用户手机号码/accid/imei
 * 获取内容tag-图文（预测）
 * @param {*} data
 */
export function queryTn2NewsTag(data) {
  return request({
    url: 'dmp/tntnewstag',
    method: 'get',
    params: data
  }).then(res => res.data);
}

/**
 * 根据用户手机号码/accid/imei
 * 获取内容tag-视频
 * @param {*} data
 */
export function queryTnVideoTag(data) {
  return request({
    url: 'dmp/tnvideotag',
    method: 'get',
    params: data
  }).then(res => res.data);
}

/**
 * 根据用户手机号码/accid/imei
 * 获取内容tag-视频
 * @param {*} data
 */
export function queryHobbyTag(data) {
  return request({
    url: 'dmp/hobbytag',
    method: 'get',
    params: data
  }).then(res => res.data);
}

/**
 * 基础数据-商业标签
 * @param {*} data
 */
export function queryBusiness(data) {
  return request({
    url: 'dmp/businesstag',
    method: 'get',
    params: data
  }).then(res => res.data);
}

/**
 * 用户行为--用户展现
 * @param {*} data
 */
export function queryUsershow(data) {
  return request({
    url: 'usershowdata/usershow',
    method: 'get',
    params: data
  }).then(res => res.data);
}

/**
 * 用户行为--用户点击
 * @param {*} data
 */
export function queryUserclick(data) {
  return request({
    url: 'usershowdata/userclick',
    method: 'get',
    params: data
  }).then(res => res.data);
}
