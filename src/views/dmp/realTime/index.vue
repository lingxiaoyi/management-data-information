<template>
  <div class="container" v-loading="loading">
    <!-- date form -->
    <el-form :inline="true" class="date-form">
      <el-form-item label="日期:">
        <el-date-picker
          v-model="dateArray"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="timestamp"
          :clearable="false"
          :picker-options="pickerOptions"
          @change="handleFormChange"
        ></el-date-picker>
      </el-form-item>
      <!-- 软件名称 -->
      <el-form-item label="软件名称">
        <el-select v-model="query.productId" placeholder="请选择软件" @change="handleFormChange">
          <el-option
            v-for="item in productList"
            :key="item.product_id"
            :label="item.product_name"
            :value="item.product_id"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- 投放媒体 -->
      <el-form-item label="投放媒体:">
        <el-select v-model="query.channelId" @change="handleFormChange">
          <el-option
            v-for="item in channelList"
            :key="item.channel_id"
            :label="item.channel_name"
            :value="item.channel_id"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- 操作系统 -->
      <el-form-item label="操作系统:">
        <el-select v-model="query.osId" @change="handleFormChange">
          <el-option
            v-for="item in osList"
            :key="item.os_id"
            :label="item.os_name"
            :value="item.os_id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <!-- chart -->

    <div style="padding: 0 20px;">
      <p class="title">折线图</p>
      <el-radio-group v-model="typeProp" @change="loadChart" style="margin-top: 15px;">
        <el-radio-button
          v-for="item in typeList"
          :label="item.prop"
          :key="item.prop"
        >{{ item.name }}</el-radio-button>
      </el-radio-group>
      <chart
        style="margin-top: 15px;"
        v-if="dateType === 'one-day'"
        :data-source="chartData"
        :unit="unit"
      />
      <multi-dates-chart
        v-else
        style="margin-top: 15px;"
        :data-source="chartData"
        :unit="unit"
        :yAxisName="yAxisName"
      />
    </div>

    <div class="form-table">
      <!-- table -->
      <xm-table :columns="columns" :max-height="380" :data-source="tableData" />
    </div>
  </div>
