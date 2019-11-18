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
          <el-option v-for="item in qdChannels" :key="item" :label="item" :value="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="代理商：">
        <el-select v-model="formInline.agent_name" filterable>
          <el-option v-for="item in qdParams" :key="item" :label="item" :value="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="操作系统：">
        <el-select v-model="formInline.os_id">
          <el-option
            v-for="item in os_list"
            :key="item.os_id"
            :label="item.os_name"
            :value="item.os_id"
          ></el-option>
        </el-select>
        <!-- <el-button @click="handleShowAccountDialog">添加</el-button> -->
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary">出价设置</el-button>
        <el-button size="small" type="primary">出价调整设置</el-button>
      </el-form-item>
    </el-form>
    <base-table
      v-loading="tableLoading"
      :tableData="head.list"
      :columns="columns"
      @tableCellClick="tableCellClick"
      @handleDialogFormVisible="handleDialogFormVisible"
      :tableViewHeight="600"
      isShowModifyColumn
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
    <div class="dialog">
      <el-dialog
        title="添加编辑"
        :visible.sync="dialogFormVisible"
        @closed="$refs.ruleForm.resetFields()"
      >
        <el-form
          :model="form"
          :rules="rules"
          :inline="true"
          ref="ruleForm"
          label-position="right"
          label-width="150px"
        >
          <el-col :span="24">
            <el-form-item label="软件名称：" prop="product_id">
              <el-select v-model="form.product_id" placeholder="选择软件" :disabled="form.flag === '1'">
                <el-option
                  v-for="item in selectData.product_list"
                  :key="item.product_id"
                  :label="item.product_name"
                  :value="item.product_id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="投放媒体：" prop="channel_id">
              <el-select
                v-model="form.channel_id"
                placeholder="选择投放媒体"
                :disabled="form.flag === '1'"
              >
                <el-option v-for="item in qdChannels" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-form-item label="出价时间：" prop="bid_time">
            <el-radio-group v-model="form.bid_time">
              <el-radio :label="1">14:00</el-radio>
              <el-radio :label="2">18:00</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-col :span="24">
            <el-form-item label="预设留存：" prop="cost">
              <el-input v-model="form.cost" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="预设出价：" prop="r_cost">
              <el-input v-model="form.r_cost" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <div class="row" v-for="(item, index) in form.accounts" :key="index">
            <el-form-item
              label="留存波动为："
              :prop="'accounts.' + index + '.account'"
              :rules="{ required: true, message: '账户不能为空', trigger: 'blur' }"
            >
              <el-input
                style="width:50px;"
                v-model="item.account"
                auto-complete="off"
                :disabled="form.flag === '1'"
              ></el-input>
              <span>% ~</span>
              <el-input
                style="width:50px;"
                v-model="item.account"
                auto-complete="off"
                :disabled="form.flag === '1'"
              ></el-input>
              <span>%</span>
            </el-form-item>
            <el-form-item
              label="出价下调："
              :prop="'accounts.' + index + '.password'"
              :rules="{ required: true, message: '密码不能为空', trigger: 'blur' }"
            >
              <el-input
                style="width:50px;"
                v-model="item.password"
                auto-complete="off"
                :disabled="form.flag === '1'"
              ></el-input>
              <span>%</span>
              <el-button
                style="margin-left:20px;"
                @click="addAccount"
                v-if="index === 0 && !isUpdateAcount"
              >添加</el-button>
              <el-button @click="reduceAccount" v-if="index === 0 && !isUpdateAcount">删除</el-button>
            </el-form-item>
          </div>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="onConfirmAddAccount('ruleForm')"
            v-loading.fullscreen.lock="fullscreenLoading"
          >确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import request from '@/utils/request';
