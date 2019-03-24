<template>
  <div class="ppm-list">
    <!--頭部選擇-->
    <div class="header-box">
      <!--新建任务-->
      <el-dropdown trigger="click" class="drop" @command="handleParent" >
        <el-button type="primary" size="medium" class="el-dropdown-link">
          {{parentName}}<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item :command="child"
                            v-for="child in kindsArr"
                            :key="child.id"
          >{{child.name}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <!--新建报事-->
      <!--職能-->
      <div class="position">
        相关负责人的职能:
        <span v-for="item in activeObj.positionList" :key="item.positionId">
          {{item.positionName}},
        </span>
      </div>
      <!--職能-->
      <div class="line"></div>
      <div class="position">
        相关任务类型:
        <span>
          {{activeObj.bizTaskTypeName}}
        </span>
      </div>
    </div>
    <!--table表-->
    <div class='ppmList_wrapper'>
      <div class="bottom-table">
        <el-table
          :data="tableData"
          :span-method="objectSpanMethod"
          :max-height="maxHeight"
          :border="true"
          style="width: 100%;"
          :resizable="true"
        >
          <el-table-column
            prop="parentName"
            label="系统"
            align="center"
            fixed
            width="100"
          >
            <template slot-scope="scope">
            <el-popover trigger="hover" placement="bottom">
              <p>{{ scope.row.parentName }}</p>
              <div slot="reference" class="name-wrapper">
                {{ scope.row.parentName }}
              </div>
            </el-popover>
          </template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="保养类型"
            align="center"
            width="160"
            :resizable="true"
            fixed
          >
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="bottom">
                <p>{{ scope.row.name }}</p>
                <div slot="reference" class="name-wrapper">
                  {{ scope.row.name }}
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column
            prop="spaceText"
            label="服务区域"
            width="250"
            align="center"
            fixed
            :resizable="true"
          >
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="bottom">
                <p>
                  {{scope.row.spaceText}}
                </p>
                <div slot="reference" class="name-wrapper">
                  {{scope.row.spaceText}}
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column
            prop="periodName"
            label="周期"
            align="center"
            fixed
            :resizable="true"
          >
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="bottom">
                <p>{{ scope.row.periodName }}</p>
                <div slot="reference" class="name-wrapper">
                  {{ scope.row.periodName}}
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column
            prop="vendorName"
            label="负责方"
            align="center"
            fixed
            :resizable="true"
          >
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="bottom">
                <p>{{ scope.row.vendorName }}</p>
                <div slot="reference" class="name-wrapper">
                  {{ scope.row.vendorName}}
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <!--头部的周期渲染-->
          <el-table-column
            :label="item.year"
            v-for='item in originData.header'
            :key='item.year'
            align='center'
          >
            <el-table-column
              :prop="ele+''"
              :label='"第"+ele+"周"'
              v-for='(ele) in item.week'
              :key='ele'
              width="60"
              align='center'
              :class="{borderCol: ele === nowWeek}"
            >
              <template slot-scope="scope">
                <div
                  class='cell_span'
                  :class="{opacityVal: activeIndex === (scope.row[ele] && scope.row[ele].id)}"
                  @click.stop='handleCellClick(scope.row[ele], $event)'
                  :style='{cursor: scope.row[ele] ? "pointer" : "auto"}'
                >
                  <ppm-cell :obj="scope.row[ele]"></ppm-cell>
                </div>
                <!--点击渲染小方格子的内容-->
              </template>
            </el-table-column>
          </el-table-column>
          <!--头部的周期渲染-->
        </el-table>
      </div>

    </div>
    <!--任务提醒-->
    <el-dialog
      title="备注留言"
      :visible.sync="dialogVisible"
      width="35%"
    >
      <el-form :model="formate"
               :rules="rules"
               ref="formateRef"
               label-width="100px"
               class="p-l-10 p-r-30"
      >
        <el-row style="margin-top:10px;">
          <el-col :span="20">
            <el-form-item label="留言" prop="textareas" >
              <el-input  v-model="formate.textareas"   type="textarea"
                         :autosize="{ minRows: 4}"
                         placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button  size="small" type="primary"
                    @click="handleConfirm">确认</el-button>
        <el-button  size="small"  @click="handleCancel" >取消</el-button>
      </span>
    </el-dialog>
    <!--任务提醒 end-->
    <!--相关工单-->
    <div
      class='cell_box'
      :style="{'top': boxStyle.y, 'left': boxStyle.x}" v-if="boxStyle.show" @click.stop>
      <!--ppm-tag-->
      <el-row>
        <ppm-tag :status="showBox.status"></ppm-tag>
      </el-row>
      <!--ppm-tag-->
      <el-row>
        <el-col :span="8" class="left-title">系统:</el-col>
        <el-col :span="16"  class="right-title">{{showBox.upkeepName}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="8" class="left-title">任务要求:</el-col>
        <el-col :span="16"  class="right-title">{{showBox.upkeepConent}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="8" class="left-title">服务区域:</el-col>
        <el-col :span="16"  class="right-title">
                      <span v-for="son in showBox.spaceList"
                            :key="son.spaceId">{{son.spaceName}}、</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8" class="left-title">任务期间:</el-col>
        <el-col :span="16"
                class="right-title">{{showBox.startAt+'~'+ showBox.endAt}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="8" class="left-title">完成时间:</el-col>
        <el-col :span="16"
                class="right-title">{{showBox.completeDt}}</el-col>
      </el-row>
      <div class="btn-box"
           v-if="showBox.taskId !== null ">
        <div v-if="showBox.taskId !== null &&  showBox.status !=='1'">
          <button class="btn"
                  v-if="showBox.status === '2' || showBox.status === '5'"
                  @click="handleDone(showBox.taskId,1,showBox.weekNo)">提醒</button>
          <button class="btn" @click="taskDetail">相关工单</button>
          <button class="btn"
                  v-if="showBox.status === '2' || showBox.status === '5'"
                  @click="handleDone(showBox.taskId,2,showBox.weekNo)">完成</button>
        </div>
      </div>
    </div>
    <!--相关工单 end-->
  </div>
</template>

<script>
import ppmTag from '../../../../../components/ui/ppm-tag-ui'; // 引入弹框ui
import ppmCell from '../../../../../components/ui/ppm-cell-ui'; // 引入小格子的颜色

export default {
  components: { ppmTag, ppmCell },
  data() {
    return {
      // 职能
      positionList: [
        { id: '1', name: '工程任务' },
        { id: '2', name: '强电主管' },
      ],
      // 任务类型
      projectCategoryList: [
        { value: '1', name: '工程任务' },
        { value: '2', name: '保安任务' },
        { value: '3', name: '保洁任务' },
        { value: '4', name: '其他任务' },
      ],
      formate: {
        textareas: '',
      }, // 完成弹框备注
      rules: {
        textareas: [{ required: true, message: '不能为空', trigger: 'change' }],
      },
      originData: {
        header: [], // weekDate列表
        leftArr: [],
      },
      tableData: [], // body 数据渲染
      rowArr: [], // 合并单元格数组
      showBox: {
        spaceList: [],
      }, // 小格子的内容
      activeIndex: -1, // 颜色的透明度
      maxHeight: (window.document.body.clientHeight - 150),
      minHeight: 2000,
      dialogVisible: false,
      taskId: null, // 每个小格子任务的id
      nowWeek: 2, // 當前周期
      parentId: this.$route.params.id,
      year: this.$route.query.year,
      projectId: this.$route.query.projectId, // 项目id
      type: 0, // 提醒=1/完成=2
      activeWeek: '', // 電機格子獲取當前周期
      kindsArr: [], // 母分类列表
      sonId: '', // 母分类id
      parentName: '', // 母分类名字
      activeObj: {}, // 单个母分类的系统
      weekLength: 0, // 总周数的 个数
      boxStyle: {
        x: '0',
        y: '0',
        show: false,
      },
    };
  },
  methods: {
    /**
     * 跳转到相关工单
     *
     * */
    taskDetail() {
      this.$router.push({ name: 'taskDetail',
        params: { id: this.showBox.temporaryId, projectId: this.projectId } });
    },
    /**
    * 筛选母分类的内容
    *
    * */
    handleParent(obj) {
      this.parentName = obj.name;
      this.sonId = obj.id;
      this.rowArr = [];
      this.getPpmDetail(obj.id);
      this.activeObj = obj;
      this.showBox = {};
    },
    /**
    *根据计划任务id 去获取母分类列表
    *
    * */
    getParentListByTaskId() {
      this.$http.get(this.api.clientApi.getKindsArr, {
        params: { planId: this.parentId } }).then((res) => {
        this.kindsArr = res;
        if (res.length) {
          this.sonId = res[0].id;
          this.parentName = res[0].name;
          this.getPpmDetail(res[0].id);
          this.activeObj = res[0];
        }
      });
    },
    /**
     *点击弹框完成
     *
     * */
    handleDone(id, type, weekNo) {
      this.taskId = id;
      this.type = type;
      this.activeWeek = weekNo;
      if (type === 2) {
        if (this.activeWeek > this.nowWeek) {
          this.$message.error('改任務周期不在規定的時間内,無法提交完成');
          return false;
        }
      }
      this.dialogVisible = true;
      return true;
    },
    /**
     *点击弹框取消
     *
     * */
    handleCancel() {
      this.dialogVisible = false;
      this.formate = {};
    },
    /**
     *弹框确认
     * */
    handleConfirm() {
      this.$refs.formateRef.validate((valid) => {
        if (valid) {
          if (this.type === 1) {
            this.handleRemind(this.taskId, this.formate.textareas);
          } else {
            this.handleComplete(this.taskId, this.formate.textareas);
          }
          this.dialogVisible = false;
          this.formate.textareas = '';
        } else {
          this.$message.error('请重新填写');
          return false;
        }
        return true;
      });
    },
    /**
    * 完成備注
    *
    * */
    handleComplete(id, msg) {
      this.$http.post(this.api.clientApi.completeTask, {
        taskGridId: id,
        content: msg,
      }).then((res) => {
        if (res) {
          this.$message.success('已提交完成');
          this.getPpmDetail(this.sonId);
          this.dialogVisible = false;
        }
      });
    },
    /**
     * 添加提醒记录
     *
     * */
    handleRemind(id, msg) {
      this.$http.post(this.api.clientApi.remindPpm, {
        taskGridId: id,
        content: msg,
      }).then((res) => {
        if (res) {
          this.$message.success('提醒成功');
          this.dialogVisible = false;
        }
      });
    },
    /**
     *table排列问题
     *
     * */
    objectSpanMethod({ rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (this.rowArr[rowIndex + 1]) {
          return {
            rowspan: this.rowArr[rowIndex + 1],
            colspan: 1,
          };
        }
        return {
          rowspan: 0,
          colspan: 0,
        };
      }
      return true;
    },
    /**
     *查询ppm 资产详情
     *
     * */
    getPpmDetail(id) {
      this.$http.get(this.api.clientApi.getPpmDetails, {
        params: {
          parentKindId: id,
          year: this.year,
        },
      })
        .then((res) => {
          if (res !== null) {
            res.header = [];
            this.originData.leftArr = [];
            res.weekBOList.forEach((item) => {
              item.startAt = this.$day(Number(item.startAt)).format('YYYY/MM/DD');
              item.endAt = this.$day(Number(item.endAt)).format('YYYY/MM/DD');
            });
            // 把每个月对应的周期处理
            for (let i = 1; i <= 12; i += 1) {
              res.header.push(this.getWeekFilter(this.year, res.weekBOList, i));
            }
            this.originData.header = res.header;
            let spanIndex = 0; // 合并单元格需要的对象，用这个index对应渲染
            res.sonKindList.forEach((obj, index) => {
              obj.upkeepList.forEach((child) => {
                child.parentName = obj.name;
                child.parentId = obj.id;
                this.originData.leftArr.push(child);
              });
              spanIndex = index ? spanIndex + this.rowArr[spanIndex] : 1;
              this.rowArr[spanIndex] = obj.upkeepList && obj.upkeepList.length;
            });
            this.tableData = [];
            const lazyData = this.originData.leftArr.map((item) => {
              item.spaceText = '';
              const { parentName, name, spaceList, periodName, vendorName, gridList, spaceText }
               = item;
              const obj = { parentName, name, spaceList, periodName, vendorName, spaceText };
              obj.spaceList.forEach((son) => {
                obj.spaceText += `${son.spaceName},`;
              });
              const arr = Object.assign([], obj);
              gridList.forEach((ele) => {
                ele.content = item.content;
                ele.name = item.name;
                arr[ele.weekNo] = { ...ele };
              });
              return arr;
            });
            // 判断行超过了15行，做懒加载
            if (lazyData.length > 15) {
              const sliceArr = lazyData.splice(15);
              this.tableData = lazyData;
              setTimeout(() => {
                this.tableData = this.tableData.concat(sliceArr);
              }, 500);
            } else {
              this.tableData = lazyData;
            }
          }
        });
    },
    /**
     *过滤周期
     *
     * */
    getWeekFilter(yearType, arr, type) {
      const obj = {
        year: `${yearType}/${type}`,
        week: [],
      };
      arr.forEach((item) => {
        if (Number(item.month) === type) {
          obj.week.push(item.weekNo);
        }
      });
      return obj;
    },
    /**
     * 点击颜色框 查看内容
     * */
    handleCellClick(v, dom) {
      if (dom) {
        const styleObj = dom.currentTarget.getBoundingClientRect();
        const bodyWidth = window.document.body.clientWidth;
        const bodyHeight = window.document.body.clientHeight;
        console.log(styleObj, bodyWidth, bodyHeight);
        if ((bodyWidth - 200) < styleObj.x) {
          styleObj.x = bodyWidth - 200;
        }
        if ((bodyHeight - 400) < styleObj.y) {
          styleObj.y -= 390;
        }
        this.boxStyle.x = `${styleObj.x - 120}px`;
        this.boxStyle.y = `${styleObj.y + 60}px`;
        this.boxStyle.show = true;
      } else {
        this.boxStyle.show = false;
      }
      if (!v || v.taskId === this.showBox.taskId) {
        this.activeIndex = -1;
        this.showBox = {};
      } else {
        this.activeIndex = v.taskId;
        this.$http.get(this.api.clientApi.getGridDetail, {
          params: { gridId: v.taskId },
        }).then((res) => {
          res.startAt = res.startAt === null ? '暂无' : this.$day(Number(res.startAt)).format('YYYY/MM/DD');
          res.endAt = res.endAt === null ? '暂无' : this.$day(Number(res.endAt)).format('YYYY/MM/DD');
          res.completeDt = res.completeDt === null ? '暂无' : this.$day(Number(res.completeDt)).format('YYYY/MM/DD');
          this.showBox = JSON.parse(JSON.stringify(res));
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
    // 滑动滚动条，则隐藏弹框
    handleScroll() {
      this.handleCellClick(null);
    },
  },
  created() {
    this.getWeekNow();
    this.getParentListByTaskId();
  },
  mounted() {
    window.onresize = () => {
      this.maxHeight = (window.document.body.clientHeight - 150);
    };
    window.addEventListener('scroll', this.handleScroll, true);
    document.querySelector('#app').addEventListener('click', () => {
      console.log(1231231);
      this.boxStyle.show = false;
    });
  },
};
</script>

<style lang='less' type="text/less" scoped>
  .ppm-list{
    .cell_box{
      position: fixed;
      width: 300px;
      min-height: 320px;
      z-index: 999;
      padding:10px 10px;
      text-align: left ;
      font-size: 12px;
      background-color: #ffffff;
      box-shadow: 0 0 14px 0 rgba(114, 133, 152, 0.3);
      border: solid 1px #e5e5e5;
      .el-row{
        margin: 13px 0;
      }
      .left-title{
        color: #7b8aa4;
      }
      .right-title{
        color: #2f3747;
      }
      .left-span{
        display: inline-block;
        width: 16px;
        height: 16px;
        opacity: 0.5;
        margin-right: 10px;
        position: relative;
        top:3px;
      }
      .right-txt{
        font-size: 16px;
        color: #14112d;
        display: inline-block;
        margin-bottom: 15px;
      }
      .btn-box{
        .btn{
          color: #2f3747;
          width: 90px;
          text-align: center;
          display: inline-block;
          height: 31px;
          background-color: #f5f6fa;
          border-radius: 2px;
          border: solid 1px #dcdfe6;
          &:hover{
            border:1px solid #647fd8;
          }
        }
      }
    }
    .el-table__header-wrapper{
      overflow: hidden!important;
    }
    .header-box{
      height: 70px;
      display: flex;
      align-items: center;
      .position{
        &>span{
          padding:0 10px;
        }
        margin:0  20px;
      }
      .line{
        width: 1px;
        height: 20px;
        background-color: #a1a2ad;
        margin: auto 10px;
      }
    }
    .ppmList_wrapper {
      background-color: #fff;
      position: relative;
      .copy-table{
        position: absolute;
        z-index: 9999;
        top:0;
        left:0;
        width: 400px;
      }
      .borderCol{
        border:2px solid red;
      }
      .cell_span{
        position:absolute;
        height:100%;
        width:100%;
        left:0;
        top: 0;
        opacity: 0.5;
        .title-box{
          height: 30px;
          width: 50px;
          border:1px solid red;
        }
      }
      .opacityVal{
        opacity: 1.0;
      }
    }
  }

</style>
