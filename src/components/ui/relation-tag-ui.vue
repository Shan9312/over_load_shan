/**
* Created by c on 2018/6/29.
*/
<template>
	<div class="relation-tag-ui">
    <span class="excellent" v-if="num == 4">
      优秀关系
    </span>
    <span class="good" v-if="num == 3">
      良好关系
    </span>
    <span class="default" v-if="num == 2">
      普通关系
    </span>
    <span class="poor" v-if="num == 1">
      较差关系
    </span>
	</div>
</template>
<script>
export default {
  name: 'relation-tag-ui',
  components: {},
  props: { num: { required: true } },
  data() {
    return {};
  },
  methods: {},
};
</script>

<style lang="less" type="text/less" scoped>
  .relation-tag-ui{
    display: inline-block;
    span{
      font-size: 12px;
      padding: 3px 12px;
      border-radius: 50px;
      margin-left: 100px;
    }
    .default{
      background: #ecf6ff;
      color: #409eff;
    }
    .excellent{
      background: #fef0f0;
      color: #f56c6c;
    }
    .good{
      background: #fdf6ec;
      color: #ff9900;
    }
    .poor{
      background: #f4f4f5;
      color: #909399;
    }
  }
</style>
