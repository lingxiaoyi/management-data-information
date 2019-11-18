import request from '@/utils/request';
import URL from '@/constants/url';
// import { Message } from 'element-ui';

export default {
  namespaced: true,

  state: {
    isLoading: false,
    dialogLoading: false,
    agentData: [],
    logs: []
  },

  getters: {
    isLoading: state => state.isLoading,
    dialogLoading: state => state.dialogLoading,
    agentData: state => state.agentData,
    logs: state => state.logs
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
     * getAgentList
     * 获取代理商列表
     * @date 2019-10-14
     */
    async getAgentData({ commit }, params = { agent_id: 0 }) {
      commit('save', {
        isLoading: true
      });
      let result = await request({
        url: URL.agentManage.agentData,
        method: 'get',
        params: params
      });
      if (Array.isArray(result)) {
        commit('save', {
          isLoading: false,
          agentData: result
        });
      } else {
        commit('save', {
          isLoading: false
        });
      }
    },

    /**
     *  修改代理商信息
     */
    async updateAgentInfo(_, params) {
      return new Promise(async resolve => {
        try {
          let result = await request({
            url: URL.agentManage.updateAgent,
            method: 'get',
            params: params
          });
          result && resolve(result);
        } catch (error) {
          console.log(error);
        }
      });
    },

    /**
     *  新增代理商信息
     */
    async createAgentInfo(_, params) {
      return new Promise(async resolve => {
        try {
          let result = await request({
            url: URL.agentManage.createAgent,
            method: 'get',
            params: params
          });
          result && resolve(result);
        } catch (error) {
          console.log(error);
        }
      });
    },

    /**
     * getAgentList
     * 获取代理商列表
     * @date 2019-10-14
     */
    async getLogs({ commit }, params = { agent_id: 0 }) {
      commit('save', {
        dialogLoading: true
      });
      let result = await request({
        url: URL.agentManage.logs,
        method: 'get',
        params: params
      });
      commit('save', {
        dialogLoading: false,
        logs: result
      });
    }
  }
};