</template>
<script>
import Chart from './components/Chart';
import MultiDatesChart from './components/MultiDatesChart';
import XmTable from '@/components/XmTable';
import URL from '@/constants/url';
import request from '@/utils/request';
import * as dateUtil from '@/utils/date-util';
import * as config from './config/index';
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'RealTime',
  components: {
    Chart,
    MultiDatesChart,
    XmTable
  },
  data() {
    return {
      loading: true,
      typeList: config.typeList,
      columns: config.columns,
      pickerOptions: config.pickerOptions,
      dateArray: [],
      query: {
        productId: '',
        channelId: 0, // 渠道id
        osId: '0'
      },
      channelList: [
        { channel_id: 0, channel_name: '全部' },
        { channel_id: 3, channel_name: '广点通' },
        { channel_id: 2, channel_name: '快手' },
        { channel_id: 1, channel_name: '抖音' },
        { channel_id: 9, channel_name: '其他' }
      ],
      tableData: [],
      chartData: [], // 图表数据
      chartStore: {}, // 图表用的全部数据
      dateType: 'one-day', // 是一天还是多天的日期

      typeProp: 'cost',
      unit: '',
      yAxisName: ''
    };
  },
  computed: {
    ...mapGetters('common', ['productList', 'osList'])
  },
  mounted() {
    // 初始化时间
    let start = dateUtil.prevDate(new Date(), 0);
    start = new Date(start).getTime();
    let end = new Date().getTime();
    this.dateArray = [start, end];
    this.timer = setTimeout(() => {
      this.getRealTimeData();
      this.getChartData();
    }, 30 * 60 * 1000);
    // 获取下拉值
    this.getSelectList().then(({ productList, osList }) => {
      if (productList && productList[0]) {
        this.query.productId = productList[0].product_id;
      }
      if (osList && osList[0]) {
        this.query.osId = osList[0].os_id;
      }
      this.getRealTimeData();
      this.getChartData();
    });
  },
  beforeDestroy() {
    clearTimeout(this.timer);
  },
  methods: {
    ...mapActions('common', ['getSelectList']),

    /**
     *  下拉改变回掉
     */
    handleFormChange() {
      this.getRealTimeData();
      this.getChartData();
    },

    /**
     * 表格数据
     */
    getRealTimeData() {
      this.loading = true;
      let [start, end] = this.dateArray;
      const { productId, channelId, osId } = this.query;

      start = dateUtil.formatDate(start, 'YYYY-MM-DD');
      end = dateUtil.formatDate(end, 'YYYY-MM-DD');

      request({
        url: URL.realTime.realTimeData,
        method: 'get',
        params: {
          start_date: start,
          end_date: end,
          version: 'v2',
          channel_id: channelId,
          product_id: productId,
          os_id: osId
        }
      }).then(res => {
        this.loading = false;
        if (res && res.code === 0) {
          this.tableData = res.data;
        }
      });
    },

    /**
     *  获取图标数据
     */
    getChartData() {
      let [start, end] = this.dateArray;
      const { productId, channelId, osId } = this.query;

      start = dateUtil.formatDate(start, 'YYYY-MM-DD');
      end = dateUtil.formatDate(end, 'YYYY-MM-DD');

      request({
        url: URL.realTime.chartData,
        method: 'get',
        params: {
          start_date: start,
          end_date: end,
          channel_id: channelId,
          product_id: productId,
          os_id: osId
        }
      }).then(res => {
        if (res && res.code === 0) {
          this.chartStore = res.data.list;
          this.dateType = res.data.type;
          this.loadChart();
        }
      });
    },

    /**
     *  图表数据
     */
    loadChart() {
      // console.log(this.dateType);
      this.dateType === 'one-day' ? this.generateOneDayChart() : this.generateMultiDatesChart();
    },

    /**
     *  多天的图表
     */
    generateMultiDatesChart() {
      const { chartStore, typeProp } = this;
      let date = chartStore.days;
      let data = chartStore[typeProp];
      if (typeProp === 'cost') {
        this.unit = '万元';
        data = data.map(x => (x /= 10000).toFixed(2));
      } else if (typeProp === 'p_cost') {
        this.unit = '元';
      } else if (typeProp === 'active') {
        this.unit = '个';
      } else {
        this.unit = '';
      }
      this.chartData = [date, data];
      this.yAxisName = this.typeList.find(item => item.prop === typeProp).name;
    },

    /**
     *  单天的图表
     */
    generateOneDayChart() {
      const { chartStore, typeProp } = this;
      const index = chartStore.fields.indexOf(typeProp);
      let date = chartStore['yestoday'][0];
      let today = chartStore['today'][index];
      let yesterday = chartStore['yestoday'][index];
      let lastweek = chartStore['todayLastWeek'][index];
      if (typeProp === 'cost') {
        this.unit = '万元';
        today = today.map(x => (x /= 10000).toFixed(2));
        yesterday = yesterday.map(x => (x /= 10000).toFixed(2));
        lastweek = lastweek.map(x => (x /= 10000).toFixed(2));
      } else if (typeProp === 'p_cost') {
        this.unit = '元';
      } else if (typeProp === 'active') {
        this.unit = '个';
      } else {
        this.unit = '';
      }
      this.yAxisName = this.typeList.find(item => item.prop === typeProp).name;
      this.chartData = [date.map(item => item.slice(0, 5)), today, yesterday, lastweek];
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  border-radius: 4px;
  overflow: hidden;
  background-color: #fff;
  .title {
    margin: 0;
    padding-top: 20px;
    font-size: 16px;
    font-weight: bold;
    color: #409eff;
  }
  .date-form {
    padding: 20px 20px 0;
  }
  .form-table {
    padding: 25px 15px 15px;
  }
}
</style>
