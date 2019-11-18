<template>
  <div class="main">
    <el-form inline :model="formInline" @submit.native.prevent>
      <el-form-item label="日期：">
        <el-date-picker
          v-model="datepicker.rangeDate"
          :default-value="datepicker.rangeDate"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
        >></el-date-picker>
      </el-form-item>

      <el-form-item label="制作人：">
        <el-select v-model="formInline.user_name">
          <el-option v-for="item in usernameList" :key="item" :label="item" :value="item"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="投放平台：">
        <el-select v-model="formInline.channel_id">
          <el-option
            v-for="item in filterData.channel_list"
            :key="item.channel_id"
            :label="item.channel_name"
            :value="item.channel_id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="应用：">
        <el-select v-model="formInline.product_id">
          <el-option
            v-for="item in filterData.product_list"
            :key="item.product_id"
            :label="item.product_name"
            :value="item.product_id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="素材:">
        <el-input v-model="formInline.key" auto-complete="off"></el-input>
      </el-form-item>
    </el-form>
    <div class="actions">
      <div class="left">
        <el-upload
          class="upload-demo"
          :action="actionUrl"
          :limit="3"
          :show-file-list="false"
          :on-success="onsuccess"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
        </el-upload>
        <el-button type="primary" @click="downloadFile">模板下载</el-button>
      </div>
      <div class="right">
        <el-button type="primary" @click="dialogFormVisible = true">新增</el-button>
      </div>
    </div>
    <base-table
      v-loading="tableLoading"
      :tableData="tableList.data"
      :columns="columns"
      @tableCellClick="tableCellClick"
      :tableViewHeight="600"
      @sort-change="handleSortChange"
    />
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="tableList.pages.page"
        :page-size="tableList.pages.size"
        layout="prev, pager, next, jumper"
        :total="tableList.pages.count"
      ></el-pagination>
    </div>
    <el-dialog title="新增素材" :visible.sync="dialogFormVisible">
      <el-form
        :model="form"
        :rules="rules"
        ref="ruleForm"
        label-position="right"
        label-width="100px"
      >
        <el-form-item label="素材名称：" prop="name">
          <el-input v-model="form.name" auto-complete="off" placeholder="填写素材名称"></el-input>
        </el-form-item>
        <el-form-item label="素材MD5：" prop="md5">
          <el-input v-model="form.md5" auto-complete="off" placeholder="填写素材MD5"></el-input>
        </el-form-item>
        <el-form-item label="制作人：" prop="user_name">
          <el-input v-model="form.user_name" auto-complete="off" placeholder="填写制作人"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="onConfirmAddAccount('ruleForm')"
          v-loading.fullscreen.lock="fullscreenLoading"
        >确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="已存在的素材" :visible.sync="materiaDialogVisible">
      <div class="materia-row" v-for="item in existingMateria" :key="item">{{item}}</div>
    </el-dialog>
  </div>
</template>

<script>
import request from '@/utils/request';
import URL from '@/constants/url';
import BaseTable from '@/components/BaseTable';
import { subtractDate } from '@/utils/index';
import { mapState, mapActions, mapMutations } from 'vuex';
import mixin from '@/mixins/rangeDate';

