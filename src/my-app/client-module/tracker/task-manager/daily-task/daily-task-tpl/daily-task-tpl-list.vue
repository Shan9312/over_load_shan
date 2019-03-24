/**
 * Created by c on 2019/1/22.
 */
<template>
<div class="daily-task-tpl-list">
  <panelContentHeader>
    <el-input class="panel-content-header-input"  placeholder="请输入模板名称" v-model="searchName">
      <i slot="suffix" class="el-input__icon el-icon-search" @click="getTaskTplList"></i>
    </el-input>
    <el-dropdown trigger="click" class="m-l-20 m-r-10" @command="addStaticTask">
            <el-button type="primary" size="medium">
              新建固定岗<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item :command="child"
                          v-for="child in taskTypeAddList"
                          :key="child.id"
                          v-if="child.basicTaskType === '4'"
        >{{child.name}}</el-dropdown-item>
        <el-dropdown-item
          v-if="taskTypeAddList.filter(v => v.basicTaskType === '4').length === 0"
          :disabled="taskTypeAddList.filter(v => v.basicTaskType === '4').length === 0"
        >暂无数据</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-dropdown trigger="click" @command="addRouteTask">
      <el-button type="primary" size="medium" >
        新建巡视任务<i class="el-icon-arrow-down el-icon--right"></i>
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item :command="child"
                          v-for="child in taskTypeAddList"
                          :key="child.id"
                          v-if="child.basicTaskType === '3'"
        >{{child.name}}</el-dropdown-item>
        <el-dropdown-item
          v-if="taskTypeAddList.filter(v => v.basicTaskType === '3').length === 0"
          :disabled="taskTypeAddList.filter(v => v.basicTaskType === '3').length === 0"
        >暂无数据</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </panelContentHeader>
  <div v-content>
    <!--面板头部 筛选-->
    <el-row class="content-header p-t-10">
      <el-col :span="6" class="p-r-30">
        <info-item-ui
          title="项目"
          :label-width="80"
          :font="14">
          <el-select v-model="projectId"  placeholder="全部项目"
                     @change="getTaskTplList">
            <el-option
              v-for="item in projectArr"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </info-item-ui>
      </el-col>
      <el-col :span="6" class="p-r-30">
        <info-item-ui
          title="任务类型"
          :label-width="80"
          :font="14">
          <el-select v-model="taskType"
                     multiple
                     collapse-tags
                     placeholder="全部类型"
                     @change="getTaskTplList">
            <el-option
              v-for="item in taskTypeList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </info-item-ui>
      </el-col>
    </el-row>
    <!--面板头部 筛选 end-->
    <!--列表-->
    <el-scrollbar v-table>
      <el-table
        :data="result.list"
        style="width: 100%">
        <el-table-column
          label="状态"
        >
          <template slot-scope="scope">
            <div class="task-ui">
              <span v-if="scope.row.valid === '0'" class="status-gray">停用中</span>
              <span v-else class="status-yellow">实施中</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="任务名称"
          class-name="main"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.basicTaskType === '3'">{{scope.row.routeName}}</span>
            <span v-if="scope.row.basicTaskType === '4'">{{scope.row.staticName}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="职能"
          width="180"
        >
          <template slot-scope="scope">
            <div v-if="scope.row.positionList.length < 2">
              {{scope.row.positionList.map(v => v.positionName).join()}}
            </div>
            <el-popover trigger="hover" placement="bottom" v-else>
              {{scope.row.positionList.map(v => v.positionName).join()}}
              <div slot="reference" class="name-wrapper">
                <div class="ellipsis" style="width: 150px">
                  {{scope.row.positionList.map(v => v.positionName).join()}}
                </div>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          label="任务类型"
          prop="bizTaskTypeName"
        >
        </el-table-column>
        <el-table-column
          label="任务描述"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.basicTaskType === '3'">{{scope.row.routeContent}}</span>
            <span v-if="scope.row.basicTaskType === '4'">{{scope.row.staticContent}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="点位数量"
        >
          <template slot-scope="scope">
            {{scope.row.beaconList.length}}
          </template>
        </el-table-column>
        <el-table-column
          prop="userName"
          label="创建人"
        >
        </el-table-column>
        <el-table-column
          label="最近修改时间"
        >
          <template slot-scope="scope">
            {{$day(Number(scope.row.updateAt)).format('YYYY/MM/DD')}}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="240"
        >
          <template slot-scope="scope">
            <div class="control-item">
              <router-link
                :to="{name:'dailyTaskTplEdit',
                 params:{bizTaskTypeId:scope.row.bizTaskTypeId,
                 type: scope.row.basicTaskType === '4'? 'static': 'route',
                  projectId: projectId,
                  taskId: scope.row.id  }}">
                <el-button  size="small" plain>编辑</el-button>
              </router-link>
                <el-button
                  size="small"
                  plain
                  @click="editItem(scope.row)">{{scope.row.valid === '1'? '停用': '启用'}}</el-button>
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
    <!--列表 end-->
  </div>
</div>
</template>
<script>
export default{
  name: 'daily-task-tpl-list',
  components: {},
  data() {
    return {
      searchName: '', // 模糊搜索名称
      projectId: '', // 项目id
      projectArr: [], // 项目列表
      taskType: [], // 任务类型已选中
      taskTypeList: [], // 任务类型 仅供查询使用
      taskTypeAddList: [], // 任务类型 仅供新增使用
      result: {
        list: [],
      },
      currentPage: 1, // 当选页数
    };
  },
  methods: {
    /**
     * 新建固定岗任务
     *
     * */
    addStaticTask(item) {
      this.$router.push({ name: 'dailyTaskTplAdd',
        params: { bizTaskTypeId: item.id, type: 'static', projectId: this.projectId } });
    },
    /**
     * 新建巡视任务
     *
     * */
    addRouteTask(item) {
      this.$router.push({ name: 'dailyTaskTplAdd',
        params: { bizTaskTypeId: item.id, type: 'route', projectId: this.projectId } });
    },
    /**
     * 停用 启用
     *
     * */
    editItem(item) {
      const url = item.basicTaskType === '4' ? this.api.taskApi.staticValid : this.api.taskApi.routeValid;
      this.$http.post(url, { taskId: item.id, valid: item.valid === '1' ? 0 : 1 })
        .then((res) => {
          if (res) {
            this.getTaskTplList();
          }
        });
    },
    /**
     * 查询模板列表
     *
     * */
    getTaskTplList() {
      this.$http.post(this.api.taskApi.dailyTaskList, {
        basicTaskType: null, // 路径岗3 巡视岗4
        bizTaskTypeIds: this.taskType, // 业务任务类型
        lv: 1, // 母任务1 子任务2
        pageIndex: this.currentPage, //
        projectId: this.projectId,
        pageSize: 10,
        valids: [0, 1],
        searchName: this.searchName, // 任务名称 任务描述 执行人
      })
        .then((res) => {
          if (res) {
            this.result = res;
            this.getTaskType();
          }
        });
    },
    /**
     * 切换分页 重新获取列表
     *
     * */
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getTaskTplList();
    },
    /**
     * 查询项目列表
     */
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
          if (!this.projectId) {
            this.projectId = this.projectArr[0].id;
            this.getTaskTplList();
            this.getTaskType();
          }
        });
    },
    /**
     * 获取项目包含的任务类型
     * 仅供查询使用
     *
     * */
    getTaskType() {
      this.$http.post(this.api.taskApi.getType, { projectId: this.projectId })
        .then((res) => {
          if (res) {
            this.taskTypeList = res.list.filter(v => v.basicTaskType === '3' || v.basicTaskType === '4');
            this.getTaskTypeByUser();
          }
        });
    },
    /**
     * 查询登录人员的任务权限
     * 新增任务或者报事使用
     *
     * */
    getTaskTypeByUser() {
      this.$http.post(this.api.taskApi.getAddType,
        { projectId: this.projectId,
          userId: this.$store.state.user.info.id,
          basicTaskTypes: [3, 4] })
        .then((res) => {
          this.taskTypeAddList = res;
        });
    },
  },
  mounted() {
    this.getProjectList();
  },
};
</script>

<style lang="less" type="text/less" scoped>
  .task-ui{
    span{
      padding: 0 25px;
      border-radius: 25px;
      justify-content: center;
      font-size: 12px;
      height: 22px;
      display: inline-flex;
      align-items: center;
      min-width: 90px;
      margin-right: 10px;
    }
    .status-yellow{
      color: #ff9900;
      background-color: #fdf6ec;
    }
    .status-gray{
      background-color: @ornament-dark-light;
    }
  }
</style>
