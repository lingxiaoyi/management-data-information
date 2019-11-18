import request from '@/utils/postRequset';

// 盗墓片-标签管理-首页
export function queryHomepage(data) {
  return request({
    url: 'sp_dmp_tag_system_search/homepage',
    method: 'post',
    data: data
  }).then(res => res.data);
}

// 盗墓片-标签管理-标签搜索
export function queryTagSystem(data) {
  return request({
    url: 'sp_dmp_tag_system_search/search',
    method: 'post',
    data: data
  }).then(res => res.data);
}

// 盗墓片-标签管理-一级标签
export function queryType1(data) {
  return request({
    url: 'sp_dmp_tag_system_search/get_type1',
    method: 'post',
    data: data
  }).then(res => res.data);
}

// 盗墓片-标签管理-二级标签
export function queryType2(data) {
  return request({
    url: 'sp_dmp_tag_system_search/get_type2',
    method: 'post',
    data: data
  }).then(res => res.data);
}

// 盗墓片-标签数据展示-首页
export function queryTagTable(data) {
  return request({
    url: 'sp_dmp_tag_system_tagshow/homepage',
    method: 'post',
    data: data
  }).then(res => res.data);
}

// 盗墓片-标签数据展示-详情页
export function queryTagTableDetail(data) {
  return request({
    url: 'sp_dmp_tag_system_tagshow/get_data',
    method: 'post',
    data: data
  }).then(res => res.data);
}

// 盗墓片-标签数据展示-一级标签下拉框
export function queryType1Select(data) {
  return request({
    url: 'sp_dmp_tag_system_tagshow/get_type1',
    method: 'post',
    data: {
      in_stdate: data.in_stdate,
      in_eddate: data.in_eddate
    }
  }).then(res => res.data);
}

// 盗墓片-标签数据展示-二级标签下拉框
export function queryType2Select(data) {
  return request({
    url: 'sp_dmp_tag_system_tagshow/get_type2',
    method: 'post',
    data: data
  }).then(res => res.data);
}

// 盗墓片-标签数据展示-标签下拉框
export function queryTagSelect(data) {
  return request({
    url: 'sp_dmp_tag_system_tagshow/get_tag',
    method: 'post',
    data: data
  }).then(res => res.data);
}

// 盗墓片-标签数据展示-标签下拉框
export function queryAppSelect(data) {
  return request({
    url: 'sp_dmp_tag_system_tagshow/get_app',
    method: 'post',
    data: data
  }).then(res => res.data);
}
