<template>
  <div class="main">
    <el-form
      inline
      :model="formInline"
      @submit.native.prevent
    >
      <el-form-item label="日期：">
        <el-date-picker
          v-model="datepicker.rangeDate"
          :default-value="datepicker.rangeDate"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
        >></el-date-picker>
      </el-form-item>
      <el-form-item label="添加日期：">
        <el-date-picker
          v-model="datepicker.rangeDate2"
          :default-value="datepicker.rangeDate2"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >></el-date-picker>
      </el-form-item>
      <el-form-item
        label="代理商："
        v-if="isShowBackBtn"
      >
        <el-select
          v-model="formInline.agent_id"
          filterable
        >
          <el-option
            v-for="item in agentList"
            :key="item.agent_id"
            :label="item.agent_name"
            :value="item.agent_id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item
        label="广告组："
        v-if="isShowBackBtn"
      >
        <el-select
          v-model="formInline.campaign_id"
          filterable
        >
          <el-option
            v-for="item in campaignList"
            :key="item.campaign_id"
            :label="item.campaign_name"
            :value="item.campaign_id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item
        label="广告计划："
        v-if="isShowBackBtn"
      >
        <el-select
          v-model="formInline.ad_id"
          filterable
        >
          <el-option
            v-for="item in adList"
            :key="item.ad_id"
            :label="item.ad_name"
            :value="item.ad_id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item
        label="软件名称："
        v-if="isShowProductList"
      >
        <el-select v-model="formInline.product_id">
          <el-option
            v-for="item in filterData.product_list"
            :key="item.product_id"
            :label="item.product_name"
            :value="item.product_id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="投放媒体："
        v-if="isShowProductList"
      >
        <el-select v-model="formInline.channel_id">
          <el-option
            v-for="item in filterData.channel_list"
            :key="item.channel_id"
            :label="item.channel_name"
            :value="item.channel_id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="素材来源："
        v-if="isShowProductList"
      >
        <el-select v-model="formInline.user_type">
          <el-option
            v-for="item in innerList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="用户姓名："
        v-if="isShowProductList"
      >
        <el-input
          v-model="formInline.user_name"
          auto-complete="off"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="像素分辨率："
        v-if="isShowProductList"
      >
        <el-select v-model="formInline.pixel">
          <el-option
            v-for="item in pixelParams"
            :key="item"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="搜索：">
        <el-input
          v-model="formInline.videoId"
          auto-complete="off"
        ></el-input>
        <el-button @click="handleQuery">查询</el-button>
      </el-form-item>
    </el-form>
    <!-- <h3 class="table">
      <span
        class="btn-customize"
        v-if="isShowBackBtn"
      >
        <el-button
          type="primary"
          @click="routerBack"
        >返回</el-button>
      </span>
    </h3> -->
    <h3
      class="table"
      v-if="!isShowBackBtn"
    >
      汇总数据总量:
      <span>{{ tableList.general.total_count }}</span>，
      累计消费金额:
      <span>{{ (tableList.general.total_cost / 1).toFixed(2) }}</span>元， 激活数据量:
      <span>{{ tableList.general.total_active }}</span>， 人均激活成本:
      <span>{{ tableList.general.per_cost }}</span>元
    </h3>
    <base-table
      v-loading="tableLoading"
      :tableData="tableList.data"
      :columns="columns"
      @tableCellClick="tableCellClick"
      @sort-change="handleSortChange"
      :tableViewHeight="600"
    />
    <div class="block">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page.sync="tableList.pages.page"
        :page-size="tableList.pages.size"
        layout="prev, pager, next, jumper"
        :total="tableList.pages.count / 1"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import BaseTable from '@/components/BaseTable';
import { subtractDate } from '@/utils/index';
import { formatDate } from '@/utils/index';
import { cloneDeep } from 'lodash';
import { mapState, mapActions, mapMutations } from 'vuex';
import { columns, columnsCreative, columnsImage, columnsImageCreative } from './columns';
import mixin from '@/mixins/rangeDate';

