/**
* Created by on 2018/7/18 hss .
*/

// 人员模块
const personnel = () => import('../my-app/personnel-center/personnel-center.vue'); // 人员总览
const personnelList = () => import('../my-app/personnel-center/personnel-list.vue'); // 人员列表
const personnelAdd = () => import('../my-app/personnel-center/personnel-add.vue'); // 人员新增
const personnelEdit = () => import('../my-app/personnel-center/personnel-edit.vue'); // 人员编辑
const personnelDetails = () => import('../my-app/personnel-center/personnel-details.vue'); // 人员详情

const router = {
  path: '/personnel',
  name: 'personnel',
  redirect: '/personnel/personnel-list',
  meta: {
    breadcrumbName: '人员',
    title: '人员',
  },
  component: personnel,
  children: [
    {
      path: '/personnel/personnel-list',
      name: 'personnelList',
      meta: {
        breadcrumbName: '人员列表',
        title: '人员列表',
        selectProject: true, // 是否需要选择项目
      },
      component: personnelList,
    },
    {
      path: '/personnel/personnel-add',
      name: 'personnelAdd',
      meta: {
        breadcrumbName: '新增人员',
        title: '新增人员',
      },
      component: personnelAdd,
    },
    {
      path: '/personnel/personnel-edit/:id',
      name: 'personnelEdit',
      meta: {
        breadcrumbName: '人员编辑',
        title: '人员编辑',
      },
      component: personnelEdit,
    },
    {
      path: '/personnel/personnel-details/:id',
      name: 'personnelDetails',
      meta: {
        breadcrumbName: '人员详情',
        title: '人员详情',
      },
      component: personnelDetails,
    },
  ],
};
export default router;
