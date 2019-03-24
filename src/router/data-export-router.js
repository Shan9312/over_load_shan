/**
 * Created by on 2018/7/23.
 */
const DataExpotRouter = () => import('../my-app/data-export/data-export-center.vue'); // 数据导出路由
const ExportTaskList = () => import('../my-app/data-export/task-list.vue'); // 任务列表

const router = {
  path: '/data-export',
  name: 'data-export',
  redirect: '/data-export/task-list',
  meta: {
    breadcrumbName: '数据',
    title: '数据',
  },
  component: DataExpotRouter,
  children: [
    {
      path: '/data-export/task-list',
      name: 'taskListExport',
      meta: {
        breadcrumbName: '任务导出',
        title: '任务导出',
      },
      component: ExportTaskList,
    },
  ],
};

export default router;
