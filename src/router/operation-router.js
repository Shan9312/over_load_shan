// 运维中项目模块

const operation = () => import('../my-app/operation-project/operation-center.vue'); // 运维总览
const operationList = () => import('../my-app/operation-project/operation-project-list.vue'); // 运维项目列表
const operationDetail = () => import('../my-app/operation-project/operation-project-detail.vue'); // 运维项目详情
const operationDeploy = () => import('../my-app/operation-project/project-func-config/operation-project-deploy.vue'); // 运维项目权限配置
const trackerConfigDetails = () => import('../my-app/operation-project/project-func-config/tracker/tracker-config-details.vue'); // tracker 功能配置详情
const trackerConfigAdd = () => import('../my-app/operation-project/project-func-config/tracker/tracker-config-add.vue'); // tracker 功能配置新增
const trackerConfigEdit = () => import('../my-app/operation-project/project-func-config/tracker/tracker-config-Edit.vue'); // tracker 功能配置修改
const operationEdit = () => import('../my-app/operation-project/operation-project-edit.vue'); // 运维项目编辑
const operationOrganize = () => import('../my-app/operation-project/operation-project-organize.vue'); // 运维项目组织架构

const router = {
  path: '/operation',
  name: 'operation',
  redirect: '/operation/operation-project-list',
  meta: {
    breadcrumbName: '运维中项目',
    title: '运维中项目',
  },
  component: operation,
  children: [
    {
      path: '/operation/operation-project-list',
      name: 'operationList',
      meta: {
        breadcrumbName: '信息列表',
        title: '运维中项目',
        selectProject: true, // 是否需要选择项目
      },
      component: operationList,
    },
    {
      path: '/operation/operation-project-edit/:id',
      name: 'operationEdit',
      meta: {
        breadcrumbName: '运维中项目编辑',
        title: '项目配置',
      },
      component: operationEdit,
    },
    {
      path: '/operation/operation-project-detail/:id',
      name: 'operationDetail',
      meta: {
        breadcrumbName: '项目信息',
        title: '运维中项目详情',
      },
      component: operationDetail,
    },
    {
      path: '/operation/operation-project-deploy/:id',
      name: 'operationDeploy',
      meta: {
        breadcrumbName: '项目功能配置',
        title: '项目功能配置',
      },
      component: operationDeploy,
    },
    {
      path: '/operation/operation-project-config/tracker-details/:queryId/:id/:projectId',
      name: 'trackerConfigDetails',
      meta: {
        breadcrumbName: '项目功能配置',
        title: '项目功能配置',
      },
      component: trackerConfigDetails,
    },
    {
      path: '/operation/operation-project-config/tracker-add/:permissionId/:projectId',
      name: 'trackerConfigAdd',
      meta: {
        breadcrumbName: '新增功能',
        title: '新增功能',
      },
      component: trackerConfigAdd,
    },
    {
      path: '/operation/operation-project-config/tracker-edit/:id/:queryId/:projectId',
      name: 'trackerConfigEdit',
      meta: {
        breadcrumbName: '项目功能配置编辑',
        title: '项目功能配置编辑',
      },
      component: trackerConfigEdit,
    },
    {
      path: '/operation/operation-project-organize/:id',
      name: 'operationOrganize',
      meta: {
        breadcrumbName: '项目组织架构管理',
        title: '项目配置',
      },
      component: operationOrganize,
    },
  ],
};
export default router;
