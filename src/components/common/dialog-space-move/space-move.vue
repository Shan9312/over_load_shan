<template>
  <div class="space-move">
    <el-dialog
      :visible="spaceVisible"
      width="35%"
      :title="projectName"
    >
      <div style="height: 400px">
        <el-scrollbar tag="div"  >
          <el-tree
            class="el-tree-custom"
            @node-click="nodeTreeClick"
            :data="data"
            :props="defaultProps"
            node-key="id"
            ref="tree"
            v-if="spaceVisible"
          >
          <span class="custom-tree-node"
                slot-scope="{ node, data }">
              <i class="sprites-img"></i>
              <span>{{ data.name }}</span>
          </span>
          </el-tree>
        </el-scrollbar>
      </div>
      <span slot="footer" class="dialog-footer">
              <el-button @click="handCancel"  plain>取消</el-button>
              <el-button @click="chooseSpaceNode"  type="primary">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'spaceMove',
  data() {
    return {
      ispaceVisible: false, // 关闭窗口
      defaultProps: {
        children: 'spaceSonList',
        name: 'name',
      },
      moveSpaceObj: {}, // 节点对象
      spaceId: '', // 节点父id
    };
  },
  props: {
    spaceVisible: { type: Boolean, required: true },
    projectName: { type: String, required: true },
    data: { type: Array },
  },
  methods: {
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
    searchArr(arr) {
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
              this.searchArr(obj.spaceSonList);
            });
          }
        });
      }
      return arr;
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
    data() {
      this.searchArr(this.data);
    },
  },
  mounted() {
  },
};
</script>

<style>
</style>
