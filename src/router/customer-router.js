/**
 * Created by caoshi on 2018/5/30.
 */

// 客户模块
const company = () => import('../my-app/company-center/company-center.vue'); // 客户总览
const companyList = () => import('../my-app/company-center/company-list.vue'); // 客户列表
const companyDetails = () => import('../my-app/company-center/company-details.vue');// 客户详情
const companyEdit = () => import('../my-app/company-center/company-edit.vue'); // 修改客户
const companyAdd = () => import('../my-app/company-center/company-add.vue'); // 新增客户

const router = {
  path: '/company',
  name: 'company',
  redirect: '/company/company-list',
  meta: {
    breadcrumbName: '客户',
    title: '客户',
  },
  component: company,
  children: [
    {
      path: '/company/company-list',
      name: 'companyList',
      meta: {
        breadcrumbName: '客户列表',
        title: '客户列表',
      },
      component: companyList,
    },
    {
      path: '/company/company-details/:id',
      name: 'companyDetails',
      meta: {
        breadcrumbName: '客户详情',
        title: '客户详情',
      },
      component: companyDetails,
    },
    {
      path: '/company/company-edit/:id',
      name: 'companyEdit',
      meta: {
        breadcrumbName: '编辑客户详情',
        title: '编辑详情',
      },
      component: companyEdit,
    },

    {
      path: '/company/company-add',
      name: 'companyAdd',
      meta: {
        breadcrumbName: '新增客户',
        title: '新增客户',
      },
      component: companyAdd,
    },
  ],
};

export default router;