import URL from '@/constants/url';
import BaseTable from '@/components/BaseTable';
import { subtractDate } from '@/utils/index';
import { formatDate } from '@/utils/index';
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
      dialogFormVisible: true,
      isShowBackBtn: false,
      fullscreenLoading: false,
      columns: columns,
      datepicker: {
        startDate: subtractDate(0), //subtractDate(1)
        rangeDate: [subtractDate(0), subtractDate(0)]
      },
      currentPage: 1,
      total: 0,
      isUpdateAcount: false, //是否是更新数据弹窗
      form: {
        product_id: '',
        channel_id: '',
        bid_time: 1,
        accounts: [
          {
            account: '',
            password: '',
            rebate_point: ''
          }
        ]
      },
      rules: {
        product_id: [{ required: true, message: '请选择产品名称', trigger: 'change' }],
        channel_id: [{ required: true, message: '请选择投放媒体', trigger: 'change' }]
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
      id: '' //元素id
    };
  },
  mounted() {
    this.querySelectData();
    this.queryqdParams();
    this.queryqdChannels();
  },
  methods: {
    ...mapMutations('uploadData', ['save']),
    ...mapActions('uploadData', ['queryTiData', 'queryTiSortData', 'queryqdParams', 'queryqdChannels']),
    ...mapActions('tiRecommend', ['querySelectData', 'queryFilterData', 'queryAccountList']),
    tableCellClick(/* row, columns */) {},
    addAccount() {
      this.form.accounts.push({
        account: '',
        password: ''
      });
    },
    reduceAccount() {
      if (this.form.accounts.length === 1) {
        this.$message({
          type: 'info',
          message: '不能再删除了'
        });
        return;
      }
      this.form.accounts.splice(this.form.accounts.length - 1, 1);
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
    handleDialogFormVisible(row) {
      this.dialogFormVisible = true;
      this.isUpdateAcount = true;
      this.form = {
        date: row.date,
        product_id: row.product_id + '',
        channel_id: row.channel_id / 1,
        os_id: row.os_id + '',
        agent_name: row.agent_name,
        qid: row.qid,
        cost: row.cost,
        r_cost: row.r_cost,
        show: row.show,
        click: row.click,
        download_start: row.download_start,
        download_finish: row.download_finish,
        active: row.active,
        per_cost: row.per_cost,
        flag: '1'
      };
      this.id = row.id;
      console.log('this.form', this.form);
    },
    handleShowAccountDialog() {
      this.dialogFormVisible = true;
      this.isUpdateAcount = false;
      this.clearForm();
    },
    clearForm() {
      this.form = {
        date: subtractDate(0),
        product_id: '',
        channel_id: '',
        agent_id: '',
        os_id: '',
        agent_name: '',
        qid: '',
        cost: '',
        r_cost: '',
        show: '',
        download_start: '',
        download_finish: '',
        active: '',
        per_cost: ''
      };
    },
    async onConfirmAddAccount(formName) {
      let promise = new Promise(resolve => {
        this.$refs[formName].validate(valid => {
          resolve(valid);
        });
      });
      let res = await promise;
      if (res) {
        try {
          let data = {};
          this.fullscreenLoading = true;
          if (this.isUpdateAcount) {
            data = { ...this.form };
            delete data.date;
            delete data.product_id;
            delete data.channel_id;
            delete data.os_id;
            delete data.agent_name;
            delete data.qid;
            delete data.flag;
          } else {
            data = { ...this.form, date: formatDate(this.form.date, '') };
          }
          let result = await request({
            url: this.isUpdateAcount ? URL.upload.uploadReportEdit : URL.upload.uploadReportSave,
            method: 'POST',
            data,
            params: {
              id: this.id
            }
          });
          if (result.code === 0) {
            this.$message({
              type: 'success',
              message: this.isUpdateAcount ? '修改成功!' : '添加成功!'
            });
            this.dialogFormVisible = false;
            this.queryTiData();
          } else {
            this.$message({
              type: 'error',
              message: result.msg
            });
          }
        } finally {
          this.fullscreenLoading = false;
        }
      }
    },
    onsuccess(response) {
      if (response.code === 0) {
        this.$message({
          type: 'success',
          message: '上传成功!'
        });
        this.queryTiData();
      } else {
        this.$message({
          type: 'error',
          message: response.msg
        });
      }
    }
  },
  computed: {
    ...mapState('uploadData', ['formInline', 'head', 'tableLoading', 'qdParams', 'qdChannels', 'os_list']),
    ...mapState('tiRecommend', ['filterData', 'selectData']),
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
