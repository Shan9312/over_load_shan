<template>
  <div>
    <el-dialog
      title="项目数量"
      :visible.sync="dialogVisible"
    >
      <el-scrollbar tag="div" >
        <el-table
          :data="projectList"
          style="width: 100%">
          <el-table-column
            prop="name"
            label="项目名称"
            width="250"
          >
          </el-table-column>
          <el-table-column
            prop="products"
            label="产品"
            width="250"
          >
            <template slot-scope="scope">
              <div>
                  <span v-for="(item, index) in scope.row.products"
                        :key="index" class="line">{{item}}
                  </span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-scrollbar>
      <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false" size="small" plain>取 消</el-button>
              <el-button type="primary"
                         @click="confirmProjec(projectList)"
                         size="small" plain>确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'dialog-role',
  data() {
    return {
    };
  },
  props: [],
  watch() {},
};
</script>

<style scoped>

</style>
