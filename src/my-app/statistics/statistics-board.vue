/**
 * Created by c on 2019/2/20.
 */
<template>
<div class="statistics-board">
  <div class="statistics-board-header">
    <span class="name font-20 m-r-30">{{projectName}}</span>
    <span class="choose cursor font-14" @click="dialogVisible = true">切换项目</span>
  </div>
  <div class="statistics-board-content">
    <!--基本信息-->
    <el-row>
      <el-col :span="12" class="p-r-10">
        <div v-content class="p-t-20">
          <img :src="projectInfo.background" class="project-img" alt=""/>
          <div class="p-t-15 p-b-15">基础信息</div>
          <el-row>
            <el-col :span="8">
              <info-item-ui
              :font="16"
              :label-width="60"
              align="top"
              :bottom="10"
              title="业态">
                <yetai-ui :num="projectInfo.yetai"></yetai-ui>
              </info-item-ui>
            </el-col>
            <el-col :span="8">
              <info-item-ui
                :font="16"
                :label-width="80"
                align="top"
                :bottom="10"
                title="占地面积">
                {{projectInfo.floorArea ? projectInfo.floorArea: '暂无'}}
              </info-item-ui></el-col>
            <el-col :span="8">
              <info-item-ui
                :font="16"
                :label-width="80"
                align="top"
                :bottom="10"
                title="商户数量">
                134家
              </info-item-ui></el-col>
            <el-col :span="8">
              <info-item-ui
                :font="16"
                :label-width="60"
                align="top"
                :bottom="0"
                title="面积">
                {{projectInfo.buildingArea? `${projectInfo.buildingArea}平方米`: '暂无'}}
              </info-item-ui></el-col>
            <el-col :span="8">
              <info-item-ui
                :font="16"
                :label-width="80"
                align="top"
                :bottom="0"
                title="收费面积">
                {{projectInfo.chargeArea?  `${projectInfo.chargeArea}平方米`: '暂无'}}
              </info-item-ui></el-col>
            <el-col :span="8">
              <info-item-ui
                :font="16"
                :label-width="80"
                align="top"
                :bottom="0"
                title="详细地址">
                <div class="ellipsis">
                  {{projectInfo.address? projectInfo.address: '暂无'}}
                </div>
              </info-item-ui></el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :span="12" class="p-l-10">
        <div v-content>
          最新公告
          <div class="bulletin">
            <div class="flex flex-justify-between header">
              <span class="title">{{btnType.title}}</span>
              <span class="time">{{btnType.updateAt}}</span>
            </div>
            <div class="content">
              {{btnType.content? btnType.content : '暂无数据'}}
            </div>
            <router-link v-if="btnType.content"
              :to="{name: 'bulletinBoardDetails',params: { id: btnType.id },query: { type: 1 }}">
              <div class="more" >查看详情</div>
            </router-link>
          </div>
        </div>
        <div v-content class="latest-news m-t-8">
          <div class="header">
            <span>最新消息 <b class="num">{{num}}</b></span>
            <span class="more cursor" @click="handleGetMoreList">
              更多
            <i class="el-icon-d-arrow-right"></i>
            </span>
          </div>
          <el-row class="content" style="height: 148px">
            <el-col :span="8" class="p-r-7" v-for="child in userMsgList" :key="child.id">
              <div class="item">
                <div class="item-header">
                  <span>{{child.title}}</span>
                  <span class="time">{{child.pushAt}}</span>
                </div>
                <p class="item-content">
                  {{child.content}}
                </p>
                <div class="more" v-if="isShowDetail.indexOf(Number(child.msgType)) > -1"
                 @click="handleReady(child.id,child.targetId, child.msgType)">查看信息</div>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
    <!--基本信息 end-->
    <!--tracker 任务统计-->
    <div class="tracker-panel" v-if="showEcherts">
      <div class="panel-title">Tracker任务统计</div>
      <div class="num-item-list m-b-15">
        <div class="num-item">
          <div class="item-label">总人数</div>
          <div class="item-num">{{trackerTaskNum.peopleNum}}</div>
          <img src="../../assets/img/statistics/icon-statistics-1.jpg" alt=""/>
        </div>
        <div class="num-item">
          <div class="item-label">今日新增任务数</div>
          <div class="item-num">{{trackerTaskNum.tempTaskNum}}</div>
          <img src="../../assets/img/statistics/icon-statistics-2.jpg" alt=""/>
        </div>
        <div class="num-item">
          <div class="item-label">今日完成任务数</div>
          <div class="item-num">{{trackerTaskNum.tempFinishedNum}}</div>
          <img src="../../assets/img/statistics/icon-statistics-3.jpg" alt=""/>
        </div>
        <div class="num-item">
          <div class="item-label">今日报事数</div>
          <div class="item-num">{{trackerTaskNum.reportTaskNum}}</div>
          <img src="../../assets/img/statistics/icon-statistics-4.jpg" alt=""/>
        </div>
        <div class="num-item">
          <div class="item-label">今日处理报事数</div>
          <div class="item-num">{{trackerTaskNum.reportDealtNum}}</div>
          <img src="../../assets/img/statistics/icon-statistics-5.jpg" alt=""/>
        </div>
      </div>
      <!--各月任务数量趋势-->
      <div class="tracker-charts">
        <el-row>
          <el-col :span="18" class="p-r-25">
            <div class="title">
              <span>{{whichDay}} 任务数量趋势</span>
              <span>
                <el-select v-model="trackerTimeValue" @change="handleChangeDate">
                  <el-option
                    v-for="item in timeList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </span>
            </div>
            <div class="charts" id="myChart"></div>
          </el-col>
          <el-col :span="6" class="p-l-25 department">
            <div class="title">
              <p>
                <span>{{activeData.calendarName}}</span>
                <span>{{type ===1 ?'产生任务':'完成任务'}}</span>
                占比</p>
              <!--<router-link :to="{ name: 'statisticsDepartment', params: {id: projectId}}">-->
                <span class="cursor" @click="handleRouter">查看各部门详情</span>
              <!--</router-link>-->
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
                    <span class="percentage">
                      100%
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
      <!--各月任务数量趋势 end-->
    </div>
    <!--tracker 任务统计 end-->
  </div>
  <!--弹框项目选项-->
  <el-dialog
    title="切换项目"
    :visible.sync="dialogVisible"
  >
    <el-scrollbar tag="div" style="height: 300px" >
      <div class="project-box">
        <el-radio-group v-model="projectId">
          <el-radio :label="item.id"
            @change="handleChangePro(item)"
           v-for="item in projectArr" :key="item.id">{{item.name}}</el-radio>
        </el-radio-group>
      </div>
    </el-scrollbar>
    <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false" size="small" plain>取消</el-button>
          <el-button @click="Confirm" size="small"  type="primary">确认</el-button>
    </span>
  </el-dialog>
