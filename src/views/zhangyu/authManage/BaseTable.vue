<template>
  <el-table
    :height="tableViewHeight"
    :data="tableData"
    size="mini"
    class="scrollbar"
    @cell-click="tableCellClick"
    highlight-current-row
    stripe
  >
    <template v-for="item in columns">
      <el-table-column
        v-if="item.prop !== 'account' && item.prop !== 'password'"
        :key="item.prop"
        :prop="item.prop"
        :label="item.label"
        :width="item.width ? item.width : ''"
        align="center"
        :formatter="item.formatter ? item.formatter : (r, c, v) => (v + '' ? v : '0')"
        sortable
      ></el-table-column>
      <el-table-column
        v-else
        :key="item.prop"
        :prop="item.prop"
        :label="item.label"
        :width="item.width ? item.width : ''"
        align="right"
        sortable
      >
        <template slot-scope="scope" v-if="item.prop === 'account' || item.prop === 'password'">
          <span style="width:180px;display: inline-block;">
            {{
            item.prop === 'account' ? scope.row.account : scope.row.password ? '******' : ''
            }}
          </span>
          <el-button
            type="primary"
            size="small"
            v-clipboard:copy="item.prop === 'account' ? scope.row.account : scope.row.password"
            v-clipboard:success="onCopy"
            v-clipboard:error="onError"
          >复制</el-button>
        </template>
      </el-table-column>
    </template>
    <el-table-column fixed="right" label="操作" width="260">
      <template slot-scope="scope">
        <el-button type="primary" size="small" @click="login(scope.row.login_url)">去登陆</el-button>
        <el-button type="primary" size="small" @click="oauth(scope.row.oauth_link)">去授权</el-button>
        <el-button type="primary" size="small" @click="handleDialogFormVisible(scope.row)">编辑</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { Message } from 'element-ui';
export default {
  props: {
    tableData: {
      type: Array,
      required: true,
      default: () => []
    },
    columns: {
      type: Array,
      required: true,
      default: () => []
    },
    tableViewHeight: {
      type: Number,
      default: null
    }
  },
  methods: {
    // 点击cell
    tableCellClick(row, columns, value, event) {
      this.$emit('tableCellClick', row, columns, value, event);
    },
    handleDialogFormVisible(row) {
      this.$emit('handleDialogFormVisible', row);
    },
    onCopy: function(e) {
      Message({
        message: `复制成功,${e.text}`,
        type: 'success',
        duration: 3 * 1000
      });
    },
    onError: function() {
      Message({
        message: 'Failed to copy texts',
        type: 'error',
        duration: 3 * 1000
      });
    },
    login(login_url) {
      window.open(login_url);
    },
    oauth(oauth_link) {
      window.open(oauth_link);
    }
  }
};
</script>
<style lang="scss" scoped>
/deep/ .el-table__body tr.current-row > td {
  background: #d0dcec !important;
}
/deep/ .el-table__body tr:hover > td {
  background-color: #e7ecf3 !important;
}
.el-button--small,
.el-button--small.is-round {
  padding: 5px 10px;
}
</style>
