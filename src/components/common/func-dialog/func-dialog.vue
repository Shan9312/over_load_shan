/**
* Created by c on 2018/12/5.
* 选择职能弹窗
* 返回选择的职能对象
*/
<template>
	<div class="func-dialog">
    <el-dialog
      title="选择职能"
      :visible.sync="visible"
      width="30%"
    >
      <el-scrollbar tag="div" style="height: 300px">
        <div v-if="!deptTree.length" class="title">暂无部门信息</div>
        <infinite-collapse :data="deptTree"
        ref="tree"
        :isChoosePosition="isChoosePosition"
        @getPositionItem="getPositionItem" v-else></infinite-collapse>
      </el-scrollbar>
      <span slot="footer" class="dialog-footer">
              <el-button @click="handleCancel"  plain>取消</el-button>
              <el-button type="primary" @click="sendPositionItem">确认</el-button>
      </span>
    </el-dialog>
	</div>
</template>
<script>
import infiniteCollapse from './infinite-collapse/infinite-collapse';

export default {
  name: 'func-dialog',
  components: { infiniteCollapse },
  data() {
    return {
      isClose: false,
      positionObj: {}, // 获取的职位信息
    };
  },
  props: {
    visible: { type: Boolean, required: true }, // 是否显示弹框
    deptTree: { type: Array, required: true }, // 获取部门信息
    selectedPosition: { type: Array }, // 选中的部门id 必须为数组
    isChoosePosition: { type: Boolean }, // 是否显示选择框,默认选的
  },
  methods: {
    // /**
    //  * 设置节点状态把更新的数组在返回tree
    //  * */
    // setCheckedKeys(item) {
    //   this.$refs.tree.setCheckedNodes(item);
    // },
    /**
    * 取消按钮
    * */
    handleCancel() {
      this.$emit('changeClose', this.isClose);
    },
    /**
    *点击确定 拿到获取的 职位
    *
    * */
    getPositionItem(obj) {
      this.positionObj = obj;
    },
    /**
    *点击确认 把获取的 职位 传送到 父组件
    *
    * */
    sendPositionItem() {
      const obj = {
        isClose: this.isClose,
        positionObj: this.positionObj,
      };
      this.$emit('getPositionObj', obj);
    },
  },
};
</script>

<style lang="less" type="text/less" scoped>
.func-dialog{
  .title{
    font-size: 20px;
    text-align: center;
    padding-top:30px;
    border-bottom:1px solid #edf2fc;
  }
}
</style>
