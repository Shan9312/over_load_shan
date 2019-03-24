/**
 * Created by on 2018/7/23.
 */
const AssetsRouter = () => import('../my-app/assets/assets-center.vue'); // 资产 总览
const AssetsList = () => import('../my-app/assets/assets-list.vue'); // 资产列表
const AssetsAdd = () => import('../my-app/assets/assets-add.vue'); // 资产新增
const AssetsEdit = () => import('../my-app/assets/assets-edit.vue'); // 资产编辑
const AssetsDetails = () => import('../my-app/assets/assets-details.vue'); // 资产详情

const router = {
  path: '/assets',
  name: 'assets',
  redirect: '/assets/assets-list',
  meta: {
    breadcrumbName: '资产',
    title: '资产',
  },
  component: AssetsRouter,
  children: [
    {
      path: '/assets/assets-list',
      name: 'assetsList',
      meta: {
        breadcrumbName: '资产列表',
        title: '资产列表',
      },
      component: AssetsList,
    },
    {
      path: '/assets/assets-add',
      name: 'assetsAdd',
      meta: {
        breadcrumbName: '资产新增',
        title: '资产新增',
      },
      component: AssetsAdd,
    },
    {
      path: '/assets/assets-edit/:id',
      name: 'assetsEdit',
      meta: {
        breadcrumbName: '资产编辑',
        title: '资产编辑',
      },
      component: AssetsEdit,
    },
    {
      path: '/assets/assets-details/:id',
      name: 'assetsDetails',
      meta: {
        breadcrumbName: '资产详情',
        title: '资产详情',
      },
      component: AssetsDetails,
    },
  ],
};

export default router;
