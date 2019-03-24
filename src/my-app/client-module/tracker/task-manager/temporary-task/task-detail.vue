<template>
  <div class="task-detail">
    <panelContentHeader>
      <template>
        <el-button
          size="medium"
          type="primary"
          class="m-l-15"
          @click="distributionStaff"
          v-if="result.menuAssignUser === 1"
        >分配人员</el-button>
        <el-button
          size="medium"
          type="primary"
          class="m-l-15"
          v-if="result.menuSupplement === 1"
          @click="statusReport(1)"
        >状况报告</el-button>
        <el-button
          size="medium"
          type="primary"
          class="m-l-15"
          v-if="result.menuCantFix === 1"
          @click="statusReport(2)"
        >无法完成</el-button>
        <el-button
          size="medium"
          type="primary"
          class="m-l-15"
          v-if="result.menuWaitProcess === 1"
          @click="beProcessed"
        >升级待处理</el-button>
        <el-button
          size="medium"
          type="primary"
          class="m-l-15"
          v-if="result.menuFix === 1"
          @click="statusReport(3)"
        >完成</el-button>
        <el-button
          size="medium"
          type="primary"
          class="m-l-15"
          v-if="result.menuDelete === 1"
          @click="delDialogVisible = true"
        >删除</el-button>
        <el-button
          size="medium"
          type="primary"
          class="m-l-15"
          v-if="result.menuFeedback === 1"
          @click="feedBackVisible = true"
        >反馈</el-button>
        <el-button
          size="medium"
          type="primary"
          class="m-l-15"
          v-if="result.menuAssignPosition === 1"
          @click="handleShareOrder"
        >分享工单</el-button>
        <el-dropdown
          v-if="result.menuConsume === 1"
          @command="clickMaterial"
          class="m-l-15">
          <el-button type="primary">
            物料消耗<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="1">金额备注</el-dropdown-item>
            <el-dropdown-item command="2">物料备注</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </template>
    </panelContentHeader>
    <div>
      <el-row>
        <el-col :span="10" class="p-r-10">
          <div class="lf-content content" v-full-content>
            <h3>{{result.temporaryName}}</h3>
            <div class="info-item m-t-50">
              <info-item-ui :src="icon1" imgWidth=16 title="所在位置">
                {{result.temporaryPlaceName}}</info-item-ui>
            </div>
            <div class="info-item m-t-50">
              <info-item-ui :src="icon2" imgWidth=16
              title="任务备注">
              {{result.temporaryContent}}
              </info-item-ui>
            </div>
            <div class="info-item m-t-50">
              <info-item-ui :src="icon3" imgWidth=16 title="工单单号">{{result.taskNo}}</info-item-ui>
            </div>
            <div class="info-item m-t-50">
              <info-item-ui
                :src="icon4"
                imgWidth=16
                title="任务类型">{{result.bizTaskTypeName}}</info-item-ui>
            </div>
            <!--按钮状态-->
            <div class="grade-ui">
              <span class="tag-type">{{result.bizTaskTypeName}}</span>
              <status-ui
                :num="Number(result.temporaryStatus)"></status-ui>
              <span class="tag-overtime"
                    v-if="result.temporaryExpireDt &&
                     Number(result.temporaryExpireDt) < new Date().getTime()">超时</span>
              <span class="tag-order status-gray"
                    v-for="(item,index) in result.tagList" :key="index">{{item.tagName}}</span>
            </div>
          </div>
        </el-col>
        <el-col :span="14" class="p-l-10">
          <div class="rg-content content" v-full-content>
            <el-scrollbar tag="div">
              <h3 class="rg-title">任务详情</h3>
              <!--任务盒子-->
              <div class="item-box"
                   :class="{
                   'item-orange':[2,10,12,16,27,28].includes(item.action),
                   'item-green':[3,14].includes(item.action),
                   'item-gery':[13].includes(item.action),
                   'item-red':[4,11,15,26].includes(item.action)
                   }"
                   v-for="(item,index) in result.taskEvents" :key="index">
                    <!--左边时间-->
                    <div class="date-item">
                      <span class="date">{{$day(Number(item.createAt)).format('YYYY/MM/DD')}}</span>
                      <span class="hours">
                          {{$day(Number(item.createAt)).format('HH:mm')}}
                      </span>
                    </div>
                  <div>
                    <!--右边内容展示-->
                    <div class="rg-item-box">
                      <span class="title">{{item.actionName}}</span>
                      <!--内容显示-->
                      <div class="text-content">
                        <span class="content-header">
                          <span class="name">{{item.userName}}</span>
                          <span class="position">{{item.userPositionName}}</span>
                        </span>
                        <!--取消限时 end-->
                        <div class="share-position" v-if="item.action === 15">
                          工单未完成
                        </div>
                        <!--取消限时 end-->
                        <!--备注-->
                        <div class="remark" v-if="item.content">
                          {{item.content}}
                        </div>
                        <!--备注 end-->
                        <!--任务图片-->
                        <div class="img-list m-t-15" v-if="item.pics">
                          <img class="task-img"
                               v-image-preview
                               v-for="(img,index) in item.pics" :key="index"
                               :src="img"
                               >
                        </div>
                        <div class="remark"
                             v-if="item.action === 1 && result.temporaryAssetPatrolContent">
                          <div class="remark-title">故障信息</div>
                          <div
                            class="remark-content"
                            :key="index"
                            v-for="(child,index) in result.temporaryAssetPatrolContent">
                            {{child}}
                          </div>
                        </div>
                        <!--职能共享-->
                        <div class="share-position" v-if="item.action === 10">
                          职能共享至:{{item.positionList.map(v => v.positionName).join()}}
                        </div>
                        <!--职能共享 end-->
                        <!--人员分配-->
                        <div class="share-position" v-if="item.action === 2">
                          将人员分配至:{{item.userList.map(v => v.userName).join()}}
                        </div>
                        <!--人员分配 end-->
                        <!--移除人员-->
                        <div class="share-position" v-if="item.action === 12">
                          移除人员:{{item.userList.map(v => v.userName).join()}}
                        </div>
                        <!--移除人员 end-->
                        <!--星星显示 反馈成功-->
                        <div class="rate-item" v-if="item.action === 14">
                          <el-rate v-model="item.actionResult"
                                   disabled :max="3"></el-rate>
                          <div class="rate-remark">
                            <span v-if="item.actionResult === 1">任务完成一般</span>
                            <span v-if="item.actionResult === 2">任务完成良好</span>
                            <span v-if="item.actionResult === 3">任务完成优秀</span>
                          </div>
                        </div>
                        <!--星星显示 反馈成功 end-->
                        <!--物料消耗-->
                        <div class="material-item" v-if="item.action === 18">
                          <div>
                            <span class="label">物料名称</span>
                            <span class="info">{{item.consumeList[0].name}}</span>
                          </div>
                          <div>
                            <span class="label">物料金额</span>
                            <span class="info">￥{{Number(item.consumeList[0].fee)/100}}</span>
                          </div>
                        </div>
                        <div class="material-item" v-if="item.action === 19">
                          <div>
                            <span class="label">费用名称</span>
                            <span class="info">{{item.consumeList[0].name}}</span>
                          </div>
                          <div>
                            <span class="label">费用金额</span>
                            <span class="info">￥{{Number(item.consumeList[0].fee)/100}}</span>
                          </div>
                        </div>
                        <!--物料消耗 end-->
                        <!--移除人员-->
                        <!--添加限时-->
                        <div class="share-position" v-if="item.action === 27">
                          限制在: {{$day(Number(item.expireDt)).format('MM-DD HH:mm')}} 前完成
                        </div>
                        <!--取消限时 end-->
                        <div class="share-position" v-if="item.action === 28">
                          将工单取消限时
                        </div>
                        <!--取消限时 end-->
                      </div>
                    </div>
                  </div>
              </div>
              <!--报告任务-->
            </el-scrollbar>
          </div>
        </el-col>
      </el-row>
    </div>
    <!--分配人员-->
    <el-dialog
      title="分配人员"
      :visible.sync="staffVisible"
      width="40%">
      <!--时间限制-->
      <div
        class="p-r-30 p-l-30"
      >
        <info-item-ui title="限制时间" :font="14"
                      :label-width="100" last v-if="!result.temporaryExpireDt">
          <el-select v-model="bindTime" class="w-50"  placeholder="不限制">
            <el-option
              v-for="item in bindTimeArr"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
         </info-item-ui>
        <el-row v-else class="flex-center">
          <el-col :span="12">
            <info-item-ui title="截止时间" :font="14"
                          :label-width="100" last>
              {{$day(Number(result.temporaryExpireDt)).format('YYYY/MM/DD HH:mm')}}
            </info-item-ui>
          </el-col>
          <el-col class="share-time-btn" :span="8">
            <el-button type="primary"
                       size="small"
                       @click="cancelLimitedTime" v-if="limitedTime">取消限时</el-button>
            <span v-else>限时已取消</span>
          </el-col>
        </el-row>
        <!--分配人员框-->
        <div class="nameBox p-t-20 p-b-20">
          <p v-for="item in peopleList" :key="item.id" v-if="item.checked">
            <i class="el-icon-close cursor" @click="item.checked = !item.checked"></i>{{item.name}}
          </p>
        </div>
        <!--人员列表-->
        <div class="people-list">
          <el-scrollbar tag="div" style="height: 500px">
            <el-table
              :data="peopleList"
              style="width: 100%"
            >
              <el-table-column
                width="70"
              >
                <template slot-scope="scope">
                  <span>
                    <el-checkbox v-model="scope.row.checked"
                                 ></el-checkbox>
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                prop="name"
                class-name="main"
                label="姓名">
              </el-table-column>
              <el-table-column
                prop="id"
                label="部门"
              >
                <template slot-scope="scope">
                  <span>
                    {{scope.row.account.projectDeptName}}
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                label="职能">
                <template slot-scope="scope">
                  <span>{{scope.row.account.positionName}}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="phone"
                width="180"
                label="联系方式">
              </el-table-column>
            </el-table>
          </el-scrollbar>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="staffVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmDistributionStaff">确 定</el-button>
      </span>
    </el-dialog>
    <!--分配人员 end-->
    <!--分享工单-->
    <el-dialog
      title="分享工单"
      :visible="shareDialogVisible"
      width="30%">
      <div class="dialog-position">
        <div class="border">
          <div class="header">
            <span :class="{'active':positionTab === 1}" @click="choosePositionTab(1)">相关职能</span>
            <span :class="{'active':positionTab === 2}" @click="choosePositionTab(2)">其他职能</span>
          </div>
          <el-scrollbar tag="ul" style="height: 500px">
            <!--相关职能-->
            <li v-for="(item, index) in positionList.list" :key="index" v-if="positionTab === 1">
            <span class="name w-30">
              <img src="../../../../../assets/img/icon-img/icon-lock.png" alt=""/>
              {{item.name}}({{item.userIds.length}})
            </span>
              <span class="manager w-65 ellipsis">
                {{item.users.map(v => v.name).join()}}
            </span>
              <span class="w-5">
              <el-checkbox v-model="item.checked"></el-checkbox>
            </span>
            </li>
            <!--其他职能-->
            <li
              v-for="(item, index) in positionList.otherList" :key="index" v-if="positionTab === 2">
            <span class="name w-30">
              <img src="../../../../../assets/img/icon-img/icon-lock.png" alt=""/>
              {{item.name}}({{item.userIds.length}})
            </span>
              <span class="manager w-65">
                {{item.users.map(v => v.name).join()}}
            </span>
              <span class="w-5">
              <el-checkbox v-model="item.checked"></el-checkbox>
            </span>
            </li>
          </el-scrollbar>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="shareDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmSharePosition">确 定</el-button>
      </span>
    </el-dialog>
    <!--分享工单 end-->
    <!--物料消耗-->
    <el-dialog
      :title="materialDialogTab === 1 ? '金额备注' : '物料备注'"
      :visible="materialDialogVisible"
      width="25%">
      <el-form ref="materialForm"
               class="p-l-30 p-r-30"
               v-if="materialDialogVisible"
               :rules="materialRules"
               :model="materialForm" label-width="100px">
        <el-form-item
          prop="name"
          :label="materialDialogTab === 1 ? '费用名称' : '物料名称'">
          <el-input v-model="materialForm.name"></el-input>
        </el-form-item>
        <el-form-item
          prop="fee"
          :label="materialDialogTab === 1 ? '费用消耗' : '物料价格'" class="m-b-0">
          <el-input v-model="materialForm.fee"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="materialDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmMaterial">确 定</el-button>
      </span>
    </el-dialog>
    <!--物料消耗 end-->
    <!--删除-->
    <div class="delBox">
      <el-dialog
        :visible.sync="delDialogVisible"
        width="30%">
        <span class="title"><i class="el-icon-warning icon-warning"></i>是否删除该任务</span>
        <p class="contents">任务删除后无法恢复，请确认！</p>
        <span slot="footer" class="dialog-footer">
          <el-button @click="delDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="deleteTask">确 定</el-button>
          </span>
      </el-dialog>
    </div>
    <!--删除 end-->
    <!--无法完成/完成-->
    <el-dialog
      :title="statusReportTitle"
      :visible="statusReportDialogVisible"
      width="30%">
      <el-form ref="statusReportForm"
               :model="statusReportForm"
               :rules="statusReportRule"
               v-if="statusReportDialogVisible"
               class="p-l-60 p-r-30"
               label-width="100px">
        <el-form-item label="报告描述" prop="content">
          <el-input type="textarea" v-model="statusReportForm.content" :rows="4"
                    placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-col :span="24" class="upload-item-icon">
          <i class="el-icon-plus" @click="uploadImg(uploadProps[0])"></i>
          <el-form-item label="图片附件" class="m-b-0">
            <upload
              :ref="uploadProps[0]"
              @getUrl="uploadLogo"
              :list="logoList"
              :limit="4"
            />
          </el-form-item>
        </el-col>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="statusReportDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmStatusReport">确 定</el-button>
      </span>
    </el-dialog>
    <!--无法完成/完成 end-->
    <!--反馈-->
    <el-dialog
      title="验收"
      :visible="feedBackVisible"
      width="30%">
      <el-form ref="feedBackForm" :model="feedBackForm"
               v-if="feedBackVisible"
      :rules="feedBackRules"
      label-width="100px" class="p-l-60 p-r-30">
        <el-form-item label="完成情况" prop="complete">
          <el-radio-group v-model="feedBackForm.complete" @change="feedBackForm.actionResult = 0">
            <el-radio  :label="true">任务完成</el-radio>
            <el-radio  :label="false">任务未完成</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="完成评分" prop="actionResult">
          <el-rate v-model="feedBackForm.actionResult"
                   :disabled="!feedBackForm.complete"  :max=3 ></el-rate>
        </el-form-item>
        <el-form-item label="备注信息" prop="content">
          <el-input type="textarea" v-model="feedBackForm.content" :rows="4"
                    placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-col :span="24" class="upload-item-icon">
          <i class="el-icon-plus" @click="uploadImg(uploadProps[0])"></i>
          <el-form-item label="图片附件">
            <upload
              :ref="uploadProps[0]"
              @getUrl="getFeedBackImg"
              :list="logoList"
              :limit="4"
            />
          </el-form-item>
        </el-col>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="feedBackVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmFeedBack">确 定</el-button>
      </span>
    </el-dialog>
    <!--反馈 end-->
    <!--升级为待处理-->
    <el-dialog
      title="升级为待处理"
      :visible="beProcessedDialog"
      width="30%"
    >
      <el-form
        :model="beProcessedForm"
        ref="beProcessedForm"
        class="p-l-60 p-r-30"
        label-width="100px"
        v-if="beProcessedDialog"
        :rules="feedBackRules">
        <el-form-item
        label="紧急工单备注"
        prop="content"
        class="m-b-0"
        >
          <el-input type="textarea" v-model="beProcessedForm.content" :rows="4"
                    placeholder="请输入内容"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="beProcessedDialog = false">取 消</el-button>
        <el-button type="primary" @click="confirmBeProcessed">确 定</el-button>
      </span>
    </el-dialog>
    <!--升级为待处理-->
  </div>
