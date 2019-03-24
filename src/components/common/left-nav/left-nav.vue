/**
* Created by c on 2018/5/22.
*/
<template>
<div class="left-nav">
    <!--logo返回主页-->
    <div class="nav-top">
        <router-link :to="category === '1' ? '/' : '/statistics/statistics-board'">
          <img src="../../../assets/img/icon-home.png" alt="overlord logo"/>
        </router-link>
    </div>
    <!--logo返回主页-->
    <!--子模块菜单-->
      <el-menu
        active-text-color="#fffffff"
        router
        class="left-nav-menu"
        unique-opened
        :default-active="$route.path"
      >
        <div
          v-if="(category === item.category && item.role !== 69)
          || (item.role === 69 && showMenuItem )"
          v-for="(item,index) in menuList" :key="index">
          <el-submenu
            class="menu-item"
            :index="item.path"
            v-if="item.list"
          >
            <template slot="title">
              <i class="iconfont m-l-10" :class="item.icon" v-if="item.icon"></i>
              <span class="m-l-5">{{item.name}}</span>
            </template>
            <el-menu-item :index="menu.path"
                          v-for="(menu,menuIndex) in item.list" :key="menuIndex">
              <span class="m-l-11">{{menu.name}}</span>
            </el-menu-item>
          </el-submenu>
          <el-menu-item :index="item.path"
                        v-else
                         >
            <i class="iconfont m-l-10" :class="item.icon" v-if="item.icon"></i>
            <span class="m-l-11">{{item.name}}</span>
          </el-menu-item>
        </div>
      </el-menu>
    </div>
    <!--子模块菜单 end-->
</template>
<script>
import menuConfig from '../../../menu.config'; // 菜单权限配置

export default {
  name: 'left-nav',
  components: {},
  data() {
    return {
      controlList: '',
      menuList: menuConfig,
      userId: this.$store.state.user.info.id,
      showMenuItem: true,
    };
  },
  methods: {
    /**
     * 根据权限限制查看按钮
     *
     * */
    isShowContentById() {
      this.$http.post(this.api.clientApi.permissionAvali, {
        permissionIds: [69],
        userId: this.userId,
      }).then((res) => {
        this.showMenuItem = res.length > 0;
      });
    },
  },
  computed: {
    category() {
      return this.$store.state.user.info.category;
    },
  },
  mounted() {
    if (this.category === '2') {
      this.isShowContentById();
    }
  },
};
</script>
<style lang="less" type="text/less" scoped>
  .nav-top{
    padding: 35px 0;
    a{
      display: flex;
      align-items: center;
      justify-content: center;
      img{
        width: 160px;
      }
    }
  }
</style>

