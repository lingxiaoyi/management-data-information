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
      },
      sort: {
        cost: 'desc'
      }
    },
    qdParams: [],
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
    isDetail: false,
    detail: 0
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
    async queryTiData({ commit, state, rootState }) {
      let { product_id, channel_id, agent_id, qid, os_id, is_valid } = rootState.tiRecommend.formInline;
      commit('save', {
        tableLoading: true
      });
      let result = await request({
        url: URL.material.channel,
        method: 'get',
        params: {
          //date: formatDate(state.startDate, ''),
          start_date: formatDate(state.rangeDate[0], ''),
          end_date: formatDate(state.rangeDate[1], ''),
          product_id,
          channel_id,
          agent_id,
          qid,
          is_valid,
          page: state.head.pages.page,
          page_size: state.head.pages.size,
          sort: JSON.stringify(state.head.sort),
          os: os_id,
          detail: state.detail
        }
      });
      if (!result.data.length) {
        commit('save', {
          head: { ...state.head, list: [] },
          tableLoading: false
        });
        return;
      }
      let { per_cost, total_active, total_cost, total_count } = result.general;
      commit('save', {
        head: {
          list: result.data,
          general: { per_cost, total_active, total_cost, total_count },
          pages: {
            ...state.head.pages,
            count: result.count / 1
          }
        },
        tableLoading: false
      });
    },
    async queryqdParams({ commit, state }) {
      commit('save', {
        tableLoading: true
      });
      let result = await request({
        url: URL.material.qdParams,
        method: 'get',
        params: {
          date: formatDate(state.startDate, '')
        }
      });

      commit('save', {
        qdParams: result.data,
        tableLoading: false
      });
    }
  }
};

export default tiRecommend;
