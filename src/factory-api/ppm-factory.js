/**
 * Created by caoshi on 2018/5/30.
 */
const ppmApi = () => ({
  getPpmDetail: '/task/ppm/get/kind/detail', // 查询ppm 详情
  getPpmNow: '/task/ppm/get/detail', // 获取当前启用的项目详情
  getPpmTaskList: '/task/ppm/get/list', // 获取当前启用的项目
  addPpmTask: '/task/ppm/insert/ppm/plan', // 新增ppm计划
  ppmUpdate: '/task/ppm/update/task', // 启用，停用，删除ppm
  ppmServiceList: '/task/ppm/get/kind/parent', // 获取当前启用的项目
  ppmSonList: '/task/ppm/get/kind/son', // 获取子分类列表
  ppmUpkeep: '/task/ppm/get/upkeep', // 获取保养类别列表
  updateTask: '/task/ppm/upsert/kind', // 保养系统，添加——修改-删除
  addTaskData: '/task/ppm/upsert/upkeep', // 保养类型 新增，编辑，删除
  completeTask: '/task/ppm/insert/complete/grid', // 完成任务
  updatePpmGrid: '/task/ppm/upsert/grid', // 新增删除 ppm 网格
  getWeekNow: 'task/ppm/get/week/now', // 获取当前周数
  remindPpm: '/task/ppm/insert/remind', // 提醒任务
});

export default ppmApi();
