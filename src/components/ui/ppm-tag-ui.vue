/**
* Created by c on 2018/6/29.
*/
<template>
	<div class="ppm-tag-ui">
    <!--任务状态：1未开始，2等待完成，3按时完成,4超时完成,5超时未完成 ,-->
    <el-row v-if="status === '3'">
    <el-col :span="20">
    <span class="left-span cell-span-green"></span>
    <span class="right-txt">按时完成任务</span>
    </el-col>
    </el-row>
    <el-row v-if="status === '2'">
    <el-col :span="20">
    <span class="left-span cell-span-blue"></span>
    <span class="right-txt">等待完成任务</span>
    </el-col>
    </el-row>
    <el-row v-if="status === '4'">
    <el-col :span="20">
    <span class="left-span cell-span-yellow"></span>
    <span class="right-txt">超时完成任务</span>
    </el-col>
    </el-row>
    <el-row v-if="status === '5'">
    <el-col :span="20">
    <span class="left-span cell-span-red-color"></span>
    <span class="right-txt">超时未完成任务</span>
    </el-col>
    </el-row>
    <el-row v-if="status === '1'">
    <el-col :span="20">
    <span class="left-span cell-span-gray"></span>
    <span class="right-txt">未开始任务</span>
    </el-col>
    </el-row>
    <el-row v-if="status === '11'">
    <el-col :span="20">
    <span class="left-span cell-span-gray"></span>
    <span class="right-txt">其他</span>
    </el-col>
    </el-row>
	</div>
</template>
<script>
export default {
  name: 'ppm-tag-ui',
  components: {},
  props: ['status'],
  data() {
    return {};
  },
  methods: {},
};
</script>

<style lang="less" type="text/less" scoped>
  .ppm-tag-ui{
    display: inline-block;
    position: relative;
    height: 20px;
    width: 100%;
    margin-bottom: 10px;
    .left-span{
      display: inline-block;
      width: 16px;
      height: 16px;
      opacity: 0.5;
      margin-right: 10px;
      position: relative;
      top:3px;
    }
    .right-txt{
      font-size: 16px;
      color: #14112d;
      display: inline-block;
      margin-bottom: 15px;
    }
  }
</style>
