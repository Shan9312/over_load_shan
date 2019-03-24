/**
* Created by c on 2018/6/29.
*/
<template>
	<div class="child-tag-ui">
    <span v-if="num == 1">
    <i class="icon-circle-red icon-small"></i>
      开发商
    </span>
    <span v-if="num == 2">
    <i class="icon-circle-yellow icon-small"></i>
      大业主
    </span>
    <span v-if="num == 3">
    <i class="icon-circle-blue icon-small"></i>
      设计商
    </span>
    <span v-if="num == 4">
    <i class="icon-circle-dark icon-small"></i>
      物业公司
    </span>
	</div>
</template>
<script>
export default {
  name: 'child-tag-ui',
  components: {},
  props: { num: { required: true } },
  data() {
    return {};
  },
  methods: {},
};
</script>

<style lang="less" type="text/less" scoped>
  .child-tag-ui{
    display: inline-block;
    span{
      display: inline-block;
      color: @secondary-color;
      font-size: 16px;
      width: 100px;
    }
  }
</style>
