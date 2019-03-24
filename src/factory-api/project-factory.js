/**
 * Created by caoshi on 2018/5/30.
 */
const projectApi = () => ({
  projectList: '/project/page', // 分页查询项目列表
  getProjectInfo: '/project/info', // 查询项目详情
  editProjectInfo: '/project/update', // 修改项目详情
  insertProject: '/project/insert', // 新增项目
  getProjectByRole: '/project/permission/all/permissions', // 项目权限
  projectBind: '/project/permission/bind', // 项目权限绑定
  getRoleListById: '/project/permission/get', // 获取项目权限
  selectCompany: '/company/select', // 客戶公司
  getSonList: '/companySub/list', // 通過客戶公司查找子公司
  getSonListByProject: '/project/get/company/sub/list', // 通過項目id查找子公司
});

export default projectApi();
