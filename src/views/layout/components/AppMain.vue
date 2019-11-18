<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <!-- or name="fade" -->
      <!-- <router-view :key="key"></router-view> -->
      <keep-alive :include="keepAliveComponents">
        <router-view :key="$route.fullPath" />
      </keep-alive>
    </transition>
  </section>
</template>

<script>
import { mapState } from 'vuex';
export default {
  name: 'AppMain',
  computed: {
    ...mapState('keepAlive', ['keepAliveComponents'])
  }
};
</script>

<style scoped>
.app-main {
  /*50 = navbar  */
  height: calc(100vh - 50px);
  position: relative;
  padding: 15px;
  background: #f4f4f4;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>
