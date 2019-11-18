<template>
  <el-table :data="tableData" size="mini" class="scrollbar" stripe>
    <el-table-column
      v-for="item in columns"
      :key="item.prop"
      :prop="item.prop"
      :label="item.label"
      :width="item.width ? item.width : ''"
      align="center"
      sortable
    />
    <el-table-column fixed="right" label="操作" width="100">
      <template slot-scope="scope">
        <el-button type="text" size="small" @click="handleDialogFormVisible(scope.row)">编辑</el-button>
        <el-button type="text" size="small" @click="handleDialogVisible(scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
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
    }
  },
  methods: {
    handleDialogFormVisible(row) {
      this.$emit('handleDialogFormVisible', row);
    },
    handleDialogVisible(row) {
      this.$emit('handleDialogVisible', row);
    }
  }
};
</script>
