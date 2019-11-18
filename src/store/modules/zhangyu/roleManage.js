//import * as api from '@/api/zhangyu/userInfo';
import { typeCheck } from '@/utils/index';

const userInfo = {
  namespaced: true,
  state: {
    tableLoading: false,
    baseInfo: []
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
    async getBaseInfo({ commit } /* , params */) {
      commit('save', {
        tableLoading: true
      });
      /*  const result = await api.queryUserBaseInfo(params);
      commit('save', { baseInfo: result.data }); */
      commit('save', {
        baseInfo: [
          {
            id: 1,
            rolename: '超级管理员'
          },
          {
            id: 2,
            rolename: '管理员'
          },
          {
            id: 3,
            rolename: '代理商1'
          }
        ],
        tableLoading: false
      });
    },
    async addBaseInfo({ commit, state }, params) {
      commit('save', {
        tableLoading: true
      });
      /*  const result = await api.queryUserBaseInfo(params);
      commit('save', { baseInfo: result.data }); */
      params.id = 4;
      console.log('params', params, state);
      commit('save', {
        baseInfo: [...state.baseInfo, params],
        tableLoading: false
      });
    },
    async updateData({ commit, state }, params) {
      commit('save', {
        tableLoading: true
      });
      /*  const result = await api.queryUserBaseInfo(params);
      commit('save', { baseInfo: result.data }); */
      let index = state.baseInfo.findIndex(item => {
        return (item.id = params.id);
      });
      state.baseInfo.splice(index, 1, params);
      commit('save', {
        baseInfo: state.baseInfo,
        tableLoading: false
      });
    },
    async deleteData({ commit, state }, params) {
      commit('save', {
        tableLoading: true
      });
      /*  const result = await api.queryUserBaseInfo(params);
      commit('save', { baseInfo: result.data }); */
      let index = state.baseInfo.findIndex(item => {
        return (item.id = params);
      });
      state.baseInfo.splice(index, 1);
      commit('save', {
        baseInfo: state.baseInfo,
        tableLoading: false
      });
    }
  }
};

export default userInfo;
