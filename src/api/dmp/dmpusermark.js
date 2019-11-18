import request from '@/utils/request';

/**
 *  查询标签分类
 */
export function queryTagsType(data) {
  return request({
    url: 'dmpmark/poitag',
    method: 'get',
    params: data
  }).then(res => res.data);
}

/**
 * 查询标签分类-详情
 */
export function queryTagsDetail(data) {
  return request({
    url: 'dmpmark/poitagmapping',
    method: 'get',
    params: data
  }).then(res => res.data);
}

/**
 * 查询群像首页数据
 */
export function queryGroupData(data) {
  return request({
    url: '	dmpmark/groupdata',
    method: 'get',
    params: data
  }).then(res => res.data);
}

/**
 * 查询群像详情数据
 */
export function queryGroupDetail(data) {
  return request({
    url: 'dmpmark/groupdetail',
    method: 'get',
    params: data
  }).then(res => res.data);
}

/**
 * 查询群像下拉框
 */
export function queryGroupSelect(data) {
  return request({
    url: 'dmpmark/getgroup',
    method: 'get',
    params: data
  }).then(res => res.data);
}

/**
 * 查询新闻分类下拉框
 */
export function queryNewstypeSelect(data) {
  return request({
    url: 'dmpmark/getnewstype',
    method: 'get',
    params: data
  }).then(res => res.data);
}

/**
 * 查询渠道下拉框
 */
export function queryQidSelect(data) {
  return request({
    url: 'dmpmark/getqid',
    method: 'get',
    params: data
  }).then(res => res.data);
}

/**
 * 查询操作系统下拉框
 */
export function queryOsSelect(data) {
  return request({
    url: 'dmpmark/getos',
    method: 'get',
    params: data
  }).then(res => res.data);
}

/**
 * 查询内容类型下拉框
 */
export function queryContenttypeSelect(data) {
  return request({
    url: 'dmpmark/getcontenttype',
    method: 'get',
    params: data
  }).then(res => res.data);
}

/**
 * 查询idx下拉框
 */
export function queryIdxSelect(data) {
  return request({
    url: 'dmpmark/getidx',
    method: 'get',
    params: data
  }).then(res => res.data);
}

/**
 * 查询pagenum下拉框
 */
export function queryPagenumSelect(data) {
  return request({
    url: 'dmpmark/getpagenum',
    method: 'get',
    params: data
  }).then(res => res.data);
}

/**
 * 用户群像统计-用户偏好
 * 参数:contenttype,group,newstype,startDate,endDate
 */

/**
 * 用户群像-用户偏好-群像列表
 */
export function queryGroupuv(data) {
  return request({
    url: 'dmpmark/getgroupuv',
    method: 'get',
    params: data
  }).then(res => res.data);
}

/**
 * 用户群像统计-用户偏好-图文视频一级类别
 */
export function queryVideoType1(data) {
  return request({
    url: 'dmpmark/gettype1',
    method: 'get',
    params: data
  }).then(res => res.data);
}

/**
 * 用户群像统计-用户偏好-图文视频二级类别
 */
export function queryVideoType2(data) {
  return request({
    url: 'dmpmark/gettype2',
    method: 'get',
    params: data
  }).then(res => res.data);
}

/**
 * 用户群像统计-用户偏好-群像列表内容
 */
export function queryContentdata(data) {
  return request({
    url: 'dmpmark/getcontentdata',
    method: 'get',
    params: data
  }).then(res => res.data);
}

/**
 * 用户群像统计-用户偏好-新闻标签数据
 */
export function queryNewsTagdata(data) {
  return request({
    url: 'dmpmark/gettagdata',
    method: 'get',
    params: data
  }).then(res => res.data);
}

/**
 * 用户群像统计-用户偏好-视频标签数据
 */
export function queryVideoTagdata(data) {
  return request({
    url: 'dmpmark/getvtagdata',
    method: 'get',
    params: data
  }).then(res => res.data);
}

/**
 * 用户群像-群像说明-兴趣-分类列表
 */
export function queryInterest(data) {
  return request({
    url: 'dmpmark/getinterest',
    method: 'get',
    params: data
  }).then(res => res.data);
}

/**
 * 用户群像-群像说明-兴趣-分类数据信息
 */
export function queryConfigInterest(data) {
  return request({
    url: 'dmpmark/getconfiginterest',
    method: 'get',
    params: data
  }).then(res => res.data);
}

/**
 * 用户群像-用户偏好-性别、年龄、城市等级和消费等级
 */
export function queryBaseInfo(data) {
  return request({
    url: 'dmpmark/getbaseinfo',
    method: 'get',
    params: data
  }).then(res => res.data);
}
