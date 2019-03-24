/**
* Created by c on 2018/5/22.
*/
<template>
<div class="index-header">
  <!--顶部信息左侧-->
    <!--动态路由标签页-->
    <div class="index-header-left">
      <div class="router-tag"
           v-for="(item,index) in  routerPond"
           :key="item.key"
           :class="item.fullPath===$route.fullPath ? 'active-tag':''">
        <router-link :to="item.fullPath">
          {{item.meta.title}}
        </router-link>
        <el-switch
          v-model="switchType"
          :width="30"
          v-if="item.meta.switch"
          @change="changeSwitch"
          :disabled="item.fullPath !== $route.fullPath"
          active-color="#647fd8"
          inactive-color="#282c4d">
        </el-switch>
        <i class="el-icon-close cursor" @click="deleteTag(index)"></i>
      </div>
    </div>
    <!--动态路由标签页 end-->
  <div class="index-header-right">
    <!--信息数量-->
    <div class="message-item m-r-40">
      <span class="message-icon cursor">
        <b class="num">3</b>
        <img src="../../../assets/img/icon-img/icon-message.png" alt=""/>
      </span>
    </div>
    <!--信息数量 end-->
    <!--人员模块-->
    <div class="personnel-item">
      <span class="topic">
        <img :src="userInfo.icon" alt=""/>
      </span>
      <el-dropdown @command="clickDrop">
      <span class="el-dropdown-link">
            {{userInfo.name}}
      <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="1">登出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <!--人员模块 end-->
  </div>
  <!--顶部信息左侧-->
</div>
</template>
<script>

export default {
  name: 'index-header',
  components: {},
  data() {
    return {
      routerPond: [], // 路由池
      projectList: [],
    };
  },
  methods: {
    /**
     * 更新路由池
     *
     * */
    updateRouterPond() {
      const fullPath = this.$route.name;
      let typeIndex = null;
      //  先把路由名字相同的删除掉
      this.routerPond.forEach((item, index) => {
        if (item.name === this.$route.name) {
          this.routerPond.splice(index, 1);
          typeIndex = index;
        }
      });
      const type = this.routerPond.filter(item => item.fullPath === fullPath);
      if (type.length === 0) {
        const obj = {
          fullPath: this.$route.fullPath,
          name: this.$route.name,
          meta: this.$route.meta,
          key: new Date().getTime(),
        };
        if (typeIndex !== null) {
          this.routerPond.splice(typeIndex, 0, obj);
        } else {
          this.routerPond.push(obj);
        }
      }
    },
    /**
     * 删除标签
     *
     * */
    deleteTag(index) {
      if (this.routerPond.length < 2) {
        return;
      }
      this.routerPond.splice(index, 1);
      const i = this.routerPond.length - 1 > index ? index : this.routerPond.length - 1;
      // 如果删除的是最后一个 就跳转到前一个 如果不是最后一个就跳转到下一个
      if (i > -1) {
        this.$router.push(this.routerPond[i].fullPath);
      }
    },
    /**
     * 删除当前页标签
     *
     * */
    deleteActiveTag() {
      const path = this.$route.fullPath;
      this.routerPond.forEach((item, index) => {
        if (item.fullPath === path) {
          this.routerPond.splice(index, 1);
        }
      });
    },
    /**
     * 点击下拉菜单
     *
     * */
    clickDrop(index) {
      if (index === '1') {
        this.$cookie.delete('token');
        this.$router.push({ name: 'login', query: { redirect: this.$route.fullPath } });
      }
    },
    /**
     * switch 切换按钮
     *
     * */
    changeSwitch(val) {
      const routeMeta = this.$route.meta; // 路由meta信息
      this.$store.commit('CHANGE_ROUTER_SWITCH_TYPE', val); // 更新vuex 储存的值
      if (routeMeta.switch) {
        // 先判断名字
        if (routeMeta.switch.name === 'dailyTaskList') {
          if (val) {
            routeMeta.title = '日常任务巡视岗';
            document.title = '日常任务巡视岗 - OverLord';
          } else {
            routeMeta.title = '日常任务固定岗';
            document.title = '日常任务固定岗 - OverLord';
          }
        }
      }
    },
  },
  watch: {
    $route: 'updateRouterPond',
    deletedTagNum: 'deleteActiveTag',
  },
  computed: {
    deletedTagNum() {
      return this.$store.state.deleteTagNum; // 检测变化的数值
    },
    userInfo() {
      return this.$store.state.user.info;
    },
    switchType: {
      get() {
        return this.$route.meta.switch && this.$store.state.routerSwitch;
      },
      set() {},
    },
  },
  created() {
    // 不是首页就添加一个当前标签页
    if (this.$route.fullPath !== '/') {
      const obj = {
        fullPath: this.$route.fullPath,
        meta: this.$route.meta,
        name: this.$route.name,
        key: new Date().getTime(),
      };
      this.routerPond.push(obj);
    }
    // 切换按钮
  },
};
</script>

<style lang="less" type="text/less" scoped>
  .index-header{
    position: absolute;
    left: 0;
    width: 100%;
    padding-left: 300px;
    display: flex;
    padding-right: 30px;
    z-index: 99;
    justify-content: space-between;
    background: #ffffff;
    height: 70px;
    border-bottom: 1px solid @bottom-color;
    // 顶部左侧
    .index-header-left{
      display: inline-flex;
      align-items: flex-end;
      width: 100%;
      overflow: hidden;
      .router-tag{
        position: relative;
        transition: all .4s;
        display: inline-flex;
        z-index: 99;
        width: 220px;
        min-width: 10px;
        padding: 10px 20px;
        align-items: center;
        justify-content: space-between;
        a{
          color: @main-color;
          flex: 1;
          font-size: 14px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        i{
          color: @secondary-color;
        }
        &:not(:first-child){
          margin-left: -10px;
        }
        &:after,&:before{
          content: '';
          position: absolute;
          border-width:0 10px 40px;
          border-style:none solid solid;
        }
        &:before{
          width:calc(98%);
          left:0;
          bottom:0;
          border-color:transparent transparent #f0f0f0;
          z-index: -2;
        }
        &:after{
          width:calc(97.1%);
          left:1px;
          bottom:-1px;
          border-color:transparent transparent #ffffff;
          z-index: -1;
        }
        &.active-tag{
          z-index: 100;
          &:after{
            border-color:transparent transparent #f5f5f5;
          }
        }
      }
      .slider-tag-enter, .slider-tag-leave-to {
        opacity: 0;
        transform: translateY(30px);
      }
      .slider-tag-leave-active {
        position: absolute;
        transition: transform .3s;
      }
    }
    // 顶部右侧
    .index-header-right{
      display: flex;
      min-width: 510px;
      align-items: center;
      justify-content: flex-end;
      // 项目
      .header-project{
        align-items: center;
        .title{
          width: 40px;
          color: @secondary-color;
        }
        .el-select{
          width: 300px;
        }
      }
      // 信息数量
      .message-icon{
        display: none;
        align-items: center;
        position: relative;
        b.num{
          font-size: 12px;
          position: absolute;
          text-align: center;
          line-height: 14px;
          .circular(14);
          color: #ffffff;
          background: @main-blue;
          top: -5px;
          right: -7px;
          display: inline-block;
        }
      }
      // 人员基本信息
      .personnel-item{
        display: inline-flex;
        align-items: center;
        .topic{
          img{
            display: inline-block;
            .circular(35);
            margin-right: 15px;
            background: #2f3747;
          }
        }
        .name{
          .font-14();
          color: @main-color;
        }
        i{
          color: @secondary-color;
        }
      }
    }
  }
</style>
