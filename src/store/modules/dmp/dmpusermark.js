import * as api from '@/api/dmp/dmpUserMark';
import { formatDate, subtractDate, typeCheck, deepClone } from '@/utils/index';

const dmpUserMark = {
  namespaced: true,

  state: {
    topActiveTab: 'UsermarkTable',

    // ======================== 群像统计 ========================
    // 表格数据
    tableData: [],
    tableLoading: false,
    // 默认时间范围
    startDate: subtractDate(2),
    rangeDate: [subtractDate(30), subtractDate(2)],
    // 表单默认数据
    formInline: {
      os: '汇总',
      qid: '汇总',
      group: '',
      newstype: '汇总',
      contenttype: '汇总',
      idx: '汇总',
      pagenum: '汇总'
    },
    // 各下拉框数据
    selectData: {
      os: [],
      qid: [],
      group: [],
      newstype: [],
      contenttype: [],
      idx: [],
      pagenum: []
    },
    datatype: 'newstype',
    pagetype: 'base',
    // 被点击列
    clickedCol: '',

    // ======================== 群像说明 ========================
    interestList: [],
    pidconfig: '',

    // ======================== 标签配置 ========================
    pnameList: [],
    pid: '', // 左侧分类id
    tagData: {
      // 标签数据
      datalist: [],
      page: 1,
      pagesize: 100,
      totalrow: 0
    },

    // ======================== 群像偏好 ========================
    groupuvList: [],
    hobbyDate: subtractDate(2, ''),
    hobbyParams: {
      group: '',
      newstype: '',
      contenttype: ''
    },
    baseInfo: {
      sex: [], // 按性别
      age: [], // 按年龄
      city: [], // 按城市等级
      cost: [] // 按消费等级
    },
    videoType1: [],
    videoType2: [],
    newsType1: [],
    newsType2: [],
    contentData: [],
    newsTagdata: [],
    newsTagsort: {
      field: 'uv', // 排序字段 (用户数-uv)
      type: 'desc' // 排序方式 (默认降序)
    },
    videoTagdata: [],
    videoTagsort: {
      field: 'uv',
      type: 'desc'
    }
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
    },
    sorted: (state, flag) => {
      const { field, type } = state[flag + 'Tagsort'];
      const t = flag + 'Tagdata';
      state[t] = state[t].sort((a, b) => {
        return type === 'asc' ? a[field] - b[field] : b[field] - a[field];
      });
    }
  },

  getters: {
    isDetail(state) {
      return /Det/g.test(state.pagetype);
    },
    // 群像统计--接口参数
    indexPayload(state, getters) {
      const { startDate, rangeDate, datatype, pagetype, clickedCol } = state;
      const { newstype, pagenum, idx } = state.formInline;
      const range = getters.isDetail;
      const start = formatDate(startDate, '');
      return {
        ...state.formInline,
        datatype,
        newstype: pagetype === 'groupNews' && newstype === '汇总' && clickedCol === 'type' ? 'all' : newstype,
        pagenum: pagetype === 'groupNews' && pagenum === '汇总' && clickedCol === 'pagenum' ? 'all' : pagenum,
        idx: pagetype === 'groupNews' && idx === '汇总' && clickedCol === 'idx' ? 'all' : idx,
        startDate: range ? formatDate(rangeDate[0], '') : start,
        endDate: range ? formatDate(rangeDate[1], '') : start
      };
    },
    // 群像偏好--接口参数
    hobbyPayload(state) {
      const { hobbyParams, hobbyDate } = state;
      return {
        startDate: hobbyDate,
        endDate: hobbyDate,
        ...hobbyParams
      };
    }
  },

  actions: {
    // ======================== 群像统计 ========================
    async queryGroupData({ commit, getters, state }) {
      commit('save', {
        tableData: [],
        tableLoading: true
      });
      const request = state.pagetype === 'base' ? 'queryGroupData' : 'queryGroupDetail';
      const result = await api[request](getters.indexPayload);
      commit('save', {
        tableData: result.data,
        tableLoading: false
      });
    },

    async querySelectData({ commit, getters }, param) {
      const selectName = param.replace(/[a-z]/, v => v.toUpperCase());
      const request = `query${selectName}Select`;
      const result = await api[request](getters.indexPayload);
      commit('save', {
        selectData: { [param]: result.data }
      });
    },

    // ======================== 群像说明 ========================
    async queryInterest({ commit }) {
      const result = await api.queryInterest();
      commit('save', {
        interestList: result.data.map(e => {
          return {
            ...e,
            title: e.pname,
            content: hobbyTable([])
          };
        })
      });
      if (result.data[0]) {
        commit('save', { pidconfig: result.data[0].pid + '' });
      }
    },

    async queryConfigInterest({ commit, state }) {
      const { pidconfig, interestList } = state;
      const result = await api.queryConfigInterest({ pid: pidconfig });
      const index = Array.from(interestList).findIndex(e => e.pid + '' === pidconfig);
      const copyInterestList = deepClone(interestList);
      copyInterestList[index].content = hobbyTable(result.data);
      commit('save', { interestList: copyInterestList });
    },

    // ======================== 标签配置 ========================
    async queryTagsType({ commit }) {
      const result = await api.queryTagsType();
      commit('save', { pnameList: result.data });
      if (result.data[0]) {
        commit('save', { pid: result.data[0].pid + '' });
      }
    },

    async queryTagsDetail({ commit }, params) {
      const result = await api.queryTagsDetail(params);
      commit('save', { tagData: result.data });
    },

    // ======================== 群像偏好 ========================
    async queryGroupuv({ commit, state }) {
      const { hobbyDate } = state;
      const result = await api.queryGroupuv({
        startDate: hobbyDate,
        endDate: hobbyDate
      });
      commit('save', { groupuvList: result.data });
      if (result.data[0]) {
        commit('save', {
          hobbyParams: {
            group: result.data[0].groupname_ch + ''
          }
        });
      }
    },

    async queryVideoType2({ commit, getters }, params) {
      const type = params.contenttype === '视频' ? 'videoType2' : 'newsType2';
      const result = await api.queryVideoType2({
        ...getters.hobbyPayload,
        ...params
      });
      commit('save', { [type]: result.data });
    },

    async queryVideoType1({ commit, getters }, params) {
      const type = params.contenttype === '视频' ? 'videoType1' : 'newsType1';
      const result = await api.queryVideoType1({
        ...getters.hobbyPayload,
        ...params
      });
      commit('save', { [type]: result.data });
    },

    async queryBaseInfo({ commit, getters }) {
      const result = await api.queryBaseInfo(getters.hobbyPayload);
      const data = result.data || [];
      const maps = {
        sex: '性别',
        age: '年龄',
        city: '城市等级',
        cost: '消费水平'
      };
      commit('save', {
        baseInfo: Object.keys(maps).reduce((sum, key) => {
          return { ...sum, [key]: data.filter(e => e.type === maps[key]) };
        }, {})
      });
    },

    async queryContentdata({ commit, getters }) {
      const result = await api.queryContentdata(getters.hobbyPayload);
      commit('save', {
        contentData: result.data.map(e => {
          // 点击率
          const ps = Number(e.show_cnt) > 0 ? Number((e.click_cnt / e.show_cnt) * 100).toFixed(2) : '0.00';
          return { ...e, ps: ps + '%' };
        })
      });
    },

    async queryNewsTagdata({ commit, getters }, params) {
      const result = await api.queryNewsTagdata({
        ...getters.hobbyPayload,
        ...params
      });
      commit('save', { newsTagdata: result.data });
    },

    async queryVideoTagdata({ commit, getters }, params) {
      const result = await api.queryVideoTagdata({
        ...getters.hobbyPayload,
        ...params
      });
      commit('save', { videoTagdata: result.data });
    }
  }
};

// 兴趣表格项
const hobbyTable = (data = []) => {
  const thead = {
    ti_config: '配置项',
    ti_weight: '权值',
    ti_type: '类型'
  };
  const keys = Object.keys(thead);
  const none = data.length ? '' : `<tr><td colspan=${keys.length}>暂无数据</td></tr>`;
  const rows = [thead, ...data].map((item, i) => {
    const cells = keys.map(v => {
      return i === 0 ? `<th>${item[v]}</th>` : `<td>${item[v]}</td>`;
    });
    return `<tr>${cells}</tr>`;
  });
  return `<table class="hobby-table">${rows + none}</table>`.replace(/,/g, '');
};

export default dmpUserMark;
