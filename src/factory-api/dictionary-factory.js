/**
 * Created by 20180/7/18 .
 */
const dictionaryApi = () => ({
  getLineList: '/sysdict/business/line', // 查询条线列表
  getSpaceList: '/sysdict/space/category', // 获取空间类型列表
  getAssetsType: '/sysdict/asset/cate', // 获取资产设备
  getProjectByNormalUser: '/user/manage/list/projects/normalUser', // 查询非介谷人员拥有的项目
  getDateList: '/sysdict/ppm/period', // 获取周期
  getBusinessList: '/sysdict/ppm/vendor', // 获取商家服务
  getSpacePropList: '/sysdict/space/prop', // 获取空间属性列表
});

export default dictionaryApi();
