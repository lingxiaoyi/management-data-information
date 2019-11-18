<template>
  <el-card
    class="box-card"
    shadow="never"
    :body-style="{ padding: '0px 20px 20px' }"
  >
    <!-- header -->
    <div
      slot="header"
      class="clearfix"
    >
      <span class="title">全部数据</span>
      <span class="tips">该页面数据为全渠道全产品的所有数据，刷新频率为30分钟</span>
    </div>
    <!-- content -->
    <el-row
      v-for="(row, index) in config"
      :key="index"
    >
      <!-- 消费 -->
      <el-col
        v-for="(col, index) in row"
        :key="index"
        :lg="{span: 6, offset: index > 0 ? 1 : 0}"
        :xl="{span: 4, offset: index > 0 ? 1 : 0}"
        class="col"
      >
        <el-card :body-style="{ padding: '0px' }">
          <div class="item">
            <div class="item-left">
              <h5 class="item__name">{{ col.title }}
                <el-tooltip
                  effect="dark"
                  placement="top-start"
                >
                  <div
                    slot="content"
                    v-html="col.tips"
                    style="line-height: 1.5;"
                  ></div>
                  <i class="el-icon-question item__icon"></i>
                </el-tooltip>
              </h5>
              <span>{{ dataSource[col.value] }}</span>
            </div>
            <ul>
              <li
                v-for="(item, index) in col.children"
                :key="index"
                class="item-list"
              >{{ item.name }}
                <span
                  v-if="item.formatter"
                  v-html="formatter(dataSource[item.prop])"
                ></span>
                <span v-else>{{ dataSource[item.prop] }}</span>
              </li>
            </ul>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import * as config from '../config/index'

export default {
  props: {
    dataSource: {
      type: Object,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {
      config: config.panelConfig
    }
  },
  methods: {
    formatter: config.formatter
  },
}
</script>

<style lang="scss" scoped>
ul {
  padding-left: 0;
}
.title {
  font-weight: bold;
  color: #409eff;
}
.tips {
  padding-left: 10px;
  color: #888;
  font-size: 13px;
}
.col {
  margin-top: 20px;
}
.item {
  display: flex;
  align-items: center;
  height: 120px;
  &-left {
    width: 55%;
    min-width: 125px;
    padding: 20px 0 20px 20px;
    line-height: 30px;
  }
  &-list {
    font-size: 12px;
    color: #888;
    line-height: 24px;
    list-style: none;
  }
  &__icon {
    margin-left: 5px;
    font-size: 16px;
    &:hover {
      color: #000;
    }
  }
  &__name {
    margin: 0;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.45);
    font-weight: normal;
  }
}
</style>