</div>
</template>
<script>
export default{
  name: 'statistics-board',
  components: {},
  data() {
    return {
      type: 1, // 2 是完成任务， 1 是产生任务
      dialogVisible: false,
      trackerTimeValue: 2,
      timeList: [
        { label: '按年查看', value: 3 },
        { label: '按月查看', value: 2 },
        { label: '按周查看', value: 1 },
      ],
      userId: this.$cookie.get('userId'),
      userMsgList: [],
      num: 0, // 消息的数量
      projectArr: [],
      projectId: '',
      projectName: '',
      activeProject: {},
      showEcherts: true,
      result: [],
      btnType: {},
      projectInfo: {},
      trackerTaskNum: {},
      numList: [],
      monthList: [],
      completeArr: [], // 完成数据
      unfinishedArr: [], // 未完成数据
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
      maxNum: 600,
      timeObj: {},
      whichDay: '各月',
      isShowDetail: [101, 102, 103, 105, 108, 109, 104, 106], // 是否显示查看详情页面
    };
  },
  methods: {
    /**
    * 显示月 周 年的 类型处理
    *
    * */
    formeatType() {
      switch (this.trackerTimeValue) {
        case 1:
          this.timeObj.queryType = 'week';
          this.whichDay = '每周';
          break;
        case 2:
          this.timeObj.queryType = 'month';
          this.whichDay = '各月';
          break;
        case 3:
          this.timeObj.queryType = 'year';
          this.whichDay = '今年';
          break;
        default:
          this.timeObj.queryType = 'month';
          this.whichDay = '各月';
      }
    },
    /**
    * 查看各部门详情
    *
    * */
    handleRouter() {
      this.timeObj = {
        endIndex: this.numList[0].index,
        startIndex: this.numList[this.numList.length - 1].index,
        endYear: this.numList[0].year,
        startYear: this.numList[this.numList.length - 1].year,
      };
      this.formeatType();
      this.$cookie.set('timeObj', JSON.stringify(this.timeObj));
      this.$router.push({ name: 'statisticsDepartment', params: { id: this.projectId } });
    },
    /**
     * 点击确定选定的项目
     * */
    Confirm() {
      this.projectName = this.activeProject.name;
      this.projectId = this.activeProject.id;
      this.dialogVisible = false;
      this.trackerTimeValue = 2;
      this.getUserMsg(); // 最新消息
      this.getLeftMsg(); // 项目详情
      this.getList(); // 获取公告栏列表
      this.getEchartsByProject(); // 根据项目统计
      this.$cookie.set('projectId', this.projectId);
    },
    /**
     *项目统计图
     *
     * */
    getEchartsByProject() {
      this.$http.post(this.api.statisticsApi.getEchartsByProject, {
        offset: 12,
        projectId: this.projectId,
        queryType: this.trackerTimeValue,
      }).then((res) => {
        if (res) {
          this.showEcherts = true;
          this.$nextTick(() => {
            this.numList = JSON.parse(JSON.stringify(res));
            this.monthList = (this.numList.map(item => item.calendarName)).reverse();
            this.completeArr = (this.numList.map(item => item.completeTotalCount)).reverse();
            this.unfinishedArr = (this.numList.map(item => item.createTotalCount)).reverse();
            this.drawLine();
            if (this.trackerTimeValue === 3) {
              this.maxNum = Number(this.numList[0].createTotalCount) + 100;
            } else {
              this.maxNum = this.maxByArr(this.unfinishedArr);
            }
            if (!this.activeName) {
              this.activeData = this.numList[0];
            }
          });
        } else {
          this.showEcherts = false;
        }
      });
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
          data: this.monthList, // x 坐标
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
        this.activeData
        = this.numList && this.numList.filter(item => item.calendarName === params.name)[0];
        this.type = params.seriesIndex === 1 ? 1 : 2;
      });
    },
    /**
    *切换日期 handleChangeDate
    *
    * */
    handleChangeDate(v) {
      this.trackerTimeValue = v;
      this.formeatType();
      this.getEchartsByProject();
    },
    /**
    * 获取基础信息
    *
    * */
    getLeftMsg() {
      this.$http.get(this.api.statisticsApi.getTaskMsg, {
        params: {
          projectId: this.projectId,
        },
      }).then((res) => {
        this.projectInfo = res.projectInfo;
        this.trackerTaskNum = res.taskStatisticSummary;
      });
    },
    /**
     *点击前往时候 需要更改消息状态
     *
     * */
    handleReady(id, taskId, msgType) {
      const arr = [];
      arr.push(id);
      this.$http.post(this.api.statisticsApi.editMsgStatus, arr).then((res) => {
        if (res) {
          if (Number(msgType) === 104 || Number(msgType) === 106) {
            this.$router.push({ name: 'matterDetail', params: { id: taskId, projectId: this.projectId } });
          } else {
            this.$router.push({ name: 'taskDetail', params: { id: taskId, projectId: this.projectId } });
          }
        }
      });
    },
    /**
     * 获取公告栏列表
     *
     * */
    getList() {
      this.$http.post(this.api.bulletinApi.list, { projectId: this.projectId })
        .then((res) => {
          if (res) {
            this.result = [];
            res.list.forEach((item) => {
              item.updateAt = item.updateAt === null ? '暂无' : this.$day(Number(item.updateAt)).format('YYYY/MM/DD');
            });
            this.result = res.list.filter(v => v.valid === '2');
            if (this.result.length) {
              this.btnType = this.result[0];
            } else {
              this.btnType = {};
            }
          }
        });
    },
    /**
    *切换项目
    *
    * */
    handleChangePro(val) {
      this.activeProject = val;
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
          // 获取项目列表 默认选第一个去请求空间列表
          if (!this.projectId) {
            this.projectId = this.projectArr[0].id;
          }
          const item = this.projectArr.filter(obj => obj.id === this.projectId);
          this.projectName = item[0].name;
          this.getList();
          this.getLeftMsg();
          this.getEchartsByProject();
          this.getUserMsg();
        });
    },
    /**
    *查询最新消息列表
    *
    * */
    getUserMsg() {
      const obj = {
        projectId: this.projectId,
        status: 1,
        userId: this.userId,
      };
      this.$http.post(this.api.statisticsApi.getUserMsgList, obj)
        .then((res) => {
          this.userMsgList = [];
          this.num = res.list.length;
          res.list.forEach((item) => {
            item.pushAt = item.pushAt === null ? '暂无' : this.$day(Number(item.pushAt)).format('YYYY/MM/DD');
            if (item.status === '1') {
              this.userMsgList.push(item);
              this.userMsgList = this.userMsgList.splice(0, 3);
            }
          });
        });
    },
    /**
    *点击更多
    * */
    handleGetMoreList() {
      this.$router.push({ name: 'messageList', params: { id: this.projectId } });
    },
    /**
    * 获取数组中最大值
    *
    * */
    maxByArr(arr) {
      const max = Math.max.apply(null, arr);
      return Number(max) + 100;
    },
  },
  watch: {
    maxNum() {
      this.drawLine();
    },
  },
  computed: {
  },
  created() {
    this.getProjectList();
    this.projectId = this.$cookie.get('projectId');
  },
  mounted() {
  },
  filters: {
    percentFormat(key, val) {
      if (!key || !val) return 0;
      const percent = Number(((Number(key) / Number(val)) * 100).toFixed(1));
      return percent;
    },
  },
};
</script>

