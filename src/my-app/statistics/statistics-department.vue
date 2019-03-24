/**
 * Created by c on 2019/2/21.
 */
<template>
<div class="statistics-department">
  <panelContentHeader>
    <template>
      <!--切换-->
      <div class="bg-white m-l-15">
        <el-select v-model="trackerTimeValue">
          <el-option
            v-for="item in timeList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <date-picker
        class="times"
        @getData="getDataType1"
        :type="trackerTimeValue">
      </date-picker>
      <span>至</span>
      <date-picker
        class="times"
        @getData="getDataType2"
        :type="trackerTimeValue">
      </date-picker>
      <!--月,周,年查询-->
      <el-button
        size="medium"
        type="primary"
        class="m-l-15"
        @click="handleGetDetail"
      >确定</el-button>
    </template>
  </panelContentHeader>
  <div class="statistics-department-content">
    <!--滑动部门列表-->
      <swiper :options="swiperOption" class="department-list">
        <swiper-slide v-for="(item,index) in deptArr" :key="item.deptId">
          <div class="department-item"
               @click="chooseDep(item, index)"
               :class="{'active': departmentActiveId === item.deptId }">
            <div class="name">
              <span>{{item.deptName}}</span>
              <span><img src="../../assets/img/icon-department.jpg" alt=""/></span>
            </div>
            <div class="progress-item">
              <div class="header">
                <span>产生任务</span>
                <span>{{item.createTotalCount}}</span>
              </div>
              <el-progress :percentage
              ="item.createTotalCount | dateFormat(item.completeTotalCount)"
                           color="#1779e6"
                           :stroke-width="6" :show-text="false"></el-progress>
            </div>
            <div class="progress-item">
              <div class="header">
                <span>完成任务</span>
                <span>{{item.completeTotalCount }}</span>
              </div>
              <el-progress :percentage=
                             "item.completeTotalCount | dateFormat(item.createTotalCount)"
                           color="#1779e6"
                           :stroke-width="6" :show-text="false"></el-progress>
            </div>
          </div>
        </swiper-slide>
        <div class="swiper-button-prev swiper-button-white" slot="button-prev"></div>
        <div class="swiper-button-next swiper-button-white" slot="button-next"></div>
      </swiper>
    <!--滑动部门列表-->
    <!--当前选中的部门-->
    <div class="tracker-charts">
      <el-row>
        <el-col :span="18" class="p-r-25">
          <div class="title">
            <span>当前选择部门任务数量趋势</span>
          </div>
          <div class="tip">{{whichDay}} 数量趋势(件任务）</div>
          <div class="charts" id="myChart"></div>
        </el-col>
        <el-col :span="6" class="p-l-25 department">
          <div class="title">
            <p>
              <span>{{activeData.calendarName}}</span>
              <span>{{type ===1 ?'产生任务':'完成任务'}}</span>
            占比</p>
          </div>
          <div class="progress" v-if="type === 2">
            <div class="progress-item">
              <div class="header">
                <div class="num">{{activeData.completeTotalCount}}</div>
                <div class="name">
                  <span>任务总数</span>
                  <span class="percentage">100%
                    <!--<img src="../../assets/img/icon-arrow-success.jpg" alt=""/>-->
                    </span>
                </div>
              </div>
              <el-progress :percentage="activeData.completeTotalCount? 100 : 0"
                           :stroke-width="8" :show-text="false"></el-progress>
            </div>
            <div class="progress-item">
              <div class="header">
                <div class="num">{{activeData.patrolCompleteCount}}</div>
                <div class="name">
                  <span>日常类</span>
                  <span class="percentage">
               {{ activeData.patrolCompleteCount | percentFormat(activeData.completeTotalCount) }}%
                    <!--<img src="../../assets/img/icon-arrow-error.jpg" alt=""/>-->
                    </span>
                </div>
              </div>
              <el-progress :percentage
              ="activeData.patrolCompleteCount | percentFormat(activeData.completeTotalCount)"
                           color="#e34748"
                           :stroke-width="8" :show-text="false"></el-progress>
            </div>
            <div class="progress-item">
              <div class="header">
                <div class="num">{{activeData.temporaryCompleteCount}}</div>
                <div class="name">
                  <span>临时类</span>
                  <span class="percentage">
              {{activeData.temporaryCompleteCount | percentFormat(activeData.completeTotalCount)}}%
                    <!--<img src="../../assets/img/icon-arrow-warming.jpg" alt=""/>-->
                    </span>
                </div>
              </div>
              <el-progress :percentage
              ="activeData.temporaryCompleteCount | percentFormat(activeData.completeTotalCount)"
                           :stroke-width="8" color="#f6b422" :show-text="false"></el-progress>
            </div>
            <div class="progress-item">
              <div class="header">
                <div class="num">{{activeData.planCompleteCount}}</div>
                <div class="name">
                  <span>计划类</span>
                  <span class="percentage">
              {{activeData.planCompleteCount | percentFormat(activeData.completeTotalCount) }} %
                    <!--<img src="../../assets/img/icon-arrow-success.jpg" alt=""/>-->
                    </span>
                </div>
              </div>
              <el-progress :percentage
              ="activeData.planCompleteCount | percentFormat(activeData.completeTotalCount)"
                           :stroke-width="8" :show-text="false"></el-progress>
            </div>
          </div>
          <div class="progress" v-else>
            <div class="progress-item">
              <div class="header">
                <div class="num">{{Number(activeData.createTotalCount)}}</div>
                <div class="name">
                  <span>任务总数</span>
                  <span class="percentage">100%
                    <!--<img src="../../assets/img/icon-arrow-success.jpg" alt=""/>-->
                    </span>
                </div>
              </div>
              <el-progress :percentage="activeData.createTotalCount? 100 : 0"
                           :stroke-width="8" :show-text="false"></el-progress>
            </div>
            <div class="progress-item">
              <div class="header">
                <div class="num">{{Number(activeData.patrolCreateCount)}}</div>
                <div class="name">
                  <span>日常类</span>
                  <span class="percentage">
                    {{activeData.patrolCreateCount | percentFormat(activeData.createTotalCount)}} %
                    <!--<img src="../../assets/img/icon-arrow-error.jpg" alt=""/>-->
                    </span>
                </div>
              </div>
              <el-progress :percentage
               ="activeData.patrolCreateCount | percentFormat(activeData.createTotalCount)"
                           color="#e34748"
                           :stroke-width="8" :show-text="false"></el-progress>
            </div>
            <div class="progress-item">
              <div class="header">
                <div class="num">{{activeData.temporaryCreateCount}}</div>
                <div class="name">
                  <span>临时类</span>
                  <span class="percentage">
                    {{
                     activeData.temporaryCreateCount | percentFormat(activeData.createTotalCount)
                    }} %
                    <!--<img src="../../assets/img/icon-arrow-warming.jpg" alt=""/>-->
                    </span>
                </div>
              </div>
              <el-progress :percentage
              ="activeData.temporaryCreateCount | percentFormat(activeData.createTotalCount)"
                           :stroke-width="8" color="#f6b422" :show-text="false"></el-progress>
            </div>
            <div class="progress-item">
              <div class="header">
                <div class="num">{{activeData.planCreateCount}}</div>
                <div class="name">
                  <span>计划类</span>
                  <span class="percentage">
                    {{
                     activeData.planCreateCount | percentFormat(activeData.createTotalCount)
                    }} %
                    <!--<img src="../../assets/img/icon-arrow-success.jpg" alt=""/>-->
                    </span>
                </div>
              </div>
              <el-progress :percentage
                ="activeData.planCreateCount | percentFormat(activeData.createTotalCount)"
                           :stroke-width="8" :show-text="false"></el-progress>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <!--当前选中的部门 end-->
    <!--当前周期完成任务-->
    <div class="task-list m-t-20" v-content>
      <div class="header">
        <span>
          当前周期完成任务
        </span>
        <span v-if="type === 1">
          <el-button plain size="mini"
          @click="searchTask(1)"
          :class="{'choose': taskBtnIndex === 1}">
            <span>日常类</span>
            <span>{{activeData.patrolCreateCount}}件</span>
          </el-button>
          <el-button plain size="mini"
                     @click="searchTask(2)"
           :class="{'choose': taskBtnIndex === 2}">
            <span>临时类</span>
            <span>{{activeData.temporaryCreateCount}}件</span>
          </el-button>
          <el-button plain size="mini"
                     @click="searchTask(3)"
           :class="{'choose': taskBtnIndex === 3}">
            <span>计划类</span>
            <span>{{activeData.planCreateCount}}件</span>
          </el-button>
        </span>
        <span v-else>
          <el-button plain size="mini"
            @click="searchTask(1)"
           :class="{'choose': taskBtnIndex === 1}">
            <span>日常类</span>
            <span>{{activeData.patrolCompleteCount}}件</span>
          </el-button>
          <el-button plain size="mini"
                     @click="searchTask(2)"
           :class="{'choose': taskBtnIndex === 2}">
            <span>临时类</span>
            <span>{{activeData.temporaryCompleteCount}}件</span>
          </el-button>
          <el-button plain size="mini"
                     @click="searchTask(3)"
           :class="{'choose': taskBtnIndex === 3}">
            <span>计划类</span>
            <span>{{activeData.planCompleteCount}}件</span>
          </el-button>
        </span>
      </div>
      <div v-if="taskBtnIndex === 2 || taskBtnIndex === 3">
        <el-table
          :data="result.list"
          key="table1"
        >
          <el-table-column
            prop="modelName"
            class-name="main"
            label="状态">
            <template slot-scope="scope">
              <task-btn-ui :num="Number(scope.row.temporaryStatus)"></task-btn-ui>
            </template>
          </el-table-column>
          <el-table-column
            prop="userName"
            class-name="main"
            label="发布人">
          </el-table-column>
          <el-table-column
            prop="temporaryContent"
            label="任务详情">
          </el-table-column>
          <el-table-column
            prop="taskNo"
            label="任务编号">
          </el-table-column>
          <el-table-column
            prop="bizTaskTypeName"
            label="任务类型">
          </el-table-column>
          <el-table-column
            prop="positionList"
            label="负责人职能">
            <template slot-scope="scope">
            <span v-for="son in scope.row.positionList"
                  :key="son.position">{{son.positionName}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="temporaryPlaceName"
            label="位置">
          </el-table-column>
          <el-table-column
            label="创建时间">
            <template slot-scope="scope">
              {{$day(Number(scope.row.belongCreateDt)).format('YYYY/MM/DD')}}
            </template>
          </el-table-column>
          <el-table-column
            label="完成时间">
            <template slot-scope="scope">
              {{scope.row.belongCompleteDt?
              $day(Number(scope.row.belongCompleteDt)).format('YYYY/MM/DD'):
              '无'}}
            </template>
          </el-table-column>
          <el-table-column
            width="120px"
            label="操作">
            <template slot-scope="scope">
              <div class="control-item">
                <router-link
                  :to="{ name: 'taskDetail', params: { id: scope.row.id, projectId: projectId } }">
                  <el-button  size="small" plain >查看</el-button>
                </router-link>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-if="taskBtnIndex === 1">
         <el-table
           key="table2"
        :data="result.list">
        <el-table-column
          prop="userName"
          class-name="main"
          label="发布人">
        </el-table-column>
        <el-table-column
          label="完成情况">
          <template slot-scope="scope">
            <span
              v-if="scope.row.basicTaskType === '3'"
            >{{scope.row.routePatrolCountActual?
            scope.row.routePatrolCountActual:0}}/{{scope.row.routePatrolCount}}</span>
            <span v-else>
              {{
              parseInt(Number(scope.row.staticDutyMinuteActual/60))
              }}小时{{Number(scope.row.staticDutyMinuteActual) -
              parseInt(Number(scope.row.staticDutyMinuteActual/60))*60}}分钟</span>
          </template>
        </el-table-column>
         <el-table-column
          label="任务名称 ">
          <template slot-scope="scope">
            <span>{{scope.row.routeName?scope.row.routeName: scope.row.staticName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="bizTaskTypeName"
          label="任务类型">
        </el-table-column>
        <el-table-column
          prop="positionList"
          label="负责人职能">
          <template slot-scope="scope">
            <span v-for="son in scope.row.positionList"
                  :key="son.position">{{son.positionName}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="routeContent"
          label="任务备注">
        </el-table-column>
        <el-table-column
          label="创建时间">
          <template slot-scope="scope">
            {{$day(Number(scope.row.belongCreateDt)).format('YYYY/MM/DD')}}
          </template>
        </el-table-column>
        <el-table-column
          width="120px"
          label="操作">
          <template slot-scope="scope">
            <div class="control-item">
              <router-link
                :to="{ name: 'dailyTaskDetails',
                params: { id: scope.row.id, projectId: projectId, type: scope.row.basicTaskType} }">
                <el-button  size="small" plain >查看</el-button>
              </router-link>
            </div>
          </template>
        </el-table-column>
      </el-table>
      </div>
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
    <!--当前周期完成任务 end-->
  </div>
</div>
</template>
<script>
import DatePicker from '../../components/common/datepicker/date-picker-custom'; // 选择 周数 月份 和 年份


export default{
  name: 'statistics-department',
  components: { DatePicker },
  data() {
    return {
      currentPage: 1,
      startAtTime: '', // 固定岗查询开始日期
      result: { list: [], pageSize: 10 },
      timeRange: [],
      trackerTimeValue: JSON.parse(this.$cookie.get('timeObj')).queryType,
      departmentActiveId: null,
      departmentActiveIndex: 0,
      taskBtnIndex: 2,
      timeList: [
        { label: '按年查看', value: 'year' },
        { label: '按月查看', value: 'month' },
        { label: '按周查看', value: 'week' },
      ],
      swiperOption: {
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        slidesPerView: 5,
        spaceBetween: 20,
      },
      projectId: this.$route.params.id,
      deptArr: [],
      timeType: JSON.parse(this.$cookie.get('timeObj')),
      completeArr: [],
      unfinishedArr: [],
      startTime: '', // 开始时间时间戳
      endTime: '', // 结束时间时间戳
      type: 1,
      activeData: {
        calendarName: '',
        completeTotalCount: 0,
        createTotalCount: 0,
        patrolCompleteCount: 0,
        patrolCreateCount: 0,
        planCompleteCount: 0,
        planCreateCount: 0,
        routeCompleteCount: 0,
        routeCreateCount: 0,
        staticCompleteCount: 0,
        staticCreateCount: 0,
        temporaryCompleteCount: 0,
        temporaryCreateCount: 0,
      },
      activeName: '',
      numList: [],
      mounthList: [],
      taskType: [],
      sourceType: [],
      whichDay: '各月',
      maxNum: 600,
    };
  },
  methods: {
    /**
     * 处理queryType的类型
     * */
    formatType(type) {
      if (type === 'month') {
        this.whichDay = '各月';
        type = 2;
      } else if (type === 'year') {
        this.whichDay = '今年';
        type = 3;
      } else {
        this.whichDay = '每周';
        type = 1;
      }
      return type;
    },
    searchTask(v) {
      this.taskBtnIndex = v;
      this.getTaskDetail(this.activeData.startAt, this.activeData.endAt);
    },
    // 判断传送的了下
    isType() {
      if (this.taskBtnIndex === 2) {
        this.taskType = [1];
        this.sourceType = [0, 1];
      } else if (this.taskBtnIndex === 1) {
        this.taskType = [3, 4];
        this.sourceType = [];
      } else {
        this.taskType = [1];
        this.sourceType = [2];
      }
    },
    /**
    * 获取任务的详情列表
    *
    * */
    getTaskDetail(x, y) {
      this.isType();
      this.$http.post(this.api.statisticsApi.getTaskDetail, {
        basicTaskTypes: this.taskType,
        sourceTypes: this.sourceType,
        queryType: this.type,
        deptId: this.departmentActiveId, // 部门id
        dtEnd: y, // 结束
        dtStart: x, // 开始
        pageIndex: this.currentPage,
        pageSize: 10,
        projectId: this.projectId,
      }).then((res) => {
        this.result = res;
      });
    },
    /**
     * 选择部门
     *
     * */
    chooseDep(item, index) {
      this.departmentActiveIndex = index;
      this.departmentActiveId = item.deptId;
      this.drownChart(item.summaryCalendarList);
    },
    /**
    *点击确认查询日期的 详情dept
    *
    * */
    handleGetDetail() {
      if (this.isChoseData()) {
        this.getDataByPosition();
        this.formatType(this.trackerTimeValue);
      }
    },
    /**
     * 起始时间选择
     *
     * */
    getDataType1(value) {
      if (this.trackerTimeValue === 'week') {
        this.timeType.startIndex = value.weekNo;
        this.timeType.startYear = this.$day(Number(value.startAt)).format('YYYY');
        this.startTime = value.startAt;
      } else if (this.trackerTimeValue === 'month') {
        const times = this.$day(Number(value)).format('YYYY/M').split('/');
        this.timeType.startIndex = times[1];
        this.timeType.startYear = times[0];
        this.startTime = value;
      } else {
        this.timeType.startIndex = 0;
        this.timeType.startYear = this.$day(Number(value)).format('YYYY');
        this.startTime = value;
      }
    },
    /**
     * 结束时间选择
     *
     * */
    getDataType2(value) {
      if (this.trackerTimeValue === 'week') {
        this.timeType.endIndex = value.weekNo;
        this.timeType.endYear = this.$day(Number(value.startAt)).format('YYYY');
        this.endTime = value.startAt;
      } else if (this.trackerTimeValue === 'month') {
        const times = this.$day(Number(value)).format('YYYY/M').split('/');
        this.timeType.endIndex = times[1];
        this.timeType.endYear = times[0];
        this.endTime = value;
      } else {
        this.timeType.endIndex = 0;
        this.timeType.endYear = this.$day(Number(value)).format('YYYY');
        this.endTime = value;
      }
    },
    /**
    * 判断时间戳和周期的大小
    *
    * */
    isChoseData() {
      if (this.startTime > this.endTime) {
        this.$message.error('结束时间年份大于起始时间时，应为有效日期');
        return false;
      }
      return true;
    },
    /**
    * 获取职能的统计数据
    *
    * */
    getDataByPosition() {
      this.$http.post(this.api.statisticsApi.getDataByPosititon, {
        endIndex: this.timeType.endIndex,
        endYear: this.timeType.endYear,
        projectId: this.projectId,
        queryType: this.formatType(this.trackerTimeValue),
        startIndex: this.timeType.startIndex,
        startYear: this.timeType.startYear,
      }).then((res) => {
        this.deptArr = JSON.parse(JSON.stringify(res));
        if (this.deptArr.length > 0) {
          this.departmentActiveId = this.deptArr[0].deptId;
          this.drownChart(this.deptArr[0].summaryCalendarList);
        }
      });
    },
    /**
    * 点击对于的部门。获取对应的 任务数量，显示ecahrts
    *
    * */
    drownChart(arr) {
      this.activeData = {
        calendarName: '',
        completeTotalCount: 0,
        createTotalCount: 0,
        patrolCompleteCount: 0,
        patrolCreateCount: 0,
        planCompleteCount: 0,
        planCreateCount: 0,
        routeCompleteCount: 0,
        routeCreateCount: 0,
        staticCompleteCount: 0,
        staticCreateCount: 0,
        temporaryCompleteCount: 0,
        temporaryCreateCount: 0,
      };
      this.numList = JSON.parse(JSON.stringify(arr));
      this.mounthList
        = (this.numList.map(item => item.calendarName)).reverse();
      this.completeArr
        = (this.numList.map(item => item.completeTotalCount)).reverse();
      this.unfinishedArr
        = (this.numList.map(item => item.createTotalCount)).reverse();
      // 根据返回生产数量 来设置 echarts 的y
      if (this.trackerTimeValue === 'year') {
        this.maxNum = Number(this.numList[0].createTotalCount) + 100;
      } else {
        this.maxNum = this.maxByArr(this.unfinishedArr);
      }
      this.drawLine();
      if (arr && arr.length > 0) {
        this.activeData = this.numList[0];
        this.getTaskDetail(this.activeData.startAt, this.activeData.endAt);
      }
    },
    /**
     * 获取数组中最大值
     *
     * */
    maxByArr(arr) {
      const max = Math.max.apply(null, arr);
      return Number(max) + 100;
    },
    /**
     *画图echerts
     *
     * */
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      const myChart = this.$echarts.init(document.getElementById('myChart'));
      //
      const option = {
        legend: {
          type: 'plain',
          bottom: 0,
          left: 'center',
          selected: ['完成任务', '产生任务'],
        },
        tooltip: {},
        xAxis: [{
          type: 'category',
          data: this.mounthList, // x 坐标
          show: true, // 是否显示
        }],
        yAxis: {
          type: 'value',
          scale: true,
          name: '',
          max: this.maxNum - 100,
          min: 0,
          axisLine: {
            show: false, // 是否显示y 轴线
          },
        },
        series: [
          {
            name: '完成任务',
            type: 'bar',
            data: this.completeArr,
            itemStyle: { // 图形的形状
              color: '#377efe',
              barBorderRadius: [10, 10, 0, 0],
            },
          },
          {
            name: '产生任务',
            type: 'bar',
            data: this.unfinishedArr,
            itemStyle: { // 图形的形状
              color: '#65dbf9',
              barBorderRadius: [10, 10, 0, 0],
            },
          },
        ],
      };
      // 绘制图表
      myChart.setOption(option);
      myChart.on('click', (params) => {
        this.activeName = params.name;
        this.activeData = this.deptArr &&
        this.deptArr[this.departmentActiveIndex].summaryCalendarList.filter(
          item => item.calendarName === params.name)[0];
        this.type = params.seriesIndex === 1 ? 1 : 2;
        this.taskBtnIndex = 2;
        this.getTaskDetail(this.activeData.startAt, this.activeData.endAt);
      });
    },
    /**
     * 切换分页
     *
     * */
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getTaskDetail(this.activeData.startAt, this.activeData.endAt);
    },
  },
  created() {
    this.getDataByPosition();
  },
  filters: {
    dateFormat(key, val) {
      if (!key && !val) return 0;
      const percent = (Number(key) / (Number(key) + Number(val))).toFixed(2) * 100;
      return percent;
    },
    percentFormat(key, val) {
      if (!key || !val) return 0;
      const percent = Number(((Number(key) / Number(val)) * 100).toFixed(1));
      return percent;
    },
  },
  watch: {
    maxNum() {
      this.drawLine();
    },
  },
};
</script>

<style lang="less" type="text/less" scoped>
  .statistics-department{
    .times{
      margin: 0 10px;
    }
    .bg-white{
      background: #ffffff;
    }
    .department-list{
      padding: 0 20px;
      .swiper-button-prev,.swiper-button-next{
        background-color: rgba(0,0,0,.25);
        width: 30px;
        height: 68px;
        margin-top: -34px;
        background-size:20px, 44px;
      }
      .swiper-button-prev{
        left: 0;
      }
      .swiper-button-next{
        right: 0;
      }
    }
    .department-item{
      padding: 20px 30px;
      cursor: pointer;
      border-radius: 3px;
      background: #ffffff;
      transition: background-color .3s;
      &.active{
        background: linear-gradient(-148deg, #0d8cff,#9571fc);
        box-shadow: 0 2px 16px 0 rgba(56,82,238,.4);
        border-color: transparent;
        color: #ffffff;
        img{
          opacity: 0;
        }
        span{
          color: #ffffff !important;
        }
      }
      .name{
        display: flex;
        align-items: center;
        justify-content: space-between;
        span{
          font-size: 26px;
          img{
            width: 25px;
          }
        }
      }
      .progress-item{
        padding-top: 20px;
        .header{
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 5px;
          span{
            &:first-child{
              color: @secondary-color;
            }
          }
        }
      }
      .border;
    }
    .tracker-charts{
      margin-top: 20px;
      background: #ffffff;
      padding: 20px 30px 30px;
      .tip{
        opacity: .4;
        margin-top: 15px;
      }
      .title{
        display: flex;
        justify-content: space-between;
        span{
          &:first-child{
            font-size: 18px;
            font-weight: 500;
          }
          &.cursor{
            font-size: 14px;
            color: @main-blue;
          }
        }
      }
      .department{
        border-left: 1px solid @bottom-color;
        .progress{
          .progress-item{
            padding-top: 30px;
            .header{
              .num{
                font-size: 24px;
              }
              .name{
                display: flex;
                justify-content: space-between;
                color: @secondary-color;
                font-size: 12px;
                padding: 10px 0;
                .percentage{
                  font-size: 16px;
                  display: inline-flex;
                  align-items: center;
                }
                align-items: center;
              }
            }
          }
        }
      }
    }
    .task-list{
      .header{
        display: flex;
        font-size: 18px;
        align-items: center;
        justify-content: space-between;
        padding-bottom: 20px;
        .choose{
          background-color: #647fd8;
          color: #ffffff;
        }
      }
    }
    .charts{
      width: 100%;
      height: 400px;
    }
  }
</style>
