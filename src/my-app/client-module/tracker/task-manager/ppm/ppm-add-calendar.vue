/**
* Created by c on 2018/8/9.
*/
<template>
  <div class="add-ppm-calendar m-b-80">
    <div class="index-999" v-if="isShowScroll.show"></div>
    <!--左侧系统保养类别-->
    <el-scrollbar tag="div">
      <div class="add-ppm-calendar-left"
      >
        <div class="calendar-header"
             :class="{'fixed-header': isShowScroll.show}"
        >
          <span class="header-system width-80">系统</span>
          <span class="header-maintain width-170"
          >保养计划
         </span>
        </div>
        <div >
          <div
            class="calendar-system"
            v-for="(system,index) in systemList"
            :key="index"
            ref="content"
          >
            <div class="width-80 system-name" >
          <span>
            {{system.name}}
          </span>
            </div>
            <div class="width-170 maintain-type">
              <div class="type"
                   v-for="(keep,index) in system.upkeepList"
                   :key="index"
              >
                <div class="type-name">{{keep.name}}</div>
                <div class="choose-tpl">
                  <el-dropdown>
                  <span class="el-dropdown-link">
                    <i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                    <el-dropdown-menu slot="dropdown" class="choose-tpl-drop">
                      <el-dropdown-item @click.native="chooseTpl(1,keep)">每周模板</el-dropdown-item>
                      <el-dropdown-item @click.native="chooseTpl(2,keep)">每两周模板一</el-dropdown-item>
                      <el-dropdown-item @click.native="chooseTpl(3,keep)">每两周模板二</el-dropdown-item>
                      <el-dropdown-item @click.native="chooseTpl(4,keep)">每月模板一</el-dropdown-item>
                      <el-dropdown-item @click.native="chooseTpl(5,keep)">每月模板二</el-dropdown-item>
                      <el-dropdown-item @click.native="chooseTpl(6,keep)">每月模板三</el-dropdown-item>
                      <el-dropdown-item @click.native="chooseTpl(7,keep)">每月模板四</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--左侧系统保养类别 end-->
      <!--右侧周期 -->
      <el-scrollbar tag="div" class="scroll-x" ref="scrollbar">
        <div
          class="add-ppm-calendar-right"
        >
          <!--正常的header-->
          <transition-group name="fade" mode="in-out" style="display: inline;">
            <div class="calendar-header"
                 :key="1"
                 :style="{transform:'translate( '+scrollbarMoveX+',0px)'}"
                 ref="calendar">
              <div class="header-month"
                   v-for="(month,index) in monthList"
                   :key="index"
              >
                <div class="month"
                >{{year + '/' + (Number(index)+1)}}</div>
                <div class="weeks-item">
            <span
              v-for="(week,index) in month"
              :key="index"
            >第{{week.weekNo}}周</span>
                </div>
              </div>
            </div>
            <!--正常的header end-->
            <!--滚动距离 遮住header -->
            <div class="calendar-header scroll-header"
                 :key="2"
                 :style="{transform:'translate( '+scrollbarMoveX+',0px)'}"
                 ref="calendar"
                 v-if="isShowScroll.show"
            >
              <div class="header-month"
                   v-for="(month,index) in monthList"
                   :key="index"
              >
                <div class="month"
                >{{year + '/' + (Number(index)+1)}}</div>
                <div class="weeks-item">
            <span
              v-for="(week,index) in month"
              :key="index"
            >第{{week.weekNo}}周</span>
                </div>
              </div>
            </div>
            <!--滚动距离 遮住header  end-->
          </transition-group>
          <div class="calendar-content">
            <div class="calender-col-item"
                 v-for="(system,index) in systemList"
                 :style="{height:domHeightList[index]+'px'}"
                 :key="index">
              <div class="col-item"
                   v-for="(keep,index) in system.upkeepList"
                   :key="index">
                <span
                  v-for="(item,index) in weeksLength"
                  @click="chooseWeek(keep,item)"
                  :class="{'choose':keep.gridNum.indexOf(index+1) !== -1,
                  'disabled': item <= nowWeek}"
                  :key="index">
                  <b></b>
                </span>
              </div>
            </div>
          </div>
        </div>
      </el-scrollbar>
      <!--右侧周期 end-->
    </el-scrollbar>
    <!--底部确定取消-->
    <div class="fixed-control">
      <el-button plain @click="$cancel" >上一步</el-button>
      <el-button  type="primary" @click="changeCalendar">保存并前往下一步</el-button>
    </div>
	</div>
