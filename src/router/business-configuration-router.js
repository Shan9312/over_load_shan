// 业务配置
const businessConfigurationCenter = () => import('../my-app/business-configuration/business-configuration-center.vue'); // 配置总页
// tracker 配置
const trackerConfig = () => import('../my-app/business-configuration/tracker/tracker-config-center.vue'); // tracker 总页
const trackerPoint = () => import('../my-app/business-configuration/tracker/point-config/point-center.vue'); // 点位配置
const pointList = () => import('../my-app/business-configuration/tracker/point-config/point-list.vue'); // 点位列表
const pointAdd = () => import('../my-app/business-configuration/tracker/point-config/point-add.vue'); // 新增点位
const pointEdit = () => import('../my-app/business-configuration/tracker/point-config/point-edit.vue'); // 新增点位
const pointDetails = () => import('../my-app/business-configuration/tracker/point-config/point-details.vue'); // 新增点位
const groupEdit = () => import('../my-app/business-configuration/tracker/point-config/group/group-edit.vue'); // 编辑分组
const SeerConfig = () => import('../my-app/business-configuration/seer/seer-center.vue'); // seer配置中心
const SeerList = () => import('../my-app/business-configuration/seer/seer-list.vue'); // seer列表页

const router = {
  path: '/business-configuration',
  name: 'businessConfiguration',
  redirect: '/business-configuration/tracker',
  component: businessConfigurationCenter,
  children: [
    {
      path: '/business-configuration/tracker',
      name: 'trackerConfig',
      redirect: '/business-configuration/tracker/point',
      meta: {
        breadcrumbName: 'tracker 配置',
        title: 'tracker 配置',
      },
      component: trackerConfig,
      children: [
        {
          path: '/business-configuration/tracker/point',
          name: 'trackerPoint',
          redirect: '/business-configuration/tracker/point/point-list',
          meta: {
            breadcrumbName: '点位配置',
            title: '点位配置',
          },
          component: trackerPoint,
          children: [
            {
              path: '/business-configuration/tracker/point/point-list',
              name: 'pointList',
              meta: {
                breadcrumbName: '点位列表',
                title: '点位列表',
              },
              component: pointList,
            },
            {
              path: '/business-configuration/tracker/point/point-add/:projectId',
              name: 'pointAdd',
              meta: {
                breadcrumbName: '新增点位',
                title: '新增点位',
              },
              component: pointAdd,
            },
            {
              path: '/business-configuration/tracker/point/point-edit/:beaconId/:projectId',
              name: 'pointEdit',
              meta: {
                breadcrumbName: '编辑点位',
                title: '编辑点位',
              },
              component: pointEdit,
            },
            {
              path: '/business-configuration/tracker/point/point-details/:beaconId/:projectId',
              name: 'pointDetails',
              meta: {
                breadcrumbName: '点位详情',
                title: '点位详情',
              },
              component: pointDetails,
            },
            {
              path: '/business-configuration/tracker/point/group-edit/:groupId/:beaconId',
              name: 'groupEdit',
              meta: {
                breadcrumbName: '编辑分组',
                title: '分组信息',
              },
              component: groupEdit,
            },
          ],
        },
      ],
    },
    {
      path: '/business-configuration/seer',
      name: 'seerConfig',
      redirect: '/business-configuration/seer/seer-list',
      meta: {
        breadcrumbName: 'seer业务配置',
        title: '',
      },
      component: SeerConfig,
      children: [
        {
          path: '/business-configuration/seer/seer-list',
          name: 'seerList',
          meta: {
            breadcrumbName: '模型信息',
            title: '模型列表',
          },
          component: SeerList,
        },
      ],
    },
  ],
};
export default router;
