import request from '@/utils/request';

/**
 * 根据新闻url查询数据
 * @param {*} data
 */
export function getUrlcontent(data) {
  return request({
    url: 'content/urlcontent',
    method: 'get',
    params: data
  }).then(res => res.data);
}
