<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>

export default {
  name: 'App',
};
</script>

<style type="text/less" scoped>
  @import "assets/css/common.less";
#app {
  font-family:
    -apple-system,PingFang SC,Hiragino Sans GB,Microsoft YaHei,Helvetica Neue,Arial,sans-serif;
  width: 100%;
  height: 100%;
  background: #f5f5f5;
}
</style>
