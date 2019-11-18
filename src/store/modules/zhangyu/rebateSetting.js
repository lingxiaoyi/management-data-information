import request from '@/utils/request';
import URL from '@/constants/url';

export default {
  namespaced: true,

  state: {
    isLoading: false,
    dialogLoading: false,
    tableData: []
  },

  getters: {
    isLoading: state => state.isLoading,
    dialogLoading: state => state.dialogLoading,
    tableData: state => state.tableData
  },

  mutations: {
    save: (state, payload) => {
      Object.keys(payload).forEach(e => {
        if (Object.prototype.toString.call(state[e]) === '[object Object]') {
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
    /**
     *  获取表格数据
     * @author wangyong
     * @date 2019-11-15
     */
    async getTableData({ commit }, params = {}) {
      commit('save', {
        isLoading: true
      });
      let result = await request({
        url: URL.rebateSetting.tableData,
        method: 'get',
        params: params
      });
      if (Array.isArray(result)) {
        commit('save', {
          isLoading: false,
          tableData: result
        });
      } else {
        commit('save', {
          isLoading: false
        });
      }
    }
  }
};
