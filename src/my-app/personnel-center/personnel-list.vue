<template>
  <div class="personnel-list">
    <panelContentHeader>
      <template>
        <el-input class="panel-content-header-input"  placeholder="请输入人员名称" v-model="nameLike">
            <i slot="suffix" class="el-input__icon el-icon-search" @click="selectPeopleName"></i>
        </el-input>
        <el-button
          size="medium"
          type="primary"
          class="m-l-15"
          @click="goAddPersonnel">新增人员</el-button>
      </template>
    </panelContentHeader>
    <div v-content >
      <!--项目搜索-->
        <el-row>
          <el-col :span="12">
          <span>项目</span>
          <span class="select-box">
            <el-select v-model="projectId" clearable placeholder="全部"
            @change="selectProjectList">
            <el-option
              v-for="item in projectArr"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          </span>
          </el-col>
        </el-row>
      <!--项目搜索-->
      <el-scrollbar tag="div" v-table>
        <el-table
          :data="result.list"
          style="width: 100%"
        >
          <el-table-column
            prop="name"
            class-name="main"
            label="姓名">
          </el-table-column>
          <el-table-column
            prop="loginName"
            label="登录名 ">
          </el-table-column>
          <el-table-column
            prop="phone"
            label="手机">
          </el-table-column>
          <el-table-column
            prop="projectAmount"
            :visible.sync="dialogVisible"
            class-name="main"
            label="项目数量">
            <template slot-scope="scope">
              <div @click="getProjectListByRoleID(scope.row.id)"
                   class="cursor">
                {{scope.row.projectAmount}}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <div class="control-item">
                <router-link
                  :to="{name:'personnelEdit',params:{id:scope.row.id}}">
                  <el-button  size="small" plain>编辑</el-button>
                </router-link>
                <router-link
                  :to="{name:'personnelDetails',params:{id:scope.row.id}}">
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
      <el-dialog
        title="项目"
        :visible.sync="dialogVisible"
      >
        <el-scrollbar tag="div" >
          <el-table
            :data="projectList"
            style="width: 100%">
            <el-table-column
              prop="projectName"
              label="项目名称"
              class-name="main"
              width="250"
            >
            </el-table-column>
            <el-table-column
              prop="positionName"
              label="职位名称"
            >
              <template slot-scope="scope">
                <div>
                 {{scope.row.positionName? scope.row.positionName: '暂无'}}
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-scrollbar>
        <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false" size="small" plain>返 回</el-button>
      </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  name: 'personnel-list',
  data() {
    return {
      nameLike: null, // 人员名称
      projectId: null, // 选择项目
      projectIds: null, // 非介谷用户 项目ids
      projectArr: [], // 项目列表
      dialogVisible: false, // 项目数量打开
      currentPage: 1, // 默认第一个
      result: {
        list: [], // 权限列表
      },
      projectList: [], // 项目列表
      userList: [], // 使用人数
      title: '',
      category: this.$store.state.router.category, // 判断是否是 介谷- 非介谷人员
    };
  },
  methods: {
    /**
       * 选择项目 查看 人员列表
       *
       * */
    selectProjectList(val) {
      if (val) {
        this.projectIds = null;
        console.log(val, this.projectIds);
      } else {
        this.projectIds = [];
        this.projectArr.forEach((obj) => {
          this.projectIds.push(obj.id);
        });
      }
      this.getPersonnelList();
    },
    /**
     * 根据名子搜索 列表
     *
     * */
    selectPeopleName() {
      this.getPersonnelList();
    },
    /**
     * 查询项目列表
     * */
    getProjectList() {
      this.$http.post(this.api.projectApi.projectList, {
        pageIndex: 1,
        pageSize: 9999,
        searchName: '',
        status: null,
        unStatus: null,
      })
        .then((res) => {
          this.projectArr = res.list;
          if (this.category === '2') {
            this.projectIds = [];
            this.projectArr.forEach((obj) => {
              this.projectIds.push(obj.id);
            });
            this.getPersonnelList(); // 查询角色列表
          } else {
            this.projectIds = null;
            this.getPersonnelList(); // 查询角色列表
          }
        });
    },
    /**
     *查询人员列表
     *
     * */
    getPersonnelList() {
      this.$http.post(this.api.personnelApi.getPersonnelList, {
        pageIndex: this.currentPage,
        pageSize: 10,
        nameLike: this.nameLike,
        projectId: this.projectId, // 项目的id
        projectIds: this.projectIds, // 非介谷用户的 所有项目id 集合
        ids: null,
        category: 2, // 1介谷用户 2普通用户
      }).then((res) => {
        this.result = res;
      });
    },
    /**
     * 切换分页
     *
     * */
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getPersonnelList();
    },
    /**
     *根据人员ID 查询项目列表
     *
     * */
    getProjectListByRoleID(id) {
      this.dialogVisible = true;
      this.$http.get(this.api.personnelApi.getPersonnelDetails, {
        params: {
          userId: id,
        },
      }).then((res) => {
        this.projectList = res.accounts;
      });
    },
    /**
     * 跳转到新增人员页面
     *
     *
     * */
    goAddPersonnel() {
      this.$router.push({ name: 'personnelAdd' });
    },
  },
  created() {
    this.getProjectList(); // 查询项目列表
  },
  computed: {
  },
  watch: {
    nameLike() {
      this.currentPage = 1;
      this.getPersonnelList();
    },
    projectId() {
      this.currentPage = 1;
      this.getPersonnelList();
    },
  },
};
</script>

<style scoped type="text/less" lang="less">
.personnel-list{
  .line{
    padding:0 5px;
  }
  // 项目
  .panel-content{
    .select-box{
      width: 300px;
      margin-left: 10px;
    }
  }
}
</style>

