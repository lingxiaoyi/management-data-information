import { formatDate, subtractDate, typeCheck } from '@/utils/index';
import request from '@/utils/request';
import URL from '@/constants/url';
const tiRecommend = {
  namespaced: true,
  state: {
    // 表格数据
    head: {
      list: [],
      general: { per_cost: '', total_active: '', total_cost: '', total_count: '' },
      pages: {
        count: 0,
        page: 1,
        page_count: 0,
        size: 20
      }
    },
    qdParams: [],
    qdChannels: [],
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
      agent_name: '全部',
      product_id: '0',
      channel_id: '全部',
      os_id: '0'
    },
    oldformInline: {
      agent_name: '全部',
      product_id: '0',
      channel_id: '全部',
      os_id: '0'
    },
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
      }
    ],
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
      let sort = {};
      if (prop && order) {
        const orderBy = order === 'ascending' ? 'asc' : 'desc';
        sort = {
          [prop]: orderBy
        };
      }
      commit('save', {
        head: {
          sort
        }
      });
      dispatch('queryTiData');
    },
    async queryTiData({ commit, state }) {
      let { product_id, channel_id, os_id, agent_name } = state.formInline;
      commit('save', {
        tableLoading: true
      });
      let result = await request({
        url: URL.upload.uploadReport,
        method: 'get',
        params: {
          start_date: formatDate(state.rangeDate[0], ''),
          end_date: formatDate(state.rangeDate[1], ''),
          product_id,
          channel_name: channel_id === '全部' ? '' : channel_id,
          agent_name: agent_name === '全部' ? '' : agent_name,
          page: state.head.pages.page,
          size: state.head.pages.size,
          //sort: JSON.stringify(state.head.sort),
          os_id: os_id
        }
      });
      if (!result.data.list.length) {
        commit('save', {
          head: { ...state.head, list: [] },
          tableLoading: false
        });
        return;
      }
      let { per_cost, total_active, total_cost, count } = result.data.detail;
      commit('save', {
        head: {
          list: result.data.list,
          general: { per_cost, total_active, total_cost, total_count: count },
          pages: {
            ...state.head.pages,
            count: result.data.total / 1
          }
        },
        tableLoading: false
      });
    },
    async queryqdParams({ commit }) {
      commit('save', {
        tableLoading: true
      });
      let result = await request({
        url: URL.upload.uploadReportAgent,
        method: 'get',
        params: {}
      });

      commit('save', {
        qdParams: ['全部', ...result.data],
        tableLoading: false
      });
    },
    async queryqdChannels({ commit }) {
      commit('save', {
        tableLoading: true
      });
      let result = await request({
        url: URL.upload.uploadReportChannel,
        method: 'get',
        params: {}
      });

      commit('save', {
        qdChannels: ['全部', ...result.data],
        tableLoading: false
      });
    }
  }
};

export default tiRecommend;
