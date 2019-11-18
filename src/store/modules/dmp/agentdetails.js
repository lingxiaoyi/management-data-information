import { /* formatDate, */ typeCheck } from '@/utils/index';
import request from '@/utils/request';
import URL from '@/constants/url';

const tiRecommend = {
  namespaced: true,
  state: {
    // 表格数据
    tableData: [],
    tableLoading: false
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
    async queryTiData({ commit /* , state */ }, { product_id,agent_id, start_date, end_date, channel_id, os_id }) {
      commit('save', {
        tableLoading: true
      });
      let result = await request({
        url: URL.agentdetails,
        method: 'get',
        params: {
          start_date,
          end_date,
          channel_id,
          agent_id,
          os_id,
          product_id
        }
      });

      commit('save', {
        tableData: result,
        tableLoading: false
      });
    }
  }
};

export default tiRecommend;
