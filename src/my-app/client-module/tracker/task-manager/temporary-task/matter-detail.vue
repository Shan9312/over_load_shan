<template>
  <div class="task-detail">
    <panelContentHeader>
      <template >
          <el-button
            size="medium"
            type="primary"
            v-if="result.menuProsceniumMessage === 1"
            @click="msgDialogVisible = true"
          >留言</el-button>
          <!--新建任务-->
          <el-dropdown
            trigger="click"
            class="m-l-15"
            v-if="result.menuProsceniumLaunchTask === 1"
            @command="handleAddTask">
            <el-button type="primary" size="medium">
              新建任务<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu
              slot="dropdown"
            >
              <el-dropdown-item :command="child"
                                v-for="child in taskTypeAddList"
                                :key="child.id"
                                v-if="child.basicTaskType === '1'"
              >{{child.name}}</el-dropdown-item>
              <el-dropdown-item
                v-if="taskTypeAddList.filter(v => v.basicTaskType === '1').length === 0"
                :disabled="taskTypeAddList.filter(v => v.basicTaskType === '1').length === 0"
              >暂无数据</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <!--新建报事-->
          <el-button
            size="medium"
            type="primary"
            class="m-l-15"
            v-if="result.menuProsceniumReply === 1"
            @click="replyDialogVisible = true"
          >回复</el-button>
          <el-button
            size="medium"
            type="primary"
            class="m-l-15"
            v-if="result.menuProsceniumFix === 1"
            @click="handleComplete"
          >已解决</el-button>
      </template>
    </panelContentHeader>
    <div  >
      <el-row>
        <el-col :span="10" class="p-r-10">
          <div class="lf-content content" v-full-content>
            <h3>给前台报事</h3>
            <div class="info-item m-t-50">
              <info-item-ui :src="icon3" imgWidth=16 title="报事内容">{{result.content}}</info-item-ui>
            </div>
            <div class="info-item m-t-50">
              <info-item-ui :src="icon1" imgWidth=16
                            title="所在位置">
                {{result.spaceName}}
              </info-item-ui>
            </div>
            <div class="info-item m-t-50">
              <info-item-ui :src="icon2" imgWidth=16
                            title="其他备注">
                {{result.remark}}
                </info-item-ui>
            </div>
            <div class="info-item m-t-50">
              <info-item-ui
                :src="icon4"
                imgWidth=16 title="报事类型">{{result.bizTaskName}}</info-item-ui>
            </div>
            <div class="info-item m-t-50">
              <info-item-ui :src="icon5" imgWidth=16 title="相关图片">
                <div class="matter-img">
                  <img :src="item"
                       v-image-preview
                       v-for="(item,index) in result.pics" :key="index">
                </div>
              </info-item-ui>
            </div>
            <!--发起任务卡片-->
            <el-card class="box-card" shadow="always" v-if="result.temporaryId">
              <router-link :to="{name:'taskDetail',
                  params: {id: result.temporaryId, projectId: projectId}}">
                <span class="title">{{temporaryResult.temporaryName}}</span>
                <p>
                  <img src="../../../../../assets/img/task/icon_address.png" alt="">
                  {{temporaryResult.temporaryPlaceName}}
                </p>
                <p>
                  <img src="../../../../../assets/img/task/icon-people.png" alt="">
                  {{temporaryResult.positionList.map(v => v.positionName).join()}}
                </p>
                <!--按钮状态-->
                <div class="grade-ui">
                  <status-ui
                    :num="Number(temporaryResult.temporaryStatus)"></status-ui>
                  <span class="tag-overtime"
                        v-if="temporaryResult.temporaryExpireDt &&
                     Number(temporaryResult.temporaryExpireDt) < new Date().getTime()">超时</span>
                  <span class="tag-order status-gray"
                        v-for="(item,index) in temporaryResult.tagList"
                        :key="index">{{item.tagName}}</span>
                </div>
              </router-link>
            </el-card>
            <!--回复卡片-->
            <el-card  shadow="always" v-if="result.reply" class="reply">
                <span class="title">回复</span>
                <p>
                  {{result.reply.content}}
                </p>
            </el-card>
          </div>
        </el-col>
        <el-col :span="14" class="p-l-10">
          <div class="rg-content content" v-full-content>
            <el-scrollbar tag="div">
              <h3 class="rg-title">任务详情</h3>
              <!--任务盒子-->
              <div class="item-box" v-for="(item,index) in result.events" :key="index">
                <div >
                  <!--左边时间-->
                  <div class="lf-item-box">
                    <p class="times">
                      {{$day(Number(item.createAt)).format('YYYY/MM/DD')}}
                    </p>
                    <p class="times">
                      <span>
                      {{$day(Number(item.createAt)).format('HH:mm')}}
                      </span>
                    </p>
                  </div>
                </div>
                <div >
                  <!--右边内容展示-->
                  <div class="rg-item-box">
                    <img src="../../../../../assets/img/task/icon_circular.png"
                         alt="" class="icon-img">
                    <span class="title">{{item.createByName}}</span>
                    <!--内容显示-->
                    <div class="text-content">
                      {{item.content}}
                    </div>
                  </div>
                </div>
              </div>
            </el-scrollbar>
          </div>
        </el-col>
      </el-row>
    </div>
    <!--留言-->
    <el-dialog
      title="留言"
      :visible.sync="msgDialogVisible"
      width="24%">
      <el-form
        ref="msgForm"
        :model="msgForm"
        class="p-l-30 p-r-30"
        :rules="rules" label-width="80px">
        <el-form-item label="留言信息" prop="remark" class="m-b-0">
          <el-input type="textarea" v-model="msgForm.remark" :rows="6"
                    placeholder="请输入内容"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="msgDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="reportMessage">确 定</el-button>
      </span>
    </el-dialog>
    <!--留言 end-->
    <!--回复-->
    <el-dialog
      title="回复"
      :visible.sync="replyDialogVisible"
      width="24%">
      <el-form
        ref="replyForm"
        :model="replyForm"
        class="p-l-30 p-r-30"
        :rules="rules" label-width="80px">
        <el-form-item label="回复信息" prop="remark" class="m-b-0">
          <el-input type="textarea" v-model="replyForm.remark" :rows="6"
                    placeholder="请输入内容"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="replyDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="replyMsg">确 定</el-button>
      </span>
    </el-dialog>
    <!--回复 end-->
    <!--新建任务弹窗-->
    <el-dialog
      title="新建任务"
      :visible="temporaryDialogVisible"
      width="30%">
      <el-form
        :model="temporaryForm"
        label-position="right"
        ref="temporaryForm"
        label-width="100px"
        :rules="temporaryRules"
        v-if="temporaryDialogVisible"
        class=" p-l-60 p-r-30 p-t-20"
      >
        <el-form-item
          prop="name"
          label="任务名称">
          <el-input v-model.trim="temporaryForm.name"></el-input>
        </el-form-item>
        <!--位置-->
        <el-form-item
          class="inline-form-choice"
          prop="placeName"
          label="任务位置">
          <el-input  placeholder="任务位置" v-model.trim="temporaryForm.placeName"></el-input>
          <el-button size="mini" @click="openChooseSpace">选择</el-button>
        </el-form-item>
        <!--移动空间-->
        <div class="space-box m-b-20" v-if="spaceVisible">
          <el-scrollbar tag="div" style="height: 250px">
            <el-tree
              class="el-tree-custom"
              @node-click="getSpaceTemporary"
              :data="spaceList"
              :props="defaultProps"
              node-key="id"
            >
          <span class="custom-tree-node"
                slot-scope="{ node, data }">
              <i class="sprites-img"></i>
              <span>{{ data.name }}</span>
          </span>
            </el-tree>
          </el-scrollbar>
        </div>
        <!--移动空间-->
        <el-form-item label="选择职能" prop="positionIds">
          <el-select v-model="temporaryForm.positionIds"  multiple placeholder="选择职能"
          >
            <el-option
              v-for="(item,index) in positionList"
              :key="index"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="任务备注" prop="content">
          <el-input
            type="textarea"
            :rows="3"
            placeholder="请输入至少五个字符"
            v-model.trim="temporaryForm.content">
          </el-input>
        </el-form-item>
        <el-col :span="24" class="upload-item-icon">
          <i class="el-icon-plus" @click="uploadImg(uploadProps[0])"></i>
          <el-form-item label="图片附件">
            <upload
              :ref="uploadProps[0]"
              @getUrl="getTemporaryImg"
              :list="logoList"
              :limit="4"
            />
          </el-form-item>
        </el-col>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="temporaryDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmModel">确 定</el-button>
      </span>
    </el-dialog>
    <!--新建任务弹窗弹框end-->
  </div>
