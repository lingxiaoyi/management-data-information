<template>
  <div class="main">
    <el-form inline :model="formInline" @submit.native.prevent>
      <el-form-item label="日期：">
        <el-date-picker
          v-model="datepicker.startDate"
          :default-value="datepicker.startDate"
          type="date"
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
      <!-- <el-form-item label="投放媒体：">
        <el-select v-model="formInline.channel_id">
          <el-option
            v-for="item in filterData.channel_list"
            :key="item.channel_id"
            :label="item.channel_name"
            :value="item.channel_id"
          ></el-option>
        </el-select>
      </el-form-item>-->
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
      <el-form-item label="账户：">
        <el-select v-model="formInline.account_id" filterable>
          <el-option
            v-for="item in accountList"
            :key="item.id"
            :label="item.account"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="btn-gg-type">
      <span class="btn-customize" v-for="item in btnStatus" :key="item.name">
        <!-- <el-button :type="item.type" @click="handleGetAdData(item)">{{item.name}}</el-button> -->
        <el-tag size="medium ">{{ item.name }}</el-tag>
      </span>
    </div>
    <h3 class="table">
      <!-- 汇总媒体:
      <span>{{head.count.total_channel}}</span>，-->
      累计消费金额:
      <span>{{ (head.count.cost / 1).toFixed(2) }}</span>元， 激活数据量
      <span>{{ head.count.active }}</span>， 人均激活成本:
      <span>{{ head.count.cost_active }}</span>元
      <span class="btn-customize">
        <el-button type="primary" @click="dialogFormVisible = true">自定义列</el-button>
      </span>
      <span class="btn-customize" v-if="isShowBackBtn">
        <el-button type="primary" @click="routerBack">返回</el-button>
      </span>
    </h3>
    <base-table
      v-loading="tableLoading"
      :tableData="head.list"
      :columns="fields"
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
    <el-dialog title="自定义数据" :visible.sync="dialogFormVisible">
      <el-form :model="formFields">
        <template v-for="(item, index) in customFields">
          <div class="sec" :key="item.id">
            <div class="title">
              <el-checkbox
                indeterminate
                @change="handleCheckAllChange(index)"
              >{{ item.category_name }}</el-checkbox>
            </div>
            <div class="ul">
              <el-checkbox-group v-model="formFields.checkedCustomFields">
                <el-checkbox
                  v-for="value in item.children"
                  :label="value.id"
                  :key="value.id"
                  @change="handleCheckedPropsChange(value)"
                >{{ value.field_name }}</el-checkbox>
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
import { cloneDeep } from 'lodash';
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
      btnStatus: [
        {
          name: '广告组',
          type: 'primary'
        }
      ],
      datepicker: {
        startDate: subtractDate(0), //subtractDate(1)
        rangeDate: [subtractDate(0), subtractDate(0)]
      },
      currentPage: 1,
      total: 0,
      oldVal: {},
      from: ''
    };
  },
  /* activated() {
    if (this.from !== '/dmp/agent') {
      this.save({
        formInline: this.oldformInline
      });
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      // 通过 `vm` 访问组件实例
      vm.from = from.path;
    });
  }, */
  mounted() {
    this.save({
      routerPath: this.$route.path,
      customFields: [],
      formFields: {
        checkedCustomFields: []
      }
    });
    this.tiRecommendsave({
      formInline: this.oldformInline
    });
    console.log('formInline', this.formInline, this.oldformInline);
    this.querySelectData();
    this.getCustomField();
    this.queryTiData();
  },
  methods: {
    ...mapMutations('dyDetail', ['save']),
    ...mapMutations('tiRecommend', {
      tiRecommendsave: 'save'
    }),
    ...mapActions('dyDetail', [
      'queryTiSortData',
      'queryTiData',
      'changeFieldsWidth',
      'getCustomField',
      'queryGgjhData',
      'queryGgcyData'
    ]),
    ...mapActions('tiRecommend', ['querySelectData', 'queryFilterData', 'queryAccountList']),
    tableCellClick(row, columns) {
      const prop = columns.property;
      if (prop === 'campaign_name') {
        this.queryGgjhData(row['campaign_id']);
        this.btnStatus = [
          {
            name: '广告计划',
            type: 'primary'
          }
        ];
        this.isShowBackBtn = true;
      }
      if (prop === 'ad_name') {
        this.queryGgcyData(row['ad_id']);
        this.btnStatus = [
          {
            name: '广告创意',
            type: 'primary'
          }
        ];
        this.isShowBackBtn = true;
      }
      if (prop === 'unit_name') {
        this.queryGgcyData(row['unit_id']);
        this.btnStatus = [
          {
            name: '广告创意',
            type: 'primary'
          }
        ];
        this.isShowBackBtn = true;
      }
      if (prop === 'adgroup_name') {
        this.queryGgcyData(row['adgroup_id']);
        this.btnStatus = [
          {
            name: '广告创意',
            type: 'primary'
          }
        ];
        this.isShowBackBtn = true;
      }
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
    handleSizeChange() {},
    handleCurrentChange(val) {
      this.save({
        head: {
          pages: {
            page: val
          }
        },
        fields: []
      });
      this.queryTiData();
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
    handleSortChange(sort) {
      if (!this.isShowBackBtn) {
        this.queryTiSortData(sort);
      }
    }
  },
  computed: {
    ...mapState('dyDetail', ['head', 'fields', 'customFields', 'checkedCustomFields', 'formFields']),
    ...mapState('tiRecommend', [
      'formInline',
      'oldformInline',
      'selectData',
      'filterData',
      'pagetype',
      'tableLoading',
      'tag',
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
      handler(val) {
        if (JSON.stringify(this.oldVal) === JSON.stringify(val)) return;
        this.oldVal = cloneDeep(val);
        this.queryTiData().then(() => {
          if (document.body.clientWidth <= 1380) {
            this.changeFieldsWidth();
          }
          this.isShowBackBtn = false;
          this.btnStatus = [
            {
              name: '广告组',
              type: 'primary'
            }
          ];
        });
      },
      deep: true
    },
    channel_id(channel_id) {
      this.queryFilterData({ channel_id });
    },
    agent_id(agent_id) {
      if (agent_id != 0) {
        this.queryAccountList(agent_id);
      }
    },
    datepicker: {
      handler(val) {
        this.save(val);
        this.queryTiData();
      },
      immediate: true,
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
</style>
