<template>
  <div class="main">
    <el-form inline :model="formInline" @submit.native.prevent>
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

      <el-form-item label="软件名称：">
        <el-select v-model="formInline.product_id">
          <el-option
            v-for="item in filterData.product_list"
            :key="item.product_id"
            :label="item.product_name"
            :value="item.product_id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="投放媒体：">
        <el-select v-model="formInline.channel_id">
          <el-option
            v-for="item in filterData.channel_list"
            :key="item.channel_id"
            :label="item.channel_name"
            :value="item.channel_id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="代理商：">
        <el-select v-model="formInline.agent_id" filterable>
          <el-option
            v-for="item in filterData.agent_list"
            :key="item.agent_id"
            :label="item.agent_name"
            :value="item.agent_id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="系统：">
        <el-select v-model="formInline.os_id">
          <el-option
            v-for="item in filterData.os_list"
            :key="item.os_id"
            :label="item.os_name"
            :value="item.os_id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="routerBack">返回</el-button>
      </el-form-item>
    </el-form>
    <h3 class="table">
      汇总详细数据:
      <span>{{ details.total_count }}</span>， 累计消费金额:
      <span>{{ (details.total_cost / 1).toFixed(2) }}</span>元， 激活数据量
      <span>{{ details.total_active }}</span>， 人均激活成本:
      <span>{{ details.per_cost }}</span>元
    </h3>
    <base-table
      v-loading="tableLoading"
      :tableData="details.list"
      :columns="columns2"
      :showWeekendRow="isDetail"
      :showColumnClass="!isDetail"
      @tableCellClick="tableCellClick"
      :tableViewHeight="500"
    />
    <div class="block">
      <el-pagination
        :current-page.sync="currentPage"
        :page-size="50"
        layout="prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import BaseTable from '@/components/BaseTable';
import { formatDate, subtractDate } from '@/utils/index';
import { cloneDeep } from 'lodash';
import { baseLongColumns, baseShortColumns } from './columns';
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex';
import mixin from '@/mixins/rangeDate';

let columns2 = cloneDeep(baseLongColumns);

/* columns2.splice(3, 0, {
  prop: 'agent_name',
  agent_id: 'agent_id',
  name: '',
  label: '代理商',
  'class-name': 'link-row',
  width: '170',
  fixed: true
}); */
columns2.splice(5, 2);
columns2.splice(8, 1);
export default {
  name: 'tiRecommend',
  components: {
    BaseTable
  },
  mixins: [mixin],
  data() {
    return {
      datepicker: {
        startDate: subtractDate(0), //subtractDate(1)
        rangeDate: [subtractDate(0), subtractDate(0)]
      },
      columns2,
      currentPage: 1,
      total: 0,
      oldVal: {},
      isFirst: true
    };
  },
  mounted() {
    let { agent_id, start_date, end_date, channel_id, product_id, os_id } = this.$route.query;
    this.datepicker.rangeDate = [start_date, end_date];
    agent_id = '' + agent_id;
    channel_id = '' + channel_id;
    product_id = '' + product_id;
    this.querySelectData().then(() => {
      this.save({
        formInline: { agent_id, start_date, end_date, channel_id, product_id, os_id }
      });
      console.log('this.formInline', JSON.stringify(this.formInline), JSON.stringify(this.filterData));
    });
    this.$nextTick(function() {
      this.setColumnsWidth();
    });
  },
  methods: {
    ...mapMutations('tiRecommendDetail', ['save']),
    ...mapActions('tiRecommendDetail', ['queryTiData']),
    ...mapActions('tiRecommend', ['querySelectData', 'queryFilterData']),
    tableCellClick(row, columns) {
      const prop = columns.property;
      if (this.pagetype === 'base' && prop === 'agent_name') {
        this.$router.push({
          path: 'agent',
          query: {
            agent_id: row['agent_id'],
            start_date: formatDate(this.datepicker.rangeDate[0]),
            end_date: formatDate(this.datepicker.rangeDate[1]),
            channel_id: row['channel_id'],
            product_id: row['product_id']
          }
        });
      }
    },
    setColumnsWidth() {
      this.columns2.forEach(item => {
        if (item.prop === 'download_start' || item.prop === 'download_finish' || item.prop === 'per_cost') {
          item.width = '150';
        } else if (item.prop === 'agent_name' || item.prop === 'cost' || item.prop === 'r_cost') {
          item.width = '170';
        } else {
          item.width = '130';
        }
      });
    },
    routerBack() {
      this.$router.go(-1);
    }
  },
  computed: {
    ...mapState('tiRecommendDetail', ['formInline', 'details', 'tableLoading']),
    ...mapState('tiRecommend', ['oldformInline', 'selectData', 'pagetype', 'filterData']),
    ...mapGetters('tiRecommend', ['isDetail', 'isRangeDate']),
    channel_id() {
      return this.formInline.channel_id;
    }
  },
  watch: {
    formInline: {
      handler(val) {
        if (JSON.stringify(this.oldVal) === JSON.stringify(val)) return;
        this.oldVal = cloneDeep(val);
        this.querySelectData().then(() => {
          this.queryTiData();
          this.isFirst = false;
        });
      },
      deep: true
    },
    channel_id(channel_id) {
      this.queryFilterData({ channel_id });
    },
    datepicker: {
      handler(val) {
        this.save(val);
        if (this.isFirst) return;
        this.queryTiData();
        if (this.isRangeDate) {
          //区间日期
          let columns2 = cloneDeep(baseShortColumns);
          /* columns2.splice(3, 0, {
            prop: 'agent_name',
            agent_id: 'agent_id',
            name: '',
            label: '代理商',
            'class-name': 'link-row',
            width: '170'
          }); */
          this.columns2 = columns2;
        } else {
          //单日日期
          let columns1 = cloneDeep(baseLongColumns);
          let columns2 = cloneDeep(baseLongColumns);

          columns1.splice(3, 1);
          columns1.push(
            {
              prop: '3day_cost',
              label: '3日人均成本'
            },
            {
              prop: '7day_cost',
              label: '7日人均成本'
            }
          );
          columns2.splice(3, 0, {
            prop: 'agent_name',
            agent_id: 'agent_id',
            name: '',
            label: '代理商',
            'class-name': 'link-row',
            width: '170'
          });
          this.columns1 = columns1;
          this.columns2 = columns2;
        }
        this.setColumnsWidth();
      },
      // immediate: true,
      deep: true
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/ .el-table .cell {
  text-align: center;
  padding: 0;
}
/deep/ .el-table--scrollable-x .el-table__body-wrapper {
  -webkit-overflow-scrolling: touch;
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
</style>