export default {
  components: {
    BaseTable
  },
  mixins: [mixin],
  data() {
    return {
      dialogFormVisible: false,
      isShowBackBtn: false,
      video_id: '',
      columns,
      datepicker: {
        rangeDate: null,
        rangeDate2: null
      },
      oldTableList: [],
      // pixel: '',
      // innerId: '',
      oldVal: {},
      innerList: [
        {
          id: '0',
          name: '全部'
        },
        {
          id: '1',
          name: '代理商'
        },
        {
          id: '2',
          name: '自创'
        }
      ]
    };
  },
  computed: {
    ...mapState('materialVideo', [
      'filterData',
      'tableList',
      'tableLoading',
      'formInline',
      'oldformInline',
      'agentList',
      'adList',
      'campaignList',
      'routerPath',
      'pixelParams'
    ]),
    isShowProductList: function() {
      return !this.isShowBackBtn;
    }
  },
  watch: {
    formInline: {
      handler(val) {
        if (JSON.stringify(this.oldVal) === JSON.stringify(val)) return;
        this.oldVal = cloneDeep(val);
        this.queryTiData();
      },
      deep: true
    },
    datepicker: {
      handler(val) {
        this.save(val);
        this.queryTiData();
      },
      deep: true
    }
  },
  created() {
    this.initColumns();
  },
  mounted() {
    let { start_date, end_date, inner_date_start, inner_date_end, videoId, agent_id, ad_id, campaign_id, user_type, user_name, pixel, product_id } = this.$route.query

    start_date = start_date || subtractDate(0)
    end_date = end_date || subtractDate(0)
    inner_date_start = inner_date_start || ''
    inner_date_end = inner_date_end || ''

    this.datepicker.rangeDate = [start_date, end_date];
    this.datepicker.rangeDate2 = inner_date_start ? [inner_date_start, inner_date_end] : null;

    this.save({
      routerPath: this.$route.path,
      rangeDate: [start_date, end_date],
      rangeDate2: inner_date_start ? [inner_date_start, inner_date_end] : null,
      // 初始化
      formInline: {
        ...this.oldformInline,
        videoId: videoId || '',
        agent_id: agent_id || '0',
        ad_id: ad_id || '0',
        campaign_id: campaign_id || '0',
        user_type: user_type || '0',
        user_name: user_name || '',
        pixel: pixel || '全部',
        product_id: product_id || ''
      },
      tableList: {
        data: [],
        pages: {
          page: 1,
          size: 20,
          count: ''
        },
        sort: {}
      }
    });
    this.getpixelParams();
  },
  methods: {
    ...mapMutations('materialVideo', ['save']),
    ...mapActions('materialVideo', [
      'querySelectData',
      'queryTiData',
      'queryTiDataCreative',
      'queryDetailSelectData',
      'queryTiSortData',
      'getpixelParams'
    ]),
    //初始化表头
    initColumns() {
      let routerPath = this.$route.path;
      let cols = [];
      let colsCreative = [];
      if (routerPath === '/res/video') {
        cols = cloneDeep(columns);
        colsCreative = cloneDeep(columnsCreative);
        // } else if (routerPath === '/res/pic') {
        //   cols = columnsImage;
      } else {
        cols = cloneDeep(columnsImage);
        colsCreative = cloneDeep(columnsImageCreative);
      }
      this.$nextTick(function() {
        if (document.body.clientWidth <= 1380) {
          cols.forEach(item => {
            if (item.prop === 'poster_url' || item.prop === 'url') {
              item.width = 200;
            } else if (item.prop === 'video_id' || item.prop === 'image_id') {
              item.width = 150;
            }
          });
          colsCreative.forEach(item => {
            if (item.prop === 'campaign_name') {
              item.width = 200;
            } else if (item.prop === 'creative_id') {
              item.width = 150;
            } else if (item.prop === 'ad_name') {
              item.width = 150;
            } else if (item.prop === 'agent_name') {
              item.width = 200;
            }
          });
        }
        this.columns = this.isShowBackBtn ? colsCreative : cols;
      });
    },
    tableCellClick(row, columns) {
      const prop = columns.property;
      if (prop === 'creative_count') {
        this.video_id = row['signature'];
        if (row['creative_count'] == 0) return;
        const { videoId, agent_id, ad_id, campaign_id, user_type, user_name, pixel, product_id } = this.formInline
        const start_date = this.datepicker.rangeDate ? formatDate(this.datepicker.rangeDate[0]) : ''
        const end_date = this.datepicker.rangeDate ? formatDate(this.datepicker.rangeDate[1]) : ''
        const inner_date_start = this.datepicker.rangeDate2 ? formatDate(this.datepicker.rangeDate2[0]) : ''
        const inner_date_end = this.datepicker.rangeDate2 ? formatDate(this.datepicker.rangeDate2[1]) : ''

        this.$router.push({
          path: 'detail',
          query: {
            id: this.video_id,
            path: this.$route.path,
            start_date,
            end_date,
            inner_date_start,
            inner_date_end,
            videoId,
            agent_id,
            ad_id,
            campaign_id,
            user_type,
            user_name,
            pixel,
            product_id
          }
        });

        // this.queryDetailSelectData({
        //   //date: row.date,
        //   id: this.video_id
        // });
      }
    },
    handleCurrentChange(val) {
      this.save({
        tableList: {
          pages: {
            ...this.tableList.pages,
            page: val
          }
        }
      });
      this.handleQuery();
    },
    handleSortChange(sort) {
      if (!this.isShowBackBtn) {
        this.queryTiSortData(sort);
      }
    },
    //查询
    handleQuery() {
      // if (this.isShowBackBtn) {
      //   this.queryTiDataCreative(this.video_id);
      // } else {
      //   this.queryTiData();
      // }
      this.queryTiData();
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/ .el-table .cell {
  text-align: center;
  padding: 0;
}
.block {
  width: 100%;
  padding: 20px;
}
.el-pagination {
  text-align: right;
}
.el-card {
  min-height: 500px;
  position: relative;
}
h3.table {
  font-size: 12px;
  span {
    padding-left: 5px;
    color: red;
  }
}
.el-form-item--mini.el-form-item,
.el-form-item--small.el-form-item {
  margin-bottom: 10px;
}
.sec {
  margin-top: 35px;
  .title {
    font-size: 16px;
    color: #000;
  }
  .ul {
    margin-top: 10px;
  }
  &:nth-child(1) {
    margin-top: 20px;
  }
}
/deep/ .el-dialog__body {
  padding-top: 0;
  .el-checkbox-group {
    padding: 0 20px;
  }
  .el-checkbox {
    margin-top: 10px;
  }
}
/deep/ .title .el-checkbox__label {
  font-size: 18px;
  color: #000;
  font-weight: 550;
}
/deep/ .title .el-checkbox__input {
  transform: translateY(-2px);
}
.el-checkbox-group .el-checkbox {
  width: 25%;
  margin-left: 0px;
}
.btn-customize {
  margin-right: 10px;
}
/deep/ .el-input {
  width: auto;
}
</style>