</template>
<script>
export default {
  name: 'add-ppm-calendar',
  components: {},
  data() {
    return {
      projectId: this.$route.query.projectId, // 项目id
      name: this.$route.query.name,
      taskId: this.$route.params.id,
      parentKindId: this.$route.query.parentId,
      isShowSpaceBox: -1,
      systemList: [], // 系统列表
      monthList: [
        [], [], [], [], [], [], [], [], [], [], [], [],
      ], // 月份列表
      weeksLength: 0, // 周数长度
      domHeightList: [], // 左侧系统保养的高度
      periodicTemplate: [
        {
          id: '2',
          name: '每周',
        },
        {
          id: '3',
          name: '每月',
        },
        {
          id: '4',
          name: '每两周',
        },
        {
          id: '5',
          name: '每两月',
        },
        {
          id: '6',
          name: '每季度',
        },
        {
          id: '7',
          name: '每半年',
        },
        {
          id: '8',
          name: '每年',
        },
        {
          id: '9',
          name: '每两年',
        },
      ], // 保养周期
      showBox: {}, // 小格子的内容
      activeBox: -1, // 当前的小个子下标
      nowWeek: 0, // 当前周数
      nowYear: 2019, // 当前年份
      isMounted: false,
      isShowScroll: {
        show: false,
        top: 0,
      },
      year: this.$cookie.get('year'),
    };
  },
  methods: {
    /**
     * 获取保养计划详情
     *
     * */
    getCalendarDetails() {
      this.$http.get(this.api.clientApi.getPpmDetails, {
        params: {
          parentKindId: this.taskId,
          year: this.year,
        },
      }).then((res) => {
        this.systemList = res.sonKindList;
        // 循环 周数对应的显示的灰色方块
        if (res.sonKindList.length) {
          this.systemList.forEach((item) => {
            item.upkeepList.forEach((keep) => {
              const gridNum = [];
              keep.gridList.forEach((grid) => {
                gridNum.push(Number(grid.weekNo));
              });
              this.$set(keep, 'gridNum', gridNum);
            });
          });
          // 循环dom 获取每个系统的高度
          this.$nextTick(() => {
            const dmoList = this.$refs.content;
            dmoList.forEach((dom) => {
              this.domHeightList.push(dom.offsetHeight);
            });
          });
          this.getWeeks(res.weekBOList); // 计算月份对应的周数
        }
      });
    },
    /**
     * 获取月份周数
     *
     * */
    getWeeks(data) {
      this.weeksLength = data.length; // 52周
      if (data.length) {
        data.forEach((item) => {
          this.monthList[Number(item.month) - 1].push(item);
        });
      }
    },
    /**
     * 选择周期
     *
     * */
    chooseWeek(item, index) {
      this.showBox = item;
      if (index <= this.nowWeek) {
        this.$message.error('不可操作当前周之前的计划');
        return false;
      }
      const arr = item.gridNum;
      const pos = arr.indexOf(index);
      if (pos < 0) {
        arr.push(index);
        this.activeBox = index;
      } else {
        arr.splice(pos, 1);
        this.showBox = {};
        this.activeBox = -1;
      }
      return true;
    },
    /**
     * 选择模板
     *
     * */
    chooseTpl(type, data) {
      const weeks = this.weeksLength; // 52
      data.gridNum = [];
      if (type < 4) {
        // 每周
        if (type === 1) {
          for (let i = 0; i < weeks; i += 1) {
            if (i + 1 > this.nowWeek) {
              data.gridNum.push(i + 1);
            }
          }
        } else {
          // 每两周
          for (let i = type - 2; i < weeks; i += 2) {
            if (i + 1 > this.nowWeek) {
              data.gridNum.push(i + 1);
            }
          }
        }
      } else {
        // 每月
        this.monthList.forEach((month) => {
          if (Number(month[type - 4].weekNo) > this.nowWeek) {
            data.gridNum.push(Number(month[type - 4].weekNo));
          }
        });
      }
    },
    /**
     * 修改ppm 周期模板
     *
     * */
    changeCalendar() {
      const arr = []; // 要发送的
      this.systemList.forEach((system) => {
        system.upkeepList.forEach((keep) => {
          const grids = [];
          keep.gridList.forEach((grid) => {
            if (keep.gridNum.indexOf(Number(grid.weekNo)) === -1) {
              arr.push(
                {
                  id: grid.taskId,
                  valid: -1,
                  pid: keep.taskId,
                  weekNo: grid.weekNo,
                  spaceIds: null,
                });
            } else {
              grids.push(Number(grid.weekNo));
            }
          });
          keep.gridNum.forEach((num) => {
            if (grids.indexOf(num) === -1) {
              arr.push({
                pid: keep.taskId,
                weekNo: num,
                valid: 1,
                spaceIds: null,
              });
            }
          });
        });
      });
      if (arr.length > 0) {
        this.$http.post(this.api.clientApi.updatePpmGrid, {
          gridList: arr,
        }).then((res) => {
          if (res) {
            this.$message.success('修改ppm计划成功');
            this.$router.push({
              name: 'ppmAddSpace',
              params: { id: this.taskId },
              query: { projectId: this.projectId },
            });
          }
        });
      } else {
        this.$router.push({
          name: 'ppmAddSpace',
          params: { id: this.taskId },
          query: { projectId: this.projectId },
        });
      }
    },
    /**
     * 获取当前周数
     *
     * */
    getWeekNow() {
      this.$http.get(this.api.clientApi.getWeekNow)
        .then((res) => {
          this.nowWeek = Number(res);
        });
    },
    /**
     * 滚动事件
     *
     * */
    scrollEvent() {
      if (this.moveY >= 100) {
        this.isShowScroll = {
          show: true,
          top: `${this.moveY}px`,
        };
      } else {
        this.isShowScroll = {
          show: false,
          top: 0,
        };
      }
    },
  },
  created() {
  },
  computed: {
    scrollbarMoveX() {
      if (this.isMounted) {
        // 计算header 偏移量
        return `${(-this.$refs.scrollbar.moveX * (this.$refs.scrollbar.$el.scrollWidth / 100))}px`;
      }
      return 0;
    },
    moveY() {
      return this.$store.state.event.moveY;
    },
  },
  watch: {
    moveY() {
      this.scrollEvent();
    },
  },
  mounted() {
    this.getCalendarDetails();
    this.getWeekNow();
    this.isMounted = true;
  },
};
</script>

