<template>
  <div class="container">
    <el-form
      :inline="true"
      :model="form"
      class="form-warpper"
    >
      <el-form-item label="代理商：">
        <el-select
          v-model="form.agent_id"
          filterable
          @change="handleFormChange"
        >
          <el-option
            v-for="item in agentList"
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
      size="mini"
      @click="handleCreate"
    >新增代理商</el-button>

    <!-- table -->
    <xm-table
      class="table-wrapper"
      :loading="isLoading"
      :columns="agentColumns"
      :data-source="agentData"
      :max-height="620"
    >
      <!-- 操作 -->
      <template
        slot="handles"
        slot-scope="{ row }"
      >
        <el-button
          type="primary"
          size="mini"
          @click.stop="handleUpdate({...row})"
        >编辑</el-button>
        <el-button
          type="primary"
          size="mini"
          @click.stop="handleShowLogs({...row})"
        >日志</el-button>
      </template>
    </xm-table>

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
          @click="dialogSubmit"
        >确 定</el-button>
      </span>
      <!-- body -->
      <el-form
        :model="dialogForm"
        label-width="120px"
        style="width: 380px"
      >
        <el-form-item label="代理商名称">
          <el-input v-model="dialogForm.agent_name"></el-input>
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
        :loading="dialogLoading"
        :columns="logColumns"
        :border="true"
        :data-source="logs"
        :max-height="300"
        class="table-wrapper"
      />
    </el-dialog>

  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import XmTable from '@/components/XmTable'
import { agentColumns, logColumns } from '../columns'

export default {
  name: 'agentList',
  components: {
    XmTable
  },
  data() {
    return {
      agentColumns,
      logColumns,
      dialogVisible: false,
      logDialogVisible: false,
      isUpdate: false,
      form: {
        agent_id: '0'
      },
      dialogForm: {}
    }
  },
  computed: {
    ...mapGetters('common', ['agentList']),
    ...mapGetters('agentManage', ['isLoading', 'dialogLoading', 'agentData', 'logs']),
    dialogTitle: function() {
      return this.isUpdate ? '编辑代理商' : '新增代理商'
    }
  },
  mounted() {
    this.getSelectList().then(({agentList}) => {
      this.form.agent_id = agentList[0] ? agentList[0].agent_id : ''
      this.getAgentData(this.form)
    })
  },
  methods: {
    ...mapActions('common', ['getSelectList']),
    ...mapActions('agentManage', ['getAgentData', 'updateAgentInfo', 'createAgentInfo', 'getLogs']),
    /**
     * 下拉改变
     */
    handleFormChange() {
      this.getAgentData(this.form)
    },
    /**
     * 新增代理商
     */
    handleCreate() {
      this.dialogVisible = true;
      this.isUpdate = false;
      this.dialogForm = {}
    },
    /**
     * 修改代理商
     */
    handleUpdate(row) {
      this.dialogVisible = true;
      this.isUpdate = true;
      this.dialogForm = row
    },
    /**
     * 查看日志
     */
    handleShowLogs(row) {
      this.logDialogVisible = true
      this.getLogs({
        agent_id: row.agent_id
      })
    },

    /**
     *  弹窗提交
     */
    dialogSubmit() {
      if (this.isUpdate) {
        // 修改
        this.updateAgentInfo(this.dialogForm).then(() => {
          this.$message.success('修改成功！');
          this.getAgentData(this.form)
        }).finally(() => {
          this.dialogVisible = false
        })
      } else {
        // 新增
        if (!this.dialogForm.agent_name) {
          this.$message.success('请填写代理商名称！');
          return
        }
        this.createAgentInfo(this.dialogForm).then(() => {
          this.$message.success('新增成功！');
          this.getAgentData(this.form)
        }).finally(() => {
          this.dialogVisible = false
        })
      }
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

.table-wrapper {
  margin-top: 20px;
}

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
