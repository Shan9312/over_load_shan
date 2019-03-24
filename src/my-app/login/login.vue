/**
* Created by c on 2018/6/25.
*/
<template>
  <div class="login">
    <div class='login-content'>
      <p class="login-logo">
        <img src="../../../src/assets/img/login_logo.png" alt="">
      </p>
      <div class="form-container">
        <el-form :model="loginForm" :rules="rules" ref="loginForm">
            <el-input
              placeholder="username"
              prefix-icon="icon-people icon"
              type="text"
              @keyup.enter.native="login('loginForm')"
              v-model="loginForm.username">
            </el-input>
            <el-input
              placeholder="请输入密码"
              prefix-icon="icon-password icon"
              type="password"
              @keyup.enter.native="login('loginForm')"
              v-model="loginForm.psw">
            </el-input>
        </el-form>
        <div class=" text-center">
          <el-button size="medium"
                     type="primary"
                     @click="login('loginForm')"
                     class='login-btn'>
            登  录
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import sha1 from 'sha1';


export default {
  name: 'login',
  components: {},
  data() {
    return {
      loginForm: {
        username: '',
        psw: '',
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 20 个字符', trigger: 'blur' },
        ],
        psw: [
          { required: true, message: '请输入您的密码', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' },
        ],
      },
    };
  },
  methods: {
    /**
     * 登录
     * 写入cookies
     * */
    login(name) {
      this.$cookie.set('taskId', '');
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$http.post(this.api.loginApi.login,
            {
              loginType: 1,
              username: this.loginForm.username,
              password: sha1(this.loginForm.psw),
            }).then((res) => {
            if (res) {
              this.$cookie.set('projectId', '');
              this.$cookie.set('token', res.token);
              this.$cookie.set('category', res.category);
              this.$cookie.set('levelList', []);
              this.$cookie.set('userId', res.id);
              this.$store.commit('CURRENT_VIEW_CATEGORY', res.category);
              this.$message({
                showClose: true,
                message: '登录成功',
                type: 'success',
              });
              // 获取用户信息
              this.getUserInfo(res.token);
            }
          });
        }
      });
    },
    /**
     * 获取用户信息
     *
     * */
    getUserInfo(data) {
      this.$http.get(this.api.loginApi.getInfo, { params: { token: data } })
        .then((res) => {
          const userInfo = JSON.stringify(res);
          this.$cookie.set('userInfo', userInfo); // 写入cookie 存储用户信息
          this.$store.commit('CURRENT_USER_INFO', res); // 更新store
          // const routePath = this.$route.query.redirect;
          // if (routePath) {
          //   this.$router.push({ path: routePath });
          // } else
          if (res.category === '1') {
            this.$router.push({ name: 'bulletinBoardList' });
          } else {
            this.$router.push({ name: 'statisticsBoard' });
          }
        });
    },
  },
};
</script>

<style lang="less"  type="text/less" scoped>
  .login {
    height:100%;
    background-color:#fff;
    .login-content {
      width: 389px;
      height: 480px;
      position: absolute;
      left:0;
      right:0;
      top:0;
      bottom:0;
      margin:auto;
      box-sizing: border-box;
      .login-logo{
        width: 199px;
        height: 102px;
        margin:0 auto;
      }
      .form-container{
        margin-top:71px;
        width:389px;
        .el-input{
        }
        .icon{
          display:inline-block;
          width:22px;
          height:24px;
          position:absolute;
          top:5px;
          margin:0 20px;
        }
        .icon-names{
          background:url('../../assets/img/login_icon_username_nor.png')
        }
        .icon-password{
          background:url('../../assets/img/login_icon_password_nor.png')
        }
        .login-btn{
          width: 180px;
          height: 50px;
          line-height:25px;
          border-radius: 4px;
          background-color: @main-blue;
          border:1px solid @main-blue;
          margin-top:53px;
          font-size:18px;
        }
      }
    }
  }
</style>
