import * as api from '@/api/dmp/dmpTagManage';
import { formatDate, subtractDate, typeCheck } from '@/utils/index';

const dmpTagManage = {
  namespaced: true,
  state: {
    topActiveTab: 'TagDataTable',
    // ======================== 标签数据 ========================
    // 表格数据
    tableData: [],
    tableLoading: false,
    // 默认时间范围
    startDate: subtractDate(2),
    rangeDate: [subtractDate(30), subtractDate(2)],
    // 表单默认数据
    formInline: {
      type1: '',
      type2: '汇总',
      tag: '汇总',
      app: '汇总'
    },
    // 各下拉框数据
    selectData: {
      type1: [],
      type2: [],
      tag: [],
      app: []
    },
    datatype: 'newstype',
    pagetype: 'base',
    // 被点击列
    clickedCol: '',

    // ======================== 标签配置  ========================
    infoList: [],
    loadingInfo: false,
    // 分页信息
    pager: {
      total: 0,
      currentpage: 1,
      pagesize: 21
    },

    in_tag: '',
    checkedTagList: ['性别', '年龄'],
    tagList: ['性别', '年龄', '消费水平', '居住地城市级别'],
    checkedTypeOne: '',
    typeListOne: '',
    checkedTypeTwo: [],
    typeListTwo: []
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

  getters: {
    isDetail(state) {
      return /Det/g.test(state.pagetype);
    },
    indexPayload(state, getters) {
      const { formInline, startDate, rangeDate } = state;
      const range = getters.isDetail;
      const start = formatDate(startDate, '');
      return {
        in_stdate: range ? formatDate(rangeDate[0], '') : start,
        in_eddate: range ? formatDate(rangeDate[1], '') : start,
        in_tp1: formInline.type1,
        in_tp2: formInline.type2,
        in_tag: formInline.tag,
        in_app: formInline.app
      };
    }
  },

  actions: {
    // ======================== 标签数据 ========================
    async queryGroupData({ commit, getters, state }) {
      commit('save', {
        tableData: [],
        tableLoading: true
      });
      const request = /base/.test(state.pagetype) ? 'queryTagTable' : 'queryTagTableDetail';
      const result = await api[request](getters.indexPayload);
      commit('save', {
        tableData: result.datalist,
        tableLoading: false
      });
    },

    async querySelectData({ commit, getters }, param) {
      const selectName = param.replace(/[a-z]/, v => v.toUpperCase());
      const request = `query${selectName}Select`;
      const result = await api[request](getters.indexPayload);
      commit('save', {
        selectData: { [param]: result.datalist }
      });
    },

    // ======================== 标签配置  ========================
    // async queryHomepage({ commit, state }) {
    //   commit('save', {
    //     infoList: [],
    //     loadingInfo: true
    //   })
    //   const result = await api.queryTagSystem({
    //     in_pagenum: state.pager.currentpage || 1,
    //     in_pagesize: state.pager.pagesize
    //   })
    //   const datalist = result.datalist
    //   commit('save', {
    //     infoList: datalist.slice(1),
    //     loadingInfo: false,
    //     pager: {
    //       total: datalist && datalist.length ? Number(datalist[0].type1) : 0
    //     }
    //   })
    // },

    async queryTagSystem({ commit, state }, params) {
      commit('save', {
        infoList: [],
        loadingInfo: true
      });
      const result = await api.queryTagSystem({
        in_pagenum: state.pager.currentpage || 1,
        in_pagesize: state.pager.pagesize,
        in_tag: state.in_tag,
        in_tp1: state.checkedTypeOne,
        in_tp2s: state.checkedTypeTwo.join(','),
        ...params
      });
      const datalist = result.datalist;
      commit('save', {
        infoList: datalist.slice(1),
        loadingInfo: false,
        pager: {
          total: datalist && datalist.length ? Number(datalist[0].type1) : 0
        }
      });
    },

    async queryType1({ commit, state }) {
      const result = await api.queryType1({
        in_tag: state.in_tag
      });
      commit('save', {
        typeListOne: result.datalist.map(e => e.type1)
      });
    },

    async queryType2({ commit, state }) {
      const result = await api.queryType2({
        in_tag: state.in_tag
      });
      commit('save', {
        typeListTwo: result.datalist.map(e => e.type2)
      });
    }
  }
};

export default dmpTagManage;
