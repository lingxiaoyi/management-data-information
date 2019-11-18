<template>
  <div class="container">
    <el-form
      :inline="true"
      :model="form"
      class="form-warpper"
    >
      <!-- 产品 -->
      <el-form-item label="产品:">
        <el-select
          v-model="form.product_id"
          filterable
        >
          <el-option
            v-for="item in productList"
            :key="item.product_id"
            :label="item.product_name"
            :value="item.product_id"
          ></el-option>
        </el-select>
      </el-form-item>

      <!-- 投放媒体 -->
      <el-form-item label="投放媒体:">
        <el-select
          v-model="form.channel_id"
          filterable
        >
          <el-option
            v-for="item in channelList"
            :key="item.channel_id"
            :label="item.channel_name"
            :value="item.channel_id"
          ></el-option>
        </el-select>
      </el-form-item>

      <!-- 代理商 -->
      <el-form-item label="代理商:">
        <el-select
          v-model="form.agent_id"
          filterable
        >
          <el-option
            v-for="item in agentList"
            :key="item.agent_id"
            :label="item.agent_name"
            :value="item.agent_id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          @click="handleFormChange"
        >查询</el-button>
      </el-form-item>
    </el-form>

    <!-- table -->
    <xm-table
      class="table-wrapper"
      :loading="isLoading"
      :columns="columns"
      :data-source="tableData"
      :max-height="650"
    >
      <!-- 操作 -->
      <template
        slot="handles"
        slot-scope="{ row }"
      >
        <el-button
          type="text"
          @click.stop="handleAddRebate({...row})"
        >添加返点</el-button>
      </template>
    </xm-table>

    <!-- dialog -->
    <el-dialog
      width="680px"
      title="添加返点"
      :visible.sync="dialogVisible"
    >
      <!-- footer -->
      <span slot="footer">
        <el-button @click="handleClose">取 消</el-button>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <el-button
          type="primary"
          @click="handleSubmit"
        >确 定</el-button>
      </span>
      <!-- body -->
      <div class="dialog-content">
        <ul class="base-info">
          <li>
            <span class="label">产品名称:</span>
            <span>{{ dialogInfo.product_name || '-' }}</span>
          </li>
          <li>
            <span class="label">投放媒体:</span>
            <span>{{ dialogInfo.channel_name || '-' }}</span>
          </li>
          <li>
            <span class="label">代 理 商:</span>
            <span>{{ dialogInfo.agent_name || '-' }}</span>
          </li>
        </ul>

        <!-- 返点列表 -->
        <ul
          v-if="rebateList && rebateList.length > 0"
          class="rebate-list"
        >
          <li
            v-for="(item, index) in rebateList || []"
            :key="index"
            class="rebate-item"
          >
            <span>返点:</span>
            <span>{{ item.name || '-'  }}</span>
            <span>添加时间:</span>
            <span>{{ item.name || '-'  }}</span>
            <i
              v-if="index === rebateList.length - 1 && !isAddingRebate"
              @click="isAddingRebate = true"
              class="el-icon-circle-plus icon"
            ></i>
          </li>
        </ul>

        <!-- 添加返点 -->
        <el-form
          v-if="!rebateList || rebateList.length === 0 || isAddingRebate"
          :inline="true"
          label-width="120px"
        >
          <el-form-item label="添加返点:">
            <el-input style="width: 260px;" />
          </el-form-item>
          <i
            v-if="isAddingRebate"
            @click="isAddingRebate = false"
            class="el-icon-remove icon"
            style="color: red;"
          ></i>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import XmTable from '@/components/XmTable'
import { columns } from './columns'

export default {
  name: 'rebateSetting',
  components: {
    XmTable
  },
  data() {
    return {
      columns,
      dialogVisible: false,
      isUpdate: false,
      form: {
        agent_id: '',
        channel_id: '',
        product_id: ''
      },
      dialogForm: {},
      dialogInfo: {},
      rebateList: [],
      isAddingRebate: false
    }
  },
  computed: {
    ...mapGetters('common', ['agentList', 'productList', 'channelList']),
    ...mapGetters('rebateSetting', ['isLoading', 'dialogLoading', 'tableData']),
  },
  mounted() {
    this.getSelectList().then(({ agentList, productList, channelList }) => {
      this.form.agent_id = agentList[0] ? agentList[0].agent_id : ''
      this.form.channel_id = channelList[0] ? channelList[0].channel_id : ''
      this.form.product_id = productList[0] ? productList[0].product_id : ''
      this.getTableData(this.form)
    })
  },
  methods: {
    ...mapActions('common', ['getSelectList']),
    ...mapActions('rebateSetting', ['getTableData']),

    /**
     *  添加返点
     */
    handleAddRebate(row) {
      this.dialogVisible = true
      this.dialogInfo = row
      this.rebateList = row.rebateList || []
    },

    /**
     * 下拉改变
     */
    handleFormChange() {
      this.getTableData(this.form)
    },

    /**
     *  确定
     */
    handleSubmit() {
      this.rebateList.push({})
    },

    /**
     *  关闭弹出
     */
    handleClose() {
      this.dialogVisible = false
      this.dialogForm = {}
      this.isAddingRebate = false
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

.dialog-content {
  min-height: 260px;
}

.base-info {
  padding-bottom: 16px;
  line-height: 36px;
  border-bottom: 1px solid #e9e9e9;
  .label {
    display: inline-block;
    width: 125px;
    text-align: right;
    padding-right: 16px;
  }
}

.rebate-item {
  display: flex;
  align-items: center;
  line-height: 34px;
  span:first-child,
  span:nth-child(3) {
    width: 125px;
    text-align: right;
    padding-right: 16px;
  }
  span:nth-child(2),
  span:nth-child(4) {
    width: 110px;
  }
}

.icon {
  font-size: 20px;
  padding: 6px 20px;
  cursor: pointer;
  color: #409eff;
  &:hover {
    opacity: 0.85;
  }
}

/deep/ {
  ul {
    list-style: none;
    padding-left: 0;
  }
  .el-dialog__footer {
    text-align: center;
  }
  .el-dialog__body {
    padding: 0 30px 15px;
    font-size: 16px;
  }
}
</style>
