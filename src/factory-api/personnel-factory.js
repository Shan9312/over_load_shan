/**
 * Created by caoshi on 2018/5/30.
 */
const personnelApi = () => ({
  getPersonnelList: '/user/manage/list', // 查询联系人列表
  getProjectList: '/user/manage/get/projects', // 查询人员相关项目
  insertPersonnel: '/user/manage/upsert', // 新增/修改 非介古人员
  getPersonnelDetails: '/user/manage/get/forUpdate', // 查询人员详情
  getRoleWithProject: '/user/manage/get/roles/with/project', // 查询人员中某项目中角色
  checkLoginName: '/user/manage/loginName/repeat/check', // 判断登录名是否重复
});

export default personnelApi();
