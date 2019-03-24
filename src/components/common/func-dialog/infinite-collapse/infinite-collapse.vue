/**
* Created by c on 2018/12/5.
* 无限下拉
*/
<template>
	<div class="infinite-collapse">
    <tree-node
      :data="data"
      ref="tree"
      :activeDepIdArr="activeDepIdArr"
      :hideDepId="hideDepId"
      :isChoosePosition="isChoosePosition"
      :positionActiveIdArr="positionActiveIdArr"
      :showPosition="showPosition"
      :selectedPosition="selectedPosition"
      :selectedDep="selectedDep"
      :selectedDepartment="selectedDepartment"
      :defaultExpansion="defaultExpansion"
      @changePositionItem="getPosition"
      @changeActiveDataSon="getChooseItem" v-if="show">
    </tree-node>
	</div>
</template>
<script>
import TreeNode from './model/node-tree';

export default {
  name: 'infinite-collapse',
  components: { TreeNode },
  props: {
    // 展示层级的数据
    data: {
      type: Array,
      required: true,
    },
    // 隐藏下级部门的id
    hideDepId: {
      type: Number,
      default: null,
    },
    // 是否需要显示职能
    showPosition: {
      type: Boolean,
      default: true,
    },
    // 是否选中部门 默认单选
    selectedDepartment: {
      type: Boolean,
      default: true,
    },
    // 默认选中的职能
    selectedDep: {
      type: Array,
      default: () => [],
    },
    // 是否可以选中职能
    isChoosePosition: {
      type: Boolean,
      default: true,
    },
    // 选中职能单选 多选
    singleElection: {
      type: Boolean,
      default: true,
    },
    // 默认选中的职能
    selectedPosition: {
      type: Array,
      default: () => [],
    },
    // 是否默认展开全部
    defaultExpansion: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      show: false, // 重新加载改组件 避免数据暂存
      depItemArr: [], // 当前选中部门
      positionItemArr: [], // 当前选中的职能
      depArr: [], // 临时部门数组
    };
  },
  methods: {
    /**
     * 获取子组件传递的值
     * 获取部门
     *
     * */
    getChooseItem(item) {
      item.isChecked = !item.isChecked;
      // 如果是单选 直接置空
      if (this.selectedDepartment) {
        this.depItemArr.length = 0;
      }
      const index = this.activeDepIdArr.indexOf(item.sign);
      if (index === -1) {
        this.depItemArr.push(item);
        item.isChecked = true;
      } else {
        this.depItemArr.splice(index, 1);
        item.isChecked = false;
      }
      this.depItemArr = this.depItemArr.filter(v => v.isChecked);
      if (this.selectedDepartment) {
        this.$emit('changeActiveData', this.depItemArr[0]);
      } else {
        this.$emit('changeActiveData', this.depItemArr);
      }
    },
    /**
     * 获取点击拿到的职能
     * 支持单选多选
     *
     * */
    getPosition(item) {
      if (item) {
        if (this.singleElection) {
          // 如果是单选 直接置空
          this.positionItemArr.length = 0;
        }
        this.positionItemArr.push(item);
      }
      this.positionItemArr = this.positionItemArr.filter(v => v.checked);
      if (this.singleElection) {
        this.$emit('getPositionItem', this.positionItemArr[0]);
      } else {
        this.$emit('getPositionItem', this.positionItemArr);
      }
    },
    /**
     * 循环数据 给已经选中的部门职位做下标记
     *
     * */
    eachData(data) {
      data.forEach((item) => {
        item.positionList.forEach((position) => {
          if (this.selectedPosition.indexOf(position.id) !== -1) {
            this.positionItemArr.push(position);
          }
        });
        if (item.deptSonList.length > 0) {
          this.eachData(item.deptSonList);
        }
      });
    },
  },
  computed: {
    /**
     * 当前选中的部门id
     *
     * */
    activeDepIdArr() {
      return this.depItemArr.map(v => v.sign);
    },
    /**
     * 当前选中的职能id
     *
     * */
    positionActiveIdArr() {
      return this.positionItemArr.map(v => v.id);
    },
  },
  watch: {
    activeDepIdArr() {
      if (this.depItemArr.length > 0) {
        this.positionItemArr = [];
      }
    },
    positionActiveIdArr() {
      if (this.positionItemArr.length > 0) {
        this.depItemArr = [];
      }
    },
    selectedDep() {
      this.depItemArr = this.selectedDep;
    },
  },
  mounted() {
    this.show = true;
    this.eachData(this.data);
    this.depItemArr = this.selectedDep; // 把上级传入的选中部门 赋值给组件的选中部门
  },
};
</script>

<style lang="less" type="text/less" scoped>

</style>
