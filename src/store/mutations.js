const mutations = {
  save: (state, payload) => {
    Object.keys(payload).forEach(e => {
      state[e] = payload[e];
    });
  }
};

export default mutations;
