import { formatDate, subtractDate, typeCheck } from '@/utils/index';
import request from '@/utils/request';
import URL from '@/constants/url';

const tiRecommend = {
  namespaced: true,
  state: {
    // 表格数据
    tableList: {
      data: [],
      sort: {},
      general: { per_cost: '', total_active: '', total_cost: '', total_count: '' },
      pages: {
        page: 1,
        size: 20,
        count: ''
      }
    },
    tableLoading: false,
    routerPath: '',
    // 默认时间范围
    startDate: subtractDate(0),
    rangeDate: [subtractDate(0), subtractDate(0)],
    rangeDate2: ['', ''],
    // 表单默认数据
    formInline: {
      videoId: '',
      agent_id: '0',
      ad_id: '0',
      campaign_id: '0',
      product_id: '0',
      channel_id: '0',
      user_type: '0',
      user_name: '',
      pixel: '全部'
    },
    oldformInline: {},
    //账户列表
    accountList: [],
    pixelParams: [],
    // 各下拉框数据
    selectData: {},
    filterData: {},
    tag: '',
    pagetype: 'base',
    isDetail: false,
    agentList: [], // 代理商列表
    adList: [], // 广告计划列表
    campaignList: [] // 广告组列表
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
  getters: {
    isDetail(state) {
      return /Det/g.test(state.pagetype);
    },
    // 群像统计--接口参数
    indexPayload(state, getters) {
      const { startDate, rangeDate } = state;
      const range = getters.isDetail;
      const start = formatDate(startDate, '');
      return {
        ...state.formInline,
        tag: state.tag,
        startDate: range ? formatDate(rangeDate[0], '') : start,
        endDate: range ? formatDate(rangeDate[1], '') : start
      };
    }
  },
  actions: {
    async queryTiSortData({ commit, dispatch }, { prop, order }) {
      let sort = {};
      if (prop && order) {
        const orderBy = order === 'ascending' ? 'asc' : 'desc';
        sort = {
          [prop]: orderBy
        };
      }
      commit('save', {
        tableList: {
          sort
        }
      });
      dispatch('queryTiData');
    },
    async queryTiData({ commit, state, dispatch }) {
      commit('save', {
        tableLoading: true
      });
      await dispatch('querySelectData', {});
      let url = '';
      if (state.routerPath === '/res/video') {
        url = URL.material.video;
      } else if (state.routerPath === '/res/pic') {
        url = URL.material.image;
      } else {
        url = URL.material.channel;
      }
      let inner_date_start;
      let inner_date_end;
      if (state.rangeDate2 === null) {
        inner_date_start = '';
        inner_date_end = '';
      } else {
        if (state.rangeDate2[0] === '') {
          inner_date_start = '';
          inner_date_end = '';
        } else {
          inner_date_start = formatDate(state.rangeDate2[0], '');
          inner_date_end = formatDate(state.rangeDate2[1], '');
        }
      }
      let result = await request({
        url,
        method: 'get',
        params: {
          start_date: formatDate(state.rangeDate[0], ''),
          end_date: formatDate(state.rangeDate[1], ''),
          inner_date_start,
          inner_date_end,
          video_id: state.formInline.videoId,
          image_id: state.formInline.videoId,
          product_id: state.formInline.product_id,
          channel_id: state.formInline.channel_id,
          user_name: state.formInline.user_name,
          user_type: state.formInline.user_type,
          pixel: state.formInline.pixel === '全部' ? '' : state.formInline.pixel,
          page: state.tableList.pages.page,
          page_size: state.tableList.pages.size,
          sort: JSON.stringify(state.tableList.sort)
        }
      });
      if (result && result.code === 0) {
        let { per_cost, total_active, total_cost, total_count } = result.general;
        commit('save', {
          tableList: {
            data: result.data,
            general: { per_cost, total_active, total_cost, total_count },
            pages: {
              ...state.tableList.pages,
              count: result.count / 1
            }
          },
          tableLoading: false
        });
      } else {
        commit('save', {
          tableLoading: false
        });
      }
    },
    async queryTiDataCreative({ commit, state }, video_id) {
      commit('save', {
        tableLoading: true
      });
      let url = '';
      if (state.routerPath === '/res/video') {
        url = URL.material.videoCreative;
      } else if (state.routerPath === '/res/pic') {
        url = URL.material.imageCreative;
      } else {
        url = URL.material.channelCreative;
      }
      const { agent_id, ad_id, campaign_id } = state.formInline;
      let result = await request({
        url,
        method: 'get',
        params: {
          start_date: formatDate(state.rangeDate[0], ''),
          end_date: formatDate(state.rangeDate[1], ''),
          video_id,
          image_id: video_id,
          page: state.tableList.pages.page,
          page_size: state.tableList.pages.size,
          agent_id,
          ad_id,
          campaign_id
        }
      });
      if (result.data && result.data.length) {
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
      } else {
        commit('save', {
          tableList: {
            data: [],
            pages: {
              page: 1,
              size: 20,
              count: ''
            }
          },
          tableLoading: false
        });
      }
    },
    async querySelectData({ dispatch, commit, state }) {
      if (state.selectData.product_list) return;
      commit('save', {
        tableLoading: true
      });
      let result = await request({
        url: URL.report_params,
        method: 'get',
        params: { channel_id: state.channel_id }
      });
      if (result.agent_list) {
        Object.keys(result).forEach(item => {
          result[item].forEach(ele => {
            if (item === 'agent_list') {
              ele.agent_id = '' + ele.agent_id;
            } else if (item === 'channel_list') {
              ele.channel_id = '' + ele.channel_id;
            } else if (item === 'product_list') {
              ele.product_id = '' + ele.product_id;
            }
          });
        });
      }
      commit('save', {
        selectData: result,
        tableLoading: false
      });
      await dispatch('queryFilterData', {});
    },
    queryFilterData({ commit, state }, { product_id, channel_id /* agent_id */ }) {
      let {
        selectData: { product_list, channel_list, agent_list }
      } = state;
      let channel_list_filter = [];
      let agent_list_filter = [];
      if (product_id) {
        channel_list_filter = channel_list.filter(item => {
          return item.product_list.indexOf(product_id) >= 0;
        });
        agent_list_filter = agent_list.filter(item => {
          return item.channel_id.indexOf('' + channel_list_filter[0].channel_id) >= 0;
        });
        commit('save', {
          filterData: {
            product_list: [/* { product_id: '0', product_name: '全部' }, */ ...product_list],
            channel_list: [/* { channel_id: '0', channel_name: '全部' }, */ ...channel_list_filter],
            agent_list: [{ agent_id: '0', agent_name: '全部' }, ...agent_list_filter]
          },
          formInline: {
            product_id: product_list[0].product_id,
            channel_id: channel_list_filter[0].channel_id,
            agent_id: '0'
          },
          oldformInline: {
            product_id: product_list[0].product_id,
            channel_id: channel_list_filter[0].channel_id,
            agent_id: '0'
          }
        });
      }
      if (channel_id) {
        //console.log('channel_id', channel_id);
        agent_list_filter = agent_list.filter(item => {
          return ('' + item.channel_id).indexOf('' + channel_id) >= 0;
        });
        if (channel_id === '0') {
          agent_list_filter = agent_list;
        }
        commit('save', {
          filterData: {
            ...state.filterData,
            agent_list: [{ agent_id: '0', agent_name: '全部' }, ...agent_list_filter]
          },
          formInline: {
            product_id: state.formInline.product_id,
            channel_id,
            agent_id: '0'
          }
        });
      }
      if (!product_id && !channel_id) {
        commit('save', {
          filterData: {
            product_list: [/* { product_id: '0', product_name: '全部' },  */ ...product_list],
            channel_list: [/* { channel_id: '0', channel_name: '全部' },  */ ...channel_list],
            agent_list: [{ agent_id: '0', agent_name: '全部' }, ...agent_list]
          },
          formInline: {
            product_id: product_list[0].product_id,
            channel_id: channel_list[0].channel_id,
            agent_id: '0'
          },
          oldformInline: {
            product_id: product_list[0].product_id,
            channel_id: channel_list[0].channel_id,
            agent_id: '0'
          }
        });
      }
    },
    //获取账户数据
    async queryAccountList({ commit, state }) {
      let result = await request({
        url: URL.account,
        method: 'get',
        params: { agent_id: state.formInline.agent_id }
      });
      commit('save', {
        accountList: [{ id: '', account: '全部' }, ...result.data]
      });
    },
    //获取账户数据
    async getpixelParams({ commit }) {
      let result = await request({
        url: URL.material.pixelParams,
        method: 'get',
        params: {}
      });
      commit('save', {
        pixelParams: ['全部', ...result.data.pixel]
      });
    },
    // 获取创意详情下拉列表
    async queryDetailSelectData({ state, commit, dispatch }, { id }) {
      const idType = state.routerPath === '/res/video' ? 'video_id' : 'image_id';
      let result = await request({
        url: URL.material.creativeDetailSelect,
        method: 'get',
        params: {
          /* start_date: formatDate(state.rangeDate[0], ''),
          end_date: formatDate(state.rangeDate[1], ''), */
          date: formatDate(state.startDate, ''),
          [idType]: id
        }
      });
      const { code, data, msg } = result;
      if (code === 0) {
        const { campaign, ad, agent } = data;
        commit('save', {
          agentList: [
            {
              agent_id: '0',
              agent_name: '全部'
            },
            ...agent
          ],
          adList: [
            {
              ad_id: '0',
              ad_name: '全部'
            },
            ...ad
          ],
          campaignList: [
            {
              campaign_id: '0',
              campaign_name: '全部'
            },
            ...campaign
          ]
        });
        dispatch('queryTiDataCreative', id);
      } else {
        console.log(msg);
      }
    }
  }
};

export default tiRecommend;
