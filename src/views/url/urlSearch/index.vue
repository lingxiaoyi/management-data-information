<template>
  <div>
    <el-form :inline="true" :model="formInline" @submit.native.prevent>
      <el-form-item label="新闻：">
        <el-input
          placeholder="请输入新闻url或新闻id"
          v-model="formInline.url"
          @keyup.enter.native="onSubmit"
          style="min-width:420px;"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>

    <el-card class="box-card">
      <div class="card-title">数据统计</div>
      <base-table :tableData="isEmpty ? [] : [urlContent]" :columns="columns" :showWeekendRow="false" />
    </el-card>

    <div class="main">
      <div class="left-side">
        <div
          v-for="{ key, val } in navList"
          :key="key"
          :class="['nav-item', { active: key === navActive }]"
          @click="changeNav(key)"
        >
          {{ val }}
          <i class="el-icon-circle-check-outline nav-icon" v-if="key === navActive"></i>
        </div>
      </div>

      <div class="right-side">
        <transition name="el-zoom-in-top">
          <el-card class="box-card box-main scrollbar" v-show="isShow(2)">
            <div class="card-title">基本信息</div>
            <ul class="news-info" v-show="!isEmpty">
              <li class="info-item">
                <h6>标题：</h6>
                <a :href="urlContent.url" target="_blank">
                  <span class="news-url">{{ urlContent.title }}</span>
                </a>
              </li>
              <li class="info-item">
                <h6>正文：</h6>
                <span>{{ urlContent.content }}</span>
              </li>
              <li class="info-item">
                <h6>分类：</h6>
                <span>{{ [urlContent.tp1st, urlContent.tp2nd, urlContent.tp3rd].filter(e => e).join(' / ') }}</span>
                <span class="url-source">{{ urlContent.source === '分类器' ? '分' : '源' }}</span>
              </li>
              <li class="info-item">
                <h6>新闻状态：</h6>
                <span>{{ urlContent.blk > 0 ? '加黑' : '正常' }}</span>
                <h6>去重状态：</h6>
                <span>{{ urlContent.isdupl > 0 ? '去重' : '正常' }}</span>
                <h6>东方号：</h6>
                <span>{{ urlContent.ufr === 'dongfanghao' ? '东方号' : '非东方号' }}</span>
              </li>
              <li class="info-item">
                <h6>URL：</h6>
                <a :href="urlContent.url" target="_blank">
                  <span class="news-url">{{ urlContent.url }}</span>
                </a>
              </li>
              <li class="info-item">
                <h6>来源：</h6>
                <span>{{ urlContent.psrc }}</span>
              </li>
              <li class="info-item">
                <h6>源站地址：</h6>
                <a :href="urlContent.purl" target="_blank">
                  <span class="news-url">{{ urlContent.purl }}</span>
                </a>
              </li>
            </ul>
          </el-card>
        </transition>

        <transition name="el-zoom-in-top">
          <el-card class="box-card" v-show="isShow(3)">
            <div class="card-title">标签内容</div>
            <ul class="news-info">
              <li class="info-item">
                <h6>粗标签：</h6>
                <span>{{ urlContent | filterTagLevel('1') }}</span>
              </li>
              <li class="info-item">
                <h6>细标签：</h6>
                <span>{{ urlContent | filterTagLevel('2') }}</span>
              </li>
            </ul>
          </el-card>
        </transition>

        <transition name="el-zoom-in-top">
          <el-card class="box-card" v-show="isShow(4)">
            <div class="card-title">时效性</div>
            <ul class="news-info">
              <li class="info-item">
                <h6>{{ urlContent.timeliness }}</h6>
                <span>{{ urlContent.timeliness | filterTimeliness }}</span>
              </li>
            </ul>
          </el-card>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import * as urlApi from '@/api/url';
import BaseTable from '@/components/BaseTable';
export default {
  components: {
    BaseTable
  },
  data() {
    return {
      formInline: {
        url: ''
      },
      urlContent: {},
      navActive: 1,
      navList: [
        {
          key: 1,
          val: '内容画像'
        },
        {
          key: 2,
          val: '基本信息'
        },
        {
          key: 3,
          val: '标签内容'
        },
        {
          key: 4,
          val: '时效性'
        }
      ],
      columns: [
        {
          prop: 'show_cnt',
          label: 'showpv'
        },
        {
          prop: 'click_cnt',
          label: 'clickpv'
        },
        {
          prop: 'rating',
          label: 'p/s',
          formatter: this.formatRate
        },
        {
          prop: 'crb_rating',
          label: 'crb点击率',
          formatter: this.formatRate
        },
        {
          prop: 'collection_cnt',
          label: '收藏数'
        },
        {
          prop: 'zan_cnt',
          label: '点赞数'
        },
        {
          prop: 'comment_cnt',
          label: '评论数'
        }
      ]
    };
  },
  filters: {
    filterTagLevel(item, type) {
      const tag = item.tagdisplay || '';
      const level = item.taglevel || '';
      const tagArr = tag.split(',');
      const levelArr = level.split(',');
      return tagArr.filter((e, i) => levelArr[i] === type).join(',');
    },
    filterTimeliness(v) {
      if (!v) {
        return '';
      } else if (v === '1') {
        return '具有时效性';
      } else if (v) {
        return '无时效性';
      }
    }
  },
  methods: {
    onSubmit() {
      const url = this.formInline.url.trim();
      if (url) {
        urlApi.getUrlcontent({ url }).then(res => {
          this.urlContent = res.data || {};
        });
      } else {
        this.$message({
          message: '新闻格式有误',
          type: 'warning'
        });
      }
    },
    changeNav(i) {
      this.navActive = i;
    }
  },
  computed: {
    isEmpty() {
      return JSON.stringify(this.urlContent) === '{}';
    },
    isShow(i) {
      return this.navActive === i || this.navActive === 1;
    }
  }
};
</script>

<style lang="scss" scoped>
.main {
  display: flex;
  > .left-side {
    width: 140px;
    background-color: #fff;
    margin-right: 12px;
    cursor: pointer;
    > .nav-item {
      font-size: 14px;
      font-weight: bold;
      padding: 10px;
      margin-bottom: 5px;
      border-radius: 3px;
      &:hover,
      &.active {
        background-color: #67a7e8;
        color: #fff;
      }
      > .nav-icon {
        float: right;
      }
    }
  }
  > .right-side {
    flex: 1;
  }
}
.box-card {
  margin-bottom: 10px;
  &.box-main {
    height: 40vh;
    overflow: auto;
  }
  .news-info {
    list-style: none;
    padding: 0;
    margin: 0;
    > li {
      h6 {
        width: 80px;
        text-align: right;
        display: inline-block;
        margin: 8px 0;
      }
      span {
        font-size: 12px;
        &.news-url {
          text-decoration: underline;
          color: #67a7e8;
          cursor: pointer;
        }
      }
    }
  }
}

/deep/ .el-card__body {
  position: relative;
  padding: 15px;
  padding-top: 50px;
  .card-title {
    position: absolute;
    top: 0;
    left: 0;
    width: 140px;
    height: 36px;
    background-color: #67a7e8;
    text-align: center;
    line-height: 36px;
    color: #fff;
    z-index: 9;
    cursor: pointer;
  }
}

/deep/ .el-table .cell {
  text-align: center;
}

.url-source {
  display: inline-block;
  width: 24px;
  height: 24px;
  margin-left: 15px;
  background-color: #67a7e8;
  color: #fff;
  border-radius: 50%;
  line-height: 24px;
  text-align: center;
  box-shadow: 2px 2px 2px #ddd;
  cursor: pointer;
}
</style>
