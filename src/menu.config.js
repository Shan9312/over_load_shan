/**
 * Created by caoshi on 2018/11/19.
 * 左侧菜单配置表
 *
 */
const menu = [
  {
    name: '客户模块',
    role: 1,
    path: '/company/company-list',
    icon: 'icon-kehu',
    category: '1',
    list: [
      {
        name: '客户列表',
        path: '/company/company-list',
        role: 1,
      },
    ],
  },
  {
    name: '项目模块',
    role: 1,
    path: '/project/project-list',
    icon: 'icon-weibiaoti-',
    category: '1',
    list: [
      {
        name: '项目列表',
        path: '/project/project-list',
        role: 1,
      },
      {
        name: '运维中的项目',
        path: '/operation/operation-project-list',
        role: 1,
      },
    ],
  },
  {
    name: '空间资产管理',
    role: 1,
    path: '/space/space-list',
    icon: 'icon-zichan',
    category: '1',
    list: [
      {
        name: '空间列表',
        path: '/space/space-list',
        role: 1,
      },
      {
        name: '资产列表',
        path: '/assets/assets-list',
        role: 1,
      },
    ],
  },
  {
    name: '人员模块',
    role: 1,
    path: '/personnel/personnel-list',
    icon: 'icon-ren',
    category: '1',
    list: [
      {
        name: '人员列表',
        path: '/personnel/personnel-list',
        role: 1,
      },
    ],
  },
  {
    name: '业务模块',
    role: 1,
    path: '/business-configuration/tracker/point/point-list',
    category: '1',
    icon: 'icon-yewu',
    list: [
      {
        name: '点位列表',
        path: '/business-configuration/tracker/point/point-list',
        role: 1,
      },
    ],
  },
  {
    name: '临时任务',
    role: 1,
    path: '/client/tracker/task-list',
    icon: 'icon-naozhong',
    category: '1',
    list: [
      {
        name: '临时任务列表',
        path: '/client/tracker/task/task-list',
        role: 1,
      },
    ],
  },
  {
    name: '日常任务',
    role: 1,
    path: '/client/tracker/task/daily-task',
    icon: 'icon-gongdan',
    category: '1',
    list: [
      {
        name: '日常任务列表',
        path: '/client/tracker/task/daily-task-list',
        role: 1,
      },
      {
        name: '日常任务管理',
        path: '/client/tracker/task/daily-task-tpl-list',
        role: 1,
      },
    ],
  },
  {
    name: '公告管理',
    role: 1,
    path: '/client/tracker/bulletin',
    icon: 'icon-gonggao',
    category: '1',
    list: [
      {
        name: '物业公告列表',
        path: '/client/tracker/bulletin/bulletin-list',
        role: 1,
      },
    ],
  },
  {
    name: '首页',
    role: 1,
    path: '/statistics/statistics-board',
    icon: 'icon-shouye',
    category: '2',
  },
  {
    name: '任务中心',
    role: 1,
    path: '/client/tracker/task',
    category: '2',
    icon: 'icon-task',
    list: [
      {
        name: '临时任务处理查看',
        path: '/client/tracker/task/task-list',
        role: 1,
      },
      {
        name: '日常任务处理查看',
        path: '/client/tracker/task/daily-task-list',
        role: 1,
      },
      {
        name: '日常任务管理配置',
        path: '/client/tracker/task/daily-task-tpl-list',
        role: 1,
      },
      {
        name: '计划任务管理配置',
        path: '/client/tracker/ppm',
        role: 1,
      },
      {
        name: '点位巡视记录',
        path: '/client/tracker/task/point-task-list',
        role: 1,
      },
    ],
  },
  {
    name: '人员模块',
    role: 1,
    path: '/personnel/personnel-list',
    icon: 'icon-ren',
    category: '2',
    list: [
      {
        name: '人员管理配置',
        path: '/personnel/personnel-list',
        role: 1,
      },
    ],
  },
  {
    name: '信息管理',
    role: 1,
    path: '/client/tracker/bulletin',
    category: '2',
    icon: 'icon-xiaoxi',
    list: [
      {
        name: '物业公告发布',
        path: '/client/tracker/bulletin/bulletin-list',
        role: 1,
      },
    ],
  },
  {
    name: '统计分析',
    role: 1,
    path: '/statistics/statistics-department',
    category: '2',
    icon: 'icon-tongji',
    list: [
      {
        name: '任务数据',
        path: '/statistics/statistics-department',
        role: 1,
      },
    ],
  },
  {
    name: '数据导出',
    role: 69,
    path: '/data-export',
    category: '2',
    icon: 'icon-shujudaochu-01',
    list: [
      {
        name: '任务数据',
        path: '/data-export/task-list',
        role: 1,
      },
    ],
  },
];
export default menu;
