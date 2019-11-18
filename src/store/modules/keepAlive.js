
export default {
  namespaced: true,

  state: {
    keepAliveComponents: [] // 缓存数组
  },

  mutations: {
    addkeepAlive(state, component) {
      // 注：防止重复添加（当然也可以使用Set）
      !state.keepAliveComponents.includes(component) && state.keepAliveComponents.push(component);
    },
    removeKeepAlive(state, component) {
      const index = state.keepAliveComponents.indexOf(component);
      index !== -1 && state.keepAliveComponents.splice(index, 1);
    }
  }
};
