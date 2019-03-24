/**
 * Created by caoshi on 2019/1/28.
 */
const taskApi = () => ({
  getType: '/permissionComplex/list/bizTaskType', // 获取 查询的任务类型或者报事类型
  getAddType: '/bizTaskType/get/by/account', // 获取新增的任务和报事类型 和用户id相关
  // 前台报事
  reportAdd: '/task/report/create', // 新增报事
  reportHistory: '/task/report/findReportHistory', // 查询本人报事历史
  reportFinish: '/task/report/finish', // 报事结束 报事确认按钮
  reportList: '/task/report/list', // 查询报事列表
  reportMessage: '/task/report/message', // 报事留言
  reportReply: '/task/report/reply', // 报事回复
  reportDetail: '/task/report/detail', // 报事详情
  // 临时任务 ： 和我相关 代办任务 历史任务
  temporaryList: '/task/temporary/get/by/page', // 查询临时任务列表
  temporaryAdd: 'task/temporary/insert', // 新增临时任务
  temporaryDetails: '/task/temporary/get/detail', // 查询临时任务详情
  // 获取工单时效性 分配人员使用
  expirePeriod: '/sysdict/expire/period', // 获取工单时效性
  // 查询任务人员列表
  taskManageList: '/user/manage/list/task', // 临时任务查询任务人员列表
  manageList: '/user/manage/list', // 查询人员列表 + 巡视任务选人员
  assignUser: '/task/temporary/insert/assign/user', // 分配人员 派工
  assignPosition: '/task/temporary/insert/assign/position', // 分配职能
  // 任务职能
  positionShareable: '/position/list/shareAble', // 查询任务可分享职能
  positionOther: '/position/list/shareAble/other', // 分享职能是查询其他职能列表
  // 新增物料消耗
  consume: '/task/temporary/insert/consume', // 添加物料消耗 金额备注
  supplement: '/task/temporary/insert/supplement', // 添加补充
  fix: '/task/temporary/insert/fix', // 检修完成
  contFix: '/task/temporary/insert/cant/complete', // 添加无法完成
  deleteTask: '/task/temporary/delete', // 删除任务
  feedback: '/task/temporary/insert/feedback', // 添加反馈
  waitProcessed: '/task/temporary/insert/wait/process', // 升级为待处理
  // 日常任务
  dailyTaskList: '/task/get/route/static/page', // 合并路径岗和固定岗分页查询
  getWeek: '/task/get/week', // 根据年份获取周数
  getDepList: '/project/dept/get/query', // 根据蓝牙查部门时 用到的部门列表
  staticAdd: '/task/static/upsert', // 新增修改固定岗任务
  staticInfo: '/task/static/get/info', // 固定岗任务详情
  staticDetails: '/task/static/get/patrol/detail', // 固定岗巡视详情
  staticValid: '/task/static/update/valid', // 删除 启用 停用
  routeAdd: '/task/route/upsert', // 新增修改巡视岗任务
  routeInfo: 'task/route/get/info', // 路径刚任务详情
  routeDetails: '/task/route/get/patrol/detail', // 固定岗巡视详情
  routeValid: '/task/route/update/valid', // 删除 启用 停用
  eventDetails: '/task/get/add/event', // 查询事件详情
  eventBeacon: '/task/temporary/get/by/event/beacon', // 根据id找对应的临时任务列表
  // 日常任务按照点位查询
  pointTaskList: '/patrol/get/beaconPatrolRecordList', // 获取蓝牙点位的巡视记录列表
  depPointList: '/patrol/get/patrolDeptList', // 获取巡视蓝牙所属部门
  pointDailyList: '/patrol/get/patrolRecordByDay', // 获取某日巡视记录
});

export default taskApi();
