import { formatDate, subtractDate, typeCheck } from '@/utils/index';
import request from '@/utils/request';
import URL from '@/constants/url';
import { Message } from 'element-ui';

const tiRecommend = {
  namespaced: true,
  state: {
    // 表格数据
    head: {
      list: [],
      total_cost: ''
    },
    details: {
      list: [],
      total_cost: ''
    },
    tableLoading: false,
    // 默认时间范围
    startDate: subtractDate(0),
    rangeDate: [subtractDate(0), subtractDate(0)],
    // 表单默认数据
    formInline: {
      product_id: '0',
      channel_id: '0',
      agent_id: '0',
      account_id: '0',
      os_id: '0',
      flag: '', //是否授权 0-未授权 1-已授权
      qid: '',
      is_valid: ''
    },
    oldformInline: {
      product_id: '0',
      channel_id: '0',
      agent_id: '0',
      account_id: '0',
      os_id: '0',
      flag: '',
      qid: ''
    },
    //账户列表
    accountList: [
      {
        id: '',
        account: '全部'
      }
    ],
    // 各下拉框数据
    selectData: {},
    filterData: {
      product_list: [
        {
          product_id: '0',
          product_name: '全部'
        }
      ],
      agent_list: [
        {
          agent_id: '0',
          agent_name: '全部'
        }
      ],
      channel_list: [
        {
          channel_id: '0',
          channel_name: '全部'
        }
      ],
      os_list: [
        {
          os_id: '0',
          os_name: '全部'
        },
        {
          os_id: '2',
          os_name: 'AND'
        },
        {
          os_id: '1',
          os_name: 'IOS'
        },
        {
          os_id: '9',
          os_name: '未区分'
        }
      ]
    },
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
    },
    saveShallow: (state, payload) => {
      Object.keys(payload).forEach(e => {
        state[e] = payload[e];
      });
    }
  },
  getters: {
    isDetail(state) {
      return /Det/g.test(state.pagetype);
    },
    isRangeDate(state) {
      return formatDate(state.rangeDate[0], '') !== formatDate(state.rangeDate[1], '');
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
    async queryTiData({ commit, state }) {
      commit('save', {
        tableLoading: true
      });
      let result = await request({
        url: URL.reportEveryday,
        method: 'get',
        params: {
          start_date: formatDate(state.rangeDate[0], ''),
          end_date: formatDate(state.rangeDate[1], ''),
          product_id: state.formInline.product_id,
          channel_id: state.formInline.channel_id,
          agent_id: state.formInline.agent_id,
          os_id: state.formInline.os_id
        }
      });
      try {
        if (!result.data.list.length) {
          commit('saveShallow', {
            details: { list: [], total_cost: '' },
            tableLoading: false
          });
          return;
        }
      } catch (error) {
        console.log('error', error);
      }

      commit('save', {
        details: result.data,
        tableLoading: false
      });
    },

    async querySelectData({ dispatch, commit, state }) {
      if (state.selectData.product_list) return;
      commit('save', {
        tableLoading: true
      });
      let result = await request({
        url: URL.report_params,
        method: 'get',
        params: { channel_id: state.channel_id }
      });
      if (result.agent_list) {
        Object.keys(result).forEach(item => {
          result[item].forEach(ele => {
            if (item === 'agent_list') {
              ele.agent_id = '' + ele.agent_id;
            } else if (item === 'channel_list') {
              ele.channel_id = '' + ele.channel_id;
            } else if (item === 'product_list') {
              ele.product_id = '' + ele.product_id;
            }
          });
        });
      }
      commit('save', {
        selectData: result,
        tableLoading: false
      });
      await dispatch('queryFilterData', {});
    },
    queryFilterData({ commit, state }, { product_id, channel_id }) {
      let {
        selectData: { product_list, channel_list, agent_list }
      } = state;
      let channel_list_filter = [];
      let agent_list_filter = [];
      if (product_id) {
        channel_list_filter = channel_list.filter(item => {
          return item.product_list.indexOf(product_id) >= 0;
        });
        agent_list_filter = agent_list.filter(item => {
          return item.channel_id.indexOf('' + channel_list_filter[0].channel_id) >= 0;
        });
        commit('save', {
          filterData: {
            product_list: [/* { product_id: '0', product_name: '全部' }, */ ...product_list],
            channel_list: [/* { channel_id: '0', channel_name: '全部' }, */ ...channel_list_filter],
            agent_list: [{ agent_id: '0', agent_name: '全部' }, ...agent_list_filter]
          },
          formInline: {
            product_id: product_list[0].product_id,
            channel_id: channel_list_filter[0].channel_id,
            agent_id: '0'
          },
          oldformInline: {
            product_id: product_list[0].product_id,
            channel_id: channel_list[0].channel_id,
            agent_id: '0'
          }
        });
      }
      if (channel_id) {
        //console.log('channel_id', channel_id);
        agent_list_filter = agent_list.filter(item => {
          return ('' + item.channel_id).indexOf('' + channel_id) >= 0;
        });
        if (channel_id === '0') {
          agent_list_filter = agent_list;
        }
        commit('save', {
          filterData: {
            ...state.filterData,
            agent_list: [{ agent_id: '0', agent_name: '全部' }, ...agent_list_filter]
          },
          formInline: {
            product_id: state.formInline.product_id,
            channel_id,
            agent_id: '0'
          }
        });
      }
      if (!product_id && !channel_id) {
        commit('save', {
          filterData: {
            product_list,
            channel_list,
            agent_list: [{ agent_id: '0', agent_name: '全部' }, ...agent_list]
          },
          formInline: {
            product_id: product_list[0].product_id,
            channel_id: channel_list[0].channel_id,
            agent_id: '0'
          },
          oldformInline: {
            product_id: product_list[0].product_id,
            channel_id: channel_list[0].channel_id,
            agent_id: '0'
          }
        });
      }
    },
    //获取账户数据
    async queryAccountList({ commit }, agent_id = '0') {
      let result = await request({
        url: URL.account,
        method: 'get',
        params: { agent_id }
      });
      if (result.code === 400) {
        Message({
          message: result.msg,
          type: 'error',
          duration: 3 * 1000
        });
      } else {
        commit('save', {
          accountList: [{ id: '', account: '全部' }, ...result.data]
        });
      }
    },
    async exportTable({ state }) {
      let src = `${URL.export.adversDetails}?date=${formatDate(state.startDate, '')}&product_id=${
        state.formInline.product_id
      }&channel_id=${state.formInline.channel_id}&agent_id=${state.formInline.agent_id}&os_id=${
        state.formInline.os_id
      }`;
      // 创建隐藏的可下载链接
      var iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = src;
      document.body.appendChild(iframe);
    }
  }
};

export default tiRecommend;
