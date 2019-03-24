/**
* Created by c on 2018/6/29.
*/
<template>
	<div class="ppm-cell-ui">
	<!--任务状态：1未开始，2等待完成，3按时完成,4超时完成,5超时未完成 ,-->
   <span class="cell_span cell-span-blue"
         v-if="obj && obj.status === '2'"></span>
    <span class="cell_span cell-span-green"
          v-if="obj && obj.status === '3'"></span>
    <span class="cell_span cell-span-yellow"
          v-if="obj && obj.status === '4'"></span>
    <span class="cell_span cell-span-red"
          v-if="obj && obj.status === '5'"></span>
    <span class="cell_span cell-span-gray"
          v-if="obj && obj.status === '1' "></span>
	</div>
</template>
<script>
export default {
  name: 'ppm-cell-ui',
  components: {},
  props: ['obj'],
  data() {
    return {};
  },
  methods: {},
};
</script>

<style lang="less" type="text/less" scoped>
  .ppm-cell-ui{
    .cell_span{
      position:absolute;
      height:60px;
      width:100%;
      top:0;
      left:0;
      opacity: 0.5;
    }
  }
</style>
