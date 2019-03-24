const operationApi = () => ({
  companyMsg: '/project/dept/get/tree/position', // 获取部门信息
  editDep: '/project/dept/upsert/dept/position', // 批量新增修改部门职位
  getDepByIds: '/project/dept/get/by/ids', // 根据部门id 查询部门子集
  getAtoms: '/permissionComplex/get/atoms', // 批量获取权限原子
  getPermissionByProjectId: '/permissionComplex/list/bizTaskType', // 根据项目id查询权限
  inlete: '/projectPermission/basic/inlete', // 新增/删除项目权限
  getProjectPermission: '/projectPermission/basic/get', // 获取项目权限
  getPermissionTree: '/permissionComplex/get/tree/atoms', // 获取权限树
  getTskTag: 'tag/list/project', // 获取任务标签
  addEditTag: 'tag/upsert', // 新增修改任务标签
  getIconList: 'sysdict/permission/icon', // 获取icon列表
  addBizTaskType: '/permissionComplex/upsert/bizTaskType', // 新增修改任务类型1
  getBizTaskTypeDetails: '/permissionComplex/get/bizTaskType/detail', // 获取业务任务类型详情1
  getPermissionByRoot: '/permissionComplex/get/permission/by/root', // 把某一个节点下边的权限全拉出来 用做公共权限配置
  getCommonPermissionDetails: '/permissionComplex/get/common/permissions/detail', //  获取公共类型详情 category = 2
  addEditCommonPermission: '/permissionComplex/upsert/common/permissions', // 新增修改公共权限 category = 2
});

export default operationApi();
