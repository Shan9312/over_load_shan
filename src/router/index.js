import Vue from 'vue';
import Router from 'vue-router';
import VueCookie from 'vue-cookie';
import axios from 'axios';
import { Message } from 'element-ui';
import routerList from './router-list';

import store from '../store';

const Index = () => import('../my-app/dashboard/index.vue'); //  落地页
const Login = () => import('../my-app/login/login.vue'); //  登录页
const LandingPage = () => import('../my-app/dashboard/landing-page.vue'); // 主页面


Vue.use(Router);
Vue.use(VueCookie);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '*',
      redirect: '/client/tracker/bulletin/bulletin-list',
    },
    {
      path: '/',
      name: 'index',
      component: Index,
      redirect: '/landing-page',
      meta: {
        breadcrumbName: 'OverLord',
        title: '首页',
      },
      children: routerList,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        required: true,
        breadcrumbName: '登录页',
        title: '欢迎来到OverLord',
      },
    },
    {
      path: '/landing-page',
      name: 'landingPage',
      component: LandingPage,
      meta: {
        breadcrumbName: '工具中心',
        title: 'OverLord工具中心',
      },
    },
  ],
  // 切换路由回到顶部
  scrollBehavior() {
    /* eslint-disable no-undef */
    const dom = $('.content>.el-scrollbar>.el-scrollbar__wrap ')[0]; // 获取主内容区域 因为是ele框架的滚动条 router自定义方法无效
    if (dom) {
      dom.scrollTop = 0;
    }
    return { x: 0, y: 0 };
  },
});

router.beforeEach((to, form, next) => {
  store.commit('CURRENT_VIEW_NAME', to.name); // 储存路由名称
  store.commit('CURRENT_VIEW_CATEGORY', VueCookie.get('category')); // 储存用户类型
  document.title = `${to.meta.title} - OverLord`;
  // 获取用户信息
  const userInfo = VueCookie.get('userInfo');
  store.commit('CURRENT_USER_INFO', JSON.parse(userInfo));
  if (!to.meta.required) {
    if (VueCookie.get('token')) {
      axios.get(`/user/login/get/user/token?token=${VueCookie.get('token')}`)
        .then((res) => {
          if (Number(res.data.code) === 10000) {
            next();
          } else {
            Message.error(res.data.msg);
            next({ name: 'login', query: { redirect: to.fullPath } });
          }
        });
    } else {
      next({ name: 'login', query: { redirect: to.fullPath } });
    }
  } else {
    next();
  }
});
export default router;
