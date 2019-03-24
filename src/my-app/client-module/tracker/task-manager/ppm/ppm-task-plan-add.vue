<template>
  <div >
    <div class="task-plan">
      <panelContentHeader>
        <template>
          <!--项目搜索-->
            <info-item-ui title="项目" :label-width="50" color="#2f3747" last>
              <el-select v-model="projectName" class="w-100"
              placeholder="全部" @change="handleProject">
                <el-option
                  v-for="item in projectArr"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </info-item-ui>
        </template>
      </panelContentHeader>
      <!--启用中-->
      <div class="item">
          <div class="title title-actived"></div>
          <div class="item-flex">
            <div v-for="item in Obj.startList" :key="item.id">
              <div class="item-plan">
                <div class="item-plan-top item-plan-top-user">
                  <div class="top-title">
                    {{item.name}}
                  </div>
                  <div class="right-num">
                    <span>{{item.completeCount  + '/'}}</span>
                    <span style="color:#dfe5ed;">{{item.totalCount}}</span>
                  </div>
                </div>
                <div class="item-plan-body">
                  <div class="item-row">
                    <div>
                      创建时间 <span class="item-text">{{item.createAt}}</span>
                    </div>
                    <div>
                      启用时间 <span class="item-text">{{item.startAt}}</span>
                    </div>
                  </div>
                  <div class="item-row">
                    <div>
                      年份 <span class="item-text">{{item.year}}</span>
                    </div>
                      <div>
                        作者
                        <span class="item-text">
                            {{item.createByName}}
                        </span>
                      </div>
                  </div>
                  <div class="item-row btn-box">
                    <el-button @click="handleWatchPpm(item)">查看</el-button>
                    <el-button @click="handleChang(0,item.id)"
                     v-if="permissionArr.length>0?true:false">停用</el-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
      </div>
      <!--已停用-->
      <div class="item" v-if="permissionArr.length>0?true:false">
          <div class="title title-stop"></div>
          <div class="item-flex">
            <div v-for="item in Obj.unStartList" :key="item.id">
              <div class="item-plan">
                <div class="item-plan-top item-plan-top-usering">
                  <div class="top-title">
                    {{item.name}}
                  </div>
                  <div class="right-num">
                    <span>{{item.completeCount  + '/'}}</span>
                    <span style="color:#dfe5ed;">{{item.totalCount}}</span>
                  </div>
                </div>
                <div class="item-plan-body">
                  <div class="item-row">
                    <div>
                      创建时间 <span class="item-text">{{item.createAt}}</span>
                    </div>
                    <div>
                      启用时间 <span class="item-text">{{item.startAt}}</span>
                    </div>
                  </div>
                  <div class="item-row">
                    <div>
                      年份 <span class="item-text">{{item.year}}</span>
                    </div>
                    <div>
                      作者 <span class="item-text">{{item.createByName}}</span>
                    </div>
                  </div>
                  <div class="item-row btn-box">
                    <el-button @click="editPpm(item.id,item.year)">编辑</el-button>
                    <el-button @click="handleChang(1,item.id)">启用</el-button>
                    <el-button @click="handleChang(-1,item.id)">删除</el-button>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div class="item-plan add">
                <div class="add-box">
                  <div class="icon-add">
                    <img src="../../../../../assets/img/task/add-icon_03.png"
                         alt="" @click="dialogVisible = true">
                    <p>点击此处新增计划</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
      </div>
      <!--已过期-->
      <div class="item">
          <div class="title title-expire"></div>
          <div class="item-flex">
            <div class="item-content" v-for="item in Obj.expiredList" :key="item.id">
              <div class="item-plan">
                <div class="item-plan-top item-plan-top-nouser">
                  <div class="top-title">
                    {{item.name}}
                  </div>
                  <div class="right-num">
                    <span>{{item.completeCount  + '/'}}</span>
                    <span style="color:#dfe5ed;">{{item.totalCount}}</span>
                  </div>
                </div>
                <div class="item-plan-body">
                  <div class="item-row">
                    <div>
                      创建时间 <span class="item-text">{{item.createAt}}</span>
                    </div>
                    <div>
                      启用时间 <span class="item-text">{{item.startAt}}</span>
                    </div>
                  </div>
                  <div class="item-row">
                    <div>
                      年份   <span class="item-text">{{item.year}}</span>
                    </div>
                    <div>
                      作者   <span class="item-text">{{item.createByName}}</span>
                    </div>
                  </div>
                  <div class="item-row btn-box">
                    <el-button @click="handleWatchPpm(item)">查看</el-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
      </div>
      <el-dialog
        title="新增保养任务"
        :visible.sync="dialogVisible"
        width="25%"
      >
        <el-form :model="formate"
                 :rules="rules"
                 ref="groupRef"
                 label-width="80px"
                 class="p-l-10 p-r-30"
        >
          <el-row style="margin-top:10px;">
            <el-col :span="24">
              <el-form-item label="名称" prop="name" >
                <el-input  v-model="formate.name" ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="年限" prop="year" >
                <el-select v-model="formate.year" placeholder="请选择年限">
                  <el-option
                    v-for="(item, index) in yearList"
                    :key="index"
                    :label="item.year"
                    :value="item.year">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button  size="small" @click="dialogVisible = false">取消</el-button>
        <el-button  size="small" type="primary"  @click="addTask">确认</el-button>
      </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { positiveInteger } from '../../../../../libs/plugins/validate';

