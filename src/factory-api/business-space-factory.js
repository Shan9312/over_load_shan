/**
 * Created by caoshi on 2018/7/23
 */
const BusinessSpaceApi = () => ({
  businessSpaceList: '/virtualBeacon/list', // 获取业务空间列表
  businessSpaceDetails: '/virtualBeacon/get', // 业务空间详情
  businessSpaceInsert: '/virtualBeacon/upsert', // 业务空间新增
});

export default BusinessSpaceApi();
