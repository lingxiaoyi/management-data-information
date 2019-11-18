import request from '@/utils/request';
import URL from '@/constants/url';

export default {
  namespaced: true,

  state: {
    tableLoading: false,
    dialogLoading: false,
    tableData: [],
    customFields: [],
    formFields: {
      checkFields: []
    }
  },

  getters: {
    tableLoading: state => state.tableLoading,
    dialogLoading: state => state.dialogLoading,
    agentData: state => state.agentData
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
    async getData({ commit }, params = { user_id: 0 }) {
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
        tableData: result.length ? result : []
      });
    },
    async addData(_, params) {
      return new Promise(async resolve => {
        try {
          let result = await request({
            url: URL.manage.addRole,
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
            url: URL.manage.editRole,
            method: 'get',
            params: {
              ...params,
              role_id: params.id
            }
          });
          result && resolve(result);
        } catch (error) {
          console.log(error);
        }
      });
    },
    async delData(_, params) {
      return new Promise(async resolve => {
        try {
          let result = await request({
            url: URL.manage.delRole,
            method: 'get',
            params: {
              role_id: params.id / 1
            }
          });
          result && resolve(result);
        } catch (error) {
          console.log(error);
        }
      });
    },
    async getPrivilege({ commit }, params) {
      //role_id privilege {1,2,3...}
      return new Promise(async resolve => {
        try {
          commit('save', {
            tableLoading: true
          });
          let result = await request({
            url: URL.manage.grantRole,
            method: 'get',
            params: {
              role_id: params.id / 1,
              action: 'get',
              privilege: params.privilege
            }
          });
          if (result.length) {
            let arr = [];
            result.forEach(item => {
              arr.push({ id: item.id, channel: [] });
            });
            commit('save', {
              formFields: {
                checkFields: arr
              }
            });
          }
          commit('save', {
            tableLoading: false,
            customFields: result.length ? result : []
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
            url: URL.manage.grantRole,
            method: 'get',
            params: {
              role_id: params.id / 1,
              action: 'post',
              privilege: params.privilege
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
