<template>
  <div class="main">
    <el-form inline :model="formInline" @submit.native.prevent class="form-inline">
      <el-form-item label="软件名称：" label-width="100px">
        <el-select v-model="formInline.product_id">
          <el-option
            v-for="item in selectData.product_list"
            :key="item.product_id"
            :label="item.product_name"
            :value="item.product_id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="投放媒体：">
        <el-select v-model="formInline.channel_id">
          <el-option
            v-for="item in selectData.channel_list"
            :key="item.channel_id"
            :label="item.channel_name"
            :value="item.channel_id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="代理商：">
        <el-select v-model="formInline.agent_id" filterable>
          <el-option
            v-for="item in selectData.agent_list"
            :key="item.agent_id"
            :label="item.agent_name"
            :value="item.agent_id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="系统">
        <el-select v-model="formInline.os_id">
          <el-option
            v-for="item in options.os"
            :key="item.os_id"
            :label="item.os_name"
            :value="item.os_id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="账户：">
        <el-select v-model="formInline.account" filterable clearable @clear="clearAccount">
          <el-option
            v-for="item in accountList"
            :key="item.account_id"
            :label="item.account"
            :value="item.account"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="formInline.flag_id">
          <el-option
            v-for="item in options.flag"
            :key="item.flag_id"
            :label="item.flag_name"
            :value="item.flag_id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-button @click="handleShowAccountDialog">添加账号</el-button>
      <el-button @click="queryTiData">刷新</el-button>
    </el-form>

    <!-- table -->
    <base-table
      v-loading="tableLoading"
      :tableData="tableList.data"
      :columns="columns"
      @handleDialogFormVisible="handleDialogFormVisible"
      :tableViewHeight="600"
    />
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="tableList.pages.page"
        :page-size="tableList.pages.size"
        layout="slot, prev, pager, next, jumper"
        :total="tableList.pages.count/1"
      >
        <span class="el-pagination__total">{{ `共计 ${tableList.pages.count} 条数据` }}</span>
      </el-pagination>
    </div>
    <div class="dialog">
      <el-dialog
        title="添加编辑账号"
        :visible.sync="dialogFormVisible"
        @closed="$refs.ruleForm.resetFields()"
      >
        <el-form
          :model="form"
          :rules="rules"
          ref="ruleForm"
          label-position="right"
          label-width="100px"
        >
          <el-form-item label="产品：" prop="product_id">
            <el-select v-model="form.product_id" placeholder="选择产品" :disabled="form.flag === '1'">
              <el-option
                v-for="item in selectData.product_list"
                :key="item.product_id"
                :label="item.product_name"
                :value="item.product_id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="投放媒体：" prop="channel_id">
            <el-select v-model="form.channel_id" placeholder="选择投放媒体" :disabled="form.flag === '1'">
              <el-option
                v-for="item in selectData.channel_list"
                :key="item.channel_id"
                :label="item.channel_name"
                :value="item.channel_id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="代理商：" prop="agent_id">
            <el-select
              v-model="form.agent_id"
              placeholder="选择代理商"
              :disabled="form.flag === '1'"
              filterable
            >
              <el-option
                v-for="item in selectData.agent_list"
                :key="item.agent_id"
                :label="item.agent_name"
                :value="item.agent_id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="系统：" prop="os">
            <el-select v-model="form.os">
              <el-option
                v-for="item in options.os"
                :key="item.os_id"
                :label="item.os_name"
                :value="item.os_id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="添加代理商：" v-if="form.flag !== '1'">
            <el-input v-model="form.agent_name" auto-complete="off" placeholder="填写代理商名称"></el-input>
            <el-button @click="addAgent_name">添加</el-button>
          </el-form-item>

          <div class="row" v-for="(item, index) in form.accounts" :key="index">
            <el-form-item
              label="账户："
              :prop="'accounts.' + index + '.account'"
              :rules="{ required: true, message: '账户不能为空', trigger: 'blur' }"
            >
              <el-input v-model="item.account" auto-complete="off" :disabled="form.flag === '1'"></el-input>
              <el-button @click="addAccount" v-if="index === 0 && !isUpdateAcount">添加账号</el-button>
            </el-form-item>
            <el-form-item
              label="密码："
              :prop="'accounts.' + index + '.password'"
              :rules="{ required: true, message: '密码不能为空', trigger: 'blur' }"
            >
              <el-input v-model="item.password" auto-complete="off" :disabled="form.flag === '1'"></el-input>
              <el-button @click="reduceAccount" v-if="index === 0 && !isUpdateAcount">删除账号</el-button>
            </el-form-item>
            <el-form-item
              label="返点："
              :prop="'accounts.' + index + '.rebate_point'"
              :rules="{ required: true, message: '返点不能为空', trigger: 'blur' }"
            >
              <el-input
                v-model="item.rebate_point"
                auto-complete="off"
                :disabled="form.flag === '1'"
              ></el-input>
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
import { cloneDeep } from 'lodash';
import BaseTable from './BaseTable';
import { mapState, mapActions, mapMutations } from 'vuex';
function formatter(params) {
  if (params.os === 2) {
    return 'Android';
  } else if (params.os === 1) {
    return 'IOS';
  } else if (params.os === 0) {
    return '未区分';
  }
}
export default {
  components: {
    BaseTable
  },
  data() {
    return {
      dialogFormVisible: false,
      dialogVisible: false,
      fullscreenLoading: false,
      isUpdateAcount: false, //是否是更新数据弹窗
      // dialog form
      form: {
        product_id: '',
        channel_id: '',
        agent_id: '',
        account: '',
        accounts: [
          {
            account: '',
            password: '',
            rebate_point: ''
          }
        ],
        os: ''
        //addAgent_name: ''
      },
      oldVal: {},
      rules: {
        product_id: [{ required: true, message: '请选择产品名称', trigger: 'change' }],
        channel_id: [{ required: true, message: '请选择投放媒体', trigger: 'change' }],
        agent_id: [{ required: true, message: '请选择代理商', trigger: 'change' }],
        os: [{ required: true, message: '请选择系统', trigger: 'change' }]
      },
      columns: [
        {
          prop: 'id',
          label: '序号'
        },
        {
          prop: 'product_name',
          label: '产品'
        },
        {
          prop: 'channel_name',
          label: '投放媒体'
        },
        {
          prop: 'agent_name',
          label: '代理商',
          width: 250
        },
        {
          prop: 'os',
          label: '系统',
          formatter
        },
        {
          prop: 'account',
          label: '账户',
          width: 250
        },
        {
          prop: 'adver_id',
          label: '广告主id'
        },
        {
          prop: 'password',
          label: '密码',
          width: 250
        },
        {
          prop: 'rebate_point',
          label: '返点'
        },
        {
          prop: 'flag_name',
          label: '状态'
        }
      ]
    };
  },
  mounted() {
    this.querySelectDataAuthManage().then(() => {
      this.save({
        formInline: this.oldformInline
      });
    });
  },
  methods: {
    ...mapMutations('authManage', ['save']),
    ...mapActions('authManage', ['queryTiData', 'querySelectDataAuthManage']),
    ...mapActions('tiRecommend', ['queryAccountList']),
    handleSizeChange() {},
    handleCurrentChange(val) {
      this.save({
        tableList: {
          pages: {
            ...this.tableList.pages,
            page: val
          }
        }
      });
      this.queryTiData();
    },
    addAgent_name() {
      let that = this;
      this.$confirm(`是否确认添加代理商${this.form.agent_name}`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request({
          url: URL.oauthAccount.addAgent,
          method: 'get',
          params: {
            agent_name: that.form.agent_name
          }
        }).then(result => {
          if (result.code === 0) {
            this.$message({
              type: 'success',
              message: '添加成功!'
            });
            this.querySelectDataAuthManage().then(() => {
              this.form.agent_id = '' + result.data.id;
            });
          } else {
            this.$message({
              type: 'error',
              message: result.msg
            });
          }
        });
      });
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
            data = { ...this.form, ...this.form.accounts[0] };
          } else {
            data = { ...this.form };
          }
          let result = await request({
            url: this.isUpdateAcount ? URL.oauthAccount.updateAccount : URL.oauthAccount.addAccount,
            method: 'get',
            params: data
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
    handleShowAccountDialog() {
      this.dialogFormVisible = true;
      this.isUpdateAcount = false;
      this.form = {
        product_id: '',
        channel_id: '',
        agent_id: '',
        account: '',
        accounts: [
          {
            account: '',
            password: '',
            rebate_point: ''
          }
        ],
        os: ''
        //addAgent_name: ''
      };
    },
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
    handleDialogFormVisible(row) {
      this.dialogFormVisible = true;
      this.isUpdateAcount = true;
      this.queryAccountList(row.agent_id);
      this.form = {
        product_id: row.product_id + '',
        channel_id: row.channel_id + '',
        agent_id: row.agent_id,
        account_id: row.account_id,
        //account: row.account,
        rebate_point: row.rebate_point,
        accounts: [
          {
            account: row.account,
            password: row.password
          }
        ],
        os: row.os + '',
        id: row.id,
        flag: row.flag
      };
    },
    clearAccount() {
      this.save({
        formInline: {
          account: '全部'
        }
      });
    }
  },
  computed: {
    ...mapState('authManage', [
      'selectData',
      'tableLoading',
      'formInline',
      'oldformInline',
      'tableList',
      'options',
      'accountList'
    ]),
    ...mapState('tiRecommend', ['filterData']),
    channel_id() {
      return this.formInline.channel_id;
    },
    agent_id() {
      return this.formInline.agent_id;
    }
  },
  watch: {
    formInline: {
      handler(val) {
        if (JSON.stringify(this.oldVal) === JSON.stringify(val)) return;
        this.oldVal = cloneDeep(val);
        this.querySelectDataAuthManage().then(() => {
          this.handleCurrentChange(1);
        });
      },
      deep: true
    },
    agent_id(agent_id) {
      if (agent_id != 0) {
        this.queryAccountList(agent_id);
      }
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
/deep/ .form-inline .el-input {
  width: 150px;
}
/deep/ .dialog .el-input--small {
  width: 300px;
}
/deep/ .el-dialog {
  width: 600px;
}
/deep/.el-dialog__body {
  padding: 0 20px;
}
/deep/.el-dialog__header {
  padding: 20px;
}
</style>
