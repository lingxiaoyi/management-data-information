import { formatDate, subtractDate, typeCheck } from '@/utils/index';
import request from '@/utils/request';
import URL from '@/constants/url';
import _ from 'lodash';
const tiRecommend = {
  namespaced: true,
  state: {
    // 表格数据
    head: {
      list: [],
      count: { cost: '' },
      pages: {
        count: 0,
        page: 1,
        page_count: 0,
        size: 20
      }
    },
    routerPath: '',
    fields: [],
    tableLoading: false,
    customFields: [],
    formFields: {
      checkedCustomFields: []
    },
    // 默认时间范围
    startDate: subtractDate(1),
    rangeDate: [subtractDate(15), subtractDate(1)],
    // 表单默认数据
    formInline: {
      product_id: '',
      channel_id: '',
      agent_id: ''
    },
    // 各下拉框数据
    selectData: {},
    filterData: {},
    tag: '',
    pagetype: 'base',
    isDetail: false
  },
  mutations: {
    save: (state, payload) => {
      Object.keys(payload).forEach(e => {
        if (typeCheck(state[e]) === 'Object') {
          state[e] = {
            ...state[e],
            ...payload[e]
          };
        } else {
          state[e] = payload[e];
        }
      });
    }
  },
  getters: {
    pageType(state) {
      if (state.routerPath.indexOf('ksDetail') > -1) {
        return 'ks';
      } else if (state.routerPath.indexOf('dyDetail') > -1) {
        return 'dy';
      } else if (state.routerPath.indexOf('gdtDetail') > -1) {
        return 'gdt';
      }
    },
    isDetail(state) {
      return /Det/g.test(state.pagetype);
    },
    // 群像统计--接口参数
    indexPayload(state, getters) {
      const { startDate, rangeDate } = state;
      const range = getters.isDetail;
      const start = formatDate(startDate, '');
      return {
        ...state.formInline,
        tag: state.tag,
        startDate: range ? formatDate(rangeDate[0], '') : start,
        endDate: range ? formatDate(rangeDate[1], '') : start
      };
    }
  },
  actions: {
    async queryTiSortData({ commit, dispatch }, { prop, order }) {
      let sort = '';
      if (prop && order) {
        const orderBy = order === 'ascending' ? 'asc' : 'desc';
        sort = orderBy;
      }
      commit('save', {
        head: {
          sort
        }
      });
      dispatch('queryTiData', sort);
    },
    async queryTiData({ commit, state, rootState } /* , sort */) {
      if (!state.routerPath) return;
      let fieldsRes = [];
      let { agent_id, account_id, product_id, os_id } = rootState.tiRecommend.formInline;
      commit('save', {
        tableLoading: true
      });
      let url = '';
      if (state.routerPath.indexOf('ksDetail') > -1) {
        url = URL.campaign.ks;
      } else if (state.routerPath.indexOf('dyDetail') > -1) {
        url = URL.campaign.dy;
      } else if (state.routerPath.indexOf('gdtDetail') > -1) {
        url = URL.campaign.gdt;
      }
      let result = await request({
        url,
        method: 'get',
        params: {
          date: formatDate(state.startDate, ''),
          //end_date: formatDate(state.rangeDate[1], ''),
          agent_id,
          account_id,
          product_id,
          os_id,
          fields: state.formFields.checkedCustomFields.join(','),
          page: state.head.pages.page,
          size: state.head.pages.size,
          sort_type: state.head.sort
        }
      });

      if (result.code !== 0) return;

      if (!result.data.res.length) {
        commit('save', {
          head: { list: [], count: { cost: '' } },
          fields: fieldsRes,
          tableLoading: false
        });
        return;
      }
      let fields = result.data.fields;
      if (!_.isEmpty(fields)) {
        Object.keys(fields).forEach(item => {
          if (fields[item]) {
            if (item === 'cost_active') {
              fieldsRes.push({
                prop: item,
                label: fields[item],
                formatter(row, column) {
                  return (row[column.property] / 1).toFixed(2);
                }
              });
            } else if (item === 'campaign_name') {
              fieldsRes.push({
                prop: item,
                label: fields[item],
                'class-name': 'link-row'
              });
            } else {
              fieldsRes.push({
                prop: item,
                label: fields[item]
              });
            }
          }
        });
      }
      result.data.res.forEach(item => {
        item.active = item.active / 1;
        item.click = item.click / 1;
        item.cost = item.cost / 1;
        item.download_finish = item.download_finish / 1;
        item.show = item.show / 1;
      });
      commit('save', {
        head: { list: result.data.res, count: result.data.count, pages: result.data.pages },
        fields: fieldsRes,
        tableLoading: false
      });
    },
    async queryGgjhData({ commit, state }, campaign_id) {
      let fieldsRes = [];
      commit('save', {
        tableLoading: true
      });
      let url = '';
      if (state.routerPath.indexOf('ksDetail') > -1) {
        url = URL.campaign.ksAd;
      } else if (state.routerPath.indexOf('dyDetail') > -1) {
        url = URL.campaign.dyAd;
      } else if (state.routerPath.indexOf('gdtDetail') > -1) {
        url = URL.campaign.gdtAd;
      }
      let result = await request({
        url,
        method: 'get',
        params: {
          date: formatDate(state.startDate, ''),
          campaign_id,
          name: '',
          fields: state.formFields.checkedCustomFields.join(',')
        }
      });
      if (!result.data.res.length) {
        return;
      }
      let fields = result.data.fields;
      if (!_.isEmpty(fields)) {
        Object.keys(fields).forEach(item => {
          if (fields[item]) {
            if (item === 'cost_active') {
              fieldsRes.push({
                prop: item,
                label: fields[item],
                formatter(row, column) {
                  return (row[column.property] / 1).toFixed(2);
                }
              });
            } else if (item === 'unit_name') {
              fieldsRes.push({
                prop: item,
                label: fields[item],
                'class-name': 'link-row'
              });
            } else if (item === 'ad_name') {
              fieldsRes.push({
                prop: item,
                label: fields[item],
                'class-name': 'link-row'
              });
            } else if (item === 'adgroup_name') {
              fieldsRes.push({
                prop: item,
                label: fields[item],
                'class-name': 'link-row'
              });
            } else {
              fieldsRes.push({
                prop: item,
                label: fields[item]
              });
            }
          }
        });
      }
      commit('save', {
        head: { list: result.data.res, count: result.data.count },
        fields: fieldsRes,
        tableLoading: false
      });
    },
    async queryGgcyData({ commit, state }, ad_id) {
      let fieldsRes = [];
      commit('save', {
        tableLoading: true
      });
      let url = '';
      if (state.routerPath.indexOf('ksDetail') > -1) {
        url = URL.campaign.ksCreative;
      } else if (state.routerPath.indexOf('dyDetail') > -1) {
        url = URL.campaign.dyCreative;
      } else if (state.routerPath.indexOf('gdtDetail') > -1) {
        url = URL.campaign.gdtCreative;
      }
      let result = await request({
        url,
        method: 'get',
        params: {
          date: formatDate(state.startDate, ''),
          ad_id,
          unit_id: ad_id,
          fields: state.formFields.checkedCustomFields.join(',')
        }
      });
      if (!result.data.res.length) {
        commit('save', {
          head: { list: [], count: '' },
          fields: [],
          tableLoading: false
        });
        return;
      }
      let fields = result.data.fields;
      if (!_.isEmpty(fields)) {
        Object.keys(fields).forEach(item => {
          if (fields[item]) {
            if (item === 'cost_active') {
              fieldsRes.push({
                prop: item,
                label: fields[item],
                formatter(row, column) {
                  return (row[column.property] / 1).toFixed(2);
                }
              });
            } else if (item === 'ad_name') {
              fieldsRes.push({
                prop: item,
                label: fields[item],
                'class-name': 'link-row'
              });
            } else {
              fieldsRes.push({
                prop: item,
                label: fields[item]
              });
            }
          }
        });
      }
      commit('save', {
        head: { list: result.data.res, count: result.data.count },
        fields: fieldsRes,
        tableLoading: false
      });
    },
    async getCustomField({ commit, state }, channel_id = '1') {
      if (state.routerPath.indexOf('ksDetail') > -1) {
        channel_id = '2';
      } else if (state.routerPath.indexOf('dyDetail') > -1) {
        channel_id = '1';
      } else if (state.routerPath.indexOf('gdtDetail') > -1) {
        channel_id = '3';
      }
      let result = await request({
        url: URL.field,
        method: 'get',
        params: {
          channel_id
        }
      });
      let arr = ['消耗金额', '展示数量', '点击数量', '应用下载激活数', '安卓下载完成', '人均激活成本', 'CTR'];
      let defaultCheckedId = [];
      result.data && result.data.forEach(item => {
        item.children.forEach(item2 => {
          if (arr.indexOf(item2.field_name) > -1) {
            defaultCheckedId.push(item2.id);
          }
        });
      });
      if (result.data.length) {
        commit('save', {
          customFields: result.data,
          formFields: {
            checkedCustomFields: defaultCheckedId
          }
        });
      }
    },
    async changeFieldsWidth({ commit, state }) {
      let fields = _.cloneDeep(state.fields);

      fields.forEach(item => {
        let prop = item.prop;
        if (prop === 'campaign_name' || prop === 'agent_name' || prop === 'account_name' || prop === 'active') {
          item.width = '180';
        } else {
          item.width = '100';
        }
      });
      commit('save', {
        fields: fields
      });
    },
    async querySelectData({ dispatch, commit, state }) {
      commit('save', {
        tableLoading: true
      });
      let result = await request({
        url: URL.report_params,
        method: 'get',
        params: { channel_id: state.channel_id }
      });

      commit('save', {
        selectData: result,
        tableLoading: false
      });
      dispatch('queryFilterData', { product_id: result.product_list[0].product_id });
    },
    queryFilterData({ commit, state }, { product_id, channel_id }) {
      let {
        selectData: { product_list, channel_list, agent_list }
      } = state;
      let product_list_filter = [];
      let channel_list_filter = [];
      let agent_list_filter = [];
      if (product_id) {
        product_list_filter = product_list.filter(item => {
          return item.product_id.indexOf(product_id) >= 0;
        });
        channel_list_filter = channel_list.filter(item => {
          return item.product_list.indexOf(product_id) >= 0;
        });
        agent_list_filter = agent_list.filter(item => {
          return item.channel_id.indexOf('' + channel_list_filter[0].channel_id) >= 0;
        });
        commit('save', {
          filterData: {
            product_list: product_list_filter,
            channel_list: [{ channel_id: '0', channel_name: '全部' }, ...channel_list_filter],
            agent_list: [{ agent_id: '0', agent_name: '全部' }, ...agent_list_filter]
          },
          formInline: {
            product_id: product_list_filter[0].product_id,
            channel_id: '0',
            agent_id: '0'
          }
        });
      }
      if (channel_id) {
        agent_list_filter = agent_list.filter(item => {
          return item.channel_id.indexOf('' + channel_id) >= 0;
        });
        commit('save', {
          filterData: {
            ...state.filterData,
            agent_list: [{ agent_id: '0', agent_name: '全部' }, ...agent_list_filter]
          },
          formInline: {
            product_id: state.filterData.product_list[0].product_id,
            channel_id,
            agent_id: '0'
          }
        });
      }
    }
  }
};

export default tiRecommend;
