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
      count: {}
    },
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
    campaign_id: '',
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
  actions: {
    async queryTiData({ commit, state }) {
      let fieldsRes = [];
      commit('save', {
        tableLoading: true
      });
      let result = await request({
        url: URL.dyAd,
        method: 'get',
        params: {
          date: formatDate(state.startDate, ''),
          campaign_id: '',
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
      commit('save', {
        head: { list: result.data.res, count: result.data.count },
        fields: fieldsRes,
        tableLoading: false
      });
    },
    async getCustomField({ commit }, channel_id = '1') {
      let result = await request({
        url: URL.field,
        method: 'get',
        params: {
          channel_id
        }
      });
      if (result.data.length) {
        commit('save', {
          customFields: result.data
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
    queryFilterData({ commit, state }, { product_id, channel_id /* agent_id */ }) {
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
        console.log('channel_id', channel_id);
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
