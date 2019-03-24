/**
 * Created by c on 2019/1/18.
 * 日常任务
 */
<template>
<div class="daily-task-center">
  <transition name="slider" mode="out-in" appear>
  <router-view/>
  </transition>
</div>
</template>
<script>
export default{
  name: 'daily-task-center',
  components: {},
  data() {
    return {};
  },
  methods: {},
};
</script>

<style lang="less" type="text/less" scoped>

</style>