<style lang="less" type="text/less" scoped>
  .add-ppm-calendar{
    background: #ffffff;
    .content{
      height: 800px;
      width: 100%;
      display: flex;
      justify-content: space-between;
      border:1px solid #000;
    }
    .index-999{
      position: fixed;
      z-index: 999;
      width: 30px;
      height: 70px;
      background: #ffffff;
      right: 0;
      border-left: 1px solid #f0f4f8;
      top: 0;
    }
    .width-80{
      width: 80px;
      display: inline-block;
    }
    .width-170{
      width: 170px;
    }
    .add-ppm-calendar-left{
      width: 250px;
      .calendar-header{
        border-right: 1px solid #f0f4f8;
        position: absolute;
        top: 0;
        z-index: 111;
        border-bottom: 1px solid #f0f4f8;
        background: #fcfcfe;
      }
      .fixed-header{
        position: fixed;
        top: 0;
        z-index: 1000;
        height: 70px;
        background: #fcfcfe;
        margin-left: -30px;
        padding-left: 30px;
      }
    }
    .add-ppm-calendar-right{
      flex: 1;
      .scroll-header{
        z-index: 999;
        position: fixed;
        top: 0;
        height: 70px;
        background: #ffffff;
        border-bottom: 1px solid #f0f4f8;
      }
      .header-month{
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        position: relative;
        &:after{
          content: '';
          height: 100%;
          position: absolute;
          top: 0;
          bottom: 0;
          right: 0;
          background: #f0f4f8;
          width: 1px;
        }
        .month{
          color: #7b8aa4;
          margin-bottom: 5px;
        }
        .weeks-item{
          display: flex;
          span{
            min-width: 60px;
            color: #c5cbd2;
            display: inline-block;
          }
        }
      }
      .calender-col-item{
        margin-bottom: 20px;
        /*height: 425px;*/
        &:last-child{
          margin-bottom: 0;
        }
        .col-item{
          height: 60px;
          display: flex;
          &:first-child{
            span{
              border-top: 1px solid #f0f4f8;
            }
          }
          span{
            min-width: 60px;
            height: 60px;
            color: #c5cbd2;
            display: inline-block;
            border-bottom: 1px solid #f0f4f8;
            border-right: 1px solid #f0f4f8;
            cursor: pointer;
            position: relative;
            b{
              position: absolute;
              top: 0;
              bottom: 0;
              right: 0;
              left: 0;
              margin: auto;
              background: #e5e5e5;
              width: 0;
              transition: all .2s ease-in;
              height: 0;
              display: inline-block;
            }
          }
          .drop-down{
            display: none;
            position: absolute;
          }
          .choose{
            b{
              width: 60px;
              height: 60px;
            }
            .drop-down{
              display: inline-block;
              color: #f00;
            }
          }
          .disabled{
            cursor: not-allowed;
          }
        }
      }
    }
    .calendar-header{
      height: 80px;
      font-size: 14px;
      color: #c5cbd2;
      display: flex;
      position: absolute;
      top: 0;
      align-items: center;
      border-bottom: 1px solid #f0f4f8;
      background: #ffffff;
      z-index: 99;
      transition: all .3s ease;
      span{
        text-align: center;
      }
    }
    .calendar-system{
      display: flex;
      border-right: 1px solid #f0f4f8;
      margin-bottom: 20px;
      &:last-child{
        margin-bottom: 0;
      }
      background: #fcfcfe;
      .system-name{
        min-height: 300px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-right: 1px solid #f0f4f8;
        border-bottom: 1px solid #f0f4f8;
        border-top: 1px solid #f0f4f8;
        span{
          width: 16px;
          color: #7b8aa4;
          display: inline-block;
          word-wrap: break-word;
        }
      }
      .maintain-type{
        /*border-bottom: 1px solid #f0f4f8;*/
        /*border-top: 1px solid #f0f4f8;*/
        .type{
          height: 60px;
          display: flex;
          justify-content: center;
          align-items: center;
          border-bottom: 1px solid #f0f4f8;
          color: #2f3747;
          position: relative;
          .type-name{
            width: 140px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .choose-tpl{
            position: absolute;
            right: 5px;
          }
          &:hover{
            background: #eff2fb;
          }
          &:first-child{
            border-top: 1px solid #f0f4f8;
          }
        }
      }
    }
    .col-item{
      position: relative;
      .spaceBox{
        position: absolute;
        top: 60px;
        left: 0px;
        width: 350px;
        height: 345px;
        border-radius: 4px;
        background-color: #fff;
        border: solid 1px #e5e5e5; // #e5e5e5;
        z-index: 1000;
      }
    }
  }
</style>
