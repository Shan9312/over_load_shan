/**
 * Created by  on 2018/7/5
 */
const roleApi = () => ({
  getRoleList: '/role/list', // 权限列表
  getProjectListById: '/role/get/bi/project/info', // 根据roleID查询项目列表
  getUserListById: '/role/get/bi/user/info', // 根据roleID查询使用人列表
  getRoleAllList: '/role/list/permission/tree', // 所有权限信息
  getRoleDetails: '/role/get', // 查询角色详情
  getRoleProject: '/role/get/bi/project/info', // 查询角色使用项目
  getRolePersonnel: '/role/get/bi/user/info', // 查询角色使用人员
  insetRole: '/role/upsert', // 创建角色
  getRoleDetail: '/role/get', // 角色详情
});

export default roleApi();
