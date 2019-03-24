/**
* Created by c on 2018/5/18.
*/
<template>
  <div class="index tables ">
    <!--公共header-->
    <index-header />
    <!--公共header-->
    <!--侧边栏-->
    <left-nav />
    <!--侧边栏-->
    <div class="content">
      <el-scrollbar tag="div" ref="scrollbarMain">
        <transition name="slider" mode="out-in" appear>
          <router-view></router-view>
        </transition>
      </el-scrollbar>
    </div>
  </div>
</template>
<script>
import indexHeader from '../../components/common/header/IndexHeader'; // 引入公共头部
import leftNav from '../../components/common/left-nav/left-nav'; // 引入侧边栏


export default {
  name: 'index',
  components: { indexHeader, leftNav },
  data() {
    return {
      isMounted: false, // 页面是否加载完毕
    };
  },
  watch: {
    scrollMoveX() {
      this.$store.commit('CURRENT_CONTENT_MOVE_Y', this.scrollMoveX); // 更新store
    },
  },
  computed: {
    scrollMoveX() {
      if (this.isMounted) {
        // return 1;
        return `${(this.$refs.scrollbarMain.moveY * (this.$refs.scrollbarMain.$el.offsetHeight / 100))}`;
      }
      return 1;
    },
  },
  mounted() {
    this.isMounted = true;
  },
};
</script>

<style lang="less" type="text/less" scoped>
  .index {
    height: 100%;
    overflow: hidden;
    .content {
      position: absolute;
      left: 300px;
      right: 0;
      top: 70px;
      height: auto;
      bottom: 0;
      box-sizing: border-box;
    }
  }
</style>
