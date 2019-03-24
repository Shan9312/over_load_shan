/**
 * Created by caoshi on 2018/5/30.
 */
const financialApi = () => ({
  contractList: '/contract/get/list', // 查询合同列表
  getContractDetail: '/contract/get/detail', // 查询合同详情
  getBillList: '/contract/bill/list/contract', // 查询账单列表
  getContractListByDay: '/contract/bill/list/union/overdue', // 根据合同查询账单列表
  editContract: '/contract/update', // 合同编辑
  getContractBillList: '/contract/bill/list/contract', // 合同查询账单列表
  billPay: '/contract/bill/paid', // 收款
  getBillSummary: '/contract/bill/summary', // 账单合同统计
  insertContract: '/contract/insert', // 新增合同
  getCurrentList: '/contract/get/current/list', // 当前合同
  getExpireCurrentList: '/contract/get/expire/list', // 逾期合同列表
});

export default financialApi();
