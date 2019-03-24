/**
* Created by c on 2018/6/29.
*/
<template>
	<div class="client-tag-ui">
    <span v-if="num == 1">
    <i class="icon-circle-red icon-small"></i>
      引荐人
    </span>
    <span v-if="num == 2">
    <i class="icon-circle-yellow icon-small"></i>
      联络人
    </span>
    <span v-if="num == 3">
    <i class="icon-circle-blue icon-small"></i>
      决策人
    </span>

	</div>
</template>
<script>
export default {
  name: 'client-tag-ui',
  components: {},
  props: { num: { required: true } },
  data() {
    return {};
  },
  methods: {},
};
</script>

<style lang="less" type="text/less" scoped>
  .client-tag-ui{
    display: inline-block;
    span{
      display: inline-block;
      color: @secondary-color;
      font-size: 16px;
    }
  }
</style>
