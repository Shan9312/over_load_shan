/**
 * Created by Administrator on 2019/3/6.
 */
const dataExportApi = () => ({
  getBizTaskTypeDetails: '/permissionComplex/get/bizTaskType/detail', // 获取业务任务类型详情1
  getBizTaskType: '/permissionComplex/list/bizTaskType', // 查询权限复合体(category=1)业务任务类型列表
  getTemporaryList: '/task/temporary/get/temporary/list', // 临时任务导出--查询临时任务列表
  getOptionsList: '/task/temporary/export/options', // 临时任务导出--查询部门和状态筛选项
  exlTemporaryList: '/exl/export/temporaryTask', // 导出临时任务
  getDailyList: '/task/get/summary/task', // 获取统计的任务列表
  getDailyOptionsList: '/task/get/summary/task/select', // 获取统计的任务列表的筛选项
});

export default dataExportApi();
