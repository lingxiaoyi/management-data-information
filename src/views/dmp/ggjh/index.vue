<template>
  <div class="main">
    <el-form inline :model="formInline" @submit.native.prevent>
      <el-form-item label="日期：">
        <el-date-picker
          v-model="datepicker.startDate"
          :default-value="datepicker.startDate"
          type="date"
          placeholder="选择日期"
        ></el-date-picker>
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
        <el-select v-model="formInline.agent_id">
          <el-option
            v-for="item in filterData.agent_list"
            :key="item.agent_id"
            :label="item.agent_name"
            :value="item.agent_id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="账户：">
        <el-select v-model="formInline.account_id" filterable>
          <el-option v-for="item in accountList" :key="item.id" :label="item.account" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <h3 class="table">
      <!-- 汇总媒体:
      <span>{{head.count.total_channel}}</span>，-->
      累计消费金额:
      <span>{{ (head.count.cost / 1).toFixed(2) }}</span
      >元， 激活数据量 <span>{{ head.count.active }}</span
      >， 人均激活成本: <span>{{ head.count.cost_active }}</span
      >元
      <span class="btn-customize">
        <el-button type="primary" @click="dialogFormVisible = true">自定义列</el-button>
      </span>
      <span class="btn-customize">
        <el-button type="primary" @click="routerBack">返回</el-button>
      </span>
    </h3>
    <base-table v-loading="tableLoading" :tableData="head.list" :columns="fields" @tableCellClick="tableCellClick" />
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
    <el-dialog title="自定义数据" :visible.sync="dialogFormVisible">
      <el-form :model="formFields">
        <template v-for="(item, index) in customFields">
          <div class="sec" :key="item.id">
            <div class="title">
              <el-checkbox indeterminate @change="handleCheckAllChange(index)">{{ item.category_name }}</el-checkbox>
            </div>
            <div class="ul">
              <el-checkbox-group v-model="formFields.checkedCustomFields">
                <el-checkbox
                  v-for="value in item.children"
                  :label="value.id"
                  :key="value.id"
                  @change="handleCheckedPropsChange(value)"
                  >{{ value.field_name }}</el-checkbox
                >
              </el-checkbox-group>
            </div>
          </div>
        </template>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onConfirm">确 定</el-button>
        <el-button @click="onReset">重置</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import BaseTable from '@/components/BaseTable';
import { subtractDate } from '@/utils/index';
import { mapState, mapActions, mapMutations } from 'vuex';

export default {
  components: {
    BaseTable
  },
  data() {
    return {
      dialogFormVisible: true,
      datepicker: {
        startDate: subtractDate(5), //subtractDate(1)
        rangeDate: [subtractDate(15), subtractDate(1)]
      },
      currentPage: 1,
      total: 0
    };
  },
  mounted() {
    let { startDate, campaign_id } = this.$route.query;
    this.save({
      startDate,
      campaign_id
    });
    this.querySelectData().then(() => {
      this.queryFilterData({ channel_id: this.filterData.channel_list[1].channel_id });
    });
    this.getCustomField();
    /* this.$nextTick(() => {
      if (document.body.clientWidth <= 1380) {
        this.changeFieldsWidth();
      }
    }); */
  },
  methods: {
    ...mapMutations('ggjh', ['save']),
    ...mapActions('dyDetail', ['queryTiData', 'changeFieldsWidth', 'getCustomField']),
    ...mapActions('tiRecommend', ['querySelectData', 'queryFilterData', 'queryAccountList']),
    tableCellClick(row, columns) {
      const prop = columns.property;
      if (prop === 'campaign_name') {
        this.$router.push({
          path: this.$route.path,
          query: {
            campaign_id: row['campaign_id']
          }
        });
      }
    },
    routerBack() {
      this.save({
        pagetype: 'base',
        tag: '',
        formInline: {
          qid: '汇总'
        }
      });
      this.$router.push({ path: this.$route.path });
    },
    handleTagInput(val) {
      this.save({ tag: val });
    },
    handleSizeChange() {},
    handleCurrentChange() {},
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
    }
  },
  computed: {
    ...mapState('dyDetail', ['head', 'fields', 'customFields', 'checkedCustomFields', 'formFields']),
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
      handler() {
        this.queryTiData().then(() => {
          if (document.body.clientWidth <= 1380) {
            this.changeFieldsWidth();
          }
        });
      },
      immediate: true,
      deep: true
    },
    formFields: {
      //调试用
      handler(val) {
        console.log('val', val);
      },
      immediate: true,
      deep: true
    },
    channel_id(channel_id) {
      this.queryFilterData({ channel_id });
    },
    agent_id(agent_id) {
      this.queryAccountList({ agent_id });
    },
    datepicker: {
      handler(val) {
        this.save(val);
        this.queryTiData();
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
.btn-customize {
  padding-left: 50px;
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
</style>
