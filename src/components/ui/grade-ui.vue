/**
* Created by c on 2018/6/5.
*/
<template>
	<div class="grade-ui">
    <span v-if="num == 1" class="status-blue">已接触</span>
    <span v-if="num == 2" class="status-green">已立项</span>
    <span v-if="num == 3" class="status-red">合同谈判</span>
    <span v-if="num == 4" class="status-yellow">实施中</span>
    <span v-if="num == 5" class="status-violet">运维中</span>
    <span v-if="num == 6" class="status-gray">已关闭</span>
	</div>
</template>
<script>
export default {
  name: 'grade-ui',
  components: {},
  props: { num: { required: true } },
  data() {
    return {};
  },
  methods: {},
};
</script>

<style lang="less" type="text/less" scoped>
  .grade-ui{
    span{
      padding: 0 25px;
      border-radius: 25px;
      justify-content: center;
      font-size: 12px;
      display: inline-flex;
      align-items: center;
      min-width: 90px;
    }
    .status-red{
      background: @ornament-red-light;
    }
    .status-yellow{
      background: @ornament-yellow-light;
    }
    .status-blue{
      background: @ornament-blue-light;
    }
    .status-green{
      background: @ornament-green-light;
    }
    .status-gray{
      background: @ornament-dark-light;
    }
    .status-violet{
      background: #f2f6fc;
    }
  }
</style>