</template>

<script>
import upload from '../../../../../components/common/upload/upload';
import statusUi from '../../../../../components/ui/task-btn-ui';


export default {
  name: 'task-detail',
  components: { upload, statusUi },
  data() {
    return {
      id: this.$route.params.id, // 报事详情id
      projectId: this.$route.params.projectId, // 项目id
      icon1: require('../../../../../assets/img/task/icon_address.png'),
      icon2: require('../../../../../assets/img/task/icon_task.png'),
      icon3: require('../../../../../assets/img/task/icon_workorder.png'),
      icon4: require('../../../../../assets/img/task/icon_tasktype.png'),
      icon5: require('../../../../../assets/img/task/icon_imgs.jpg'),
      bindTime: '0',
      // 任务處理
      taskTypeList: [
        { value: '1', name: '工程任务' },
        { value: '2', name: '保安任务' },
        { value: '3', name: '保洁任务' },
        { value: '4', name: '其他任务' },
      ],
      bindTimeArr: [
        { id: '0', name: '不限制' },
        { id: '1', name: '3小时' },
        { id: '2', name: '6小时' },
        { id: '3', name: '12小时' },
        { id: '4', name: '48小时' },
        { id: '5', name: '一周' },
      ], // 限制时间
      list: [], // 人员列表 分配
      taskTypeAddList: [], // 任务类型 新增使用 查询改登录用户在该项目下拥有的任务类型权限
      result: {}, // 报事详情
      temporaryResult: {
        positionList: [],
      }, // 临时任务详情
      msgDialogVisible: false, // 留言弹窗
      replyDialogVisible: false, // 回复弹窗
      msg: '', // 留言或回复信息
      msgForm: { // 留言表单
        remark: '', // 留言
      },
      replyForm: { // 回复表单
        remark: '', // 留言
      },
      isComplete: '', // 是否完成的标题
      matterFormObj: {
        name: '', // 任务名称
        spaceName: '', // 位置
        positionIds: [], // 职能
        remark: '', // 备注
        pics: '', // 图片
      },
      spaceVisible: false, // 空间移动
      temporaryDialogVisible: false, // 新建任务弹窗
      positionList: [], // 职能
      activeSpace: null, // 选中的空间
      data: [],
      defaultProps: {
        children: 'spaceSonList',
        name: 'name',
      },
      // 新建任务
      temporaryForm: {
        name: '', // 任务名称
        placeName: '', // 位置
        bizTaskTypeId: null, // 业务基本类型id 这里取选中的报事类型的id
        positionIds: [], // 职能
        content: '', // 备注
        pics: [], // 图片
      },
      temporaryRules: {
        name: [
          { required: true, message: '请输入任务名称', trigger: 'change' },
          { min: 1, max: 20, message: '报事名称长度1-20个字符' },
        ],
        placeName: [
          { required: true, message: '请输入任务位置', trigger: 'change' },
          { min: 1, max: 20, message: '事件位置长度1-20个字符' },
        ],
        positionIds: [
          { required: true, message: '请选择职能', trigger: 'change' },
        ],
        content: [
          { required: true, message: '请输入备注信息', trigger: 'change' },
          { min: 1, max: 100, message: '备注信息最多100字符' },
        ],
      },
      rules: {
        modelName: [
          { required: true, message: '请输入模型名称', trigger: 'blur' },
        ],
        spaceName: [
          { required: true, message: '请输入模型名称', trigger: 'blur' },
        ],
        remark: [
          { required: true, message: '请输入备注信息', trigger: 'change' },
          { min: 1, max: 100, message: '备注信息最多100字符' },
        ],
      },
      logoList: [], // 图片上传
      uploadProps: [this.$uuid()],
      summitBtn: true, // 防止按钮重复提交
    };
  },
  methods: {
    /**
     * 打开关闭选择弹窗
     *
     * */
    openChooseSpace() {
      this.spaceVisible = !this.spaceVisible;
    },
    /**
     * 获取任务图片
     *
     * */
    getTemporaryImg(res) {
      this.temporaryForm.pics = res;
    },
    /**
     * 查询任务可分享职能
     *
     * */
    getPosition(bizTaskTypeId) {
      this.$http.get(this.api.taskApi.positionShareable, { params: {
        projectId: this.projectId,
        bizTaskTypeId,
      } })
        .then((res) => {
          if (res) {
            this.positionList = res;
          }
        });
    },
    /**
     * 点击获取任务空间位置
     *
     * */
    getSpaceTemporary(obj) {
      this.temporaryForm.placeName = obj.name;
      this.activeSpace = obj;
    },
    /**
     *点击确认 新增任务
     *
     * */
    confirmModel() {
      this.$refs.temporaryForm.validate((valid) => {
        if (valid) {
          if (!this.summitBtn) {
            this.summitBtn = false;
            return false;
          }
          this.$http.post(this.api.taskApi.temporaryAdd, {
            bizTaskTypeId: this.temporaryForm.bizTaskTypeId,
            comeFrom: 4, // 工单来源 1:安卓，2:ios，3:手机，4:网页，5:第三方,6:系统
            content: this.temporaryForm.content, // 任务描述
            name: this.temporaryForm.name, // 任务名称
            pics: this.temporaryForm.pics ? this.temporaryForm.pics.join() : '', // 图片列表
            placeName: this.temporaryForm.placeName, // 所在位置
            positionIds: this.temporaryForm.positionIds, // 职能id
            projectId: this.projectId, // 项目id
            spaceIdList: this.activeSpace &&
            this.temporaryForm.placeName === this.activeSpace.name ?
              [this.activeSpace.id] : [], // 空间列表
            pid: this.id, // 为报事任务新建任务
            lv: 2, // 创建临时任务
          })
            .then((res) => {
              if (res) {
                this.$message.success('新建成功');
                this.temporaryDialogVisible = false;
                this.summitBtn = true;
                this.getTaskDetails();
              }
            });
        } else {
          this.$message.error('请完善信息');
        }
        return true;
      });
      return true;
    },
    /**
     * 点击新增任务
     *
     * */
    handleAddTask(val) {
      this.temporaryForm.bizTaskTypeId = val.id;
      this.temporaryDialogVisible = true;
      this.getPosition(val.id);
    },
    /**
    *留言
    *
    * */
    reportMessage() {
      this.$refs.msgForm.validate((valid) => {
        if (valid) {
          this.$http.post(this.api.taskApi.reportMessage,
            { content: this.msgForm.remark, taskId: this.result.taskId })
            .then((res) => {
              if (res) {
                this.$message.success('留言成功');
                this.getTaskDetails();
              }
            });
          this.msgDialogVisible = false;
        } else {
          this.$message.error('请完善信息');
        }
      });
    },
    /**
     *
     * 回复
     *
     * */
    replyMsg() {
      this.$refs.replyForm.validate((valid) => {
        if (valid) {
          this.$http.post(this.api.taskApi.reportReply,
            { content: this.replyForm.remark, taskId: this.result.taskId })
            .then((res) => {
              if (res) {
                this.$message.success('回复成功');
                this.getTaskDetails();
              }
            });
          this.replyDialogVisible = false;
        } else {
          this.$message.error('请完善信息');
        }
      });
    },
    /**
     * 点击el-tree 节点 获取子节点
     * */
    nodeTreeClick(obj) {
      this.matterFormObj.spaceName = obj.name;
      this.matterFormObj.spaceId = obj.id;
    },
    /**
     * 获取上传logo返回的地址
     *
     * */
    uploadLogo(res) {
      this.matterFormObj.pics = res;
    },
    /**
     *点击 + 资产新增图片
     *
     * */
    uploadImg(name) {
      this.$refs[name].upload();
    },
    /**
     * 点击是否完成
     *
     * */
    handleComplete() {
      this.$http.post(this.api.taskApi.reportFinish, {
        taskId: this.id,
        content: '',
      })
        .then((res) => {
          if (res) {
            this.$message.success('改任务已解决');
            this.getTaskDetails();
          }
        });
    },
    /**
     * 查询空间列表
     *
     * */
    getSpaceList() {
      this.$http.get(this.api.spaceApi.spaceFormat, { params: { projectId: this.projectId } })
        .then((res) => {
          this.spaceList = res;
        });
    },
    /**
     * 查询报事详情
     *
     * */
    getTaskDetails() {
      this.$http.get(this.api.taskApi.reportDetail,
        { params: { id: this.id, projectId: this.projectId } })
        .then((res) => {
          this.result = res;
          this.result.pics = this.result.pics && this.result.pics.split(',');
          if (this.result.temporaryId) {
            this.getTemporaryDetails();
          }
        });
    },
    /**
     *
     * 查询临时任务详情
     *
     * */
    getTemporaryDetails() {
      this.$http.post(`${this.api.taskApi.temporaryDetails}?taskId=${this.result.temporaryId}&projectId=${this.projectId}&needEvents=${false}`)
        .then((res) => {
          if (res) {
            this.temporaryResult = res;
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
        { projectId: this.projectId, userId: this.$store.state.user.info.id, basicTaskTypes: [] })
        .then((res) => {
          this.taskTypeAddList = res;
        });
    },
  },
  watch: {
    msgDialogVisible(val) {
      if (val) {
        this.msgForm.remark = '';
      }
    },
    replyDialogVisible(val) {
      if (val) {
        this.replyForm.remark = '';
      }
    },
  },
  created() {
    this.getTaskDetails();
    this.getTaskTypeByUser();
    this.getSpaceList();
  },
};
</script>

<style type="text/less" lang="less" scoped>
  .task-detail{
    .content{
      background: #fff;
      padding: 20px 30px;
      overflow: hidden;
    }
    .grade-ui{
      display: flex;
      align-items: center;
      justify-content: left;
      flex-wrap: wrap;
      div{
        margin-bottom: 10px;
      }
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
        margin-bottom: 10px;
      }
      .tag-type{
        background-color: #409eff;
        color: #ffffff;
      }
      .tag-overtime{
        color: #f56c6c;
        background-color: #fef0f0;
      }
      .tag-order{
        background: @ornament-dark-light;
      }
    }
    .lf-content{
      h3{
        text-align: center;
        padding: 20px 0;
      }
      .matter-img>img{
        width: 60px;
        display: inline-block;
        height: 60px;
        border-radius: 3px;
        margin-right: 10px;
      }
      .box-card {
        a{
          color: #2f3747;
        }
        .title{
          font-size: 20px;
          line-height: 26px;
          display: inline-block;
          margin-bottom: 30px;
        }
        p{
          margin-bottom: 20px;
        }
        p>img{
          vertical-align: middle;
          margin-right: 10px;
        }
      }
    }
    .reply{
      color: @main-color;
      p{
        margin-top: 10px;
      }
    }
    .rg-content{
      .rg-title{
        margin-bottom: 40px;
      }
      .times{
        text-align: right;
        width: 80px;
        &>span{
          color: #c5cbd2;
          font-size: 14px;
          margin-top:10px;
        }
      }
      .item-box{
        display: flex;
        margin: 10px 0;
        &:last-child{
          .text-content{
            border: none;
          }
        }
        .title{
          font-size: 16px;
          color: #2f3747;
          margin-left: 20px;
          font-weight: 600;
        }
        .icon-img{
          position: relative;
          left:-7px;
        }
        .text-content{
          border-left:1px solid #eef1fb;
          margin-top: 5px;
          color: #c5cbd2;
          padding: 10px 40px 10px 40px;
          .lf-title{
            font-size: 14px;
            color: #7b8aa4;
            margin-right: 15px;
          }
          .status-btn{
            border-radius: 11px;
            font-size: 12px;
            padding: 5px 20px;
            margin: 0 15px;
          }
          .status-blue{
            color: #409eff;
            background-color: #ecf6ff;
          }
          .status-yellow{
            background-color: #fdf6ec;
            color: #ff9900;
          }
          .service-title{
            margin-top:10px;
          }
        }
      }
      .lf-item-box{
        width: 130px;
      }
    }
  }
</style>
