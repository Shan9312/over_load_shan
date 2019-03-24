/**
* Created by c on 2018/5/28.
*/
<template>
<div class="panel-content-header">
  <div class="title" >
  <span v-if="!$route.meta.noShowTitle">
        {{title?title:$route.meta.breadcrumbName}}
  </span>
  </div>
  <div class="control">
    <slot class="panel-content-control"></slot>
  </div>
</div>
</template>
<script>

export default {
  name: 'panel-content-header',
  props: ['title'],
};
</script>

<style lang="less" type="text/less" scoped>
  .panel-content-header{
    display: flex;
    justify-content: space-between;
    height: 70px;
    align-items: center;
    .title{
      font-size: 20px;
      color: @main-color;
    }
    .control{
      display: inline-flex;
      align-items: center;
    }
  }
</style>
