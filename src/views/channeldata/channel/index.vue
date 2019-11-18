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
      <el-form-item label="是否规范">
        <el-select v-model="formInline.is_valid">
          <el-option
            v-for="item in validOption"
            :key="item.name"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="渠道号">
        <el-select v-model="formInline.qid" filterable>
          <el-option v-for="(item, i) in qdParams" :key="i" :label="item" :value="item"></el-option>
        </el-select>
        <el-button @click="expandAllColumns">{{expand.text}}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="backQuery" v-if="isShowBackBtn">返回</el-button>
      </el-form-item>
    </el-form>
    <h3 class="table">
      汇总数据总量:
      <span>{{ head.general.total_count }}</span>，
      累计消费金额:
      <span>{{ (head.general.total_cost / 1).toFixed(2) }}</span>元， 激活数据量:
      <span>{{ head.general.total_active }}</span>， 人均激活成本:
      <span>{{ head.general.per_cost }}</span>元
    </h3>
    <base-table
      v-loading="tableLoading"
      :tableData="head.list"
      :columns="columns"
      @tableCellClick="tableCellClick"
      @sort-change="handleSortChange"
      :tableViewHeight="600"
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
import { cloneDeep } from 'lodash';
import { formatDate } from '@/utils/index';
import { zhangyuColumns, bddColumns, zhangyuColumnszk, bddColumnszk } from './columns';
import { mapState, mapActions, mapMutations } from 'vuex';
import mixin from '@/mixins/rangeDate';

export default {
  name: 'qudaoshuju',
  components: {
    BaseTable
  },
  mixins: [mixin],
  data() {
    return {
      dialogFormVisible: false,
      isShowBackBtn: false,
      columns: bddColumns,
      datepicker: {
        startDate: subtractDate(0), //subtractDate(1)
        rangeDate: [subtractDate(0), subtractDate(0)]
      },
      currentPage: 1,
      total: 0,
      oldVal: {},
      validOption: [
        {
          name: '全部',
          id: ''
        },
        {
          name: '不规范',
          id: '0'
        },
        {
          name: '规范',
          id: '1'
        }
      ],
      expand: {
        text: '展开全部',
        isExpand: false
      }
    };
  },
  beforeRouteLeave(to, from, next) {
    // 如果下一个页面不是详情页（C），则取消列表页（B）的缓存
    if (to.name !== 'channeldataqid') {
      this.save({
        //formInline: cloneDeep(this.oldformInline),
        rangeDate: [subtractDate(0), subtractDate(0)]
      });
      this.tiRecommendsave({
        formInline: cloneDeep(this.oldformInline)
      });
      this.$store.commit('keepAlive/removeKeepAlive', from.name);
    }
    next();
  },
  mounted() {
    this.querySelectData().then(() => {
      this.handleCurrentChange(1);
    });
    this.queryqdParams();
  },
  methods: {
    ...mapMutations('channelData', ['save']),
    ...mapMutations('tiRecommend', {
      tiRecommendsave: 'save'
    }),
    ...mapActions('channelData', ['queryTiData', 'queryTiSortData', 'queryqdParams']),
    ...mapActions('tiRecommend', ['querySelectData', 'queryFilterData', 'queryAccountList']),
    tableCellClick(row, columns) {
      const prop = columns.property;
      if (prop === 'qid') {
        this.isShowBackBtn = true;
        this.$router.push({
          path: 'qid',
          query: {
            agent_id: row['agent_id'],
            start_date: formatDate(this.datepicker.rangeDate[0]),
            end_date: formatDate(this.datepicker.rangeDate[1]),
            qid: row['qid']
          }
        });
      } else if (prop === 'date' && /\d{4}-\d{4}/.test('' + row.date)) {
        this.isShowBackBtn = true;
        this.save({
          detail: 1
        });
        this.tiRecommendsave({
          formInline: {
            qid: row.qid
          }
        });
        this.queryTiData();
      }
    },
    backQuery() {
      this.save({
        detail: 0
      });
      this.tiRecommendsave({
        formInline: {
          qid: ''
        }
      });
      this.isShowBackBtn = false;
      this.queryTiData();
    },
    routerBack() {
      this.queryTiData();
      this.isShowBackBtn = false;
      this.btnStatus = [
        {
          name: '广告组',
          type: 'primary'
        }
      ];
    },
    handleTagInput(val) {
      this.save({ tag: val });
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
    },
    handleSortChange(sort) {
      if (!this.isShowBackBtn) {
        this.queryTiSortData(sort);
      }
    },
    handleCheckedPropsChange(val) {
      console.log('val', val);
    },
    handleCheckAllChange(val) {
      console.log('val', val);
    },
    onConfirm() {
      this.queryTiData();
      this.dialogFormVisible = false;
    },
    onReset() {
      this.save({
        formFields: {
          checkedCustomFields: []
        }
      });
    },
    handleQuery() {},
    expandAllColumns() {
      if (this.expand.isExpand) {
        this.expand = {
          text: '展开全部',
          isExpand: false
        };
        if (this.product_id === '1') {
          this.columns = zhangyuColumns;
        } else {
          this.columns = bddColumns;
        }
      } else {
        this.expand = {
          text: '收回全部',
          isExpand: true
        };
        if (this.product_id === '1') {
          this.columns = zhangyuColumnszk;
        } else {
          this.columns = bddColumnszk;
        }
      }
    }
  },
  computed: {
    ...mapState('channelData', ['head', 'tableLoading', 'qdParams']),
    ...mapState('tiRecommend', [
      'formInline',
      'oldformInline',
      'selectData',
      'filterData',
      'pagetype',
      'tag',
      'filterData',
      'accountList'
    ]),
    channel_id() {
      return this.formInline.channel_id;
    },
    agent_id() {
      return this.formInline.agent_id;
    },
    product_id() {
      return this.formInline.product_id;
    },
    checkedOptionsValues() {
      let arr = [];
      this.checkedOptions.forEach(item => {
        let arr2 = [];
        item.values.forEach(element => {
          arr2.push(element.label);
        });
        arr.push(arr2);
      });
      return arr;
    }
  },
  watch: {
    formInline: {
      handler(val) {
        if (JSON.stringify(this.oldVal) === JSON.stringify(val)) return;
        this.oldVal = cloneDeep(val);
        this.querySelectData().then(() => {
          this.handleCurrentChange(1);
        });
      },
      deep: true
    },
    product_id(product_id) {
      if (product_id === '1') {
        this.columns = zhangyuColumns;
      } else {
        this.columns = bddColumns;
      }
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
        this.querySelectData().then(() => {
          this.handleCurrentChange(1);
        });
      },
      immediate: true,
      deep: true
    },
    tag() {
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
