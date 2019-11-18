import Vue from 'vue';
import Router from 'vue-router';

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router);

/* Layout */
import Layout from '../views/layout/Layout';

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/errorPage/404'), hidden: true },
  { path: '/401', component: () => import('@/views/errorPage/401'), hidden: true },
  {
    path: '/',
    component: Layout,
    redirect: '/dmp',
    hidden: true
  },
  {
    path: '/dmp',
    component: Layout,
    //redirect: '/dmp/tiRecommend',
    name: 'dmp',
    meta: {
      icon: 'datav',
      title: '报表数据'
    },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        meta: {
          title: '展示板',
          keepAlive: false
        },
        component: () => import('@/views/dashboard/index')
      },
      {
        path: 'realTime',
        component: () => import('@/views/dmp/realTime'),
        name: 'realTime',
        meta: {
          title: '实时数据',
          keepAlive: false
        }
      },
      {
        path: 'tiRecommend/:tag?',
        component: () => import('@/views/dmp/tiRecommend/index'),
        name: 'tiRecommend',
        meta: {
          title: '广告主数据',
          keepAlive: true //此组件需要被缓存
        }
      },
      {
        path: 'tiRecommendDetail',
        component: () => import('@/views/dmp/tiRecommend/detail'),
        name: 'tiRecommendDetail',
        meta: {
          title: '广告主数据',
          keepAlive: true //此组件不需要被缓存
        }
      },
      {
        path: 'dyDetail',
        component: () => import('@/views/dmp/dyDetail'),
        name: 'dyDetail',
        meta: {
          title: '抖音详细数据',
          keepAlive: true //此组件不需要被缓存
        }
      },
      {
        path: 'ksDetail',
        component: () => import('@/views/dmp/dyDetail'),
        name: 'ksDetail',
        meta: {
          title: '快手详细数据',
          keepAlive: true //此组件不需要被缓存
        }
      },
      {
        path: 'gdtDetail',
        component: () => import('@/views/dmp/dyDetail'),
        name: 'gdtDetail',
        meta: {
          title: '广点通',
          keepAlive: true //此组件不需要被缓存
        }
      },
      {
        path: 'ggjh',
        component: () => import('@/views/dmp/ggjh'),
        name: 'ggjh',
        meta: {
          title: '广告计划',
          keepAlive: true //此组件不需要被缓存
        }
      },
      {
        path: 'ggcy',
        component: () => import('@/views/dmp/ggjh'),
        name: 'ggcy',
        meta: {
          title: '广告创意',
          keepAlive: true //此组件不需要被缓存
        }
      },
      {
        path: 'accout',
        component: () => import('@/views/dmp/accout'),
        name: 'accout',
        meta: {
          title: '账户消费额'
        }
      },
      {
        path: 'agent',
        component: () => import('@/views/dmp/agent'),
        name: 'tiRecommendAgent',
        meta: {
          title: '账户数据'
        }
      }
    ]
  },
  {
    path: '/zhangyu',
    component: Layout,
    redirect: '/zhangyu/authManage',
    name: '章鱼输入法',
    hidden: true,
    meta: {
      icon: 'list',
      title: '章鱼输入法'
    },
    children: [
      {
        path: 'authManage',
        component: () => import('@/views/zhangyu/authManage/index.vue'),
        name: 'authManage',
        meta: {
          title: '账号授权管理'
        }
      },
      {
        path: 'agentManage',
        component: () => import('@/views/zhangyu/agentManage/index.vue'),
        name: 'agentManage',
        meta: {
          title: '代理商名称管理'
        }
      },
      {
        path: 'rebateSetting',
        component: () => import('@/views/zhangyu/rebateSetting/index.vue'),
        name: 'rebateSetting',
        meta: {
          title: '返点设置'
        }
      }
    ]
  },
  {
    path: '/manage',
    component: Layout,
    redirect: '/manage/productManage',
    name: '权限管理',
    hidden: true,
    meta: {
      icon: 'list',
      title: '权限管理'
    },
    children: [
      {
        path: 'productManage',
        component: () => import('@/views/manage/productManage/index.vue'),
        name: 'productManage',
        meta: {
          title: '产品管理'
        }
      },
      {
        path: 'roleManage',
        component: () => import('@/views/manage/roleManage/index.vue'),
        name: 'roleManage',
        meta: {
          title: '角色授权'
        }
      },
      {
        path: 'userManage',
        component: () => import('@/views/manage/userManage/index.vue'),
        name: 'userManage',
        meta: {
          title: '用户管理'
        }
      }
    ]
  },
  {
    path: '/channeldata',
    component: Layout,
    redirect: '/channeldata/qudaoshuju',
    name: '渠道数据',
    hidden: true,
    meta: {
      icon: 'list',
      title: '渠道数据'
    },
    children: [
      {
        path: 'qudaoshuju',
        component: () => import('@/views/channeldata/channel/index.vue'),
        name: 'qudaoshuju',
        meta: {
          title: '渠道数据',
          keepAlive: true //此组件需要被缓存
        }
      },
      {
        path: 'qid',
        component: () => import('@/views/channeldata/qid/index.vue'),
        name: 'channeldataqid',
        meta: {
          title: '渠道维度'
        }
      }
    ]
  },
  {
    path: '/uploaddata',
    component: Layout,
    redirect: '/uploaddata/data',
    name: '上传数据',
    hidden: true,
    meta: {
      icon: 'list',
      title: '上传数据'
    },
    children: [
      {
        path: 'data',
        component: () => import('@/views/upload/data/index.vue'),
        name: 'uploaddata',
        meta: {
          title: '上传数据'
        }
      }
    ]
  },
  {
    path: '/res',
    component: Layout,
    redirect: '/res/video',
    name: '素材库',
    hidden: true,
    meta: {
      icon: 'list',
      title: '素材库'
    },
    children: [
      {
        path: 'video',
        component: () => import('@/views/materials/video/index.vue'),
        name: 'resVideo',
        meta: {
          title: '视频维度'
        }
      },
      {
        path: 'pic',
        component: () => import('@/views/materials/video/index.vue'),
        name: 'resPic',
        meta: {
          title: '图片维度'
        }
      },
      {
        path: 'detail',
        component: () => import('@/views/materials/detail/index.vue'),
        name: 'resDetail',
        meta: {
          title: '创意'
        }
      },
      {
        path: 'internal',
        component: () => import('@/views/materials/internal/index.vue'),
        name: 'internal',
        meta: {
          title: '内部素材'
        }
      }
    ]
  },
  {
    path: '/bid',
    component: Layout,
    redirect: '/bid/agent',
    name: '自动结算',
    hidden: true,
    meta: {
      icon: 'list',
      title: '自动结算'
    },
    children: [
      {
        path: 'agent',
        component: () => import('@/views/bid/agent/index.vue'),
        name: 'bidAgent',
        meta: {
          title: '出价调整(代理商)'
        }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
];

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
});
