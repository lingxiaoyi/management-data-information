<template>
  <div v-loading="loading">
    <el-table
      ref="xmTable"
      :class="{border: bordered}"
      :border="border"
      :data="dataSource"
      :max-height="mHeight"
      :stripe="stripe"
      :default-sort="defaultSort"
      :header-cell-class-name="headerCellClassName"
      :row-class-name="rowClassName"
      :cell-class-name="cellClassName"
      :cell-style="cellStyle"
      @sort-change="handleSortChange"
      @row-click="handleRowClick"
      @cell-click="handleClickCell"
      @selection-change="handleSelectionChange"
    >
      <template v-for="(column, index) in columns.filter(item => !item.hidden)">
        <el-table-column
          v-if="column.type"
          :key="column.key || column.prop"
          :type="column.type"
          :label="column.label"
          :width="column.width"
          :align="column.align || 'center'"
          :fixed="column.fixed"
        />
        <el-table-column
          v-else
          :key="column.key || column.prop"
          :prop="column.prop"
          :label="column.label"
          :width="column.width"
          :align="column.align || 'center'"
          :sortable="column.sortable"
          :fixed="column.fixed"
        >
          <!--
            注意: 在组件中使用 <template slot="xxxx-header" slot-scope="scope" ></template>的时候
            slot-scope="scope" 不能删除，必须指明为作用域插槽, 否则会导致奇怪的错误
            例如：当表格在进行前端排序（sortable: true）时，会出现slot重复渲染错误
          -->
          <!-- header slot -->
          <template
            slot="header"
            slot-scope="{ row }"
          >
            <slot
              :name="`${column.prop || column.key}-header`"
              :row="row"
            >{{ column.label || column.prop }}</slot>
          </template>

          <!-- default slot -->
          <!-- 当增加一个 空白列时，，例如 [操作]: { label: '操作', key: 'handles' } 时
            如果不调用 slot-scope 会报如下错误
            Duplicate presence of slot "handles" found in the same render tree -
            this will likely cause render errors.
          -->
          <template slot-scope="{ row }">
            <slot
              :name="column.prop || column.key"
              :row="row"
            >
              <span
                v-if="column.formatter"
                v-html="column.formatter(row[column.prop], row, index) || cellDefault"
              ></span>
              <template v-else>{{ row[column.prop] || cellDefault }}</template>
            </slot>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      v-if="pagination && total > pageSize"
      background
      class="pagination"
      :total="total"
      :layout="pagerLayout"
      :page-size="pageSize"
      :page-sizes="pageSizes"
      :current-page.sync="curPage"
      @size-change="handleSizeChange"
      @current-change="handlePageChange"
      @prev-click="handlePageChange"
      @next-change="handlePageChange"
    />
  </div>
</template>

<script>
/**
 * ref: http://codeio.dftoutiao.com/AIDOG/aidog
 * columns 参数说明
 * columns: [
    {
      key: [String, Number], // 唯一Key，可选，如果不传默认使用 prop 作为 key
      prop: String, // 字段名
      type: ['index', 'selection', ''], // col 类型，参照 element-ui 文档
      label: String, // 列的名称
      width: String, // 每列的宽度
      hidden: Boolean, // 是否隐藏该列
      align: ['left','center','right'], // 列文字对齐方式
      sortable: [true, false, 'custom'], // 排序，参照 element-ui 文档
      fixed: [true, 'left', 'right'] // 列是否固定在左侧或者右侧，true 表示固定在左侧
      formatter: Function // 传入一个函数对数据进行格式化，常用于简单重复使用
    }
 * ]
 */
