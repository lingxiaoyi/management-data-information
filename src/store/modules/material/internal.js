import { formatDate, subtractDate, typeCheck } from '@/utils/index';
import request from '@/utils/request';
import URL from '@/constants/url';

const tiRecommend = {
  namespaced: true,
  state: {
    // 表格数据
    tableList: {
      data: [],
      pages: {
        page: 1,
        size: 20,
        count: 0
      },
      sort_field: '',
      sort_type: ''
    },
    tableLoading: false,
    // 默认时间范围
    startDate: subtractDate(0),
    rangeDate: [subtractDate(0), subtractDate(0)],
    // 表单默认数据
    formInline: {
      user_name: '全部',
      channel_id: '0',
      product_id: '0',
      key: ''
    },
    oldformInline: {
      user_name: '全部',
      channel_id: '0',
      product_id: '0',
      key: ''
    },
    //账户列表
    usernameList: [],
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
      commit('save', {
        tableList: {
          sort_field: prop,
          sort_type: order === 'ascending' ? 'asc' : 'desc'
        }
      });
      dispatch('queryTiData');
    },
    async queryTiData({ commit, state }) {
      let { user_name, product_id, channel_id, key } = state.formInline;
      commit('save', {
        tableLoading: true
      });
      let result = await request({
        url: URL.material.inner,
        method: 'get',
        params: {
          start_date: formatDate(state.rangeDate[0], ''),
          end_date: formatDate(state.rangeDate[1], ''),
          user_name: user_name === '全部' ? '' : user_name,
          channel_id,
          product_id,
          key,
          page: state.tableList.pages.page,
          size: state.tableList.pages.size,
          sort_field: state.tableList.sort_field,
          sort_type: state.tableList.sort_type
        }
      });
      if (result.list.length) {
        result.list.forEach(element => {
          element.outer_materialNew = element.outer_material;
        });
        commit('save', {
          tableList: {
            data: result.list,
            pages: {
              ...state.tableList.pages,
              count: result.pages.total_count
            }
          },
          tableLoading: false
        });
      } else {
        commit('save', {
          tableList: {
            data: [],
            pages: {
              page: 1,
              size: 20,
              count: 0
            }
          },
          tableLoading: false
        });
      }
    },
    //获取账户数据
    async queryInnerUsername({ commit }) {
      let result = await request({
        url: URL.material.innerUsername,
        method: 'get',
        params: {}
      });
      commit('save', {
        usernameList: ['全部', ...result.list]
      });
    }
  }
};

export default tiRecommend;
