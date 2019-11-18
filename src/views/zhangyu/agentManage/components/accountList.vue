<template>
  <div class="container">
    <el-form
      :inline="true"
      :model="form"
      class="form-warpper"
    >
      <el-form-item label="账户：">
        <el-select
          v-model="form.agent_id"
          filterable
        >
          <el-option
            v-for="item in []"
            :key="item.agent_id"
            :label="item.agent_name"
            :value="item.agent_id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <!-- 新增代理商 -->
    <el-button
      type="primary"
      @click="handleCreate"
    >新增代理商</el-button>

    <el-button type="primary" @click="handleGoBack">返回</el-button>

    <!-- 代理商名称 -->
    <p>XXXX代理商</p>

    <!-- table -->
    <xm-table
      :columns="accountColumns"
      :border="true"
      class="table-wrapper"
    />

    <!-- dialog 新增代理商 -->
    <el-dialog
      width="660px"
      :title="dialogTitle"
      :visible.sync="dialogVisible"
    >
      <!-- footer -->
      <span slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="dialogVisible = false"
        >确 定</el-button>
      </span>
      <!-- body -->
      <el-form
        :model="dialogForm"
        label-width="120px"
        style="width: 380px"
      >
        <el-form-item label="账号：">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="账户ID：">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- dialog 操作日志 -->
    <el-dialog
      width="660px"
      title="日志"
      :visible.sync="logDialogVisible"
      class="dialog-log"
    >
      <!-- footer -->
      <span slot="footer">
        <el-button
          type="primary"
          @click="logDialogVisible = false"
        >确 定</el-button>
      </span>
      <!-- body -->
      <xm-table
        :columns="logColumns"
        :border="true"
        class="table-wrapper"
      />
    </el-dialog>

  </div>
</template>

<script>
import { mapGetters }  from 'vuex'
import XmTable from '@/components/XmTable'
import { accountColumns, logColumns } from '../columns'

export default {
  name: 'accountList',
  components: {
    XmTable
  },
  data() {
    return {
      accountColumns,
      logColumns,
      dialogVisible: false,
      logDialogVisible: false,
      isUpdate: false,
      form: {},
      dialogForm: {},
    }
  },
  computed: {
    dialogTitle: function() {
      return this.isUpdate ? '编辑账号' : '新增账号'
    },
    ...mapGetters('agentManage', ['curAgentData']),
  },
  mounted() {
    console.log(this.curAgentData)
  },
  methods: {
    /**
     * 返回
     */
    handleGoBack() {
      this.$emit('jump')
    },
    /**
     * 新增账号
     */
    handleCreate() {
      this.dialogVisible = true;
      this.isUpdate = false;
    }
  },
}
</script>


<style lang="scss" scoped>
.container {
  padding: 20px;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid #e9e9e9;
  background-color: #fff;
}

// .table-wrapper {
//   margin-top: 20px;
// }

.dialog-log {
  /deep/ {
    .el-dialog__footer {
      text-align: center;
    }
    .el-dialog__body {
      padding: 0 15px 15px;
    }
  }
}
</style>
