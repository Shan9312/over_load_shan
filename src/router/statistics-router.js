/**
 * Created by on 2019/02/20.
 */
const statisticsCenter = () => import('../my-app/statistics/statistics-center.vue'); // 统计总览
const statisticsBoard = () => import('../my-app/statistics/statistics-board.vue'); // 统计面板
const statisticsDepartment = () => import('../my-app/statistics/statistics-department.vue'); // 部门统计详情

const router = {
  path: '/statistics',
  name: 'statistics',
  redirect: '/statistics/statistics-board',
  meta: {
    breadcrumbName: '统计首页',
    title: '统计首页',
  },
  component: statisticsCenter,
  children: [
    {
      path: '/statistics/statistics-board',
      name: 'statisticsBoard',
      meta: {
        breadcrumbName: '统计首页',
        title: '统计首页',
      },
      component: statisticsBoard,
    },
    {
      path: '/statistics/statistics-department/:id',
      name: 'statisticsDepartment',
      meta: {
        breadcrumbName: '部门详情',
        title: '部门详情',
      },
      component: statisticsDepartment,
    },
  ],
};

export default router;