</template>

<script>
import upload from '../../../../../components/common/upload/upload';
import statusUi from '../../../../../components/ui/task-btn-ui';
import { number } from '../../../../../libs/plugins/validate';

export default {
  name: 'task-detail',
  components: { upload, statusUi },
  data() {
    return {
      taskId: this.$route.params.id, // 任务id
      projectId: this.$route.params.projectId, // 项目id
      result: {},
      icon1: require('../../../../../assets/img/task/icon_address.png'),
      icon2: require('../../../../../assets/img/task/icon_task.png'),
      icon3: require('../../../../../assets/img/task/icon_workorder.png'),
      icon4: require('../../../../../assets/img/task/icon_tasktype.png'),
      bindTime: '',
      bindTimeArr: [], // 限制时间
      peopleList: [], // 人员列表 分配
      limitedTime: true, // 取消限时按钮
      positionList: {
        list: [], // 职能列表
        otherList: [], // 其他职能列表
      },
      choicePeopleList: [], // 选中的人员列表
      staffVisible: false, // 分配人员
      shareDialogVisible: false, // 分享工单
      materialDialogVisible: false, // 物料消耗
      materialDialogTab: 1,
      positionTab: 1,
      delDialogVisible: false, // 删除弹窗
      feedBackVisible: false, // 反馈弹窗
      statusReportDialogType: null, // 状态报告弹窗 type 值
      statusReportDialogVisible: false, // 状态报告弹窗
      beProcessedDialog: false, // 升级为待处理弹窗
      // 物料消耗form
      materialForm: {
        fee: '',
        name: '',
      },
      // 物料消耗验证规则
      materialRules: {
        fee: [
          { required: true, validator: number, trigger: 'change' },
        ],
        name: [
          { required: true, message: '请输入消耗物品', trigger: 'change' },
          { min: 1, max: 20, message: '字数1-20', trigger: 'change' },
        ],
      },
      // 状态报告 无法完成 完成任务 form
      statusReportForm: {
        content: '', // 备注
        pics: [], // 上传图片列表
      },
      statusReportRule: {
        content: [
          { required: true, message: '请输入报告描述', trigger: 'change' },
          { min: 1, max: 128, message: '报告描述1-128', trigger: 'change' },
        ],
      },
      // 反馈form
      feedBackForm: {
        pics: [],
        content: '',
        complete: '',
        actionResult: null,
      },
      // 反馈规则
      feedBackRules: {
        complete: [
          { required: true, message: '请选择完成情况', trigger: 'blur' },
        ],
        actionResult: [
          { required: true, message: '请选择完成评分', trigger: 'change' },
        ],
        content: [
          { min: 1, max: 128, message: '报告描述1-128', trigger: 'change' },
        ],
      },
      // 升级为待处理工单
      beProcessedForm: {
        content: '',
      },
      logoList: [], // 图片上传
      // 图片上次
      uploadProps: [this.$uuid()],
      userId: this.$cookie.get('userId'),
    };
  },
  methods: {
    /**
     *
     * 讲任务的status 改为已读状态
     * */
    changeStatusByTask() {
      const arr = [];
      arr.push(this.taskId);
      this.$http.post(this.api.statisticsApi.changeStatus, {
        readStatus: 1,
        taskIds: arr,
        userId: this.userId,
      }).then((res) => {
        console.log(res);
      });
    },
    /**
     * 打开升级待处理弹窗
     *
     * */
    beProcessed() {
      this.beProcessedDialog = true;
    },
    /**
     * 确认升级为待处理
     *
     * */
    confirmBeProcessed() {
      this.$refs.beProcessedForm.validate((valid) => {
        if (valid) {
          this.$http.post(this.api.taskApi.waitProcessed, {
            content: this.beProcessedForm.content, // 内容
            taskId: this.taskId, // 任务id
          })
            .then((res) => {
              if (res) {
                this.$message.success('升级为待处理成功');
                this.getTaskDetails(); // 查询工单详情
                this.beProcessedDialog = false;
              }
            });
        } else {
          this.$message.error('请完善信息');
        }
      });
    },
    /**
     * 删除任务
     *
     * */
    deleteTask() {
      this.$http.post(this.api.taskApi.deleteTask, {
        taskId: this.taskId,
      })
        .then((res) => {
          if (res) {
            this.$message.success('删除成功');
            this.delDialogVisible = false;
            this.getTaskDetails();
          }
        });
    },
    /**
     * 打开状态报告 无法完成 完成任务 弹窗
     * type 1 2 3
     * */
    statusReport(type) {
      this.statusReportDialogType = type;
      this.statusReportForm.content = '';
      this.statusReportForm.pics = [];
      this.logoList = [];
      this.statusReportDialogVisible = true;
    },
    /**
     * 确认添加状态报告 无法完成 完成
     *
     * */
    confirmStatusReport() {
      this.$refs.statusReportForm.validate((valid) => {
        if (valid) {
          if (this.statusReportDialogType === 1) {
            // 这里是状态报告
            this.$http.post(this.api.taskApi.supplement,
              {
                content: this.statusReportForm.content,
                pics: this.statusReportForm.pics.length > 0 ? this.statusReportForm.pics.join() : '',
                taskId: this.taskId,
              })
              .then((res) => {
                if (res) {
                  this.$message.success('添加报告成功');
                  this.getTaskDetails(); // 查询工单详情
                  this.statusReportDialogVisible = false;
                }
              });
          } else if (this.statusReportDialogType === 2) {
            // 这里是无法完成
            this.$http.post(this.api.taskApi.contFix,
              {
                content: this.statusReportForm.content,
                pics: this.statusReportForm.pics.length > 0 ? this.statusReportForm.pics.join() : '',
                taskId: this.taskId,
              })
              .then((res) => {
                if (res) {
                  this.$message.success('添加无法完成成功');
                  this.getTaskDetails(); // 查询工单详情
                  this.statusReportDialogVisible = false;
                }
              });
          } else {
            this.$http.post(this.api.taskApi.fix,
              {
                content: this.statusReportForm.content,
                pics: this.statusReportForm.pics.length > 0 ? this.statusReportForm.pics.join() : '',
                taskId: this.taskId,
              })
              .then((res) => {
                if (res) {
                  this.$message.success('添加完成成功');
                  this.getTaskDetails(); // 查询工单详情
                  this.statusReportDialogVisible = false;
                }
              });
          }
        }
      });
    },
    /**
     * 打开物料消耗弹窗
     *
     * */
    clickMaterial(val) {
      this.materialDialogTab = Number(val); // 标记选择的物料消耗类型
      this.materialDialogVisible = true;
      this.materialForm.fee = '';
      this.materialForm.name = '';
    },
    /**
     *
     * 确认新增物料
     * type 1,2
     *
     * */
    confirmMaterial() {
      this.$refs.materialForm.validate((valid) => {
        if (valid) {
          const fee = Math.floor(this.materialForm.fee * 100);
          this.$http.post(this.api.taskApi.consume, {
            consumeList: [{ fee, name: this.materialForm.name }], // 消耗列表
            consumeType: this.materialDialogTab === 1 ? 'AMOUNT' : 'MATERIAL', // 类型 1 金额备注 2 物料消耗
            taskId: this.taskId,
          })
            .then((res) => {
              if (res) {
                this.$message.success('新增物料消耗成功');
                this.getTaskDetails(); // 查询工单详情
                this.materialDialogVisible = false;
              }
            });
        }
      });
    },
    /**
     *点击 打开分配人员弹窗
     *
     * */
    distributionStaff() {
      this.staffVisible = true;
      this.limitedTime = true;
      this.getPeopleList(); // 查询分享工单使用的人员列表
    },
    /**
     * 取消限时
     *
     * */
    cancelLimitedTime() {
      this.limitedTime = false;
      this.bindTime = null;
    },
    /**
     * 确认分配工单
     *
     * */
    confirmDistributionStaff() {
      const checkedPeople = this.peopleList.filter(v => v.checked);
      if (checkedPeople.length) {
        this.$http.post(this.api.taskApi.assignUser,
          {
            taskId: this.taskId, // 任务id
            expireHours:
              this.result.temporaryExpireDt && this.limitedTime
                ? null : this.bindTime, // 过期时间
            newUserIds: checkedPeople.map(v => v.id), // 新的分配人
            oldUserIds: this.result.userList.map(v => v.userId), // 旧的分配人
            setExpireDt: this.result.temporaryExpireDt && this.limitedTime
              ? true : Boolean(this.bindTime), // 是否设置过期时间
          })
          .then((res) => {
            if (res) {
              this.$message.success('分配人员成功');
              this.getTaskDetails(); // 查询工单详情
              this.staffVisible = false;
            }
          });
      } else {
        this.$message.error('请选择分配人员');
      }
    },
    /**
     * 选择分享工单职能tab
     *
     * */
    choosePositionTab(val) {
      this.positionTab = val;
    },
    /**
     * 确认分享工单
     *
     * */
    confirmSharePosition() {
      const id1 = this.positionList.list.filter(v => v.checked).map(v => v.id);
      const id2 = this.positionList.otherList.filter(v => v.checked).map(v => v.id);
      if ((id1.length + id2.length) === 0) {
        this.$message.error('请选择职能');
        return false;
      }
      this.$http.post(this.api.taskApi.assignPosition, {
        positionIds: [...id1, ...id2], // 分配的职能列表
        taskId: this.taskId, // 任务id
      })
        .then((res) => {
          if (res) {
            this.$message.success('分享工单成功');
            this.getTaskDetails(); // 查询工单详情
            this.shareDialogVisible = false;
          }
        });
      return true;
    },
    /**
     *点击 验收弹框
     *
     * */
    confirmFeedBack() {
      this.$refs.feedBackForm.validate((valid) => {
        if (valid) {
          this.$http.post(this.api.taskApi.feedback, {
            actionResult: this.feedBackForm.actionResult, // 评分
            complete: this.feedBackForm.complete, // 任务是否完成 布尔
            content: this.feedBackForm.content, // 内容
            pics: this.feedBackForm.pics.length > 0 ? this.feedBackForm.pics.join() : '', // 时间图片
            taskId: this.taskId, // 任务id
          })
            .then((res) => {
              if (res) {
                this.$message.success('反馈成功');
                this.getTaskDetails(); // 查询工单详情
                this.feedBackVisible = false;
              }
            });
        } else {
          this.$message.error('请完善信息');
        }
      });
    },
    /**
     * 获取上传logo返回的地址
     *
     * */
    uploadLogo(res) {
      this.statusReportForm.pics = res;
    },
    /**
     * 获取上传图片返回的地址
     *
     * */
    getFeedBackImg(res) {
      this.feedBackForm.pics = res;
    },
    /**
     *点击 + 资产新增图片
     *
     * */
    uploadImg(name) {
      this.$refs[name].upload();
    },
    /**
    *点击分享工单
    * 职能分享
    * */
    handleShareOrder() {
      this.shareDialogVisible = true;
    },
    /**
    *手动删除分配人员
    *
    * */
    handleDel(obj) {
      this.list.forEach((child) => {
        if (child.id === obj.id) {
          child.checked = false;
          this.handleAddPeople();
        }
      });
    },
    /**
    *
    * 分配人员
    * */
    handleAddPeople() {
      this.choicePeopleList = this.peopleList.filter(item => item.checked);
    },
    /**
     * 查询临时任务详情
     *
     * */
    getTaskDetails() {
      this.$http.post(`${this.api.taskApi.temporaryDetails}?taskId=${this.taskId}&projectId=${this.projectId}&needEvents=${true}`)
        .then((res) => {
          if (res) {
            this.result = res;
            // 处理评价星星数量
            this.result.taskEvents.forEach((item) => {
              item.action = Number(item.action);
              item.actionResult = Number(item.actionResult);
              item.pics = item.pics && item.pics.split(',');
            });
            this.bindTime = this.result.temporaryExpireHours;
            // 处理故障信息
            this.result.temporaryAssetPatrolContent =
              this.result.temporaryAssetPatrolContent ? this.result.temporaryAssetPatrolContent.split('&') : [];
            if (this.result.menuAssignPosition === 1) {
              this.getPositionShare(); // 查询分享职能 可用的职能列表
            }
          }
        });
    },
    /**
     * 获取工单时效性
     *
     * */
    getPeriod() {
      this.$http.get(this.api.taskApi.expirePeriod)
        .then((res) => {
          this.bindTimeArr = res;
        });
    },
    /**
     * 查询人员列表
     *
     * */
    getPeopleList() {
      this.$http.post(this.api.taskApi.taskManageList, {
        bizTaskTypeId: this.result.bizTaskTypeId,
        projectId: this.projectId, // 项目的id
        userId: this.$store.state.user.info.id, // 用户id
        positionIds: this.result.positionList.map(v => v.positionId), //  创建工单时所选的职能id
      }).then((res) => {
        this.peopleList = res;
        // 获取已经分配的人员id
        const idArr = this.result.userList.map(v => v.userId);
        this.peopleList.forEach((item) => {
          if (idArr.indexOf(item.id) !== -1) {
            this.$set(item, 'checked', true);
          } else {
            this.$set(item, 'checked', false);
          }
        });
      });
    },
    /**
     * 查询任务可分享的职能
     *
     * */
    getPositionShare() {
      // 相关职能
      this.$http.get(this.api.taskApi.positionShareable,
        { params: { projectId: this.projectId, bizTaskTypeId: this.result.bizTaskTypeId } })
        .then((res) => {
          this.positionList.list = res;
          // 取出已分配职能的id
          this.positionList.list.forEach((item) => {
            if (this.positionIds.indexOf(item.id) === -1) {
              this.$set(item, 'checked', false);
            } else {
              this.$set(item, 'checked', true);
            }
          });
        });
      // 其他职能
      this.$http.get(this.api.taskApi.positionOther,
        { params: { projectId: this.projectId, bizTaskTypeId: this.result.bizTaskTypeId } })
        .then((res) => {
          this.positionList.otherList = res;
          // 取出已分配职能的id
          this.positionList.otherList.forEach((item) => {
            if (this.positionIds.indexOf(item.id) === -1) {
              this.$set(item, 'checked', false);
            } else {
              this.$set(item, 'checked', true);
            }
          });
        });
    },
  },
  computed: {
    positionIds() {
      return this.result.positionList.map(v => v.positionId);
    },
    statusReportTitle() {
      let str = '';
      if (this.statusReportDialogType === 1) {
        str = '提交报告';
      } else if (this.statusReportDialogType === 2) {
        str = '无法完成';
      } else {
        str = '完成';
      }
      return str;
    },
  },
  created() {
    this.changeStatusByTask();
    this.getTaskDetails(); // 查询工单详情
    this.getPeriod(); // 获取工单时效性
  },
};

