const getters = {
  sidebar: state => state.app.sidebar,
  language: state => state.app.language,
  device: state => state.app.device,
  menuList: state => state.user.menuList,
  userInfo: state => state.user.userInfo,
  realname: state => state.user.realname
};

export default getters;
