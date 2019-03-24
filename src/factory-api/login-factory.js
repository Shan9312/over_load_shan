/**
 * Created by caoshi on 2018/5/30.
 */
const loginApi = () => ({
  login: '/user/login/execute',
  getInfo: '/user/login/get/user/token',
  getUserProjectList: '/user/manage/list/projects/normalUser', // 获取非介古用户项目
  changePassword: '/user/login/update/password',
  changePwd: '/user/manage/update/password', // 改密码
});

export default loginApi();
