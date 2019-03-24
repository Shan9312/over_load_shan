/**
 * Created by caoshi on 2018/7/20.
 */

// 空间模块
const space = () => import('../my-app/space/space-center.vue'); // 空间总览
const spaceList = () => import('../my-app/space/space-list.vue'); // 空间列表
const spaceEdit = () => import('../my-app/space/space-edit.vue'); // 空间编辑列表
const spaceAdd = () => import('../my-app/space/space-add.vue'); // 空间新增

const router = {
  path: '/space',
  name: 'space',
  redirect: '/space/space-list',
  meta: {
    breadcrumbName: '空间',
    title: '空间',
  },
  component: space,
  children: [
    {
      path: '/space/space-list',
      name: 'spaceList',
      meta: {
        breadcrumbName: '列表首页',
        title: '空间列表',
      },
      component: spaceList,
    },
    {
      path: '/space/space-edit/:id/:pid',
      name: 'spaceEdit',
      meta: {
        breadcrumbName: '空间编辑',
        title: '空间编辑',
      },
      component: spaceEdit,
    },
    {
      path: '/space/space-add/:id',
      name: 'spaceAdd',
      meta: {
        breadcrumbName: '空间信息',
        title: '空间新增',
      },
      component: spaceAdd,
    },
  ],
};

export default router;
