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
        <el-form-item label="产品名称" prop="product_name">
          <el-input v-model="form.product_name" autocomplete="off"></el-input>
        </el-form-item>
        <!-- <el-form-item label="appid" prop="rolename">
          <el-input v-model="form.rolename" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="Secret" prop="rolename">
          <el-input v-model="form.rolename" autocomplete="off"></el-input>
        </el-form-item>-->
        <el-form-item label="备注">
          <el-input v-model="form.remarks" autocomplete="off"></el-input>
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
        product_name: '',
        remarks: ''
      },
      rules: {
        product_name: [{ required: true, message: '填写产品名称', trigger: 'blur' }]
      },
      columns: [
        {
          prop: 'id',
          label: 'id'
        },
        {
          prop: 'product_name',
          label: '产品名称'
        },
        {
          prop: 'remarks',
          label: '备注'
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
    ...mapState('productManage', ['tableLoading', 'tableData'])
  },
  methods: {
    ...mapActions('productManage', ['getData', 'addData', 'updateData']),
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
