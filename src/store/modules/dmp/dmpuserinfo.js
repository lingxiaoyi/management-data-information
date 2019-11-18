import * as api from '@/api/dmp/dmpUserInfo';

const dmpUserInfo = {
  namespaced: true,

  state: {
    baseInfo: {},
    listRatio: [],
    newsHobby: [],
    videoHobby: [],
    recNewsHobby: [],
    recVideoHobby: [],
    tnNewsTag: [],
    tn2NewsTag: [],
    tnVideoTag: [],
    hobbyTag: [],
    businessTag: [],
    usershowTable: [],
    userclickTable: [],
    tableLoadingLeft: false,
    tableLoadingRight: false
  },

  mutations: {
    SAVE: (state, payload) => {
      Object.keys(payload).forEach(e => {
        state[e] = payload[e];
      });
    }
  },

  actions: {
    async getNewsHobby({ commit }, params) {
      const result = await api.queryNewsHobby(params);
      commit('SAVE', { newsHobby: result.data });
    },

    async getRecNewsHobby({ commit }, params) {
      const result = await api.queryRecNewsHobby(params);
      commit('SAVE', { recNewsHobby: result.data });
    },

    async getVideoHobby({ commit }, params) {
      const result = await api.queryVideoHobby(params);
      commit('SAVE', { videoHobby: result.data });
    },

    async getRecVideoHobby({ commit }, params) {
      const result = await api.queryRecVideoHobby(params);
      commit('SAVE', { recVideoHobby: result.data });
    },

    async getTnNewsTag({ commit }, params) {
      const result = await api.queryTnNewsTag(params);
      commit('SAVE', { tnNewsTag: result.data });
    },

    async getTn2NewsTag({ commit }, params) {
      const result = await api.queryTn2NewsTag(params);
      commit('SAVE', { tn2NewsTag: result.data });
    },

    async getTnVideoTag({ commit }, params) {
      const result = await api.queryTnVideoTag(params);
      commit('SAVE', { tnVideoTag: result.data });
    },

    async getHobbyTag({ commit }, params) {
      const result = await api.queryHobbyTag(params);
      commit('SAVE', { hobbyTag: result.data });
    },

    async getBusinessTag({ commit }, params) {
      const result = await api.queryBusiness(params);
      commit('SAVE', { businessTag: result.data });
    },

    async getUsershowTable({ commit }, params) {
      commit('SAVE', {
        tableLoadingLeft: true,
        usershowTable: []
      });
      const result = await api.queryUsershow(params);
      commit('SAVE', {
        tableLoadingLeft: false,
        usershowTable: result.data
      });
    },

    async getUserclickTable({ commit }, params) {
      commit('SAVE', {
        tableLoadingRight: true,
        userclickTable: []
      });
      const result = await api.queryUserclick(params);
      commit('SAVE', {
        tableLoadingRight: false,
        userclickTable: result.data
      });
    }
  }
};

export default dmpUserInfo;