export default {
  name: 'XmTable',
  props: {
    columns: {
      type: Array,
      default: function() {
        return [];
      }
    },
    dataSource: {
      type: Array,
      default: function() {
        return [];
      }
    },
    loading: {
      type: Boolean,
      default: function() {
        return false;
      }
    },
    cellDefault: {
      type: [Number, String],
      default: function() {
        return '-';
      }
    },
    // 最外层的边框
    bordered: {
      type: Boolean,
      default: function() {
        return false;
      }
    },
    // 表格纵向边框
    border: {
      type: Boolean,
      default: function() {
        return false;
      }
    },
    // 斑马条纹
    stripe: {
      type: Boolean,
      default: function() {
        return true;
      }
    },
    // 是否显示分页
    pagination: {
      type: Boolean,
      default: function() {
        return true;
      }
    },
    // 分页布局
    pagerLayout: {
      type: String,
      default: function() {
        return 'total, sizes, prev, pager, next, jumper';
      }
    },
    // 总条数
    total: {
      type: Number,
      default: function() {
        return 0;
      }
    },
    // 每页显示数量
    pageSize: {
      type: Number,
      default: function() {
        return 15;
      }
    },
    // 页码
    pageNum: {
      type: Number,
      default: function() {
        return 1;
      }
    },
    // 分页选择器的选项设置
    pageSizes: {
      type: Array,
      default: function() {
        return [10, 20, 30, 40, 50];
      }
    },
    // 当前排序字段
    sortBy: {
      type: String,
      default: function() {
        return '';
      }
    },
    // 排序顺序
    sortOrder: {
      type: [String, null],
      default: function() {
        return null;
      }
    },
    // 初始排序
    defaultSort: {
      type: Object,
      default: function() {
        return {};
      }
    },
    // 是否开启选中高亮
    highlightRow: {
      type: Boolean,
      default: function() {
        return true;
      }
    },
    // 高亮选中样式
    highlightRowClassName: {
      type: String,
      default: function() {
        return 'row-select';
      }
    },
    // 表头类
    headerCellClassName: {
      type: String,
      default: function() {
        return 'header-bg';
      }
    },
    // 最大高度
    maxHeight: {
      type: Number,
      default: function() {
        return 0;
      }
    },
    // 分页后是否自动滚动到顶部
    autoScrollTop: {
      type: Boolean,
      default: function() {
        return true;
      }
    },
    cellStyle: {
      type: [Function, String],
      default: function() {
        return ''
      }
    },
    cellClassName: {
      type: [Function, String],
      default: function() {
        return ''
      }
    }
  },
  data() {
    return {
      tableSelectIndex: [],
      curPage: 1
    };
  },
  computed: {
    mHeight: function() {
      return this.maxHeight !== 0 ? this.maxHeight : 'auto';
    }
  },
  watch: {
    dataSource: {
      deep: true,
      handler: function() {
        if (!this.height && this.autoScrollTop) {
          this.move(0);
        } else {
          // need set fixed height
          this.$refs.xmTable.bodyWrapper.scrollTop = 0;
        }
      }
    },
    pageNum: function(val) {
      this.curPage = val;
    }
  },
  methods: {
    /**
     * 表格单元格击回调
     */
    handleClickCell(row, column, cell, event) {
      this.$emit('cell-click', row, column, cell, event);
    },
    /**
     * 表格行点击添加背景色
     */
    handleRowClick(row, column, cell, event) {
      this.$emit('row-click', row, column, cell, event);

      if (!this.highlightRow) return;

      if (this.tableSelectIndex.includes(row.index)) {
        this.tableSelectIndex = this.tableSelectIndex.filter(item => item !== row.index);
      } else {
        this.tableSelectIndex.push(row.index);
      }
    },
    /**
     * 表格每行的ClassName
     */
    rowClassName({ row, rowIndex }) {
      // 把每一行的索引放进row
      row.index = rowIndex;
      if (this.tableSelectIndex.includes(rowIndex)) {
        return this.highlightRowClassName;
      }
    },

    /**
     * 改变页数
     */
    handlePageChange(page) {
      this.$emit('change', {
        pageNum: page,
        pageSize: this.pageSize,
        sorter: { prop: this.sortBy, order: this.sortOrder }
      });
    },
    /**
     * 改变每页显示的条数
     */
    handleSizeChange(size) {
      this.$emit('change', {
        pageNum: this.pageNum,
        pageSize: size,
        sorter: { prop: this.sortBy, order: this.sortOrder }
      });
    },
    /**
     * 排序
     */
    handleSortChange({ prop, order }) {
      // 如果设置了默认排序，该方法第一次会默认触发
      this.$emit('change', {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        sorter: { prop, order }
      });
    },
    /**
     * 多选
     */
    handleSelectionChange(val) {
      this.$emit('selection-change', val);
    },
    /**
     * 返回页面顶部
     */
    move(amount) {
      document.documentElement.scrollTop = amount;
      document.body.parentNode.scrollTop = amount;
      document.body.scrollTop = amount;
    }
  }
};
</script>
<style lang="scss" scoped>
/* 表格行点击后的背景色 */
/deep/ {
  .el-table__body tr.row-select > td {
    border-color: #d0dcec;
    background-color: #d0dcec;
    // background-color: #fff7e6;
    // color: #fa8c16;
  }
  .header-bg {
    background-color: #fafafa;
  }
  .el-table__fixed-right-patch {
    background-color: #fafafa;
  }
  .el-table {
    th.is-sortable {
      padding: 2px 0;
      .cell {
        line-height: 20px;
      }
    }
  }
}

.pagination {
  padding: 24px 12px;
  text-align: right;
  background-color: #fff;
}
// 父元素的边框
.border {
  border: 1px solid #dfe6ec;
  border-bottom: none;
}
</style>
