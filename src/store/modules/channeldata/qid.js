import { /* formatDate, */ typeCheck } from '@/utils/index';
import request from '@/utils/request';
import URL from '@/constants/url';
import { formatDate, subtractDate } from '@/utils/index';

const tiRecommend = {
  namespaced: true,
  state: {
    // 表格数据
    head: {
      list: [],
      count: { cost: '' },
      pages: {
        count: 0,
        page: 1,
        page_count: 0,
        size: 20
      }
    },
    form: {
      agent_id: '',
      date: '',
      qid: ''
    },
    rangeDate: [subtractDate(0), subtractDate(0)],
    tableLoading: false
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
    async queryTiData({ commit, state }) {
      let { agent_id, qid } = state.form;
      commit('save', {
        tableLoading: true
      });
      let result = await request({
        url: URL.material.planReport,
        method: 'get',
        params: {
          qid,
          agent_id,
          start_date: formatDate(state.rangeDate[0], ''),
          end_date: formatDate(state.rangeDate[1], ''),
          page: state.head.pages.page,
          page_size: state.head.pages.size
        }
      });
      if (result.code === 0) {
        if (!result.data.length) {
          commit('save', {
            head: { list: [], total_cost: '' },
            tableLoading: false
          });
          return;
        }
        commit('save', {
          head: {
            list: result.data,
            pages: {
              ...state.head.pages,
              count: result.count / 1
            }
          },
          tableLoading: false
        });
      }
    }
  }
};

export default tiRecommend;
