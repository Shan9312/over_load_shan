/**
* Created by c on 2018/6/5.
*/
<template>
  <div class="statistics-ui">
    <span v-if="num === '101'" >新任务</span>
    <span v-if="num === '102'" >无法完成</span>
    <span v-if="num === '103'" >计划任务手动提醒</span>
    <span v-if="num === '104'" >新报事</span>
    <span v-if="num === '105'" >被分配</span>
    <span v-if="num === '106'" >报事回复</span>
    <span v-if="num === '107'" >巡视被分配</span>
    <span v-if="num === '108'" >人物分享</span>
    <span v-if="num === '109'" >人物分享</span>
  </div>
</template>
<script>
export default {
  name: 'statistics-ui',
  components: {},
  props: { num: { required: true } },
  data() {
    return {};
  },
  methods: {},
};
</script>

<style lang="less" type="text/less" scoped>
  .task-ui{
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
    .status-red{
      color: #f56c6c;
      background-color: #fef0f0;
    }
    .status-yellow{
      color: #ff9900;
      background-color: #fdf6ec;
    }
    .status-blue{
      background-color: #ecf6ff;
      color: #409eff;;
    }
    .status-gray{
      color: #909399;
      background-color: #f4f4f5;
    }
    .status-violet{
      background: #f2f6fc;
    }
    .status-green{
      background: @ornament-green-light;
    }
  }
</style>
