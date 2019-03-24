<template>
  <div class="seer-list">
    <panelContentHeader>
      <template>
        <el-input class="panel-content-header-input"  placeholder="请输入模型名称" v-model="nameLike">
          <i slot="suffix" class="el-input__icon el-icon-search" @click="selectPeopleName"></i>
        </el-input>
      </template>
    </panelContentHeader>
    <div v-content class="seer-content" >
      <!--项目搜索-->
      <el-row>
        <el-col :span="6">
          <info-item-ui title="项目" :label-width="60" :font="14">
            <el-select v-model="projectId"  placeholder="选择项目"
                       >
              <el-option
                v-for="item in projectArr"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </info-item-ui>
        </el-col>
      </el-row>
      <!--项目搜索-->
      <el-scrollbar tag="div" v-table>
        <el-table
          :data="result.list"
          style="width: 100%"
        >
          <el-table-column
            prop="modelName"
            class-name="main"
            label="模型名称">
          </el-table-column>
          <el-table-column
            prop="name"
            class-name="main"
            label="关联空间">
          </el-table-column>
          <el-table-column
            prop="propName"
            label="空间属性">
            <template slot-scope="scope">
              <div @click="getProjectListByRoleID(scope.row.id)"
                   class="cursor">
                {{scope.row.propName?scope.row.propName:'暂无'}}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="categoryName"
            label="空间类型">
            <template slot-scope="scope">
              <div @click="getProjectListByRoleID(scope.row.id)"
                   class="cursor">
                {{scope.row.categoryName?scope.row.categoryName:'暂无'}}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <div class="control-item">
                <el-button  size="small" plain @click="editModleName(scope.row)">编辑</el-button>
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
    <!--编辑空间弹框-->
    <el-dialog
      title="编辑空间"
      :visible.sync="dialogVisible"
      width="30%">
      <el-form
      :model="formObj"
      label-position="right"
      ref="forms"
      label-width="80px"
      :rules="rules"
      class="forms">
        <el-form-item
          prop="modelName"
          label="模型名称">
          <el-input v-model="formObj.modelName"></el-input>
        </el-form-item>
        <el-form-item label="关联空间">
          <el-input v-model="formObj.spaceName" disabled ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmModel">确 定</el-button>
      </span>
    </el-dialog>
    <!--编辑空间弹框end-->
  </div>
</template>

<script>
export default {
  name: 'seer-list',
  data() {
    return {
      formObj: {
        modelName: '',
        spaceName: '',
        id: '',
        square: '',
      }, // 编辑弹框
      rules: {
        modelName: [
          { required: true, message: '请输入模型名称', trigger: 'blur' },
        ],
      },
      nameLike: null, // 人员名称
      projectId: null, // 选择项目
      projectIds: null, // 非介谷用户 项目ids
      projectArr: [], // 项目列表
      dialogVisible: false, // 项目数量打开
      currentPage: 1, // 默认第一个
      result: {
        list: [],
      },
      projectList: [], // 项目列表
      userList: [], // 使用人数
      title: '',
      category: this.$store.state.router.category, // 判断是否是 介谷- 非介谷人员
    };
  },
  methods: {
    /**
    *点击确认 修改空间模型名称
    *
    * */
    confirmModel() {
      this.$refs.forms.validate((valid) => {
        if (valid) {
          this.$http.post(this.api.spaceApi.confirmModleName, this.formObj)
            .then((res) => {
              if (res) {
                this.$message.success('编辑成功');
                this.dialogVisible = false;
                this.getSeerList();
              }
            });
        } else {
          this.$message.error('请完善信息');
        }
      });
    },
    /**
    *
    * 点击编辑 模型名称
    * */
    editModleName(obj) {
      this.dialogVisible = true;
      this.formObj.spaceName = obj.name;
      this.formObj.square = obj.square;
      this.formObj.id = obj.id;
      this.formObj.modelName = obj.modelName;
    },
    /**
     * 选择项目 查看 模型列表
     *
     * */
    selectProjectList(val) {
      this.projectId = val;
      this.getSeerList();
    },
    /**
     * 根据名子搜索 列表
     *
     * */
    selectPeopleName() {
      this.getSeerList();
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
          this.projectId = res.list[0].id;
          this.getSeerList();
        });
    },
    /**
     *查询模型列表
     *
     * */
    getSeerList() {
      this.$http.post(this.api.spaceApi.getSeerList, {
        modelName: this.nameLike,
        projectId: this.projectId, // 项目的id this.projectId
        pageIndex: this.currentPage,
        pageSize: 10,
        ids: null,
        valid: null,
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
      this.getSeerList();
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
  },
  created() {
    this.getProjectList(); // 查询项目列表
  },
  mounted() {
  },
  computed: {
  },
  watch: {
    nameLike() {
      this.currentPage = 1;
      this.getSeerList();
    },
    projectId() {
      this.currentPage = 1;
      this.getSeerList();
    },
  },
};
</script>

<style scoped type="text/less" lang="less">
  .seer-list{
  }
</style>

