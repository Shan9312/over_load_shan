const clientApi = () => ({
  getTaskType: '/permissionComplex/list/bizTaskType', // 获取 任务类型列表
  getPositionList: '/position/list/shareAble', // 任务职能
  getOverview: '/task/plan/get/overview', // 获取 ppm 计划列表
  addPlanInset: '/task/plan/insert', // 新增ppm 任务
  ppmUpdate: '/task/plan/update', // 启用/停用/删除
  addPlanTaskKind: '/task/plan/upsert/kind', // 新增/修改/删除_分类
  getKindsArr: 'task/plan/get/kind/parent', // 获取母分类 列表
  getSonSystem: 'task/plan/get/kind/son', // 获取子系统
  addSystemSon: 'task/plan/upsert/kind/son', // 新增/修改/删除_系统
  addTaskData: 'task/plan/upsert/upkeep', // 新增,修改_删除_保养内容
  getUpkeep: 'task/plan/get/upkeep', // 获取保养类别列表\
  getPpmDetails: 'task/plan/get/kind/detail', // 获取网格详情
  getWeekNow: 'task/plan/get/week/now', // 获取当前周期
  updatePpmGrid: 'task/plan/desert/grid', // 新增/删除 网格
  remindPpm: 'task/plan/remind/grid', // 任務提醒
  completeTask: 'task/plan/complete/grid', // 任務完成
  getGridDetail: '/task/plan/get/ grid/detail', // ppm 列表的 小格子详情
  permissionAvali: '/position/get/permissions/avali/quick', // 根据权限只能职能是否有
});

export default clientApi();
