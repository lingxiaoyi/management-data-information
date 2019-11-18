import request from '@/utils/request';
import URL from '@/constants/url';

export default {
  namespaced: true,

  state: {
    tableLoading: false,
    dialogLoading: false,
    tableData: [],
    role_list: [],
    logs: []
  },

  getters: {
    tableLoading: state => state.tableLoading,
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
    async getRoleList({ commit }, params = { user_id: 0 }) {
      commit('save', {
        tableLoading: true
      });
      let result = await request({
        url: URL.manage.roleList,
        method: 'get',
        params: params
      });
      commit('save', {
        tableLoading: false,
        role_list: result.length ? result : []
      });
    },
    async getData({ commit }, params = { user_id: 0 }) {
      commit('save', {
        tableLoading: true
      });
      let result = await request({
        url: URL.manage.userList,
        method: 'get',
        params
      });
      if (!result.length) {
        commit('save', {
          tableLoading: false,
          tableData: []
        });
      } else {
        commit('save', {
          tableLoading: false,
          tableData: result
        });
      }
    },
    async addData(_, params) {
      return new Promise(async resolve => {
        try {
          let result = await request({
            url: URL.manage.addUser,
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
            url: URL.manage.editUser,
            method: 'get',
            params: params
          });
          result && resolve(result);
        } catch (error) {
          console.log(error);
        }
      });
    },
    async delData(_, params = { user_id: 0 }) {
      return new Promise(async resolve => {
        try {
          let result = await request({
            url: URL.manage.delUser,
            method: 'get',
            params
          });
          result && resolve(result);
        } catch (error) {
          console.log(error);
        }
      });
    },
    async getPrivilege(_, params) {
      //role_id privilege {1,2,3...}
      return new Promise(async resolve => {
        try {
          let result = await request({
            url: URL.manage.delUser,
            method: 'get',
            params: params
          });
          result && resolve(result);
        } catch (error) {
          console.log(error);
        }
      });
    },
    async postPrivilege(_, params) {
      return new Promise(async resolve => {
        try {
          let result = await request({
            url: URL.manage.delUser,
            method: 'get',
            params: params
          });
          result && resolve(result);
        } catch (error) {
          console.log(error);
        }
      });
    }
  }
};
