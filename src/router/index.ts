// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { createRouter, createWebHistory, RouteRecordRaw, createWebHashHistory, _RouteRecordBase } from 'vue-router';
// import NProgress from 'nprogress';
// import Home from '@/components/general/SHome.vue'

declare module 'vue-router' {
  // eslint-disable-next-line no-shadow
  interface _RouteRecordBase {
    hidden?: boolean | string | number;
  }
}
const routes: RouteRecordRaw[] = [
  {
    // path: '/',
    // redirect: '/Home',
    // name: 'Homes',
    // component: Home

    path: '/',
    name: 'homes',
    component: () => {
      return import('../components/home.vue');
    }
  },
  {
    path: '/home',
    name: 'home',
    component: () => {
      return import('../components/home.vue');
    }
  },
  {
    path: '/CmdCommand',
    name: 'CmdCommand',
    component: () => {
      return import('@vi/page/cmd/CmdCommand.vue');
    }
  },
  {
    path: '/Desktop',
    name: 'Desktop',
    component: () => {
      return import('@vi/page/desktop/Desktop.vue');
    }
  },
  {
    path: '/Programs',
    name: 'Programs',
    component: () => {
      return import('@vi/page/programs/Programs.vue');
    }
  }
];

// createWebHashHistory createWebHistory
const router = createRouter({
  history: createWebHashHistory(), // HTML5模式
  routes
});
// 页面切换之前取消上一个路由中未完成的请求
router.beforeEach((_to, _from, next) => {
  // NProgress.start();
  next();
});
router.afterEach(() => {
  // 进度条
  // NProgress.done();
});

export default router;