export default {
  name: 'task-plan',
  data() {
    return {
      Obj: {
        startList: [], // 启用项目
        unStartList: [], // 已停用
        expiredList: [], // 已过期
      },
      rules: {
        year: [{ required: true, validator: positiveInteger, trigger: 'change' }],
        name: [{ required: true, message: '不能为空', trigger: 'change' }],
      },
      yearList: [], // 年限列表
      projectArr: [], // 项目列表
      projectName: '', // 项目名称
      formate: {
        name: '', // 项目名称
        year: '', // 年限
        comeFrom: '4', // web 端接口
        projectId: '', // 项目id
      }, // 窗口 信息
      yearArr: [], // 当前年份
      projectId: '', // 项目的id
      dialogVisible: false,
      userId: this.$cookie.get('userId'),
      permissionArr: [],
    };
  },
  methods: {
    /**
    * 根据权限限制查看按钮
    *
    * */
    isShowContentById() {
      this.$http.post(this.api.clientApi.permissionAvali, {
        permissionIds: [39],
        projectId: this.projectId,
        userId: this.userId,
      }).then((res) => {
        this.permissionArr = res;
      });
    },
    /**
    *查看 ppm list表
    *
    * */
    handleWatchPpm(item) {
      this.$router.push({ name: 'ppmList', params: { id: item.id }, query: { year: item.year, projectId: this.projectId } });
    },
    /**
    * 切换项目 去获取 任务管理
    *
    * */
    handleProject(id) {
      this.projectId = id;
      this.getPpmTaskList();
      this.$cookie.set('projectId', id);
    },
    /**
    *点击编辑 跳转到 计划管理页面
    *
    * */
    editPpm(taskId, year) {
      this.$router.push({
        name: 'ppmServicePlanAdd',
        params: {
          id: taskId,
        },
        query: {
          projectId: this.projectId,
        },
      });
      this.$cookie.set('year', year);
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
          this.formate.projectId = item[0].id;
          this.isShowContentById();
          this.getPpmTaskList();
        });
    },
    /**
     *点击查看 过期的ppmlist
     * */
    watchList(item) {
      this.$cookie.set('taskId', item.id);
      this.$router.push({ name: 'ppmList', params: { id: item.projectId }, query: { taskId: item.id } });
    },
    /**
     *获取ppm 任务计划管理单
     *
     * */
    getPpmTaskList() {
      this.$http.get(this.api.clientApi.getOverview, {
        params: {
          projectId: this.projectId,
        },
      }).then((res) => {
        this.changeDate(res.startList);
        this.changeDate(res.unStartList);
        this.changeDate(res.expiredList);
        this.Obj = res;
      });
    },
    /**
    * 遍历数据 把时间戳转换格式
    *
    * */
    changeDate(arr) {
      if (arr && arr.length) {
        arr.forEach((item) => {
          item.createAt = item.createAt === null ? '暂无' : this.$day(Number(item.createAt)).format('YYYY/MM/DD');
          item.startAt = item.startAt === null ? '暂无' : this.$day(Number(item.startAt)).format('YYYY/MM/DD');
          item.endAt = item.endAt === null ? '暂无' : this.$day(Number(item.endAt)).format('YYYY/MM/DD');
        });
      }
    },
    /**
     * 点击确定新增 任务
     *
     * */
    addTask() {
      this.$refs.groupRef.validate((valid) => {
        if (valid) {
          this.formate.projectId = this.projectId;
          this.$http.post(this.api.clientApi.addPlanInset, this.formate).then((res) => {
            if (res) {
              this.$message.success('新增成功');
              this.dialogVisible = false;
              this.getPpmTaskList();
              this.formate.name = '';
              this.formate.year = '';
            }
            return true;
          });
        } else {
          this.$message.error('请重新填写');
          return false;
        }
        return true;
      });
      return true;
    },
    /**
     * 点击取消
     * */
    cancelHandle() {
      this.formate = {};
    },
    /**
     *点击启用，停用，删除
     *
     * */
    handleChang(valid, id) {
      this.$http.post(this.api.clientApi.ppmUpdate, { id, valid }).then((res) => {
        if (res) {
          if (!valid) {
            this.$message.success('停用成功');
          } else if (valid === 1) {
            this.$message.success('启用成功');
          } else {
            this.$message.success('删除成功');
          }
          this.getPpmTaskList();
        }
      });
    },
    /**
     * 获取年份
     * */
    getData() {
      const myDate = new Date();
      const yearNow = Number(myDate.getFullYear());
      for (let i = yearNow; i < (yearNow + 5); i += 1) {
        const obj = {
          year: i,
          status: false,
        };
        this.yearList.push(obj);
      }
    },
  },
  created() {
    this.getData();
    this.getProjectList();
    this.projectId = this.$cookie.get('projectId');
  },
  computed: {
  },
  watch: {
  },
};
</script>
<style type="text/less" scoped lang="less">
.task-plan{
  .flex-justify-between{
    margin-top: 50px;
  }
  .item{
    background-color: #ffffff;
    border-radius: 4px;
    padding:30px;
    margin:20px auto;
    .item-flex {
      display: flex;
      justify-content: left;
      flex-wrap: wrap;
    }
    .title{
      font-size: 18px;
      color:@main-color;
      margin:0px 0px 30px;
      height: 35px;
      display: flex;
    }
    .title-actived{
      background: url("../../../../../assets/img/ppm/title_activited.png") no-repeat;
    }
    .title-stop{
      background: url("../../../../../assets/img/ppm/title_stop.png") no-repeat;
    }
    .title-expire{
      background: url("../../../../../assets/img/ppm/title_expire.png") no-repeat;
    }
    .item-plan{
      margin-right: 20px;
      width: 100%;
      background-color: #ffffff;
      margin-bottom: 20px;
      border-radius: 4px;
      box-shadow: 0px 4px 10px 0px
      rgba(47, 55, 71, 0.2);
      width: 480px;
      .btn-box{
        width: 100%!important;
        text-align: center;
        margin-top: 20px;
        .el-button{
          display: inline-block;
          margin: 0 auto;
          padding: 10px 50px;
          cursor: pointer;
        }
      }
      .item-plan-top{
        display: flex;
        justify-content: space-between;
        width: 100%;
        padding:0 30px;
        height: 74px;
        line-height: 74px;
        color:#fff;
        font-size: 18px;
        border-radius: 4px 4px 0px 0px;
        .right-num{
          font-size: 1.1rem;
          text-align: right;
        }
        .top-title{
          font-size: 0.9em;
        }
      }
      .item-plan-top-user{
        background: url("../../../../../assets/img/task/img_bg1.png") no-repeat center;
      }
      .item-plan-top-usering{
        background: url("../../../../../assets/img/task/img_bg2.png") no-repeat center;
      }
      .item-plan-top-nouser{
        background: url("../../../../../assets/img/task/img_bg3.png") no-repeat center;
      }
      .item-plan-body{
        padding:20px 30px;
        .item-row{
          display: flex;
          justify-content: left;
          flex-wrap: wrap;
          max-height: 55px;
          line-height: 55px;
          text-align: left;
          color:@secondary-color;
          &>div{
            width: 50%;
            padding:0 10px;
            border-bottom: 1px solid #e5e5e5;
            overflow: hidden;
            text-overflow:ellipsis;
          }
          &>div:first-child{
            border-right:  1px solid #e5e5e5;
          }
          .item-text{
            color: @main-color;
            text-align: left;
            height: 100%;
            white-space: nowrap;
            max-width: 120px;
            padding-left: 10px;
          }
        }
      }
    }
    .add{
      padding: 30px;
      .add-box{
        border: 1px dotted #7b8aa4;
        height: 220px;
        border-radius: 4px;
        text-align: center;
        position: relative;
        .icon-add{
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%,-50%);
          &>img{
            margin-bottom: 20px;
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>