</script>

<style type="text/less" lang="less" scoped>
 .task-detail{
   // 人员取消限时
   .share-time-btn{
      height: 34px;
      line-height: 34px;
   }
   .content{
    background: #fff;
    padding: 20px 0 0 30px;
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
   .nameBox{
     display: flex;
     p{
       background: #fafafa;
       color: @main-color;
       height: 26px;
       display: inline-flex;
       align-items: center;
       margin-right: 10px;
       padding: 0 10px;
       border-radius: 3px;
       i{
         color: @auxiliary-color;
         padding-right: 5px;
       }
     }
   }
   .dialog-position{
     padding: 0 30px;
     li{
       height: 55px;
       display: flex;
       align-items: center;
       font-size: 16px;
       border-bottom: 1px solid @bottom-color;
       padding: 0 25px;
       .name{
         color: @main-color;
       }
     }
     .header{
       background: #f5f5f5;
       height: 36px;
       display: flex;
       align-items: center;
       color: #c5cbd2;
       span{
         padding: 0 25px;
         cursor: pointer;
       }
       span.active{
          color: @main-color;
       }
     }
   }
   .lf-content{
     h3{
      text-align: center;
      padding: 20px 0;
     }
     .imgs{
       text-align: center;
       margin-top:30px;
     }
   }
   .rg-content{
    .rg-title{
      margin-bottom: 40px;
    }
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
         height: 20px;
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
         color: @auxiliary-color;
       }
     }
     // 圆圈颜色
     .item-orange{
       .date{
         &:after{
           border-color: @ornament-yellow;
         }
       }
     }
     .item-gery{
       .date{
         &:after{
           border-color: @ornament-dark;
         }
       }
     }
     .item-red{
       .date{
         &:after{
           border-color: @ornament-red;
         }
       }
     }
     .item-green{
       .date{
         &:after{
           border-color: @ornament-green;
         }
       }
     }
    .item-box{
      display: flex;
      &:last-child{
        .date-item{
          &:after{
            display: none;
          }
        }
      }
      .title{
        font-size: 16px;
        color: @main-color;
        font-weight: 600;
        padding-left: 30px;
        padding-bottom: 15px;
      }
      .text-content{
        font-size: 14px;
        padding-left: 30px;
        padding-bottom: 30px;
        .content-header{
          color: @secondary-color;
          .position{
            padding-left: 5px;
            color: @auxiliary-color;
          }
        }
        .remark{
          color: @auxiliary-color;
          font-size: 14px;
          padding-top: 10px;
          padding-right: 20px;
          .remark-title{
            color: @main-color;
            font-size: 16px;
            margin-bottom: 10px;
          }
          .remark-content{
            margin-bottom: 10px;
            &:last-child{
              margin-bottom: 0;
            }
          }
        }
        .img-list{
          .task-img{
            width: 60px;
            height: 60px;
            margin-right: 10px;
          }
        }
        .rate-item{
          .rate-remark{
            padding-top: 20px;
            color: @auxiliary-color;
          }
        }
        .material-item{
          margin-top: 15px;
          div{
            span.label{
              width: 90px;
              display: inline-block;
              color: @auxiliary-color;
            }
            span.info{
              color: @secondary-color;
            }
            &:first-child{
              padding-bottom: 15px;
            }
          }
        }
        .share-position{
          padding-top: 10px;
          color: @secondary-color;
        }
      }
    }
   }
 }
</style>
