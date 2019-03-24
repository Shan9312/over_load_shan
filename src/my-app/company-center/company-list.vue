/**
* Created by c on 2018/5/30.
* 客户列表
*/
<template>
	<div class="company-list">
    <panelContentHeader>
      <template>
        <el-button
          size="medium"
          type="primary"
          class="m-l-15"
          @click="goAddCompany">新增客户</el-button>
      </template>
    </panelContentHeader>
    <div v-content>
      <el-scrollbar tag="div" v-table>
        <el-table
          :data="result.list"
          style="width: 100%">

          <el-table-column
            prop="companyCode"
            label="客户编号"
            >
          </el-table-column>
          <el-table-column
            prop="name"
            label="名称"
            class-name="main"
            >
          </el-table-column>
          <el-table-column
            label="省/市区"
            >
            <template slot-scope="scope">
              {{scope.row.zone.lv1Name}}
              {{scope.row.zone.lv2Name}}
            </template>
          </el-table-column>
          <el-table-column
            prop="address"
            label="相关项目"
          >
            <template slot-scope="scope">
              <div
              >
                <span
                      class="flex p-t-10"
                      v-for="(item,index) in scope.row.projectList"
                      :key="index">
                  {{item.name}}
                </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
          >
            <template slot-scope="scope">
              <div class="control-item">
                <router-link :to="{name:'companyEdit',params:{id:scope.row.id}}">
                  <el-button  size="small" plain>修改</el-button>
                </router-link>
                <router-link :to="{name:'companyDetails',params:{id:scope.row.id}}">
                  <el-button  size="small" plain>查看</el-button>
                </router-link>
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
  </div>
</template>
<script>
export default {
  name: 'company-list',
  components: {},
  data() {
    return {
      result: {
        list: [],
      },
      currentPage: 1,
    };
  },
  methods: {
    /**
     * 查询客户列表
     * */
    getCompanyList() {
      this.$http.post(this.api.companyApi.companyList, {
        pageNum: this.currentPage,
        pageSize: 10,
        searchName: '',
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
      this.getCompanyList();
    },
    /**
     * 新增客户
     *
     * */
    goAddCompany() {
      this.$router.push({ name: 'companyAdd' });
    },
  },
  mounted() {
    this.getCompanyList();
  },
};
</script>

<style lang="less" type="text/less" scoped>

</style>
