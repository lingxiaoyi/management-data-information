<template>
  <div class="my-card">
    <div class="header">
      <span class="tit">{{ title }}</span>
      <span class="tit" v-if="subTitle">{{ subTitle }}</span>
    </div>
    <div class="content"><slot /></div>
  </div>
</template>

<script>
export default {
  name: 'my-card',
  props: {
    title: String,
    subTitle: String
  }
};
</script>

<style lang="scss" scoped>
.my-card {
  margin: 10px;
  border: 1px solid #dcdfe6;
  border-radius: 3px;
  .header {
    display: flex;
    align-items: center;
    height: 42px;
    padding: 0 15px;
    font-weight: bold;
    border-bottom: 1px solid #ebeef5;
    .tit {
      flex: 1;
    }
  }
  .content {
    padding: 12px;
    overflow: hidden;
  }
}
</style>
