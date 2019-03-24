/**
 * Created by c on 2019/1/18.
 */
<template>
<div class="daily-task-list">
  <panelContentHeader>
    <template>
      <el-input class="panel-content-header-input"
                placeholder="请输入任务名称"
                v-model="searchName"
      >
        <i slot="suffix" class="el-input__icon el-icon-search"
           @click="getDailyList"></i>
      </el-input>
    </template>
  </panelContentHeader>
  <div v-content class="daily-task-content">
     <!--固定岗切换tab 每日 每周 每月-->
    <transition name="slider">
      <div class="header-tab" v-if="switchValue">
        <span class="tab-item"
              :key="index"
              @click="chooseTab(index)"
              :class="{'active-tab': activeTabIndex === index}"
              v-for="(item,index) in tabList"
        >{{item.name}}</span>
      </div>
    </transition>
     <!--固定岗切换tab 每日 每周 每月 end-->
     <!--面板头部 筛选-->
      <el-row class="content-header p-t-10">
        <el-col :span="6" class="p-r-30">
          <info-item-ui
            title="项目"
            :label-width="80"
            last
            :font="14">
            <el-select v-model="projectId"  placeholder="全部项目"
                       @change="getDailyList">
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
            title="选择日期"
            :label-width="80"
            last
            :font="14">
            <date-picker
              v-if="switchValue"
              @getData="getData"
              :type="tabList[activeTabIndex].key"></date-picker>
            <el-date-picker
              v-model="startAtTime"
              type="date"
              value-format="timestamp"
              @change="getDailyList"
              v-else
              placeholder="选择日期">
            </el-date-picker>
          </info-item-ui>
        </el-col>
        <el-col :span="6" class="p-r-30">
          <info-item-ui
            title="任务类型"
            :label-width="80"
            last
            :font="14">
            <el-select v-model="taskType"
                       multiple
                       collapse-tags
                       placeholder="全部类型"
                       @change="getDailyList">
              <el-option
                v-for="item in taskTypeList"
                :key="item.id"
                v-if=" switchValue &&  item.basicTaskType === '3'"
                :label="item.name"
                :value="item.id">
              </el-option>
              <el-option
                v-for="item in taskTypeList"
                :key="item.id"
                v-if=" !switchValue &&  item.basicTaskType === '4'"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </info-item-ui>
        </el-col>
      </el-row>
     <!--面板头部 筛选 end-->
    <!--列表-->
    <el-scrollbar v-table v-if="showTable">
      <el-table
        :data="result.list"
        style="width: 100%">
        <el-table-column
          label="状态"
        >
          <template slot-scope="scope">
            <status-ui
              :num="Number(scope.row.routeStatus)" v-if="switchValue"></status-ui>
            <status-ui
              :num="Number(scope.row.staticStatus)" v-else></status-ui>
          </template>
        </el-table-column>
        <el-table-column
          label="执行人"
          width="180px"
        >
          <template slot-scope="scope">
            <div v-if="scope.row.userList.length < 2">
              {{scope.row.userList.map(v => v.userName).join()}}
            </div>
            <el-popover trigger="hover" placement="bottom" v-else>
              {{scope.row.userList.map(v => v.userName).join()}}
              <div slot="reference" class="name-wrapper">
                <div class="ellipsis" style="width: 150px">
                  {{scope.row.userList.map(v => v.userName).join()}}
                </div>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          label="完成次数"
          class-name="main"
          v-if="switchValue"
        >
          <template slot-scope="scope">
          {{scope.row.routePatrolCountActual?
            scope.row.routePatrolCountActual:0}}/{{scope.row.routePatrolCount}}
          </template>
        </el-table-column>
        <el-table-column
          label="有效时长"
          class-name="main"
          v-else
        >
          <template slot-scope="scope">
            <span>
              {{
              parseInt(Number(scope.row.staticDutyMinuteActual/60))
              }}小时{{Number(scope.row.staticDutyMinuteActual) -
              parseInt(Number(scope.row.staticDutyMinuteActual/60))*60}}分钟</span>
          </template>
        </el-table-column>
        <el-table-column
          label="任务名称"
          class-name="main"
        >
          <template slot-scope="scope">
            <span v-if="switchValue">{{scope.row.routeName}}</span>
            <span v-else>{{scope.row.staticName}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="time"
          label="任务类型"
        >
          <template slot-scope="scope">
            <span>{{scope.row.bizTaskTypeName}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="time"
          label="职能"
          width="180px"
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
          prop="time"
          label="任务描述"
        >
          <template slot-scope="scope">
            <span v-if="switchValue">{{scope.row.routeContent}}</span>
            <span v-else>{{scope.row.staticContent}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
        >
          <template slot-scope="scope">
            <div class="control-item">
              <router-link
                :to="{name:'dailyTaskDetails',
                params:{id:scope.row.id,
                 projectId: projectId,
                 type: scope.row.basicTaskType
                  }}">
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
    <!--列表 end-->
  </div>
</div>
</template>
<script>
import statusUi from '../../../../../components/ui/task-tpl-ui';
import DatePicker from '../../../../../components/common/datepicker/date-picker-custom'; // 选择 周数 月份 和 年份

export default{
  name: 'daily-task-list',
  components: { statusUi, DatePicker },
  data() {
    return {
      searchName: '',
      currentPage: 1,
      activeTabIndex: 0, // 巡视岗tabIndex
      projectId: '', // 项目id
      projectArr: [], // 项目列表
      taskTypeList: [], // 任务类型
      taskType: [], // 选中的任务类型
      startAtTime: '', // 固定岗查询开始日期
      tabList: [
        { name: '每日任务', key: 'day' },
        { name: '每周任务', key: 'week' },
        { name: '每月任务', key: 'month' },
      ],
      showTable: false,
      result: {
        list: [],
      },
    };
  },
  methods: {
    /**
     * 获取选择的时间
     *
     * */
    getData(value) {
      if (this.activeTabIndex === 1) {
        // 选择的是周 按周选择 子组件传递回来的是对象 包含周开始的时间戳
        this.startAtTime = value ? value.startAt : '';
      } else {
        this.startAtTime = value;
      }
      this.getDailyList();
    },
    /**
     * 切换tab
     *
     * */
    chooseTab(index) {
      if (this.activeTabIndex !== index) {
        this.activeTabIndex = index;
        this.getDailyList();
      }
    },
    /**
     * 切换分页
     *
     * */
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getDailyList();
    },
    /**
     * 查询日常任务列表
     *
     * */
    getDailyList() {
      this.showTable = false;
      this.$http.post(this.api.taskApi.dailyTaskList, {
        basicTaskType: this.switchValue ? 3 : 4, // 路径岗3 巡视岗4
        bizTaskTypeIds: this.taskType, // 业务任务类型
        lv: 2, // 母任务1 子任务2
        pageIndex: this.currentPage, //
        projectId: this.projectId,
        pageSize: 10,
        period: this.switchValue ? this.activeTabIndex + 1 : '', // 周期 巡视岗的时候 按照日 周 月 传 1 2 3
        searchName: this.searchName, // 任务名称 任务描述 执行人
        startAtDay: this.startAtTime, // 开始时间 如果是月、周 请选第一天的时间戳
      })
        .then((res) => {
          if (res) {
            this.result = res;
            this.showTable = true;
            this.getTaskType();
          }
        });
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
            this.getDailyList();
          }
        });
    },
    getTaskType() {
      this.$http.post(this.api.taskApi.getType, { projectId: this.projectId })
        .then((res) => {
          if (res) {
            this.taskTypeList = res.list.filter(v => v.basicTaskType === '3' || v.basicTaskType === '4');
          }
        });
    },
  },
  watch: {
    switchValue() {
      this.getDailyList();
      this.taskType = [];
    },
  },
  computed: {
    switchValue() {
      // true: 固定岗 false: 巡视岗 路径岗
      return this.$store.state.routerSwitch;
    },
  },
  mounted() {
    this.getProjectList();
  },
};
</script>

<style lang="less" type="text/less" scoped>
  .daily-task-list{
    .daily-task-content{
      position: relative;
      .header-tab{
        position: absolute;
        left: 0;
        top: -40px;
        .tab-item{
          width: 190px;
          height: 0;
          border-bottom: 40px solid #ececed;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          text-align: center;
          margin-left: -10px;
          transition: all .3s;
          z-index: 1;
          line-height: 40px;
          cursor: pointer;
          position: relative;
          &:first-child{
            margin-left: 0;
          }
          &.active-tab{
            z-index: 99;
            border-bottom-color: #ffffff;
          }
        }
      }
    }
  }
</style>
