<template>
  <div class="main">
    <div class="header">
      <el-button type="primary" @click="handleAdd">添加</el-button>
    </div>
    <xm-table
      class="table-wrapper"
      v-loading="tableLoading"
      :data-source="tableData"
      :columns="columns"
    >
      <!-- 操作 -->
      <template slot="handles" slot-scope="{ row }">
        <el-button type="primary" size="mini" @click.stop="handleAuth(row)">给角色授权</el-button>
        <el-button type="primary" size="mini" @click.stop="handleUpdate(row)">编辑</el-button>
        <el-button type="primary" size="mini" @click.stop="handleDel(row)">删除</el-button>
      </template>
    </xm-table>
    <el-dialog title="添加/编辑" :visible.sync="dialogFormVisible">
      <el-form
        :model="form"
        :rules="rules"
        ref="ruleForm"
        label-position="right"
        label-width="100px"
      >
        <el-form-item label="用户姓名：" prop="role_name">
          <el-input v-model="form.role_name" autocomplete="off"></el-input>
        </el-form-item>
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
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <span>确定要删除这条数据吗?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onConfirmDelete">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="给角色授权" :visible.sync="authFormVisible">
      <!-- <el-form :model="formFields"></el-form> -->
      <template v-for="(item, index) in customFields">
        <div class="sec" :key="item.id">
          <div class="title">
            <el-checkbox indeterminate @change="handleCheckAllChange(index)">{{ item.product_name }}</el-checkbox>
          </div>
          <div class="ul">
            <el-checkbox-group v-model="formFields.checkFields[index].channel">
              <el-checkbox
                v-for="value in item.channel"
                :label="value.channel_id"
                :key="value.channel_id"
                @change="handleCheckedPropsChange(value)"
              >{{ value.channel_name }}</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </template>

      <!-- <el-form :model="formFields">
        <el-checkbox-group v-model="formFields.fields">
          <el-checkbox
            v-for="value in customFields"
            :label="value.id"
            :key="value.id"
            @change="handleCheckedPropsChange(value)"
          >{{ value.product_name }}</el-checkbox>
        </el-checkbox-group>
      </el-form>-->
      <div slot="footer" class="dialog-footer">
        <el-button @click="authFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="onConfirmAddAuth"
          v-loading.fullscreen.lock="fullscreenLoading"
        >确 定</el-button>
      </div>
    </el-dialog>
    <!-- <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-size="50"
        layout="prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>-->
  </div>
</template>

<script>
import XmTable from '@/components/XmTable';
import { mapState, mapActions } from 'vuex';

export default {
  components: {
    XmTable
  },
  data() {
    return {
      dialogFormVisible: false,
      dialogVisible: false,
      authFormVisible: false,
      fullscreenLoading: false,
      isUpdate: false,
      form: {
        role_name: ''
      },
      privilegeArr: [],
      /* checkFields: [

      ], */
      rules: {
        role_name: [{ required: true, message: '填写角色名称', trigger: 'blur' }]
      },
      columns: [
        {
          prop: 'id',
          label: 'id'
        },
        {
          prop: 'role_name',
          label: '角色名称'
        },
        {
          label: '操作',
          key: 'handles'
        }
      ],
      currentPage: 1,
      total: 0
    };
  },
  mounted() {
    this.getData();
  },
  computed: {
    ...mapState('roleManage', ['tableLoading', 'tableData', 'customFields', 'formFields'])
  },
  methods: {
    ...mapActions('roleManage', ['getData', 'addData', 'delData', 'updateData', 'getPrivilege', 'postPrivilege']),
    async onConfirmAddAccount(formName) {
      let promise = new Promise(resolve => {
        this.$refs[formName].validate(valid => {
          resolve(valid);
        });
      });
      let res = await promise;
      if (res) {
        this.dialogFormVisible = false;
        this.fullscreenLoading = true;
        if (this.isUpdate) {
          try {
            let res = await this.updateData(this.form);
            this.$message.success(res.msg);
            this.getData();
          } catch (error) {
            this.$message.success(error);
          }
        } else {
          try {
            let res = await this.addData(this.form);
            this.$message.success(res.msg);
            this.getData();
          } catch (error) {
            this.$message.success(error);
          }
        }
        this.form = {
          product_name: '',
          remarks: ''
        };
        this.fullscreenLoading = false;
      }
    },
    handleAdd() {
      this.dialogFormVisible = true;
      this.isUpdate = false;
      this.form = {
        product_name: '',
        remarks: ''
      };
    },
    handleUpdate(row) {
      this.dialogFormVisible = true;
      this.isUpdate = true;
      this.form = row;
    },
    handleDel(row) {
      this.dialogVisible = true;
      this.form = row;
    },
    async handleAuth(row) {
      this.authFormVisible = true;
      this.form = row;
      if (!row.privilege || row.privilege === 'null') row.privilege = '[]';
      let privilege = JSON.parse(row.privilege);
      try {
        await this.getPrivilege(this.form);

        this.formFields.checkFields.forEach(ele => {
          if (privilege[ele.id]) {
            ele.channel = privilege[ele.id];
          }
        });
      } catch (error) {
        this.$message.success(error);
      }
    },
    async onConfirmAddAuth() {
      try {
        let arr = [];
        this.formFields.checkFields.forEach(ele => {
          if (ele.channel.length) {
            arr.push({
              product_id: ele.id,
              channel_id: ele.channel
            });
          }
        });
        console.log('arr', JSON.stringify(arr));
        this.fullscreenLoading = true;
        let res = await this.postPrivilege({ ...this.form, privilege: JSON.stringify(arr) });
        this.$message.success(res.msg);
        this.authFormVisible = false;
        this.getData();
      } catch (error) {
        this.$message.success(error);
      } finally {
        this.fullscreenLoading = false;
      }
    },
    async onConfirmDelete() {
      try {
        let res = await this.delData(this.form);
        this.$message.success(res.msg);
        this.getData();
      } catch (error) {
        this.$message.success(error);
      }
      this.form = {
        product_name: '',
        remarks: ''
      };
      this.dialogVisible = false;
      this.fullscreenLoading = false;
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    handleCheckedPropsChange(val) {
      console.log('val', val, JSON.stringify(this.formFields.checkFields));
    },
    handleCheckAllChange(val) {
      console.log('val', val);
    }
  }
};
</script>

<style lang="scss" scoped>
.main .header {
  margin-bottom: 20px;
}
.input-imei {
  width: 400px;
  margin-bottom: 151px;
}
.block {
  width: 100%;
  padding: 20px;
  position: absolute;
  left: 0;
  bottom: 0;
}
.el-pagination {
  text-align: right;
}
.el-card {
  min-height: 500px;
  position: relative;
}
/deep/ .el-dialog {
  width: 500px;
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
</style>
