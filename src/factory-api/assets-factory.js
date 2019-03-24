/**
 * Created  on 2018/07/23.
 */
const assetsApi = () => ({
  getAssetsList: '/asset/list', // 查询资产列表
  getAssetsGroupList: '/asset/group/list', // 查询资产分组列表
  insertAssets: '/asset/upsert', // 新增/修改 资产
  updateBatchAssets: 'asset/update/batch', // 批量删除资产
  insertGroupAssets: '/asset/group/upsert', // 新增/修改 资产分组
  getAssetsDetails: '/asset/get', // 资产详情
  addAssetsGroup: '/asset/group/upsert', // 资产分组新增
  delAssetsGroup: '/asset/group/delete/batch', // 批量删除资产分组
  getAssetsCate: '/sysdict/asset/cate', // 资产类型列表
});

export default assetsApi();