<style lang="less" type="text/less" scoped>
.statistics-board{
  .statistics-board-header{
    height: 70px;
    align-items: center;
    display: flex;
    .choose{
      color: @main-blue;
    }
  }
  .statistics-board-content{
    .project-img{
      width: 100%;
      display: inline-block;
      height: 330px;
      background: #e5e5e5;
    }
    .bulletin{
      margin-top: 15px;
      padding: 15px 30px;
      height: 160px;
      background: #f5f5f5;
      .content{
        color: @secondary-color;
        max-height: 148px;
      }
      .more{
        display: flex;
        justify-content: flex-end;
        color: @main-blue;
        cursor: pointer;
        font-size: 14px;
      }
      .header{
        padding-bottom: 15px;
        .time{
          color: @secondary-color;
          font-size: 14px;
        }
      }
    }
    .latest-news{
      .header{
        display: flex;
        padding-bottom: 15px;
        justify-content: space-between;
        .num{
          background: #ff0000;
          color: #ffffff;
          font-size: 14px;
          border-radius: 50%;
          padding:1px 2px;
          width: 22px;
          height: 22px;
          text-align: center;
          display: inline-block;
        }
        .more{
          font-size: 14px;
          color: #7b8aa4;
          cursor: pointer;
        }
      }
      .content{
        .item{
          width: 100%;
          padding: 20px 30px;
          background: #e5e5e5;
          height: 150px;
          .item-header{
            display: flex;
            justify-content: space-between;
            &>span:first-child{
              overflow: hidden;
              text-overflow:ellipsis;
              white-space: nowrap;
            }
            .time{
              font-size: 14px;
              color: @secondary-color;
            }
          }
          .item-content{
            color: @secondary-color;
            margin: 15px 0 8px 0;
            min-height: 44px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp:2;
            -webkit-box-orient: vertical;
          }
          .more{
            color: @main-blue;
            display: flex;
            font-size: 14px;
            justify-content: flex-end;
            cursor: pointer;
          }
        }
      }
    }
    .tracker-panel{
      .panel-title{
        font-size: 20px;
        font-weight: 500;
        padding: 30px 0;
      }
      .num-item-list{
        display: flex;
        justify-content: space-between;
        .num-item{
          margin-right: 3.2%;
          position: relative;
          color: #ffffff;
          .item-label{
            position: absolute;
            left: 25px;
            top: 15px;
            font-size: 18px;
          }
          .item-num{
            position: absolute;
            left: 25px;
            top: 50px;
            font-size: 36px;
          }
          &:last-child{
            margin-right: 0;
          }
        }
      }
      .tracker-charts{
        background: #ffffff;
        padding: 20px 30px 30px;
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
    }
  }
  .project-box{
    height: 400px;
  }
  .charts{
    width: 100%;
    height: 400px;
  }
}
</style>
