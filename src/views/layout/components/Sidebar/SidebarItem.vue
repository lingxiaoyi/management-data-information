<template>
  <div v-if="!item.hidden && item.children" class="menu-wrapper">
    <router-link
      v-if="hasOneShowingChild(item.children) && !onlyOneChild.children && !item.alwaysShow"
      :to="resolvePath(onlyOneChild.modelpage)"
    >
      <el-menu-item :index="resolvePath(onlyOneChild.modelpage)" :class="{ 'submenu-title-noDropdown': !isNest }">
        <!-- <svg-icon v-if="onlyOneChild.meta && onlyOneChild.meta.icon" :icon-class="onlyOneChild.meta.icon"></svg-icon> -->
        <svg-icon v-if="onlyOneChild.icon" :icon-class="onlyOneChild.icon"></svg-icon>
        <svg-icon v-else icon-class="list"></svg-icon>
        <span slot="title">{{ onlyOneChild.cname }}</span>
      </el-menu-item>
    </router-link>

    <el-submenu v-else :index="item.cname || item.modelpage">
      <template slot="title">
        <svg-icon v-if="item.icon" :icon-class="item.icon"></svg-icon>
        <svg-icon v-else icon-class="list"></svg-icon>
        <span slot="title">{{ item.cname }}</span>
      </template>

      <template v-for="child in item.children">
        <template v-if="!child.hidden">
          <sidebar-item
            :is-nest="true"
            class="nest-menu"
            v-if="child.children && child.children.length > 0"
            :item="child"
            :key="child.modelpage"
            :base-path="resolvePath(child.modelpage)"
          ></sidebar-item>

          <router-link v-else :to="resolvePath(child.modelpage)" :key="child.id">
            <el-menu-item :index="resolvePath(child.modelpage)">
              <!-- <svg-icon v-if="child.meta && child.meta.icon" :icon-class="child.meta.icon"></svg-icon> -->
              <span slot="title">{{ child.cname }}</span>
            </el-menu-item>
          </router-link>
        </template>
      </template>
    </el-submenu>
  </div>
</template>

<script>
import path from 'path';

export default {
  name: 'SidebarItem',
  props: {
    // route object
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      onlyOneChild: null
    };
  },
  methods: {
    hasOneShowingChild(children) {
      const showingChildren = children.filter(item => {
        if (item.hidden) {
          return false;
        } else {
          // temp set(will be used if only has one showing child )
          this.onlyOneChild = item;
          return true;
        }
      });
      if (showingChildren.length === 0) {
        return true;
      }
      return false;
    },
    resolvePath(...paths) {
      const _paths = String(paths) || '';
      if (_paths && path.resolve(this.basePath, _paths)) {
        return path.resolve(this.basePath, _paths).slice(2);
      } else {
        return '';
      }
    }
  }
};
</script>
