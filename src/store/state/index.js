/**
 * Created by caoshi on 2018/5/30.
 */
// 路由信息
const router = {
  pathName: '',
  category: '',
};
const user = {
  info: null, // 用户信息
};
// 滚动条对象值
const event = {
  moveY: 0,
};
const projectList = []; // 项目列表
const projectId = ''; // 选中的项目id
const infiniteItem = null; // 更新无限下拉选中对象
const deleteTagNum = 0; // 标记是否触发删除标签
const routerSwitch = true; // 标记 头部路由切换状态
const state = {
  router,
  user,
  event,
  projectList,
  projectId,
  infiniteItem,
  deleteTagNum,
  routerSwitch,
};

export default state;
