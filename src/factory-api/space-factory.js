/**
 * Created by caoshi on 2018/7/23
 */
const spaceApi = () => ({
  spaceList: '/space/list/sons', // 获取空间列表
  saveSpaceDetails: '/space/update', // 编辑空间详情
  spaceAdd: '/space/insert', // 空间新增
  deleteSpace: '/space/delete/batch', // 批量删除元空间
  pathBatch: '/space/get/path/batch', // 批量获取空间路径
  spaceFormat: '/space/list/format', // 根据项目id获取空间弹框的列表
  spaceAssetsMove: '/space/shift/batch', // 批量移动空间和资产
  getSpaceDetail: '/space/get', // 查看空间详情
  getErwei: '/space/downloadQRCode', // 下载二维码
  getSeerList: '/space/list/modelSpace', // seer 模型列表
  confirmModleName: '/space/update/modelSpace', // 修改模型空间
});

export default spaceApi();
