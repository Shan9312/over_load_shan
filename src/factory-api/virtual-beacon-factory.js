/**
 * Created by caoshi on 2019/1/9.
 */
const virtualBeaconApi = () => ({
  details: '/virtualBeacon/get', // 获取蓝牙详情
  groupDetails: '/virtualBeacon/assetGroup/get', // 获取资产分组详情
  groupList: '/virtualBeacon/assetGroup/list', // 获取资产分组列表
  editGroup: '/virtualBeacon/assetGroup/upsert', // 新增/修改资产分组
  deleteBatch: '/virtualBeacon/delete/batch', // 批量删除蓝牙
  list: '/virtualBeacon/list', // 查询蓝牙列表
  edit: '/virtualBeacon/upsert', // 新增/修改蓝牙
});

export default virtualBeaconApi();
