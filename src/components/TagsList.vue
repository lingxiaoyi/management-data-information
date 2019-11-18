<template>
  <div class="col-content top-content scrollbar">
    <div>
      <el-button
        v-for="item in tagData.datalist"
        :key="item[tagField.id]"
        :type="item[tagField.id] === tagid || item.small_vid == tagid ? 'primary' : ''"
        @click="clickTagButton(item)"
        size="mini"
        round
        class="tags-btn"
      >
        <el-tooltip
          v-if="item[tagField.id] && item[tagField.display].length > 9"
          :content="item[tagField.display]"
          class="item"
          effect="dark"
          placement="top"
        >
          <span>
            {{ item[tagField.display].slice(0, 8) + '...' }}
            <slot name="tagRate" :item="item"></slot>
          </span>
        </el-tooltip>
        <span v-else>
          {{ item[tagField.display] }}
          <slot name="tagRate" :item="item"></slot>
        </span>
      </el-button>
    </div>

    <el-pagination
      v-if="tagData.totalrow"
      class="pager"
      background
      layout="total, prev, pager, next"
      @current-change="handleCurrentChange"
      :current-page="tagData.page"
      :page-size="tagData.pagesize"
      :total="tagData.totalrow"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  props: {
    tagData: {
      type: Object,
      required: true,
      default: () => {}
    },
    tagid: {
      type: String,
      default: ''
    },
    tagField: {
      type: Object,
      default: () => {
        return {
          id: 'tag_id',
          display: 'tag_display'
        };
      }
    }
  },
  methods: {
    // 点击标签按钮
    clickTagButton(item) {
      this.$emit('clickTagButton', item);
    },
    // 点击分页按钮
    handleCurrentChange(page) {
      this.$emit('handleCurrentChange', page);
    }
  }
};
</script>

<style lang="scss" scoped>
.top-content {
  max-height: 48vh;
  padding-top: 5px;
  overflow: auto;
}
.tags-btn {
  margin: 2px 5px;
  width: 130px;
  position: relative;
}
.pager {
  float: right;
  margin-top: 10px;
  margin-right: 20px;
}
</style>
