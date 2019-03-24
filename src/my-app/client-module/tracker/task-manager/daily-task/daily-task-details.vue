/**
 * Created by c on 2019/1/21.
 */
<template>
<div class="daily-task-details">
  <panelContentHeader>
  </panelContentHeader>
  <!--content-->
  <el-row class="daily-task-details-content">
    <el-col :span="9" class="p-r-10">
      <div v-content v-full-content>
        <div class="title font-20 flex-center flex-column p-b-30 p-t-30 font-bold">
          {{result.name}}
          <span class="font-12" v-if="isStatic">固定岗任务</span>
          <span class="font-12" v-else>巡视岗任务</span>
        </div>
        <info-item-ui :src="iconList[0]"
                      imgWidth=18
                      align="top"
                      title="实际执行人"
                      :label-width="150"
        >
          <div class="execute-people-list" v-if="result.patrolDetails.length > 0">
            <span class="execute-people cursor"
                  @click="switchUser(item,index)"
                  :class="{'error':item.patrolCount !== item.totalCount,
                           'active': activeUserIndex === index
                  }"
                  v-for="(item,index) in result.patrolDetails && result.patrolDetails" :key="index">
            <b class="name">{{item.userName}}</b>
            <b class="step">{{item.patrolCount}}/{{item.totalCount}}</b>
          </span>
          </div>
          <div v-else>暂无实际执行人员</div>
        </info-item-ui>
        <info-item-ui :src="iconList[1]"
                      imgWidth=18
                      align="top"
                      title="相关执行人"
                      :label-width="150"
        >{{result.userList.map(v => v.userName).join()}}</info-item-ui>
        <info-item-ui :src="iconList[2]"
                      imgWidth=18
                      title="职能"
                      :label-width="150"
        >{{result.positionList.map(v => v.positionName).join()}}</info-item-ui>
        <info-item-ui :src="iconList[3]"
                      imgWidth=18
                      title="任务详情"
                      :label-width="150"
        >{{result.content}}</info-item-ui>
        <info-item-ui :src="iconList[4]"
                      imgWidth=18
                      title="当日有效时间"
                      v-if="isStatic"
                      :label-width="150"
        >
          {{parseInt(Number(result.dutyMinuteActual/60))
          }}小时{{Number(result.dutyMinuteActual) -
          parseInt(Number(result.dutyMinuteActual/60))*60}}分钟
        </info-item-ui>
        <info-item-ui :src="iconList[4]"
                      imgWidth=18
                      v-if="isStatic && result.patrolDetails.length > 0"
                      title="当次有效时间"
                      :label-width="150"
        >
          {{parseInt(Number(result.patrolDetails[activeUserIndex].dutyMinuteActual/60))
          }}小时{{Number(result.patrolDetails[activeUserIndex].dutyMinuteActual) -
          parseInt(Number(result.patrolDetails[activeUserIndex].dutyMinuteActual/60))*60}}分钟
        </info-item-ui>
        <info-item-ui :src="iconList[5]"
                      imgWidth=18
                      title="任务类型"
                      :label-width="150"
        >{{result.bizTaskTypeName}}</info-item-ui>
      </div>
    </el-col>
    <el-col :span="15" class="p-l-10">
      <div v-content v-full-content class="p-r-0">
        <!--蓝牙列表-->
        <el-scrollbar tag="ul" class="content-list">
          <div v-content-title>
          <span class="font-bold">
          现有蓝牙列表
          </span>
          </div>
            <li
              v-for="(item,index) in
              this.result.patrolDetails[this.activeUserIndex] &&
               this.result.patrolDetails[this.activeUserIndex].patrolEventList"
              :key="index"
              :class="{'warming-item':result.isSort === '1' && item.patrolRankStatus !== '0'}"
            >
              <div class="date-item">
                <span class="date m-b-5">
                  {{item.captureAt?
                $day(Number(item.captureAt)).format('YYYY/MM/DD'): '未打点'}}
                </span>
                <span class="hours font-14">
                  {{item.captureAt?
                $day(Number(item.captureAt)).format('HH:mm'): ''}}
                </span>
              </div>
              <div class="info-item">
                <div class="info-item-title">
                  <!--名称-->
                  <b class="name">{{item.action !== '3'
                    ? item.virtualBeaconName: '事件记录报告'}}</b>
                  <!--名称 end-->
                  <!--起点终点 到岗离岗-->

                  <span v-if="isStatic">
                    <b class="status-blue font-12 status" v-if="item.action === '1' ">到岗</b>
                    <b class="status-blue font-12 status" v-if="item.action === '2' ">离岗</b>
                  </span>
                  <span v-else>
                    <b class="status-blue font-12 status" v-if="item.sign === '1' ">起点</b>
                    <b class="status-blue font-12 status" v-if="item.sign === '2' ">终点</b>
                  </span>
                  <!--起点终点 到岗离岗 end-->
                  <!--事件记录展开折叠-->
                  <b class="fold" v-if="item.action === '3' "
                     @click="getEventDetail(item)">
                    {{item.collapse?'收起':'展开'}}
                    <i :class="{
                    'el-icon-arrow-up': item.collapse,
                    'el-icon-arrow-down': !item.collapse,
                    }"
                    ></i>
                  </b>
                  <!--事件记录展开折叠 end-->
                </div>
                <!--事件记录内容-->
                <div class="address p-t-15 flex-center" v-if="item.action !== '3'">
                  <img src="../../../../../assets/img/task/icon_address.png" class="m-r-10"/>
                  <span>
                  {{item.virtualBeaconSpaceName}}
                </span>
                </div>
                <div class="address p-t-15 flex-center" v-if="item.collapse && item.action === '3'">
                  <img src="../../../../../assets/img/task/icon-beacon.png" class="m-r-10"
                       alt=""/>
                  <span>
                  {{item.virtualBeaconSpaceName}}
                </span>
                </div>

                <div class="record p-t-15" v-if="item.collapse && item.action === '3'">
                  <div class="text">{{item.event.content}}</div>
                  <div class="img-list p-t-15">
                    <img :src="img"
                         v-for="(img,index) in item.event.pics"
                         :key="index"/>
                  </div>
                </div>
                <!--事件记录内容 end-->
                <!--故障临时任务-->
                <div class="task-list" v-if="item.patrolStatus === '2'">
                  <div class="task-header">
                    <span>有故障</span>
                    <b class="fold"
                       @click="getEventDetail(item)">
                      {{item.collapse?'收起':'展开'}}
                      <i :class="{
                    'el-icon-arrow-up': item.collapse,
                    'el-icon-arrow-down': !item.collapse,
                    }"></i>
                    </b>
                  </div>
                  <div class="task" v-if="item.collapse"
                       :key="index"
                       v-for="(task,index) in item.taskList">
                    <span><i class="el-icon-tickets"></i>{{task.temporaryName}}</span>
                    <router-link :to="{ name:'taskDetail',
                  params: {id: task.id, projectId: projectId} }">跳转 ></router-link>
                  </div>
                </div>
                <!--故障临时任务 end-->
              </div>
            </li>
        </el-scrollbar>
        <!--蓝牙列表 end-->
      </div>
    </el-col>
  </el-row>
  <!--content end-->
