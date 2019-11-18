import Vue from 'vue';
import Vuex from 'vuex';

// modules
// app
import app from './modules/app';
import user from './modules/user';

// tag
/* import tagTn from './modules/tag/tnSearch';
import tagTn2 from './modules/tag/tn2Search';
import tagVideo from './modules/tag/videoSearch';
import tagVideoLevel from './modules/tag/videoLevelSearch';
import miniTagVideo from './modules/tag/miniVideoSearch';
import miniTagVideoLevel from './modules/tag/miniVideoLevelSearch'; */

// common
import common from './modules/common';
// common
import keepAlive from './modules/keepAlive';
// dmp
import dmpUserMark from './modules/dmp/dmpUserMark';
import dmpUserInfo from './modules/dmp/dmpUserInfo';
import tiRecommend from './modules/dmp/tiRecommend';
import tiRecommendDetail from './modules/dmp/tiRecommendDetail';
import agentdetails from './modules/dmp/agentdetails';
import dyDetail from './modules/dmp/dyDetail';
import ggjh from './modules/dmp/ggjh';
import authManage from './modules/dmp/authManage';
import dmpTagManage from './modules/dmp/dmpTagManage';

// zhangyu
import agentManage from './modules/zhangyu/agentManage';
import rebateSetting from './modules/zhangyu/rebateSetting';

//material
import materialVideo from './modules/material/video';
import materialPic from './modules/material/pic';
import materialInternal from './modules/material/internal';
import materialDetail from './modules/material/detail';
import channelData from './modules/channelData/channel';
import channelDataQid from './modules/channelData/qid';

//uploaddata 上传数据
import uploadData from './modules/uploaddata/data';
// commoms
import getters from './getters';
import mutations from './mutations';
// zhangyu
import productManage from './modules/manage/productManage';
import roleManage from './modules/manage/roleManage';
import userManage from './modules/manage/userManage';
//bid
import bidAgent from './modules/bid/agent';
Vue.use(Vuex);

const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  modules: {
    app,
    common,
    keepAlive,
    user,
    dmpUserMark,
    dmpUserInfo,
    dmpTagManage,
    tiRecommend,
    tiRecommendDetail,
    agentdetails,
    dyDetail,
    ggjh,
    authManage,
    agentManage,
    rebateSetting,
    materialVideo,
    materialPic,
    materialInternal,
    materialDetail,
    channelData,
    channelDataQid,
    uploadData,
    productManage,
    roleManage,
    userManage,
    bidAgent
  },
  mutations,
  getters
});

export default store;
