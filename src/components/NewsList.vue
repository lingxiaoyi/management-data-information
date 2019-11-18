<template>
  <div class="news-container">
    <ul>
      <li v-for="item in news" :key="item.id">
        <div v-if="item.miniimg.length > 1" class="newslist">
          <a :href="item.newsurl" class="newslist-threeimg" target="_blank">
            <h2 class="title">{{ item.newstopic }}</h2>
            <div class="img-wrap">
              <div class="img" v-for="(img, i) in item.miniimg" :key="`${item.id}-${i}`">
                <img v-lazy="img.src" :alt="img.alt" />
              </div>
            </div>
            <p class="tags">
              <em class="tag">{{ item.date }} {{ item.source }}</em>
            </p>
            <p class="tags">
              <span class="tag">展现： {{ item.showpv }}</span>
              <span class="tag">点击： {{ item.clickpv }}</span>
              <span class="tag">加成点击率： {{ item.ctr | formatRate }}</span>
              <span class="tag">真实点击率：{{ item.rating | formatRate }}</span>
            </p>
          </a>
          <p class="tags text-tag">
            <span>
              type1: {{ item.maintype || item.maintypecooper }} type2: {{ item.subtype || item.subtypecooper }}
            </span>
            <a target="_blank" :class="['news-source', { active: item.isDFTT }]" :href="item.url">东方</a>
          </p>
          <p class="tags text-tag">
            <span>粗标签：{{ item | filterTagLevel('1') }}</span>
            <a target="_blank" :class="['news-source', { active: item.isBaidu }]" :href="item.urlbd"
              >百度 {{ item.urlidbd }}</a
            >
          </p>
          <p class="tags text-tag">
            <span>细标签：{{ item | filterTagLevel('2') }}</span>
            <a target="_blank" :class="['news-source', { active: item.isQQ }]" :href="item.urlqq"
              >腾讯 {{ item.urlidqq }}</a
            >
          </p>
          <p class="tags text-tag">时效性： {{ item.timeliness }}</p>
        </div>

        <div v-else-if="item.miniimg.length === 1" class="newslist">
          <span class="newslist-oneimg">
            <div class="text-wrap">
              <a :href="item.newsurl" target="_blank">
                <h2 class="title">{{ item.newstopic }}</h2>
                <p class="tags">
                  <em class="tag">{{ item.date }} {{ item.source }}</em>
                </p>
                <p class="tags">
                  <span class="tag">展现： {{ item.showpv }}</span>
                  <span class="tag">点击： {{ item.clickpv }}</span>
                  <span class="tag">加成点击率： {{ item.ctr | formatRate }}</span>
                  <span class="tag">真实点击率：{{ item.rating | formatRate }}</span>
                </p>
              </a>
              <p class="tags text-tag">
                <span>
                  type1: {{ item.maintype || item.maintypecooper }} type2: {{ item.subtype || item.subtypecooper }}
                </span>
                <a target="_blank" :class="['news-source', { active: item.isDFTT }]" :href="item.url">东方</a>
              </p>
              <p class="tags text-tag">
                <span>粗标签：{{ item | filterTagLevel('1') }}</span>
                <a target="_blank" :class="['news-source', { active: item.isBaidu }]" :href="item.urlbd"
                  >百度 {{ item.urlidbd }}</a
                >
              </p>
              <p class="tags text-tag">
                <span>细标签：{{ item | filterTagLevel('2') }}</span>
                <a target="_blank" :class="['news-source', { active: item.isQQ }]" :href="item.urlqq"
                  >腾讯 {{ item.urlidqq }}</a
                >
              </p>
              <p class="tags text-tag">时效性： {{ item.timeliness }}</p>
            </div>
            <div class="img-wrap">
              <a :href="item.url" target="_blank">
                <img v-lazy="item.miniimg[0].src" />
              </a>
            </div>
          </span>
        </div>

        <div v-else class="newslist">
          <a :href="item.newsurl" target="_blank">
            <h2 class="title">{{ item.newstopic }}</h2>
            <p class="tags">
              <em class="tag">{{ item.date }} {{ item.source }}</em>
            </p>
            <p class="tags">
              <span class="tag">展现： {{ item.showpv }}</span>
              <span class="tag">点击： {{ item.clickpv }}</span>
              <span class="tag">加成点击率： {{ item.ctr | formatRate }}</span>
              <span class="tag">真实点击率：{{ item.rating | formatRate }}</span>
            </p>
          </a>
          <p class="tags text-tag">
            <span
              >type1: {{ item.maintype || item.maintypecooper }} type2: {{ item.subtype || item.subtypecooper }}</span
            >
            <a target="_blank" :class="['news-source', { active: item.isDFTT }]" :href="item.url">东方</a>
          </p>
          <p class="tags text-tag">
            <span>粗标签：{{ item | filterTagLevel('1') }}</span>
            <a target="_blank" :class="['news-source', { active: item.isBaidu }]" :href="item.urlbd"
              >百度 {{ item.urlidbd }}</a
            >
          </p>
          <p class="tags text-tag">
            <span>细标签：{{ item | filterTagLevel('2') }}</span>
            <a target="_blank" :class="['news-source', { active: item.isQQ }]" :href="item.urlqq"
              >腾讯 {{ item.urlidqq }}</a
            >
          </p>
          <p class="tags text-tag">时效性： {{ item.timeliness }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { deepClone } from '@/utils/index';

export default {
  props: {
    newstype: {
      type: String,
      default: () => ''
    },
    newsList: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  data() {
    return {
      news: []
    };
  },
  mounted() {
    this.rewriteNewsList();
  },
  filters: {
    filterTagLevel(item, type) {
      const tag = item.col_tptag || item.tagcooper;
      const level = item.taglevel || item.taglevelcooper;
      const tagArr = tag.split(',');
      const levelArr = level.split(',');
      return tagArr.filter((e, i) => levelArr[i] === type).join(',');
    },
    formatRate(v) {
      return v ? `${Number(v * 100).toFixed(2)}%` : '';
    }
  },
  methods: {
    getImgList(item) {
      const field = ['miniimg', 'minijsbd', 'minijsqq'];
      const idx = field.map((e, i) => item[field[i]].length).findIndex(e => e > 0);
      return idx > -1 ? item[field[idx]] : [];
    },
    // 重写字段
    rewriteNewsList() {
      const _this = this;
      let copylist = [];
      copylist = deepClone(this.newsList);
      this.news = [];
      copylist.forEach(e => {
        this.news.push({
          ...e,
          newsurl: e.url || e.urlbd || e.urlqq,
          newstopic: e.topic || e.topicbd || e.topicqq,
          isDFTT: e.url,
          url: e.url || 'javascript:;',
          isBaidu: e.urlbd,
          urlbd: e.urlbd || 'javascript:;',
          isQQ: e.urlqq,
          urlqq: e.urlqq || 'javascript:;',
          miniimg: _this.getImgList(e)
        });
      });
    }
  },
  watch: {
    newstype() {
      this.rewriteNewsList();
    },
    newsList() {
      this.rewriteNewsList();
    }
  }
};
</script>

<style lang="scss" scoped>
.news-container {
  max-width: 750px;
  > ul {
    list-style: none;
    margin-top: -10px;
  }
}
// 标题
.title {
  font-size: 24px;
  color: #222222;
  margin: 10px 0;
}
// 底部文字
.tags {
  margin: 1px;
  line-height: 16px;
  font-size: 12px;
  color: #848e98;
  .tag {
    margin-right: 5px;
  }
  &.text-tag {
    color: #67a7e8;
  }
  > .news-source {
    float: right;
    color: #333;
    font-weight: bold;
    cursor: pointer;
    &.active {
      background-color: #dedede;
      color: #2178f1;
    }
  }
}
img {
  width: 100%;
}

.newslist {
  border-bottom: 1px solid #f0f0f0;
}
// 三图
.newslist-threeimg {
  display: flex;
  flex-direction: column;
  .img-wrap {
    display: flex;
    margin: 5px 0;
    .img {
      border-radius: 4px;
      overflow: hidden;
      background-color: #f0f0f0;
      margin-right: 5px;
      width: 33.33%;
    }
  }
}

// 单图
.newslist-oneimg {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  .txt-wrap {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-right: 10px;
  }
  .img-wrap {
    flex: 0.5;
    min-width: 33%;
    border-radius: 4px;
    overflow: hidden;
    margin: 5px;
    .img {
      width: 100%;
    }
  }
}
</style>
