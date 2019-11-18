import request from '@/utils/request';
import URL from '@/constants/url';

export default {
  namespaced: true,

  state: {
    tableLoading: false,
    dialogLoading: false,
    tableData: [],
    logs: []
  },

  /* getters: {
    tableLoading: state => state.tableLoading,
    dialogLoading: state => state.dialogLoading,
    agentData: state => state.agentData,
    logs: state => state.logs
  }, */

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
    async getData({ commit }, params = { product_id: 0 }) {
      commit('save', {
        tableLoading: true
      });
      let result = await request({
        url: URL.manage.productList,
        method: 'get',
        params: params
      });
      commit('save', {
        tableLoading: false,
        tableData: result.length ? result : []
      });
    },
    async addData(_, params) {
      return new Promise(async resolve => {
        try {
          let result = await request({
            url: URL.manage.addProduct,
            method: 'get',
            params: params
          });
          result && resolve(result);
        } catch (error) {
          console.log(error);
        }
      });
    },
    async updateData(_, params) {
      return new Promise(async resolve => {
        try {
          let result = await request({
            url: URL.manage.editProduct,
            method: 'get',
            params: {
              ...params,
              product_id: params.id
            }
          });
          result && resolve(result);
        } catch (error) {
          console.log(error);
        }
      });
    }
  }
};
