<template>
  <div class="role-list tables assets-list ">
    <panelContentHeader>
      <template>
        <el-input class="panel-content-header-input"
                  placeholder="请输入资产名称"
                  v-model="nameLike"
        >
          <i slot="suffix" class="el-input__icon el-icon-search"
             @click="getAssetsListByName"></i>
        </el-input>
        <el-button
          size="medium"
          type="primary"
          class="m-l-15"
          @click="assetsRouter"
        >新建资产</el-button>
        <el-button
          size="medium"
          type="primary"
          class="m-l-15"
          @click="isShowBtn=!isShowBtn"
        >更多操作</el-button>
        <div v-if="isShowBtn" class="editBtn">
          <el-button
            plain
            @click="delSpace"
          >删除</el-button>
        </div>
      </template>
    </panelContentHeader>
    <div v-content >
      <!--项目搜索-->
      <div style="margin-bottom:20px;">
        <el-form ref="form" label-width="80px">
          <el-row :gutter="20" >
            <el-col :span="6">
              <el-form-item label="项目" >
                <el-select v-model="projectId" clearable placeholder="全部"
                           @change="selectProjectList">
                  <el-option
                    v-for="item in projectArr"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                class="inline-form-choice"
                label="空间">
                <el-input disabled placeholder="请选择空间" v-model="spacePathName"
                style="margin-top: 4px;"></el-input>
                <el-button size="mini" @click="moveSpace">选择</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="资产设备" >
                <el-select  placeholder="请选择资产设备" v-model="assetsId" @change="assetsCategory">
                  <el-option v-for="item in assetsCate"
                             :key="item.id"
                             :label="item.name"
                             :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <!--项目搜索-->
      <el-scrollbar tag="div" v-table>
        <el-table
          :data="result.list"
          style="width: 100%"
        >
          <el-table-column
            prop="name"
            class-name="main"
            label="资产名称">
            <template slot-scope="scope">
              <div class="assets-name">
                <span>
                    <el-checkbox v-model="scope.row.checked"></el-checkbox>
                </span>
                <span class="space-name">
                    <img class="assets-img assets-icon"
                    v-if="scope.row.category === '1'"
                    src="../../assets/img/space/assets_1.png"/>
                    <img class="facitiy-img assets-icon" v-else
                    src="../../assets/img/space/assets_2.png"/>
                  <span class="assets-name-th">
                                        {{scope.row.name}}

                  </span>
                </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="assetCode"
            class-name="main"
            label="编号"
          >
          </el-table-column>
          <el-table-column
            prop="categoryName"
            class-name="main"
            label="类型 ">
          </el-table-column>
          <el-table-column
            prop="projectName"
            class-name="main"
            label="项目">
          </el-table-column>
          <el-table-column
            prop="projectSpaceName"
            class-name="main"
            label="空间">
            <template slot-scope="scope">
              <i class="el-icon-warning"
                v-if="scope.row.space_valid === -1"
               style="color:red;margin-right: 5px;"></i>
              <span :class="{'redColor': scope.row.space_valid === -1}">
              {{scope.row.projectSpaceName}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <div class="control-item">
                <router-link
                  :to="{name:'assetsEdit',params:{id:scope.row.id}}">
                  <el-button  size="small" plain>编辑</el-button>
                </router-link>
                <router-link
                  :to="{name:'assetsDetails',params:{id:scope.row.id}}">
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
          @current-change="handleCurrentChange(currentPage)"
          :current-page.sync="currentPage"
          :total="result.total"
          >
        </el-pagination>
      </div>
    </div>
    <!--删除资产弹框-->
    <div class="delBox">
      <el-dialog
        :visible.sync="delVisible"
        width="30%">
        <span class="title"><i class="el-icon-warning icon-warning"></i>是否删除该资产</span>
        <p class="content">资产删除后无法恢复，请确认！</p>
        <span slot="footer" class="dialog-footer">
          <el-button @click="delVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmDelete">确 定</el-button>
          </span>
      </el-dialog>
    </div>
    <!--删除资产弹框end-->
    <!--移动分组弹窗-->
    <space-move :data="data"
    :projectName="projectName"
    :spaceVisible="spaceVisible"
     @getNodeTree="getNodeTree"
     @handleClose="handleClose">
    </space-move>
    <!--移动分组弹窗end-->
  </div>
</template>

<script>
import spaceMove from '../../components/common/dialog-space-move/space-move';

export default {
  name: 'assets-list',
  components: { spaceMove },
  data() {
    return {
      spacePathName: '', // 选择空间的路径
      assetsId: 3, // 资产项目
      spaceId: '', // 空间
      isShowBtn: false, // 操作更多
      nameLike: '', // 搜索名字
      dialogVisibleUser: false, // 使用人数打开
      dialogVisible: false, // 项目数量打开
      currentPage: 1, // 默认第一个
      result: {
        list: [], // 权限列表
      },
      projectList: [], // 项目列表
      userList: [], // 使用人数
      title: '',
      projectId: '', // 项目id
      projectArr: [],
      assetsCate: [
        { id: 1, name: '设备' },
        { id: 2, name: '设施' },
        { id: 3, name: '全部' },
      ], // 资产设备类型
      delVisible: false, // 删除弹框
      spaceVisible: false, // 空间弹框
      spaceArrChoose: [], // 选择移动空间的id
      assetsArrChoose: [], // 选择移动资产的id
      spaceIds: [], //
      assetsIds: [], //
      data: [],
      projectName: '', // 项目名称
      moveSpaceObj: {},
      spacePid: '',
      levelList: [], // tree值
      categoryIds: [1, 2], // 资产设备ids
    };
  },
  methods: {
    /**
    *点击查看
    *
    * */
    detailAssets(val) {
      const isShow = 2;
      this.$cookie.set('isShowSpace', isShow);
      this.$router.push({
        name: 'assetsDetails',
        params: {
          id: val,
        },
      });
    },
    /**
     *点击空间描述 搜索框
     *
     * */
    getAssetsListByName() {
      this.getAssetsList();
    },
    /**
    *选择资产设备
    *
    * */
    assetsCategory(val) {
      this.categoryIds = [];
      if (val === 3) {
        this.categoryIds = [1, 2];
      } else {
        this.categoryIds.push(val);
      }
      this.getAssetsList();
    },
    /**
    *获取选定的空间节点 给显示框
    *
    * */
    getNodeTree(val) {
      this.spacePathName = val.path;
      this.spacePid = val.id;
      this.spaceVisible = false;
      this.getAssetsList();
    },
    /**
    *取消按钮
    *
    * */
    handleClose(val) {
      this.spaceVisible = val;
    },
    /**
    *点击调转资产新增
    *
    * */
    assetsRouter() {
      this.$router.push({
        name: 'assetsAdd',
      });
    },
    /**
     * 选择项目 查看 资产列表
     *
     * */
    selectProjectList(id) {
      this.projectId = id;
      this.spacePathName = '';
      this.spacePid = null;
      this.getAssetsList();
    },
    /**
     *点击移动 弹框出现 空间列表
     *
     * */
    spaceFormat() {
      this.$http.get(this.api.spaceApi.spaceFormat, { params: { projectId: this.projectId,
      } }).then((res) => {
        this.data = JSON.parse(JSON.stringify(res));
      });
    },
    /**
     * 点击移动空间
     *
     * */
    moveSpace() {
      if (this.projectId) {
        this.spaceVisible = true;
        this.spaceFormat();
      } else {
        this.$message.error('请先选择项目');
      }
    },
    /**
     * 判断是否选中 数组集合
     *
     * */
    isCheckSpace() {
      this.assetsArrChoose = this.result.list.filter(item => item.checked);
      if (this.assetsArrChoose.length <= 0) {
        this.$message.error('请选择资产设备');
        return false;
      }
      return true;
    },
    /**
     *获取空间 和 资产 混合的集合 获取id
     *
     * */
    getIds() {
      if (this.assetsArrChoose.length) {
        this.assetsArrChoose.forEach((obj) => {
          this.assetsIds.push(obj.id);
        });
      }
    },
    /**
     * 确认删除/ 批量删除资产
     *
     * */
    confirmDelete() {
      if (this.isCheckSpace()) {
        this.getIds();
        this.$http.post(this.api.spaceApi.deleteSpace, {
          asset_ids: this.assetsIds,
          space_ids: null,
        })
          .then((res) => {
            if (res) {
              this.$message.success('资产删除成功');
            }
            this.getAssetsList();
            this.delVisible = false;
          });
      }
    },
    /**
     * 点击删除空间
     *
     * */
    delSpace() {
      if (this.isCheckSpace()) {
        this.delVisible = true;
      }
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
        });
    },
    /**
     *查询资产列表
     *
     * */
    getAssetsList() {
      this.$http.post(this.api.assetsApi.getAssetsList, {
        valid: 1,
        nameLike: this.nameLike, // 搜索名称
        pageIndex: this.currentPage,
        pageSize: 10,
        projectId: this.projectId, // 项目id
        projectSpaceId: this.spacePid, // 空间的 id
        categoryIds: this.categoryIds, // 资产设备, 1; 设备 2,设施 ,1,2 全部
      }).then((res) => {
        res.list.forEach((child) => {
          child.checked = false;
        });
        this.result = res;
      });
    },
    /**
     * 切换分页
     *
     * */
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getAssetsList();
    },
    /**
     *根据角色ID 查询项目列表
     *
     * */
    getProjectListByRoleID(id) {
      this.dialogVisible = true;
      this.$http.get(this.api.roleApi.getProjectListById, {
        params: {
          roleId: id,
        },
      }).then((res) => {
        this.projectList = res;
      });
    },
    /**
     *根据角色ID 查询使用人数列表
     *
     * */
    getUserListByRoleID(id) {
      this.dialogVisibleUser = true;
      this.$http.get(this.api.roleApi.getUserListById, {
        params: {
          roleId: id,
        },
      }).then((res) => {
        this.userList = res;
      });
    },
  },
  created() {
    this.getProjectList(); // 查询项目列表
  },
  mounted() {
    this.getAssetsList(); // 查询资产列表
  },
  computed: {
  },
  watch: {
    projectId() {
      this.currentPage = 1;
      this.getAssetsList();
    },
    spaceId() {
      this.currentPage = 1;
      this.getAssetsList();
    },
    assetsId() {
      this.currentPage = 1;
      this.getAssetsList();
    },
  },
};
</script>

<style scoped type="text/less" lang="less">
  .assets-list{
    .redColor{
      color:red;
    }
    .editBtn{
      margin-left:10px;
    }
    .point{
      cursor: pointer;
    }
    .line{
      padding:0 5px;
    }
    .assets-name{
      span{
        display: inline-flex;
        align-items: center;
      }
      .space-name{
        cursor: pointer;
        margin-left:10px;
      }
      .assets-name-th{
        width: 120px;
      }
      i{
        display: inline-block;
        width: 36px;
        height: 36px;
        margin-right: 60px;
        .background-position(-10, -385)
      }
    }
  }
</style>