</div>
</template>
<script>
export default{
  name: 'daily-task-details',
  components: {},
  data() {
    return {
      taskId: this.$route.params.id, // 任务id
      projectId: this.$route.params.projectId, // 项目id
      iconList: [
        require('../../../../../assets/img/task/icon-people.png'),
        require('../../../../../assets/img/task/icon-people-related.png'),
        require('../../../../../assets/img/task/icon-line.png'),
        require('../../../../../assets/img/task/icon_workorder.png'),
        require('../../../../../assets/img/task/icon-time.png'),
        require('../../../../../assets/img/task/icon_tasktype.png'),
      ],
      result: {
        patrolDetails: [
          [
            { dutyMinuteActual: '', patrolEventList: [] },
          ],
        ],
        userList: [],
        positionList: [],
        dutyMinuteActual: '',
      },
      activeUserIndex: 0,
    };
  },
  methods: {
    /**
     * 查询事件记录详情
     *
     * */
    getEventDetail(item) {
      if (!item.collapse) {
        if (item.action === '3') {
          // 查询事件记录详情
          this.$http.get(this.api.taskApi.eventDetails,
            { params: { taskEventId: item.taskEventId } })
            .then((res) => {
              if (res) {
                item.virtualBeaconSpaceName = res.virtualBeaconName; // 把蓝牙名称塞到蓝牙地址字段上
                res.pics = res.pics ? res.pics.split(',') : [];
                this.$set(item, 'event', res);
                item.collapse = !item.collapse;
              }
            });
        } else {
          // 查询蓝牙临时任务
          this.$http.get(this.api.taskApi.eventBeacon,
            { params: { eventBeaconId: item.eventBeaconId } })
            .then((res) => {
              if (res) {
                this.$set(item, 'taskList', res);
                item.collapse = !item.collapse;
              }
            });
        }
      } else {
        item.collapse = false;
      }
    },
    /**
     * 切换人员
     *
     * */
    switchUser(item, index) {
      this.activeUserIndex = index;
    },
    /**
     * 根据任务id 和项目id查询巡视岗 和固定岗详情
     *
     * */
    getDetails() {
      if (this.isStatic) {
        this.$http.post(`${this.api.taskApi.staticDetails}?taskId=${this.taskId}&projectId=${this.projectId}`)
          .then((res) => {
            this.result = res;
            this.collapse();
          });
      } else {
        this.$http.get(`${this.api.taskApi.routeDetails}?taskId=${this.taskId}&projectId=${this.projectId}`)
          .then((res) => {
            this.result = res;
            this.collapse();
          });
      }
    },
    /**
     * 计算蓝牙列表展开属性
     *
     *
     * */
    collapse() {
      // 计算蓝牙列表展开属性
      this.result.patrolDetails.forEach((item) => {
        if (item.patrolEventList.length > 0) {
          item.patrolEventList.forEach((event) => {
            if (event.action === '3' || event.patrolStatus === '2') {
              this.$set(event, 'collapse', false);
            }
          });
        }
      });
    },
  },
  computed: {
    /**
     * 是否是固定岗任务
     *
     * */
    isStatic() {
      return this.$route.params.type === '4';
    },
  },
  mounted() {
    this.getDetails();
  },
};
</script>

