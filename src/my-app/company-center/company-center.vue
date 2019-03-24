/**
* Created by c on 2018/5/30.
*/
<template>
	<div class="customer-center tables ">
    <!--<keep-alive include="customer-list">-->
    <transition name="slider" mode="out-in" appear>
      <router-view/>
    </transition>
    <!--</keep-alive>-->
	</div>
</template>
<script>
export default {
  name: 'customer-center',
  components: {},
  data() {
    return {};
  },
  methods: {},
};
</script>

<style lang="less" type="text/less" scoped>

</style>
