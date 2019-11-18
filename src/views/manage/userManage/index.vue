<template>
  <el-card class="dmp-userinfo" shadow="never">
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
        <el-form-item label="用户姓名：" prop="user_name">
          <el-input v-model="form.user_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="所属角色：">
          <el-select v-model="form.role_id" filterable @change="change">
            <el-option
              v-for="item in role_list"
              :key="item.id"
              :label="item.role_name"
              :value="item.id"
            ></el-option>
          </el-select>
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
  </el-card>
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
      fullscreenLoading: false,
      isUpdate: false,
      form: {
        user_name: '',
        role_id: ''
      },
      rules: {
        user_name: [{ required: true, message: '填写用户姓名', trigger: 'blur' }]
      },
      columns: [
        {
          prop: 'id',
          label: '序号'
        },
        {
          prop: 'user_name',
          label: '用户姓名'
        },
        {
          prop: 'role_name',
          label: '所属角色'
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
    this.getRoleList();
  },
  computed: {
    ...mapState('userManage', ['tableLoading', 'tableData', 'role_list'])
  },
  watch: {
    form: {
      handler(val) {
        console.log('val', JSON.stringify(val));
      },
      deep: true
    }
  },
  methods: {
    ...mapActions('userManage', ['getData', 'addData', 'updateData', 'delData', 'getRoleList']),
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
    change(val) {
      console.log('val', val, JSON.stringify(this.form));
    },
    handleAdd() {
      this.dialogFormVisible = true;
      this.isUpdate = false;
      this.form = {
        user_name: ''
      };
    },
    handleUpdate(row) {
      this.dialogFormVisible = true;
      this.isUpdate = true;
      this.form.id = row.id;
      this.form.user_name = row.user_name;
      this.role_list.some(item => {
        if (item.role_name === row.role_name) {
          this.role_id = item.id;
          this.form.role_id = item.id;
          return true;
        }
      });
      this.form.user_id = this.form.id;
    },
    handleDel(row) {
      this.dialogVisible = true;
      this.form = row;
      this.form.user_id = this.form.id;
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
    }
  }
};
</script>

<style lang="scss" scoped>
.dmp-userinfo .header {
  margin-bottom: 10px;
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
