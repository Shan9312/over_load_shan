/**
* Created by c on 2018/6/29.
*/
<template>
	<div class="item-tag-ui">
    <span v-if="num == 1">
    <i class="icon-circle-red icon-small"></i>
      项目负责人
    </span>
    <span v-if="num == 2">
    <i class="icon-circle-yellow icon-small"></i>
      项目决策人
    </span>
    <span v-if="num == 3">
    <i class="icon-circle-blue icon-small"></i>
      条线负责人
    </span>
    <span v-if="num == 4">
    <i class="icon-circle-dark icon-small"></i>
      条线决策人
    </span>
	</div>
</template>
<script>
export default {
  name: 'item-tag-ui',
  components: {},
  props: { num: { required: true } },
  data() {
    return {};
  },
  methods: {},
};
</script>

<style lang="less" type="text/less" scoped>
  .item-tag-ui{
    display: inline-block;
    span{
      display: inline-block;
      color: @secondary-color;
      font-size: 16px;
    }
  }
</style>
