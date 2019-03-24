/**
 * Created by c on 2019/3/7.
 */
<template>
<div class="point-task-list">
  <panelContentHeader>
    <template>
      <el-input class="panel-content-header-input"
                placeholder="请输入点位名称"
                v-model="beaconNameLike"
      >
        <i slot="suffix" class="el-input__icon el-icon-search"
           @click="getTaskListByPoint"></i>
      </el-input>
    </template>
  </panelContentHeader>
  <!--列表-->
  <div v-content>
    <!--面板头部 筛选-->
    <el-row class="content-header p-t-10">
      <el-col :span="6" class="p-r-30">
        <info-item-ui
          title="项目"
          :label-width="80"
          last
          :font="14">
          <el-select v-model="projectId"  placeholder="全部项目"
                     @change="getDepList">
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
          <el-date-picker
            v-model="time"
            type="date"
            :clearable="false"
            value-format="timestamp"
            @change="getDepList"
            placeholder="选择日期">
          </el-date-picker>
        </info-item-ui>
      </el-col>
      <el-col :span="8" class="p-r-30">
        <info-item-ui
          title="选择部门"
          :label-width="80"
          last
          :font="14">
          <el-select v-model="deptIds"  placeholder="选择部门"
                     multiple
                     @change="getTaskListByPoint">
            <el-option
              v-for="item in depList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </info-item-ui>
      </el-col>
    </el-row>
    <!--面板头部 筛选 end-->
    <el-scrollbar v-table >
      <el-table
        :data="result.list"
        style="width: 100%">
        <el-table-column
          label="点位名称"
          prop="beaconName"
          width="300px"
        >
        </el-table-column>
        <el-table-column
          label="打点次数"
          class-name="main"
          prop="times"
          width="150px"
        >
        </el-table-column>

        <el-table-column
          prop="time"
          label="部门"
          width="500px"
        >
          <template slot-scope="scope">
            <div v-if="scope.row.deptNames.length < 2">
              {{scope.row.deptNames.join()}}
            </div>
            <el-popover trigger="hover" placement="bottom" v-else>
              {{scope.row.deptNames.join()}}
              <div slot="reference" class="name-wrapper">
                <div class="ellipsis" style="width: 480px">
                  {{scope.row.deptNames.join()}}
                </div>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          label="最近一次打点时间"
        >
          <template slot-scope="scope">
          {{scope.row.lastSearchTime ?
            $day(Number(scope.row.lastSearchTime)).format('YYYY/MM/DD HH:mm'):'无'}}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="120px"
        >
          <template slot-scope="scope">
            <div class="control-item">
              <router-link
                :to="{name:'pointTaskDetail',
                params:{
                 beaconId:scope.row.beaconId,
                 projectId: projectId,
                 time: time
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
  </div>
  <!--列表 end-->
</div>
</template>
<script>
export default{
  name: 'point-task-list',
  components: {},
  data() {
    return {
      beaconNameLike: '', // 点位名称
      time: new Date().getTime(), // 开始日期
      projectArr: [], // 项目列表
      projectId: '', // 项目id
      currentPage: 1, // 当前页数
      deptIds: [], // 选中的部门id
      result: {
        list: [], // 列表
      },
      depList: [], // 部门列表
    };
  },
  methods: {
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
            this.getDepList();
          }
        });
    },
    /**
     *  根据点位查询任务
     *
     * */
    getTaskListByPoint() {
      this.$http.post(this.api.taskApi.pointDailyList, {
        projectId: this.projectId,
        pageNum: this.currentPage, // 当前页
        pageSize: 10,
        time: this.time, // 开始时间
        deptIds: this.deptIds, // 部门id
        beaconNameLike: this.beaconNameLike,
      })
        .then((res) => {
          if (res) {
            this.result = res;
            this.result.list.forEach((item) => {
              item.deptNames = item.deptNames && item.deptNames.split(',');
            });
          }
        });
    },
    /**
     * 根据项目id 和开始时间
     * 查询部门
     *
     * */
    getDepList() {
      this.deptIds = [];
      this.$http.post(this.api.taskApi.depPointList, {
        projectId: this.projectId,
        time: this.time,
      })
        .then((res) => {
          if (res) {
            this.depList = res;
          }
          this.getTaskListByPoint();
        });
    },
    /**
     * 切换分页
     *
     * */
    handleCurrentChange(val) {
      this.currentPage = val;
    },
  },
  mounted() {
    this.getProjectList(); // 查询项目列表
  },
};
</script>

<style lang="less" type="text/less" scoped>

</style>
