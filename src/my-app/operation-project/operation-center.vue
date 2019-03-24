
<template>
  <div class="operation-center">
    <transition name="slider" mode="out-in" appear>
      <router-view/>
    </transition>
  </div>
</template>
<script>
export default {
  name: 'operation-center',
  components: {},
  data() {
    return {};
  },
  methods: {},
};
</script>

<style lang="less" type="text/less" scoped>

</style>
