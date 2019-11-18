<template>
  <div class="main">
    <el-form inline :model="formInline" @submit.native.prevent>
      <el-form-item label="日期：" v-show="!isDetail">
        <el-date-picker
          v-model="datepicker.startDate"
          :default-value="datepicker.startDate"
          type="date"
          placeholder="选择日期"
        ></el-date-picker>
      </el-form-item>

      <el-form-item label="日期：" v-show="isDetail">
        <el-date-picker
          v-model="datepicker.rangeDate"
          :default-value="datepicker.rangeDate"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>

      <el-form-item label="软件名称：">
        <el-select v-model="formInline.qid" placeholder="请选择渠道：">
          <el-option v-for="item in selectData.qid" :key="item.qid" :label="item.qid" :value="item.qid"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="投放媒体：">
        <el-select v-model="formInline.contenttype" placeholder="请选择内容类型：">
          <el-option
            v-for="item in selectData.contenttype"
            :key="item.contenttype"
            :label="item.contenttype"
            :value="item.contenttype"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="代理商：">
        <el-input placeholder="请输入标签" :value="tag" :debounce="300" @change="handleTagInput" clearable></el-input>
      </el-form-item>

      <el-form-item v-show="isDetail">
        <el-button type="primary" @click="routerBack">返回</el-button>
      </el-form-item>
    </el-form>
    <h3 class="table">汇总媒体: 3 截止目前累计消费金额:30000元,激活数据量61782,人均激活成本: 3.5元</h3>
    <base-table
      v-loading="tableLoading"
      :tableData="tableData"
      :columns="columns1"
      :showWeekendRow="isDetail"
      :showColumnClass="!isDetail"
      :tableViewHeight="tableViewHeight"
      @tableCellClick="tableCellClick"
    />
    <h3 class="table">汇总详细数据: 50 截止目前累计消费金额:30000元,激活数据量61782,人均激活成本: 3.5元</h3>
    <base-table
      v-loading="tableLoading"
      :tableData="tableData"
      :columns="columns2"
      :showWeekendRow="isDetail"
      :showColumnClass="!isDetail"
      :tableViewHeight="tableViewHeight"
      @tableCellClick="tableCellClick"
    />
  </div>
</template>

<script>
import BaseTable from '@/components/BaseTable';
import { subtractDate } from '@/utils/index';
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex';
let columns = [
  {
    prop: 'dt',
    label: '日期'
  },
  {
    prop: 'qid',
    label: '截止时间'
  },
  {
    prop: 'groupname_ch',
    label: '软件名称'
  },
  {
    prop: 'groupname_ch',
    label: '投放媒体'
  },
  /* {
          prop: 'tag',
          label: '标签',
          'class-name': 'link-row'
        }, */
  {
    prop: 'url_cnt',
    label: '消费金额 (元)'
  },
  {
    prop: 'rec_cnt',
    label: '展现数量'
  },
  {
    prop: 'click_cnt',
    label: '点击数量'
  },
  {
    prop: 'click_uv',
    label: '开始下载数量'
  },
  {
    prop: 'click_uv',
    label: '下载完成数量'
  },
  {
    prop: 'click_uv',
    label: '激活数量'
  },
  {
    prop: 'click_uv',
    label: '人均激活成本'
  }
];
let columns1 = JSON.parse(JSON.stringify(columns));
columns1.splice(4, 0, {
  prop: 'tag',
  label: '标签',
  'class-name': 'link-row'
});
export default {
  components: {
    BaseTable
  },
  data() {
    return {
      datepicker: {
        startDate: subtractDate(1),
        rangeDate: [subtractDate(15), subtractDate(1)]
      },
      columns1,
      columns2: columns
    };
  },
  mounted() {
    const arr = ['qid', 'contenttype'];
    arr.forEach(e => this.querySelectData(e));
  },
  methods: {
    ...mapMutations('tiRecommend', ['save']),
    ...mapActions('tiRecommend', ['queryTiData', 'querySelectData']),
    tableCellClick(row, columns) {
      const prop = columns.property;
      if (this.pagetype === 'base' && prop === 'tag') {
        this.save({
          pagetype: 'tagDet',
          tag: row[prop]
        });
        this.$router.push({
          path: this.$route.path,
          query: { tag: row[prop] }
        });
      }
    },
    routerBack() {
      this.save({
        pagetype: 'base',
        tag: '',
        formInline: {
          qid: '汇总'
        }
      });
      this.$router.push({ path: this.$route.path });
    },
    handleTagInput(val) {
      this.save({ tag: val });
    }
  },
  computed: {
    ...mapState('tiRecommend', ['formInline', 'selectData', 'pagetype', 'tableData', 'tableLoading', 'tag']),
    ...mapGetters('tiRecommend', ['isDetail']),
    tableViewHeight() {
      return document.body.clientHeight - 150;
    }
  },
  watch: {
    formInline: {
      handler() {
        this.queryTiData();
      },
      immediate: true,
      deep: true
    },
    datepicker: {
      handler(val) {
        this.save(val);
        this.queryTiData();
      },
      immediate: true,
      deep: true
    },
    tag() {
      this.queryTiData();
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/ .el-table .cell {
  text-align: center;
}
</style>
