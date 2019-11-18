import request from '@/utils/request';
import URL from '@/constants/url';

export default {
  namespaced: true,

  state: {
    agentList: [],
    productList: [],
    channelList: [],
    osList: [
      {
        os_id: '0',
        os_name: '全部'
      },
      {
        os_id: '1',
        os_name: 'IOS'
      },
      {
        os_id: '2',
        os_name: 'Android'
      },
      {
        os_id: '9',
        os_name: '未区分'
      }
    ]
  },

  getters: {
    channelList: state => state.channelList,
    productList: state => state.productList,
    agentList: state => state.agentList,
    osList: state => state.osList
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
     * 获取下拉列表
     * 代理商下拉
     * 产品下拉
     * 渠道下拉
     */
    async getSelectList({ commit, state }) {
      return new Promise(async resolve => {
        let result = await request({
          url: URL.report_params,
          method: 'get'
        });
        const { product_list, channel_list, agent_list } = result;
        resolve({
          agentList: agent_list,
          productList: product_list,
          channelList: channel_list,
          osList: state.osList
        });
        commit('save', {
          agentList: agent_list,
          productList: product_list,
          channelList: channel_list
        });
      });
    }
  }
};
