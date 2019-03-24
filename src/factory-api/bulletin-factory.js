/**
 * Created by caoshi on 2019/1/24.
 */
const bulletinApi = () => ({
  list: '/notice/list', // 查询公告栏列表
  edit: '/notice/upsert', // 新增/修改公告栏
});

export default bulletinApi();
