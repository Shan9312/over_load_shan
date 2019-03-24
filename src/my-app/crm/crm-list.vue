<template>
  <div class="crm-list tables " v-content>
          <el-scrollbar tag="div" v-table>
            <el-table
              :data="result.list"
              style="width: 100%">
              <el-table-column
                label="操作"
                width="180">
                <template slot-scope="scope">
                  <div class="control-item">
                    <router-link
                      :to="{name:'crmEdit',params:{id:scope.row.id}}">
                      <el-button  size="small" plain>修改</el-button>
                    </router-link>
                    <router-link
                      :to="{name:'crmDetails',params:{id:scope.row.id}}">
                      <el-button  size="small" plain>查看</el-button>
                    </router-link>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="name"
                label="姓名"
                >
              </el-table-column>
              <el-table-column
                prop="positionName"
                label="职位"
                >
              </el-table-column>
              <el-table-column
                prop="phone1"
                label="联系电话"
                >
              </el-table-column>
              <el-table-column
                prop="relationLv"
                label="关系等级"
                >
              </el-table-column>
              <el-table-column
                label="相关客户"
                >
                <template slot-scope="scope">
                  <div
                    v-for="(item,index) in scope.row.customerList"
                    :key="index"
                  >
                    {{item.name}}
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                label="相关项目"
              >
                <template slot-scope="scope">
                  <div
                    v-for="(item,index) in scope.row.projectList"
                    :key="index"
                  >
                    {{item.name}}
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </el-scrollbar>
          <div class="pagination">
            <el-pagination
              background
              layout="prev, pager, next"
              :page-size="result.pageSize"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :total="result.total">
            </el-pagination>
          </div>
    </div>
</template>

<script>
export default {
  name: 'crm-list',
  data() {
    return {
      currentPage: 1,
      result: {
        list: [],
      },
    };
  },
  methods: {
    /**
     * 查询crm联系人
     * */
    getCrmList() {
      this.$http.post(this.api.crmApi.getCrmList, {
        pageNum: this.currentPage,
        pageSize: 10,
        searchName: this.$eventBus.input,
      })
        .then((res) => {
          this.result = res;
        });
    },
    /**
     * 切换分页
     *
     * */
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getCrmList();
    },
  },
  watch: {
    input() {
      this.currentPage = 1;
      this.getCrmList();
    },
  },
  computed: {
    input() {
      return this.$eventBus.input;
    },
  },
  mounted() {
    this.getCrmList();
  },
};
</script>

<style  lang="less" type="text/less" scoped>
</style>
