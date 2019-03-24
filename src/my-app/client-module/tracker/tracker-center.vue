/**
* Created by hss on 2019/1/9.
*/
<template>
  <div class="tracker-center">
    <transition name="slider" mode="out-in" appear>
    <router-view/>
    </transition>
  </div>
</template>
<script>
export default{
  name: 'trackerCenter',
  components: {},
  data() {
    return {};
  },
  methods: {},
};
</script>

<style lang="less" type="text/less" scoped>
</style>
