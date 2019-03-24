/**
 * Created by c on 2019/3/4.
 */
<template>
<div class="task-tpl-ui">
  <span v-if="num === 1" class="status-yellow">没记录</span>
  <span v-if="num === 2" class="status-blue">未完成</span>
  <span v-if="num === 3" class="status-gray">已完成</span>
</div>
</template>
<script>
export default{
  name: 'task-tpl-ui',
  components: {},
  props: { num: { required: true, type: Number } },
  data() {
    return {};
  },
  methods: {},
};
</script>

<style lang="less" type="text/less" scoped>
  .task-tpl-ui{
    span{
      padding: 0 25px;
      border-radius: 25px;
      justify-content: center;
      font-size: 12px;
      height: 22px;
      display: inline-flex;
      align-items: center;
      min-width: 90px;
      margin-right: 10px;
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
  }
</style>
