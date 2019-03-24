// 客户模块中心
const clientModuleCenter = () => import('../my-app/client-module/client-module-center.vue');
// tracker 的任务管理 中心模块
const trackerCenter = () => import('../my-app/client-module/tracker/tracker-center.vue');
const taskManagerCenter = () => import('../my-app/client-module/tracker/task-manager/temporary-task/task-manager-center.vue');
const ppmTaskCenter = () => import('../my-app/client-module/tracker/task-manager/ppm/ppm-task-center.vue');
// 临时任务模块
const taskList = () => import('../my-app/client-module/tracker/task-manager/temporary-task/task-list.vue');
const taskDetail = () => import('../my-app/client-module/tracker/task-manager/temporary-task/task-detail.vue');
const matterDetail = () => import('../my-app/client-module/tracker/task-manager/temporary-task/matter-detail.vue');
// 日常任务模块
const dailyTaskCenter = () => import('../my-app/client-module/tracker/task-manager/daily-task/daily-task-center.vue'); // 日常任务center
const dailyTaskList = () => import('../my-app/client-module/tracker/task-manager/daily-task/daily-task-list.vue'); // 日常任务center
const dailyTaskDetails = () => import('../my-app/client-module/tracker/task-manager/daily-task/daily-task-details.vue'); // 日常任务详情 固定岗 巡视岗
const pointTaskList = () => import('../my-app/client-module/tracker/task-manager/daily-task/point-task-list.vue'); // 点位巡视记录
const pointTaskDetail = () => import('../my-app/client-module/tracker/task-manager/daily-task/point-task-details.vue'); // 点位巡视详情
// 日常任务模板
const dailyTaskTplList = () => import('../my-app/client-module/tracker/task-manager/daily-task/daily-task-tpl/daily-task-tpl-list.vue'); // 日常任务模板列表
const dailyTaskTplAdd = () => import('../my-app/client-module/tracker/task-manager/daily-task/daily-task-tpl/daily-task-tpl-add.vue'); // 日常任务模板新增
const dailyTaskTplEdit = () => import('../my-app/client-module/tracker/task-manager/daily-task/daily-task-tpl/daily-task-tpl-edit.vue'); // 日常任务模板编辑
// ppm 计划模块
const ppmTaskPlanAdd = () => import('../my-app/client-module/tracker/task-manager/ppm/ppm-task-plan-add.vue'); // ppm 计划新增
const ppmServicePlanAdd = () => import('../my-app/client-module/tracker/task-manager/ppm/ppm-service-plan-add.vue'); // 计划管理
const ppmAddCalender = () => import('../my-app/client-module/tracker/task-manager/ppm/ppm-add-calendar.vue'); // ppm 表格新增
const ppmList = () => import('../my-app/client-module/tracker/task-manager/ppm/ppm-list.vue'); // ppm 列表页
const ppmAddSpace = () => import('../my-app/client-module/tracker/task-manager/ppm/ppm-add-calendar-space.vue'); // ppm 新增空间列表页

// 公告栏
const bulletinBoardCenter = () => import('../my-app/client-module/tracker/bulletin-board/bulletin-board-center.vue'); // 公告栏 center
const bulletinBoardList = () => import('../my-app/client-module/tracker/bulletin-board/bulletin-board-list.vue'); // 公告栏列表
const bulletinBoardAdd = () => import('../my-app/client-module/tracker/bulletin-board/bulletin-board-add.vue'); // 公告栏新增
const bulletinBoardDetails = () => import('../my-app/client-module/tracker/bulletin-board/bulletin-board-details.vue'); // 公告栏详情


