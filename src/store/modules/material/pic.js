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
        count: ''
      }
    },
    tableLoading: false,
    // 默认时间范围
    startDate: subtractDate(1),
    rangeDate: [subtractDate(15), subtractDate(1)],
    // 表单默认数据
    formInline: {
      videoId: ''
    },
    //账户列表
    accountList: [],
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
    async queryTiData({ commit, state }) {
      commit('save', {
        tableLoading: true
      });
      let result = await request({
        url: URL.material.video,
        method: 'get',
        params: {
          date: formatDate(state.startDate, ''),
          video_id: state.formInline.videoId,
          page: state.tableList.pages.page - 1,
          page_size: state.tableList.pages.size
        }
      });
      if (result.data.length) {
        commit('save', {
          tableList: {
            data: result.data,
            pages: {
              ...state.tableList.pages,
              count: result.count / 1
            }
          },
          tableLoading: false
        });
      } else {
        commit('save', {
          tableLoading: false
        });
      }
    },
    async queryTiDataCreative({ commit, state }, video_id) {
      commit('save', {
        tableLoading: true
      });
      let result = await request({
        url: URL.material.videoCreative,
        method: 'get',
        params: {
          date: formatDate(state.startDate, ''),
          video_id,
          page: state.tableList.pages.page - 1,
          page_size: state.tableList.pages.size
        }
      });
      if (result.data.length) {
        commit('save', {
          tableList: {
            data: result.data,
            pages: {
              ...state.tableList.pages,
              count: result.count / 1
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
              count: ''
            }
          },
          tableLoading: false
        });
      }
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
    //获取账户数据
    async queryAccountList({ commit, state }) {
      let result = await request({
        url: URL.account,
        method: 'get',
        params: { agent_id: state.formInline.agent_id }
      });
      commit('save', {
        accountList: [{ id: '', account: '全部' }, ...result.data]
      });
    }
  }
};

export default tiRecommend;
