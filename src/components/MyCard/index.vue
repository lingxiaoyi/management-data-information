<template>
  <div class="my-card">
    <div class="header">
      <span>{{ title }}</span>
    </div>
    <div class="content">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'my-card',
  props: {
    title: String
  }
};
</script>

<style lang="scss" scoped>
.my-card {
  margin: 10px;
  border: 1px solid #dcdfe6;
  border-radius: 3px;
  .header {
    height: 42px;
    padding: 0 15px;
    line-height: 42px;
    font-weight: bold;
    border-bottom: 1px solid #ebeef5;
  }
  .content {
    width: 100%;
    padding: 12px;
    overflow: hidden;
  }
}
</style>