const router = {
  path: '/client',
  name: 'clientModule',
  redirect: '/client/tracker',
  component: clientModuleCenter,
  children: [
    // tracker 模块
    {
      path: '/client/tracker',
      name: 'trackerCenter',
      redirect: '/client/tracker/task',
      meta: {
        breadcrumbName: 'tracker 模块',
        title: 'tracker 模块',
      },
      component: trackerCenter,
      children: [
        // 临时任务模块
        {
          path: '/client/tracker/task',
          name: 'taskManagerCenter',
          redirect: '/client/tracker/task/task-list',
          meta: {
            breadcrumbName: '任务',
            title: '临时任务',
          },
          component: taskManagerCenter,
          children: [
            {
              path: '/client/tracker/task/task-list',
              name: 'taskList',
              meta: {
                breadcrumbName: '',
                title: '临时任务',
              },
              component: taskList,
            },
            {
              path: '/client/tracker/task/task-detail/:id/:projectId',
              name: 'taskDetail',
              meta: {
                breadcrumbName: '任务详情',
                title: '任务详情',
              },
              component: taskDetail,
            },
            {
              path: '/client/tracker/task/matter-detail/:id/:projectId',
              name: 'matterDetail',
              meta: {
                breadcrumbName: '报事信息',
                title: '报事详情',
              },
              component: matterDetail,
            },
          ],
        },
        // 日常任务
        {
          path: '/client/tracker/daily-task',
          name: 'dailyTaskCenter',
          redirect: '/client/tracker/task/daily-task-list',
          meta: {
            breadcrumbName: '日常任务',
            title: '日常任务',
          },
          component: dailyTaskCenter,
          children: [
            {
              path: '/client/tracker/task/daily-task-list',
              name: 'dailyTaskList',
              meta: {
                breadcrumbName: '日常任务巡视岗',
                title: '日常任务巡视岗',
                noShowTitle: true,
                switch: {
                  name: 'dailyTaskList',
                  type: true,
                },
              },
              component: dailyTaskList,
            },
            {
              path: '/client/tracker/task/point-task-list',
              name: 'pointTaskList',
              meta: {
                breadcrumbName: '点位巡视记录',
                title: '点位巡视记录',
              },
              component: pointTaskList,
            },
            {
              path: '/client/tracker/task/point-task-details/:beaconId/:projectId/:time',
              name: 'pointTaskDetail',
              meta: {
                breadcrumbName: '点位巡视详情',
                title: '点位巡视详情',
              },
              component: pointTaskDetail,
            },
            {
              path: '/client/tracker/task/daily-task-details/:id/:projectId/:type',
              name: 'dailyTaskDetails',
              meta: {
                breadcrumbName: '日常任务详情',
                title: '日常任务详情',
              },
              component: dailyTaskDetails,
            },
            {
              path: '/client/tracker/task/daily-task-tpl-list',
              name: 'dailyTaskTplList',
              meta: {
                breadcrumbName: '日常任务模板列表',
                title: '日常任务模板列表',
              },
              component: dailyTaskTplList,
            },
            {
              path: '/client/tracker/task/daily-task-tpl-add/:bizTaskTypeId/:type/:projectId',
              name: 'dailyTaskTplAdd',
              meta: {
                breadcrumbName: '日常任务模板新增',
                title: '日常任务模板新增',
              },
              component: dailyTaskTplAdd,
            },
            {
              path: '/client/tracker/task/daily-task-tpl-edit/:bizTaskTypeId/:type/:projectId/:taskId',
              name: 'dailyTaskTplEdit',
              meta: {
                breadcrumbName: '日常任务模板编辑',
                title: '日常任务模板编辑',
              },
              component: dailyTaskTplEdit,
            },
          ],
        },
        // ppm 模块
        {
          path: '/client/tracker/ppm',
          name: 'ppmCenter',
          redirect: '/client/tracker/ppm/ppm-task-plan-add',
          meta: {
            breadcrumbName: '计划任务管理',
            title: '计划任务',
          },
          component: ppmTaskCenter,
          children: [
            {
              path: '/client/tracker/ppm/ppm-task-plan-add',
              name: 'ppmTaskPlanAdd',
              meta: {
                breadcrumbName: '计划任务管理',
                title: '计划任务',
              },
              component: ppmTaskPlanAdd,
            },
            {
              path: '/client/tracker/ppm/ppm-service-plan-add/:id',
              name: 'ppmServicePlanAdd',
              meta: {
                breadcrumbName: '编辑计划',
                title: '新增计划',
              },
              component: ppmServicePlanAdd,
            },
            {
              path: '/client/tracker/ppm/ppm-add-calender/:id',
              name: 'ppmAddCalender',
              meta: {
                breadcrumbName: '工程部',
                title: '计划周期',
              },
              component: ppmAddCalender,
            },
            {
              path: '/client/tracker/ppm/ppm-add-calender-space/:id',
              name: 'ppmAddSpace',
              meta: {
                breadcrumbName: '工程部',
                title: '计划周期',
              },
              component: ppmAddSpace,
            },
            {
              path: '/client/tracker/ppm/ppm-list/:id',
              name: 'ppmList',
              meta: {
                breadcrumbName: '',
                title: '计划列表',
              },
              component: ppmList,
            },
          ],
        },
        // 公告栏
        {
          path: '/client/tracker/bulletin',
          name: 'bulletinBoardCenter',
          component: bulletinBoardCenter,
          children: [
            {
              path: '/client/tracker/bulletin/bulletin-list',
              name: 'bulletinBoardList',
              meta: {
                breadcrumbName: '公告栏列表',
                title: '公告栏列表',
              },
              component: bulletinBoardList,
            },
            {
              path: '/client/tracker/bulletin/bulletin-add/:projectId',
              name: 'bulletinBoardAdd',
              meta: {
                breadcrumbName: '公告编辑',
                title: '公告编辑',
              },
              component: bulletinBoardAdd,
            },
            {
              path: '/client/tracker/bulletin/bulletin-details/:id',
              name: 'bulletinBoardDetails',
              meta: {
                breadcrumbName: '公告详情',
                title: '公告详情',
              },
              component: bulletinBoardDetails,
            },
          ],
        },
      ],
    },
  ],
};

export default router;
