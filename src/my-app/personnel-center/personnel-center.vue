<template>
  <div class="personnel-center">
    <!--<keep-alive include="personnel-list">-->
      <transition name="slider" mode="out-in">
        <router-view/>
      </transition>
    <!--</keep-alive>-->
  </div>
</template>

<script>
export default {
  name: 'personnel-center',
  components: {},
  data() {
    return {};
  },
  methods: {},
};
</script>

<style lang="less" type="text/less" scoped>

</style>
