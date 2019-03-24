/**
 * Created by caoshi on 2018/5/30.
 */
const crmApi = () => ({
  getCrmList: '/linkman/get/list', // 查询联系人列表
  editCrm: '/linkman/update', // 编辑联系人
  getCrmDetail: '/linkman/get/detail', // 查询联系人详情
  addCrm: '/linkman/insert', // 新增联系人
});

export default crmApi();
