
const statisticsApi = () => ({
  getUserMsgList: 'userMsg/list', // 查询用户列表
  editMsgStatus: 'userMsg/update/userMsg/status/batch', // 按照taskid 更改状态
  changeStatus: 'taskPerson/upsert/by/task', // 切换 task状态
  getTaskMsg: 'statistic/get/trackerTaskSummary', // 获取统计左侧栏
  getEchartsByProject: 'task/summary/get/project', // 项目统计
  getDataByPosititon: '/task/summary/get/dept', // 部门统计
  getTaskDetail: 'task/get/summary/task', // 任务详情
});

export default statisticsApi();
