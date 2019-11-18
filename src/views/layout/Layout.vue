<template>
  <div class="app-wrapper" :class="classObj">
    <div v-if="device === 'mobile' && sidebar.opened" class="drawer-bg" @click="handleClickOutside"></div>
    <sidebar class="sidebar-container"></sidebar>
    <div class="main-container">
      <navbar></navbar>
      <app-main></app-main>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import { Navbar, Sidebar, AppMain } from './components';
import ResizeMixin from './mixin/ResizeHandler';
import { GlobalConst } from '@/utils/index';
const { loginOut } = GlobalConst;

export default {
  name: 'layout',
  components: {
    Navbar,
    Sidebar,
    AppMain
  },
  mixins: [ResizeMixin],
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar;
    },
    device() {
      return this.$store.state.app.device;
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      };
    }
  },
  mounted() {
    //console.log('this.$route', this.$route);
    let { username, openId, sign } = this.$route.query;
    if (!!username && !!sign) {
      this.loginBySign({ username, openId, sign });
    } else {
      let d = JSON.parse(localStorage.getItem('menuList') || '[]');
      if (d && d.length) {
        if (this.$route.fullPath === '/dmp') {
          this.$router.push({
            path: d[0].children[0].modelpage.replace('#', '')
          });
        } else {
          this.$router.push({
            path: this.$route.fullPath
          });
        }
      } else {
        window.location.href = loginOut;
      }
    }
  },
  methods: {
    ...mapActions('user', ['loginBySign']),
    handleClickOutside() {
      this.$store.dispatch('closeSideBar', { withoutAnimation: false });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import 'src/styles/mixin.scss';
.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}
.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}
</style>
