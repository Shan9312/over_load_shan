/**
* Created by c on 2018/6/5.
*/
<template>
	<div class="grade-ui">
    <span v-if="num == 1" >园区</span>
    <span v-if="num == 2" >工业</span>
    <span v-if="num == 3" >住宅</span>
    <span v-if="num == 4" >商业</span>
    <span v-if="num == 5" >办公</span>
    <span v-if="num == 6">综合体</span>
    <span v-if="num == 7" >酒店</span>
    <span v-if="num == 8" >学校</span>
    <span v-if="num == 9" >医院</span>
    <span v-if="num == 10">政府</span>
    <span v-if="num == 11">租赁式项目</span>
    <span v-if="num == 12">自有资产</span>
	</div>
</template>
<script>
export default {
  name: 'yetai-ui',
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
      font-size: 16px;
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
