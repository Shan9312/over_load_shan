/**
 * Created by caoshi on 2018/5/30.
 */
const companyApi = () => ({
  companyList: '/company/get/list', // 查询客户列表
  getCompanyDetail: '/company/get/detail', // 查询客户详情
  addCompany: '/company/insert', // 新增客户
  editCompany: '/company/update', // 编辑客户
});

export default companyApi();
