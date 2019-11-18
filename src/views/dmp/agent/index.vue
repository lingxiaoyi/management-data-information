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
      <el-form-item label="系统：">
        <el-select v-model="formInline.os_id" @change="handleQuery">
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
      <span>{{ tableData.total_count }}</span>， 累计消费金额:
      <span>{{ (tableData.total_r_cost / 1).toFixed(2) }}</span>元， 激活数据量
      <span>{{ tableData.total_active }}</span>， 人均激活成本:
      <span>{{ tableData.per_cost }}</span>元
    </h3>
    <base-table
      v-loading="tableLoading"
      :tableData="tableData.list"
      :columns="columns1"
      @tableCellClick="tableCellClick"
      :tableViewHeight="600"
    />

    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
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
import { mapState, mapActions, mapMutations } from 'vuex';
import { baseLongColumns, baseShortColumns } from './columns';

export default {
  components: {
    BaseTable
  },
  data() {
    return {
      datepicker: {
        startDate: subtractDate(0), //subtractDate(1)
        rangeDate: [subtractDate(0), subtractDate(0)]
      },
      pickerOptions: {
        shortcuts: [
          {
            text: '今天',
            onClick: picker => {
              let rangeDate = [subtractDate(0), subtractDate(0)];
              this.datepicker.rangeDate = rangeDate;
              this.save({
                rangeDate
              });
              picker.$emit('pick', rangeDate);
            }
          },
          {
            text: '昨天',
            onClick: picker => {
              let rangeDate = [subtractDate(1), subtractDate(1)];
              this.datepicker.rangeDate = rangeDate;
              this.save({
                rangeDate
              });
              picker.$emit('pick', rangeDate);
            }
          },
          {
            text: '过去7天',
            onClick: picker => {
              let rangeDate = [subtractDate(7), subtractDate(1)];
              this.datepicker.rangeDate = rangeDate;
              this.save({
                rangeDate
              });
              picker.$emit('pick', rangeDate);
            }
          },
          {
            text: '过去30天',
            onClick: picker => {
              let rangeDate = [subtractDate(30), subtractDate(1)];
              this.datepicker.rangeDate = rangeDate;
              this.save({
                rangeDate
              });
              picker.$emit('pick', rangeDate);
            }
          },
          {
            text: '本周',
            onClick: picker => {
              let rangeDate = [
                this.dayjs()
                  .startOf('week')
                  .add(1, 'd')
                  .format('YYYY-MM-DD'),
                subtractDate(0)
              ];
              this.datepicker.rangeDate = rangeDate;
              this.save({
                rangeDate
              });
              picker.$emit('pick', rangeDate);
            }
          },
          {
            text: '上周',
            onClick: picker => {
              let dayjs = this.dayjs;
              let t = dayjs().subtract(1, 'w');
              let val1 = t
                .set('date', t.$D - t.$W)
                .add(1, 'd')
                .format('YYYY-MM-DD'); //上周第一天（周一）
              let val2 = t
                .set('date', t.$D + (6 - t.$W))
                .add(1, 'd')
                .format('YYYY-MM-DD'); //上周最后一天（周日）
              let rangeDate = [val1, val2];
              this.datepicker.rangeDate = rangeDate;
              this.save({
                rangeDate
              });
              picker.$emit('pick', rangeDate);
            }
          },
          {
            text: '本月',
            onClick: picker => {
              let rangeDate = [
                this.dayjs()
                  .startOf('month')
                  .format('YYYY-MM-DD'),
                subtractDate(0)
              ];
              this.datepicker.rangeDate = rangeDate;
              this.save({
                rangeDate
              });
              picker.$emit('pick', rangeDate);
            }
          },
          {
            text: '上月',
            onClick: picker => {
              let dayjs = this.dayjs;
              let val1 = dayjs()
                .subtract(1, 'months')
                .startOf('month')
                .format('YYYY-MM-DD'); //上周第一天（周一）
              let val2 = this.dayjs()
                .subtract(1, 'months')
                .endOf('month')
                .format('YYYY-MM-DD'); //上周最后一天（周日）
              let rangeDate = [val1, val2];
              this.datepicker.rangeDate = rangeDate;
              this.save({
                rangeDate
              });
              picker.$emit('pick', rangeDate);
            }
          }
        ]
      },
      columns1: baseShortColumns,
      currentPage: 1,
      formInline: {
        os_id: '0'
      },
      total: 0
    };
  },
  mounted() {
    let { start_date, end_date } = this.$route.query;
    this.datepicker.rangeDate = [start_date, end_date];
    /* if (start_date === end_date) {
      this.columns1 = baseLongColumns;
    } else {
      this.columns1 = baseShortColumns;
    } */
    this.handleQuery();
    this.$nextTick(function() {
      this.setColumnsWidth();
    });
  },
  methods: {
    ...mapMutations('agentdetails', ['save']),
    ...mapActions('agentdetails', ['queryTiData']),
    handleQuery() {
      let { agent_id, channel_id, product_id } = this.$route.query;
      const { os_id } = this.formInline;
      this.queryTiData({
        product_id,
        agent_id,
        start_date: formatDate(this.datepicker.rangeDate[0], ''),
        end_date: formatDate(this.datepicker.rangeDate[1], ''),
        channel_id,
        os_id
      });
    },
    tableCellClick(row, columns) {
      const prop = columns.property;
      if (this.pagetype === 'base' && prop === 'agent_id') {
        this.$router.push({
          path: 'agent',
          query: { agent_id: row[prop] }
        });
      }
    },
    routerBack() {
      this.$router.go(-1);
      //this.$router.push({ path: 'tiRecommend' });
    },
    setColumnsWidth() {
      this.columns1.forEach(item => {
        if (item.prop === 'download_start' || item.prop === 'download_finish' || item.prop === 'per_cost') {
          item.width = '150';
        } else if (item.prop === 'agent_name' || item.prop === 'cost' || item.prop === 'r_cost') {
          item.width = '170';
        } else {
          item.width = '130';
        }
      });
    },
    handleSizeChange() {},
    handleCurrentChange() {}
  },
  computed: {
    ...mapState('agentdetails', ['tableData', 'tableLoading']),
    ...mapState('tiRecommend', ['filterData'])
  },
  watch: {
    /* formInline: {
      handler() {
        this.queryTiData();
      },
      // immediate: true,
      deep: true
    }, */
    datepicker: {
      handler(val) {
        let { agent_id /* , start_date, end_date */, channel_id, product_id } = this.$route.query;
        const { os_id } = this.formInline;
        this.queryTiData({
          product_id,
          agent_id,
          start_date: formatDate(val.rangeDate[0], ''),
          end_date: formatDate(val.rangeDate[1], ''),
          channel_id,
          os_id
        });
        if (formatDate(val.rangeDate[0], '') !== formatDate(val.rangeDate[1], '')) {
          this.columns1 = baseShortColumns;
        } else {
          this.columns1 = baseLongColumns;
        }
      },
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
