<template>
  <div class="main">
    <el-form inline :model="form" @submit.native.prevent>
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
      <el-form-item label="代理商：">
        <el-select v-model="form.agent_id" filterable>
          <el-option
            v-for="item in filterData.agent_list"
            :key="item.agent_id"
            :label="item.agent_name"
            :value="item.agent_id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="渠道号:">
        <el-input v-model="form.qid" auto-complete="off"></el-input>
        <el-button @click="handleQuery">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="routerBack">返回</el-button>
      </el-form-item>
    </el-form>
    <base-table
      v-loading="tableLoading"
      :tableData="head.list"
      :columns="columns"
      @tableCellClick="tableCellClick"
    />
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="head.pages.page"
        :page-size="head.pages.size"
        layout="prev, pager, next, jumper"
        :total="head.pages.count"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import BaseTable from '@/components/BaseTable';
import { subtractDate } from '@/utils/index';
import { columns } from './columns';
import { mapState, mapActions, mapMutations } from 'vuex';
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
      columns,
      datepicker: {
        startDate: subtractDate(0), //subtractDate(1)
        rangeDate: [subtractDate(0), subtractDate(0)]
      },
      currentPage: 1,
      total: 0
    };
  },
  mounted() {
    let { agent_id, start_date, end_date, qid } = this.$route.query;
    this.save({
      form: {
        agent_id: '' + agent_id,
        qid
      },
      rangeDate: [start_date, end_date]
    });
    console.log('this.form', this.form);
    this.datepicker.rangeDate = [start_date, end_date];
    this.querySelectData().then(() => {
      /* this.queryFilterData({ product_id: this.filterData.product_list[1].product_id }); */
    });
    this.$nextTick(function() {
      if (document.body.clientWidth <= 1380) {
        this.setColumnsWidth();
      }
    });
  },
  methods: {
    ...mapMutations('channelDataQid', ['save']),
    ...mapActions('channelDataQid', [
      'queryTiData',
      'changeFieldsWidth',
      'getCustomField',
      'queryGgjhData',
      'queryGgcyData'
    ]),
    ...mapActions('tiRecommend', ['querySelectData', 'queryFilterData', 'queryAccountList']),
    tableCellClick(row, columns) {
      const prop = columns.property;
      if (this.pagetype === 'base' && prop === 'agent_id') {
        this.$router.push({
          path: 'agent',
          query: { agent_id: row[prop] }
        });
      }
    },
    handleQuery() {
      this.queryTiData();
    },
    routerBack() {
      this.$router.push({ path: 'qudaoshuju' });
    },
    setColumnsWidth() {
      this.columns1.forEach(item => {
        if (
          item.prop === 'cost' ||
          item.prop === 'download_start' ||
          item.prop === 'download_finish' ||
          item.prop === 'per_cost'
        ) {
          item.width = '150';
        } else if (item.prop === 'agent_name') {
          item.width = '170';
        } else {
          item.width = '130';
        }
      });
      this.columns2.forEach(item => {
        if (
          item.prop === 'cost' ||
          item.prop === 'download_start' ||
          item.prop === 'download_finish' ||
          item.prop === 'per_cost'
        ) {
          item.width = '150';
        } else if (item.prop === 'agent_name') {
          item.width = '170';
        } else {
          item.width = '130';
        }
      });
    },
    handleSizeChange() {},
    handleCurrentChange(val) {
      this.save({
        head: {
          pages: {
            ...this.head.pages,
            page: val
          }
        },
        fields: []
      });
      this.queryTiData();
    }
  },
  computed: {
    ...mapState('channelDataQid', ['head', 'form']),
    ...mapState('tiRecommend', [
      'formInline',
      'selectData',
      'filterData',
      'pagetype',
      'tableLoading',
      'tag',
      'filterData',
      'accountList'
    ]),
    channel_id() {
      return this.formInline.channel_id;
    },
    agent_id() {
      return this.formInline.agent_id;
    }
  },
  watch: {
    formInline: {
      handler() {
        this.queryTiData();
      },
      deep: true
    },
    channel_id(channel_id) {
      this.queryFilterData({ channel_id });
    },
    agent_id(agent_id) {
      if (agent_id != 0) {
        this.queryAccountList({ agent_id });
      }
    },
    datepicker: {
      handler(val) {
        this.save(val);
        this.queryTiData();
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
