/**
 * Created by caoshi on 2018/5/30.
 */
const Crm = () => import('../my-app/crm/crm.vue'); // crm 总览
const crmList = () => import('../my-app/crm/crm-list.vue'); // crm 列表
const crmEdit = () => import('../my-app/crm/crm-edit.vue'); // crm 编辑页
const crmAdd = () => import('../my-app/crm/crm-add.vue'); // crm 新增页
const crmDetails = () => import('../my-app/crm/crm-details.vue'); // crm 详情页

const router = {
  path: '/crm',
  name: 'crm',
  redirect: '/crm/crm-list',
  meta: {
    breadcrumbName: '联系人',
    title: '联系人',
  },
  component: Crm,
  children: [
    {
      path: '/crm/crm-list',
      name: 'crmList',
      meta: {
        breadcrumbName: '联系人列表',
        title: '联系人列表',
      },
      component: crmList,
    },
    {
      path: '/crm/crm-edit/:id',
      name: 'crmEdit',
      meta: {
        breadcrumbName: '编辑联系人',
        title: '编辑',
      },
      component: crmEdit,
    },
    {
      path: '/crm/crm-add',
      name: 'crmAdd',
      meta: {
        breadcrumbName: '新增联系人',
        title: '新增联系人',
      },
      component: crmAdd,
    },
    {
      path: '/crm/crm-details/:id',
      name: 'crmDetails',
      meta: {
        breadcrumbName: '联系人详情',
        title: '联系人详情',
      },
      component: crmDetails,
    },
  ],
};

export default router;
