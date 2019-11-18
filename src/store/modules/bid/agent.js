import { subtractDate, typeCheck } from '@/utils/index';
import request from '@/utils/request';
import URL from '@/constants/url';

const tiRecommend = {
  namespaced: true,
  state: {
    // 表格数据
    tableList: {
      data: [],
      pages: {
        page: 1,
        size: 20,
        count: ''
      }
    },
    options: {
      os: [
        {
          os_id: '0',
          os_name: '全部'
        },
        {
          os_id: '1',
          os_name: 'IOS'
        },
        {
          os_id: '2',
          os_name: 'Android'
        },
        {
          os_id: '9',
          os_name: '未区分'
        }
      ],
      flag: [
        {
          flag_id: '',
          flag_name: '全部'
        },
        {
          flag_id: '0',
          flag_name: '未授权'
        },
        {
          flag_id: '1',
          flag_name: '已授权'
        }
      ]
    },
    tableLoading: false,
    // 默认时间范围
    startDate: subtractDate(1),
    rangeDate: [subtractDate(15), subtractDate(1)],
    // 表单默认数据
    formInline: {
      product_id: '0',
      channel_id: '0',
      agent_id: '0',
      account: '全部',
      os_id: '0',
      flag_id: '' //是否授权 0-未授权 1-已授权
    },
    oldformInline: {
      product_id: '0',
      channel_id: '0',
      agent_id: '0',
      account: '全部',
      os_id: '0',
      flag_id: '' //是否授权 0-未授权 1-已授权
    },
    //账户列表
    accountList: [],
    // 各下拉框数据
    selectData: {},
    filterData: {},
    tag: '',
    pagetype: 'base',
    isDetail: false
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
    saveShallow: (state, payload) => {
      Object.keys(payload).forEach(e => {
        state[e] = payload[e];
      });
    }
  },
  actions: {
    async queryTiData({ commit, state }) {
      let { product_id, agent_id, channel_id, account, os_id, flag_id } = state.formInline;
      commit('save', {
        tableLoading: true
      });

      let result = await request({
        url: URL.oauthAccount.query,
        method: 'get',
        params: {
          product_id,
          channel_id,
          agent_id,
          account: account === '全部' ? '' : account, //账号
          flag: flag_id, //是否授权 0-未授权 1-已授权
          os: os_id, //操作系统 1-iOS 2-Android 0-全部
          page: state.tableList.pages.page,
          page_size: state.tableList.pages.size
        }
      });
      if (result.code === 0) {
        result.data.forEach(element => {
          element.flag == '0' ? (element.flag_name = '未授权') : (element.flag_name = '已授权');
          if (element.os == '0') {
            element.os_name = '全部';
          } else if (element.os == '1') {
            element.os_name = 'IOS';
          } else if (element.os == '2') {
            element.os_name = 'Android';
          }
        });
        commit('save', {
          tableList: {
            data: result.data,
            pages: {
              ...state.tableList.pages,
              count: result.count / 1
            }
          },
          tableLoading: false
        });
      }
    },
  }
};

export default tiRecommend;
