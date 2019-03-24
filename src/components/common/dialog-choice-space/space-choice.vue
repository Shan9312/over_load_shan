<template>
  <div class="space-choice">
   <div class="header">
     <h3>选择空间</h3>
   </div>
   <!--body-->
    <div style="height: 340px;">
        <el-scrollbar tag="div"  >
          <el-tree
            class="el-tree-custom"
            @node-click="nodeTreeClick"
            :data="data"
            :props="defaultProps"
            node-key="id"
            ref="tree"
            show-checkbox
            :check-strictly="true"
            @check-change="getChecked"
          >
          <span class="custom-tree-node"
                slot-scope="{ node, data }">
              <i class="sprites-img"></i>
              <span>{{ data.name }}</span>
          </span>
          </el-tree>
        </el-scrollbar>
    </div>
  </div>
</template>

<script>
export default {
  name: 'spaceMove',
  data() {
    return {
      spaceVisible: false, // 关闭窗口
      defaultProps: {
        children: 'spaceSonList',
        name: 'name',
      },
      moveSpaceObj: {}, // 节点对象
      spaceId: '', // 节点父id
      checkedArr: [], // 选中节点的数组
    };
  },
  props: {
    data: { type: Array },
    spaceIdList: { type: Array },
  },
  methods: {
    /**
    * 选中的 节点 返回一个数组,渲染下面的 已选空间
    *
    * */
    setCheckedKeys(arr) {
      this.$refs.tree.setCheckedKeys(arr);
    },
    getChecked() {
      this.checkedArr = this.$refs.tree.getCheckedNodes();
      this.$emit('getCheckedArr', this.checkedArr);
    },
    /**
     * 点击el-tree 节点 获取子节点
     * */
    nodeTreeClick(obj) {
      this.moveSpaceObj = obj;
      this.spaceId = obj.id;
    },
    /**
     *
     *深层遍历 数组, 加一个 path:父元素的name + 自己的 name ; 空间选择时用
     * */
    searchArr(arr, id) {
      if (arr.length) {
        arr.forEach((obj) => {
          if (obj.level === '1') {
            obj.path = obj.name;
            obj.index = obj.id;
          }
          if (obj.spaceSonList && obj.spaceSonList.length) {
            obj.spaceSonList.forEach((child) => {
              child.path = `${obj.path}/${child.name}`;
              child.index = obj.id;
              this.searchArr(obj.spaceSonList, id);
            });
          }
        });
      }
      // return arr;
    },
    /**
    * 取消按钮
    *
    * */
    handCancel() {
      this.ispaceVisible = false;
      this.$emit('handleClose', this.ispaceVisible);
    },
    /**
    * 点击确定时 需要先确认 是否选择了 空间
    *
    * */
    chooseSpaceNode() {
      if (!this.spaceId) {
        this.$message.error('请选择对应空间');
        return false;
      }
      this.$emit('getNodeTree', this.moveSpaceObj);
      return true;
    },
  },
  watch: {
    data(v) {
      this.searchArr(v);
    },
    spaceIdList(v) {
      this.setCheckedKeys(v);
      this.getChecked();
    },
  },
  created() {
  },
  mounted() {
    this.getChecked();
    this.searchArr(this.data);
    this.setCheckedKeys(this.spaceIdList);
  },
};
</script>

<style type="text/less" lang="less" scoped>
  .space-choice{
    border: solid 1px #eef1fb;
    .header{
      height: 36px;
      line-height: 36px;
      background-color: #f5f5f5;
      padding: 0 30px;
      color: #14112d;
      font-size: 16px;
    }
  }
</style>
