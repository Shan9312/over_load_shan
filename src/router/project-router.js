/**
 * Created by caoshi on 2018/5/30.
 */

// 客户模块
const project = () => import('../my-app/project-center/project-center.vue'); // 项目总览
const projectList = () => import('../my-app/project-center/project-list.vue'); // 项目列表
const projectDetails = () => import('../my-app/project-center/project-details.vue');// 项目详情
const projectEdit = () => import('../my-app/project-center/project-edit.vue'); // 修改项目
const projectAdd = () => import('../my-app/project-center/project-add.vue'); // 修改项目

const router = {
  path: '/project',
  name: 'project',
  redirect: '/project/project-list',
  meta: {
    breadcrumbName: '项目',
    title: '项目',
  },
  component: project,
  children: [
    {
      path: '/project/project-list',
      name: 'projectList',
      meta: {
        breadcrumbName: '项目信息',
        title: '项目列表',
      },
      component: projectList,
    },
    {
      path: '/project/project-details/:id',
      name: 'projectDetails',
      meta: {
        breadcrumbName: '项目信息',
        title: '项目详情',
      },
      component: projectDetails,
    },
    {
      path: '/project/project-edit/:id',
      name: 'projectEdit',
      meta: {
        breadcrumbName: '信息编辑',
        title: '项目编辑',
      },
      component: projectEdit,
    },

    {
      path: '/project/project-add',
      name: 'projectAdd',
      meta: {
        breadcrumbName: '项目信息',
        title: '新增项目',
      },
      component: projectAdd,
    },
  ],
};

export default router;
