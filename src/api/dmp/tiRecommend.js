import request from '@/utils/request';

/**
 * 首页
 */
export function queryTiHomepage(data) {
  return request({
    url: 'dmpmark/tihomepage',
    method: 'get',
    params: data
  }).then(res => res.data);
}

/**
 * 详情
 */
export function queryTiDetail(data) {
  return request({
    url: 'dmpmark/gettidata',
    method: 'get',
    params: data
  }).then(res => res.data);
}

/**
 * 渠道下拉框
 */
export function queryQidSelect(data) {
  return request({
    url: 'dmpmark/gettiqid',
    method: 'get',
    params: data
  }).then(res => res.data);
}

/**
 * 内容类型下拉框
 */
export function queryContenttypeSelect(data) {
  return request({
    url: 'dmpmark/getticontenttype',
    method: 'get',
    params: data
  }).then(res => res.data);
}