export default {
  components: {
    BaseTable
  },
  mixins: [mixin],
  data() {
    return {
      dialogFormVisible: false,
      materiaDialogVisible: false,
      fullscreenLoading: false,
      datepicker: {
        startDate: subtractDate(8), //subtractDate(1)
        rangeDate: [subtractDate(0), subtractDate(0)]
      },
      form: {
        name: '',
        md5: '',
        user_name: ''
      },
      rules: {
        name: [{ required: true, message: '填写素材名称', trigger: 'blur' }],
        md5: [{ required: true, message: '填写素材MD5', trigger: 'blur' }],
        user_name: [{ required: true, message: '填写制作人', trigger: 'blur' }]
      },
      actionUrl: URL.material.innerUpload,
      currentPage: 1,
      total: 0,
      isUpdateAcount: false,
      existingMateria: [],
      columns: [
        {
          prop: 'id',
          label: '序号'
        },
        {
          prop: 'name',
          label: '素材名称'
        },
        {
          prop: 'md5',
          label: '素材MD5'
        },
        {
          prop: 'user_name',
          label: '制作人'
        },
        {
          prop: 'outer_material',
          label: '投放平台',
          formatter(row, column) {
            let str = '';
            if (!row[column.property]) return '';
            row[column.property].forEach(item => {
              str = str + item.channel_name + '、';
            });
            return str.substring(0, str.length - 1);
          }
        },
        {
          prop: 'outer_materialNew',
          label: '应用',
          formatter(row, column) {
            //let str = '';
            if (!row[column.property]) return '';
            /* row[column.property].forEach(item => {
              str = str + item.product_name + '、';
            }); */
            return row[column.property][0].product_name;
          }
        },
        {
          prop: 'total_cost',
          label: '总消耗'
        },
        {
          prop: 'date',
          label: '上传日期'
        }
      ]
    };
  },
  mounted() {
    this.save({
      formInline: this.oldformInline
    });
    this.querySelectData(); // 获取产品列表
    this.queryInnerUsername(); // 获取Username列表
    this.queryTiData();
  },
  methods: {
    ...mapActions('tiRecommend', ['querySelectData']),
    ...mapMutations('materialInternal', ['save']),
    ...mapActions('materialInternal', ['queryTiData', 'queryTiSortData', 'queryInnerUsername']),
    tableCellClick() {},
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
            url: this.isUpdateAcount ? URL.material.innerUpdate : URL.material.innerAdd,
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
    handleSizeChange() {},
    handleCurrentChange(val) {
      this.save({
        head: {
          pages: {
            page: val
          }
        },
        fields: []
      });
      this.queryTiData();
    },
    handleSortChange(sort) {
      console.log('sort', sort);
      if (sort.prop === 'outer_material') {
        sort.prop = 'channel';
        this.queryTiSortData(sort);
      } else if (sort.prop === 'outer_materialNew') {
        sort.prop = 'product_id';
        this.queryTiSortData(sort);
      } else if (sort.prop === 'user_name' || sort.prop === 'total_cost') {
        this.queryTiSortData(sort);
      }
    },
    downloadFile() {
      let src = `${URL.material.innerDownload}`;
      // 创建隐藏的可下载链接
      var iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = src;
      document.body.appendChild(iframe);
    },
    onsuccess(response) {
      if (response.code === 0) {
        this.$message({
          type: 'success',
          message: '上传成功!'
        });
        this.queryTiData();
      } else {
        this.materiaDialogVisible = true;
        this.existingMateria = response.msg.split(',');
        this.$message({
          type: 'error',
          message: response.msg
        });
      }
    }
  },
  computed: {
    ...mapState('tiRecommend', ['filterData']),
    ...mapState('materialInternal', ['tableList', 'tableLoading', 'formInline', 'oldformInline', 'usernameList']),
    channel_id() {
      return this.formInline.channel_id;
    },
    agent_id() {
      return this.formInline.agent_id;
    },
    checkedOptionsValues() {
      let arr = [];
      this.checkedOptions.forEach(item => {
        let arr2 = [];
        item.values.forEach(element => {
          arr2.push(element.label);
        });
        arr.push(arr2);
      });
      return arr;
    }
  },
  watch: {
    formInline: {
      handler() {
        this.queryTiData();
      },
      deep: true
    },
    datepicker: {
      handler(val) {
        this.save(val);
        this.queryTiData();
      },
      deep: true
    }
  }
};
</script>

<style lang="scss" scoped>
.materia-row {
  font-size: 16px;
  line-height: 32px;
}
.main .actions {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  .left {
    width: 180px;
    display: flex;
    justify-content: space-between;
  }
}
/deep/ .el-table .cell {
  text-align: center;
  padding: 0;
}
.block {
  width: 100%;
  padding: 20px;
}
.el-pagination {
  text-align: right;
}
.el-card {
  min-height: 500px;
  position: relative;
}
h3.table {
  font-size: 12px;
  span {
    padding-left: 5px;
    color: red;
  }
}
/* .el-form-item--mini.el-form-item,
.el-form-item--small.el-form-item {
  margin-bottom: 10px;
} */
.sec {
  margin-top: 35px;
  .title {
    font-size: 16px;
    color: #000;
  }
  .ul {
    margin-top: 10px;
  }
  &:nth-child(1) {
    margin-top: 20px;
  }
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
/deep/ .title .el-checkbox__label {
  font-size: 18px;
  color: #000;
  font-weight: 550;
}
/deep/ .title .el-checkbox__input {
  transform: translateY(-2px);
}
.el-checkbox-group .el-checkbox {
  width: 25%;
  margin-left: 0px;
}
.btn-customize {
  margin-right: 10px;
}
</style>
