/**
* Created by c on 2018/6/5.
*/
<template>
  <div class="project-list">
    <panelContentHeader>
      <template>
      </template>
    </panelContentHeader>
    <div v-content >
      <el-scrollbar tag="div" v-table>
        <el-table
          :data="result.list"
        >
          <el-table-column
            label="项目状态"
            width="120">
            <template slot-scope="scope">
              <grade-ui :num="scope.row.status"></grade-ui>
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="项目名称"
            width="120">
          </el-table-column>
          <el-table-column
            prop="projectCode"
            label="项目编号"
            width="180">
          </el-table-column>
          <el-table-column
            prop="projectEvent"
            label="当前动作方"
            width="120">
            <template slot-scope="scope">
              <div v-if="scope.row.projectEvent">
                <span v-if="scope.row.projectEvent.actionType == 1">
                  介谷方
                </span>
                <span v-if="scope.row.projectEvent.actionType == 2">
                  客户方
                </span>
                <span v-if="scope.row.projectEvent.actionType == 3">
                  第三方
                </span>
              </div>
              <div v-else>
                暂无
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="personChargeName"
            label="当前负责人"
            width="120">
          </el-table-column>
          <el-table-column
            label="省市/区"
            width="120">
            <template slot-scope="scope">
              <span v-if="scope.row.zone">
                {{scope.row.zone.lv1Name}}/{{scope.row.zone.lv2Name}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="project"
            label="产品"
            width="180">
          </el-table-column>

          <el-table-column
            prop="date"
            label="操作"
            width="360"
            >
            <template slot-scope="scope">
              <div class="control-item">
                <router-link :to="{name:'operationDeploy',params:{id:scope.row.id}}">
                  <el-button  size="small" plain>项目功能配置</el-button>
                </router-link>
                <router-link :to="{name:'operationOrganize',params:{id:scope.row.id}}">
                  <el-button  size="small" plain>组织架构配置</el-button>
                </router-link>
                <router-link :to="{
                name:'operationEdit',
                params:{id:scope.row.id},
                query:{url: $route.name}}">
                  <el-button  size="small" plain>修改</el-button>
                </router-link>
                <router-link :to="{name:'operationDetail',params:{id:scope.row.id}}">
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
import gradeUi from '../../components/ui/grade-ui';

export default {
  name: 'project-list',
  components: { gradeUi },
  data() {
    return {
      currentPage: 1,
      result: { list: [] },
    };
  },

  methods: {
    /**
     *
     * 点击添加项目
     * */
    goAddProject() {
      this.$router.push({ path: '/project/project-add' });
    },
    /**
     * 查询项目列表
     * */
    getProjectList() {
      this.$http.post(this.api.projectApi.projectList, {
        pageIndex: this.currentPage,
        pageSize: 10,
        searchName: null,
        status: 5,
        unStatus: null })
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
      this.getProjectList();
    },
  },
  created() {
    this.getProjectList();
  },
};
</script>

<style lang="less" type="text/less" scoped>

</style>
