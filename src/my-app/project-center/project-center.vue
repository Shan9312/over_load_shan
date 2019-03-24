/**
* Created by c on 2018/6/5.
*/
<template>
	<div class="project-center">
    <!--<keep-alive include="project-list">-->
    <transition name="slider" mode="out-in">
      <router-view/>
    </transition>
    <!--</keep-alive>-->
	</div>
</template>
<script>
export default {
  name: 'project-center',
  components: {},
  data() {
    return {};
  },
  methods: {
  },
};
</script>

<style lang="less" type="text/less" scoped>

</style>
