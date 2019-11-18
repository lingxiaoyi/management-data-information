<template>
  <el-scrollbar wrapClass="scrollbar-wrapper">
    <el-menu
      mode="vertical"
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
    >
      <sidebar-item
        v-for="route in menuList"
        :key="route.cname"
        :item="route"
        :base-path="route.modelpage ? route.modelpage.slice(2) : ''"
      ></sidebar-item>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex';
import SidebarItem from './SidebarItem';
import { constantRouterMap } from '@/router/index.js';

export default {
  data() {
    return {};
  },
  components: { SidebarItem },
  computed: {
    ...mapGetters(['sidebar']),
    menuList() {
      const { menuList } = this.$store.state.user;
      return menuList.length > 0 ? menuList : JSON.parse(localStorage.getItem('menuList'));
    },
    routerArr() {
      return constantRouterMap;
    },
    isCollapse() {
      return !this.sidebar.opened;
    }
  }
};
</script>