<style lang="less" type="text/less" scoped>
.daily-task-details{
  .daily-task-details-content{
    .default-img{
      display: block;
      margin: auto;
    }
    .title{
      text-align: center;
      align-items: center;
      flex-direction: column;
      span{
        color: @auxiliary-color;
      }
    }
    .title-num{
      background: @ornament-blue-light;
      color: @ornament-blue;
      font-weight: bold;
      padding: 0 15px;
      height: 20px;
      display: inline-flex;
      align-items: center;
      border-radius: 15px;
    }
    .execute-people{
      border: 1px solid #dcdfe6;
      padding: 3px 15px;
      font-size: 14px;
      margin-right: 15px;
      margin-bottom: 10px;
      height: 30px;
      border-radius: 3px;
      &.active{
        color: @main-blue;
        border-color: @main-blue;
      }
      &.error{
        .step{
          color: #f42424;
        }
      }
    }
    // 现有蓝牙列表
    .content-list{
      li{
        &:last-child{
          .date-item{
            &:after{
              display: none;
            }
          }
        }
        display: flex;
        .date-item{
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          padding-right: 30px;
          position: relative;
          min-height: 110px;
          width: 120px;
          &:after{
            width: 2px;
            content: '';
            top: 24px;
            bottom: 10px;
            background: #eef1fb;
            position: absolute;
            right: 0;
          }
          .date{
            position: relative;
            height: 16px;
            &:after{
              content: '';
              background: #ffffff;
              width: 11px;
              height: 11px;
              border-radius: 100%;
              position: absolute;
              top: 0;
              bottom: 0;
              margin: auto;
              right: -35px;
              border: 2px solid @ornament-blue;
            }
          }
          .hours{
            color: @secondary-color;
          }
        }
        .info-item{
          padding-left: 30px;
          position: relative;
          padding-bottom: 40px;
          .address{
            color: @secondary-color;
            font-size: 14px;
          }
          .name{
            font-weight: bold;
            padding-right: 15px;
          }
          .status{
            padding: 3px 25px;
            border-radius: 25px;
          }
          .record{
            color: #54617a;
          }
          .fold{
            color: @secondary-color;
            font-size: 14px;
            cursor: pointer;
          }
          .task-list{
            font-size: 14px;
            .task-header{
              padding: 20px 0;
              color: @secondary-color;
            }
            .task{
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding-bottom: 20px;
              i{
                padding-right: 10px;
              }
              a{
                color: @secondary-color;
              }
            }
          }
          .img-list{
            img{
              display: inline-block;
              width: 60px;
              height: 60px;
              background: #e5e5e5;
              margin-right: 5px;
              border-radius: 5px;
              cursor: pointer;
            }
          }
          .status-blue{
            background: @ornament-blue-light;
          }
        }
      }
      // 超时完成的点位
      .error-item{
        .date{
          &:after{
            border-color: @ornament-red !important;
          }
        }
        .info-item{
          .status{
            background: @ornament-red-light;
            color: @ornament-red;
          }
        }
      }
      // 异常的点位
      .warming-item{
        .date{
          &:after{
            border-color: @ornament-yellow !important;
          }
        }
      }
    }
  }
}
</style>
