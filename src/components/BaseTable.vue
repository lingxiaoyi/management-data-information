<template>
  <div>
    <el-table
      :data="tableData"
      :height="tableViewHeight"
      :row-class-name="showWeekendRow ? weekendRowClass : ''"
      @cell-click="tableCellClick"
      @sort-change="handleSortChange"
      highlight-current-row
      size="mini"
      class="scrollbar"
      :cell-style="cellStyle"
      :default-sort="defaultSort"
      stripe
    >
      <template v-for="item in columns">
        <el-table-column
          v-if="item.prop !== 'poster_url' && item.prop !== 'url' && item.prop !== 'remark'"
          :fixed="item.fixed"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width ? item.width : ''"
          :class-name="showColumnClass ? item['class-name'] : ''"
          :formatter="item.formatter ? item.formatter : (r, c, v) => (v + '' ? v : '0')"
          :sortable="item.sortable || true"
        />
        <el-table-column
          v-else-if="item.prop === 'poster_url' || item.prop === 'url'"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width ? item.width : ''"
          align="right"
          :sortable="item.sortable || true"
        >
          <template slot-scope="scope" v-if="item.prop === 'poster_url' || item.prop === 'url'">
            <div class="img" @click="jumpPlay(scope.row, scope.column)">
              <img :src="scope.row.poster_url || scope.row.url" />
              <div class="play" v-if="item.prop === 'poster_url'"></div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          v-else-if="item.prop === 'remark'"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width ? item.width : ''"
          align="right"
          :sortable="item.sortable || true"
        >
          <template slot-scope="scope" v-if="item.prop === 'remark'">
            <el-button v-if="scope.row.remark" @click="showDialog(scope.row, scope.column)">添加备注</el-button>
            <el-popover
              v-else
              placement="top-start"
              title
              width="200"
              trigger="hover"
              :content="scope.row.remark"
            >
              <el-button slot="reference">{{scope.row.remark.subString(0, 20)+ '...'}}</el-button>
            </el-popover>
          </template>
        </el-table-column>
      </template>
      <template v-if="isShowModifyColumn">
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="handleDialogFormVisible(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </template>
      <div class="dialog">
        <el-dialog
          title="添加备注"
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
            <el-input v-model="form.text" auto-complete="off" placeholder="在此添加备注,100字以内"></el-input>
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
    </el-table>
    <el-dialog title="预览" :visible.sync="videoDialogVisible" width="560px" center>
      <iframe
        v-if="videoDialogVisible && !isImg"
        width="500"
        height="600"
        :src="videoSrc"
        frameborder="0"
      ></iframe>
      <img :src="videoSrc" alt style="width:500px;" />
    </el-dialog>
  </div>
</template>


<script>
import request from '@/utils/request';
import URL from '@/constants/url';
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
    defaultSort: {
      type: Object,
      default: () => {}
    },
    showColumnClass: {
      type: Boolean,
      default: true
    },
    showWeekendRow: {
      type: Boolean,
      default: true
    },
    tableViewHeight: {
      type: Number,
      default: null
    },
    isShowModifyColumn: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogFormVisible: false,
      videoDialogVisible: false,
      fullscreenLoading: false,
      isImg: false,
      videoSrc: '',
      form: {
        text: ''
      },
      rules: {
        product_id: [{ required: true, message: '输入内容不能为空', trigger: 'blur' }]
      }
    };
  },
  created() {},
  methods: {
    // 点击cell
    tableCellClick(row, columns, value, event) {
      this.$emit('tableCellClick', row, columns, value, event);
    },
    handleDialogFormVisible(row) {
      this.$emit('handleDialogFormVisible', row);
    },
    async jumpPlay(row, column) {
      if (column.property === 'url') {
        //window.open(row.url);
        this.videoSrc = row.url;
        this.videoDialogVisible = true;
        this.isImg = true;
        return;
      }
      this.isImg = false;
      let loading = '';
      try {
        loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        let result = await request({
          url: URL.material.videoPreview,
          method: 'get',
          params: {
            video_id: row.video_id
          }
        });
        if (result.code === 0) {
          //window.open(result.data.url);
          this.videoSrc = result.data.url;
          this.videoDialogVisible = true;
        } else {
          Message({
            message: result.msg,
            type: 'error',
            duration: 3 * 1000
          });
        }
      } finally {
        loading.close();
      }
    },
    cellStyle({ row, column }) {
      if (row.creative_count == 0 && column.property === 'creative_count') {
        return 'color:#666;cursor: default;';
      }
      if (column.property === 'poster_url') {
        return 'cursor: pointer;';
      }
      if (column.property === 'r_cost') {
        return 'background:#ffe4e1;';
      }
      if (column.property === 'date' && (('' + row.date).indexOf('~') > 0 || /\d{4}-\d{4}/.test('' + row.date))) {
        return 'color:#06a8f3;cursor: pointer;';
      }
      //渠道号名字不规范红色显示
      if (typeof row.is_valid !== 'undefined' && row.is_valid === 0 && column.property === 'qid') {
        return 'color:red;';
      }
      let array = [
        'yday_active_pr',
        'yday_click_pr',
        'yday_cost_pr',
        'yday_dfinish_pr',
        'yday_dstart_pr',
        'yday_show_pr'
      ];
      for (let index = 0; index < array.length; index++) {
        const element = array[index];
        if (typeof row[element] !== 'undefined' && row[element].indexOf('-') > -1 && column.property === element) {
          return 'color:green;';
        } else if (
          typeof row[element] !== 'undefined' &&
          row[element].indexOf('-') === -1 &&
          column.property === element
        ) {
          return 'color:red;';
        }
      }
    },
    showDialog(row, column) {
      this.row = row;
      this.column = column;
      this.dialogFormVisible = true;
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
    /**
     * 排序
     */
    handleSortChange({ prop, order }) {
      this.$emit('sort-change', { prop, order });
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
/deep/ .cell .img {
  width: 100%;
  height: 60px;
  position: relative;
  img {
    width: 100%;
    height: 100%;
  }
  .play {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    background-color: rgba(0, 0, 0, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;
    &::after {
      content: '';
      width: 25px;
      height: 25px;
      background-size: contain;
      content: '';
      background-image: url("data:image/svg+xml,%3Csvg t='1568790469554' class='icon' viewBox='0 0 1024 1024' version='1.1' xmlns='http://www.w3.org/2000/svg' p-id='2471' width='48' height='48'%3E%3Cpath d='M511.5 4C231.216 4 4 231.216 4 511.5S231.216 1019 511.5 1019 1019 791.784 1019 511.5 791.784 4 511.5 4zM511.5 923.844c-227.73 0-412.344-184.614-412.344-412.344S283.77 99.156 511.5 99.156s412.344 184.614 412.344 412.344S739.23 923.844 511.5 923.844zM384.624 289.468 765.25 511.5 384.624 733.532 384.624 289.468z' p-id='2472' fill='%23ffffff'%3E%3C/path%3E%3C/svg%3E");
    }
  }
}
</style>
