[<template>
  <div class="task-list">
    <!--头部面包屑切换-->
    <div class="task-tab">
    <!--标签头-->
      <div class="header-tab">
        <div class="item-tab"
             :class="[{'active-tab': child.id === activeTabIndex}]"
             v-for="child in tabArr"
             @click="handleChangePage(child.id)"
             :key="child.id">
          {{child.name}}
        </div>
      </div>
      <!--右侧搜索按钮-->
      <div class="header-right">
      <!--任务搜索-->
          <el-input
            class="panel-content-header-input m-r-15"
            :placeholder="`请选择${SearchSelectArr[searchSelectValue-1].name}`" v-model="searchName">
            <el-select v-model="searchSelectValue" placeholder="请选择" slot="prepend">
              <el-option
                v-for="item in SearchSelectArr"
                :key="item.value"
                :label="item.name"
                :value="item.value">
              </el-option>
            </el-select>
            <i slot="suffix" class="el-input__icon el-icon-search" @click="searchListByName"></i>
          </el-input>
        <!--任务搜索-->
        <!--新建任务-->
          <el-dropdown trigger="click" class="m-r-15" @command="handleAddTask">
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
        <el-dropdown trigger="click"  class="m-r-15"
                     @command="handleAddMatter">
          <el-button type="primary" size="medium">
            新建报事<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu
            slot="dropdown"
            >
            <el-dropdown-item :command="child"
                              v-for="child in taskTypeAddList"
                              :key="child.id"
                              v-if="child.basicTaskType === '2'"
            >{{child.name}}</el-dropdown-item>
            <el-dropdown-item
              v-if="taskTypeAddList.filter(v => v.basicTaskType === '2').length === 0"
              :disabled="taskTypeAddList.filter(v => v.basicTaskType === '2').length === 0"
            >暂无数据</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button
          size="medium"
          type="primary"
          >导出</el-button>
      </div>
    </div>
    <!--头部面包屑切换 end-->
    <div v-content class="task-content">
      <!--搜索 4个-->
      <el-row :gutter="20">
        <el-col :span="5">
          <info-item-ui title="项目" :label-width="60" :font="14">
            <el-select v-model="projectId"  placeholder="选择项目"
                       @change="selectProjectList"
                       >
              <el-option
                v-for="item in projectArr"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </info-item-ui>
        </el-col>
        <el-col :span="5">
          <info-item-ui title="任务状态" :label-width="80" :font="14">
            <el-select v-model="taskStatus"
                       v-if="isTemporaryTask"
                       @change="chooseTaskStatus" placeholder="选择状态"
            ><el-option
              v-for="(item,index) in temporaryStatusList"
              :key="index"
              :label="item.name"
              :value="item.key">
            </el-option>
            </el-select>
            <el-select
              v-else
              v-model="taskStatus"  @change="chooseTaskStatus" placeholder="选择状态"
            >
              <el-option
                v-for="(item,index) in reportStatusList"
                :key="index"
                :label="item.name"
                :value="item.key">
              </el-option>
            </el-select>
          </info-item-ui>
        </el-col>
        <!--报事类型判断-->
          <el-col :span="6">
            <info-item-ui
              :title="!isTemporaryTask ? '报事类型' :'任务类型'"
              :label-width="80" :font="14">
              <el-select v-model="taskTypeValue" @change="chooseType" multiple placeholder="选择类型"
              >
                <el-option
                  v-for="item in taskTypeList"
                  :key="item.id"
                  v-if="
                  (!isTemporaryTask && item.basicTaskType === '2') ||
                   (isTemporaryTask && item.basicTaskType === '1')"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </info-item-ui>
          </el-col>
          <el-col :span="6" v-if="isTemporaryTask">
            <info-item-ui title="创建时间" :label-width="80" :font="14">
              <el-date-picker
                v-model="dayTime"
                @change="getTaskReportList"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </info-item-ui>
          </el-col>
      </el-row>
      <!--搜索 end-->
      <!--列表-->
        <el-scrollbar tag="div" v-table>
          <el-table
            v-if="result.list"
            :data="result.list"
          >
            <el-table-column
              label="状态">
              <template slot-scope="scope">
                <status-ui
                  :num="Number(scope.row.temporaryStatus)" v-if="isTemporaryTask"></status-ui>
                <status-matter-ui :num="Number(scope.row.status)" v-else></status-matter-ui>
              </template>
            </el-table-column>
            <el-table-column
              prop="userName"
              class-name="main"
              v-if="isTemporaryTask"
              label="报修人">
            </el-table-column>
            <el-table-column
              prop="createByName"
              class-name="main"
              v-if="!isTemporaryTask"
              label="报事人">
            </el-table-column>
            <el-table-column
              class-name="main"
              prop="temporaryName"
              v-if="isTemporaryTask"
              label="名称">
            </el-table-column>
            <el-table-column
              class-name="main"
              prop="content"
              v-else
              label="报事内容">
            </el-table-column>
            <el-table-column
              prop="bizTaskTypeName"
              v-if="isTemporaryTask"
              label="任务类型">
            </el-table-column>
            <el-table-column
              prop="bizTaskName"
              v-else
              label="报事类型">
            </el-table-column>
            <el-table-column
              prop="temporaryPlaceName"
              v-if="isTemporaryTask"
              label="任务地址">
            </el-table-column>
            <el-table-column
              prop="spaceName"
              v-else
              label="事件地址">
            </el-table-column>
            <el-table-column
              label="创建时间">
              <template slot-scope="scope">
                {{$day(Number(scope.row.createAt)).format('YYYY/MM/DD HH:mm')}}
              </template>
            </el-table-column>
            <el-table-column
              v-if="isTemporaryTask"
              label="更新时间">
              <template slot-scope="scope">
                {{scope.row.updateAt?
                $day(Number(scope.row.updateAt)).format('YYYY/MM/DD HH:mm'):
                $day(Number(scope.row.createAt)).format('YYYY/MM/DD HH:mm')}}
              </template>
            </el-table-column>
            <el-table-column
              prop="taskNo"
              label="相关任务编号">
            </el-table-column>
            <el-table-column
              width="120px"
              label="操作">
              <template slot-scope="scope">
                <div class="control-item">
                  <router-link
                    v-if="isTemporaryTask"
                    :to ="{ name:'taskDetail',
                  params: {id: scope.row.id, projectId: projectId} }">
                    <el-button  size="small" plain >查看</el-button>
                  </router-link>
                  <router-link
                    v-else
                    :to ="{ name:'matterDetail',
                  params: {id: scope.row.taskId, projectId: projectId} }">
                    <el-button  size="small" plain >查看</el-button>
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
        <div class="space-box" v-if="spaceVisible">
          <el-scrollbar tag="div" style="height: 300px">
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
              v-for="item in positionList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="任务备注" prop="content">
          <el-input
            type="textarea"
            :rows="3"
            placeholder="备注信息1-128字符"
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
    <!--新增报事弹窗-->
    <el-dialog
      title="新建报事"
      :visible.sync="matterDialogVisible"
      width="32%">
      <el-form
        :model="matterFormObj"
        label-position="right"
        ref="matterForms"
        label-width="100px"
        :rules="rules"
        v-if="matterDialogVisible"
        class="matter-form p-l-60 p-r-30 p-t-20">
        <el-form-item
          prop="content"
          label="报事内容">
          <el-input v-model.trim="matterFormObj.content"></el-input>
        </el-form-item>
        <!--位置-->
        <el-form-item
          class="inline-form-choice"
          prop="spaceName"
          label="事件位置">
          <el-input placeholder="事件位置" v-model.trim="matterFormObj.spaceName"
                    ></el-input>
          <el-button size="mini" @click="openChooseSpace">选择</el-button>
        </el-form-item>
        <!--移动空间-->
        <div class="space-box" v-if="spaceVisible">
          <el-scrollbar tag="div" style="height: 300px">
            <el-tree
              class="el-tree-custom"
              @node-click="nodeTreeClick"
              :data="spaceList"
              :props="defaultProps"
              node-key="id"
              ref="tree">
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
          <el-select v-model="matterFormObj.positionIds"  multiple placeholder="选择职能"
          >
            <el-option
              v-for="item in positionList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="事件备注" prop="remark">
          <el-input
            type="textarea"
            :rows="3"
            placeholder="备注信息1-128字符"
            v-model.trim="matterFormObj.remark">
          </el-input>
        </el-form-item>
        <el-col :span="24" class="upload-item-icon">
          <i class="el-icon-plus" @click="uploadImg(uploadProps[0])"></i>
          <el-form-item label="图片附件">
            <upload
              :ref="uploadProps[0]"
              @getUrl="uploadMatterImg"
              :list="logoList"
              :limit="4"
            />
          </el-form-item>
        </el-col>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="matterDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmMatter">确 定</el-button>
      </span>
    </el-dialog>
    <!--新增报事end 弹窗 -->
  </div>
</template>

<script>
import upload from '../../../../../components/common/upload/upload';
import statusMatterUi from '../../../../../components/ui/task-matter-ui';
import statusUi from '../../../../../components/ui/task-btn-ui';

export default {
  name: 'task-list',
  components: { upload, statusUi, statusMatterUi },
  data() {
    return {
      // 页面头部 tab 标题
      currentPage: 1, // 分页
      tabArr: [
        { name: '待办任务', id: 1 },
        { name: '和我相关', id: 2 },
        { name: '历史任务', id: 3 },
        { name: '报事', id: 4 },
      ],
      // 报事任务状态
      reportStatusList: [
        { name: '全部', key: '' },
        { name: '未处理', key: '1' },
        { name: '待确认', key: '2-4' },
        { name: '处理中', key: '3' },
        { name: '已结束', key: '5' },
      ],
      // 临时任务状态
      temporaryStatusList: [
        { name: '全部', key: '' },
        { name: '未派工', key: '1' },
        { name: '处理中', key: '2' },
        { name: '特殊状态', key: '3' },
        { name: '待反馈', key: '4' },
        { name: '已完成', key: '5' },
      ],
      taskTypeList: [], // 任务类型 查询使用 选取改项目下全部的任务类型
      taskTypeAddList: [], // 任务类型 新增使用 查询改登录用户在该项目下拥有的任务类型权限
      searchSelectValue: 1, // 搜索框下拉的值 标记搜索的type
      taskStatus: '', // 任务状态
      activeTabIndex: 1, // tab
      positionList: [], // 职能
      activeSpace: null, // 选中的空间
      // 新建任务
      temporaryForm: {
        name: '', // 任务名称
        placeName: '', // 位置
        bizTaskTypeId: null, // 业务基本类型id 这里取选中的报事类型的id
        positionIds: [], // 职能
        content: '', // 备注
        pics: [], // 图片
      },
      // 新建报事
      matterFormObj: {
        projectId: this.projectId,
        bizTaskTypeId: null, // 业务基本类型id 这里取选中的报事类型的id
        content: '', // 任务名称
        spaceName: '', // 位置
        space_id: null, // 空间id 选择的空间id 输入的为null
        positionIds: [], // 职能
        pics: [], // 图片
        remark: '', // 报事备注
      },
      rules: {
        content: [
          { required: true, message: '请输入报事内容', trigger: 'change' },
          { min: 1, max: 20, message: '报事内容长度1-20个字符' },
        ],
        spaceName: [
          { required: true, message: '请输入事件位置', trigger: 'change' },
          { min: 1, max: 20, message: '事件位置长度1-20个字符' },
        ],
        positionIds: [
          { required: true, message: '请选择职能', trigger: 'change' },
        ],
        remark: [
          { required: true, message: '请输入备注信息', trigger: 'change' },
          { min: 1, max: 128, message: '备注信息最多128字符' },
        ],
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
          { min: 1, max: 128, message: '备注信息最多128字符' },
        ],
      },
      searchName: '', // 搜索框内输入值
      projectId: '', // 选择项目
      projectArr: [], // 项目列表
      result: { list: [] },
      projectList: [], // 项目列表
      taskTypeValue: [], // 任务类型 多选
      dayTime: [], // 创建时间开始和结束
      logoList: [], // logo图片 列表
      summitBtn: true, // 提交按钮多次点击
      // 图片上传
      uploadProps: [this.$uuid()],
      matterDialogVisible: false, // 新增报事弹窗
      temporaryDialogVisible: false, // 新建任务弹窗
      spaceVisible: false, // 显示选择空间下拉
      spaceList: [], // 空间列表
      defaultProps: {
        children: 'spaceSonList',
        name: 'name',
      },
    };
  },
  methods: {
    /**
     * 选择项目
     *
     * */
    selectProjectList(val) {
      this.projectId = val;
      this.currentPage = 1;
      this.getTaskReportList();
      this.getTaskType(); // 获取类型
      this.getSpaceList(); // 查询空间列表
    },
    /**
     * 根据名子搜索 列表
     *
     * */
    searchListByName() {
      this.getTaskReportList();
    },
    /**
     * 选择类型
     *
     * */
    chooseType() {
      this.getTaskReportList();
    },
    /**
     * 选择任务状态
     *
     * */
    chooseTaskStatus() {
      this.getTaskReportList();
    },
    /**
     * 查询 任务 报事列表
     *
     *
     * */
    getTaskReportList() {
      if (this.activeTabIndex === 4) {
        // 这里是报事列表
        this.$http.post(`${this.api.taskApi.reportList}?pageNum=${this.currentPage}&pageSize=${10}`, {
          projectId: this.projectId, // 项目id
          bizTaskTypeIds: this.taskTypeValue, // 报事类型
          content: this.searchName, // 报事内容
          statusList: this.taskStatus ? this.taskStatus.split('-') : [], // 报事状态
        })
          .then((res) => {
            this.result = res;
          });
      } else {
        // 这里是查询临时任务 包括 代办任务 和我相关 历史任务
        this.$http.post(this.api.taskApi.temporaryList, {
          bizTaskTypeIds: this.taskTypeValue, // 任务类型
          createAtStart: this.dayTime ? new Date(this.dayTime[0]).getTime() : '', // 创建时间开始
          createAtEnd: this.dayTime ? new Date(this.dayTime[1]).getTime() : '', // 创建时间结束
          menuStatus: this.activeTabIndex, // 菜单状态 1：代办任务 2：和我相关 3：历史任务
          pageIndex: this.currentPage,
          pageSize: 10,
          projectId: this.projectId, // 项目id
          taskNo: this.searchSelectValue === 1 ? this.searchName : '', // 任务编号
          tempContent: this.searchSelectValue === 2 ? this.searchName : '', // 临时任务备注
          createByName: this.searchSelectValue === 3 ? this.searchName : '', // 创建人名字
          tempPlaceName: this.searchSelectValue === 4 ? this.searchName : '', // 临时任务地址
          temporaryStatus: this.taskStatus, // 临时任务状态
        })
          .then((res) => {
            this.result = res;
          });
      }
    },
    /**
     *查询 代办任务 和我相关 历史任务 列表
     * 根据传入的 activeTab = 1,2,3 分别取获取对应的列表数据
     * */
    handleChangePage(val) {
      this.activeTabIndex = val;
      this.searchSelectValue = 1;
      this.currentPage = 1;
      this.taskTypeValue = [];
      this.getTaskReportList();
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
          })
            .then((res) => {
              if (res) {
                this.$message.success('新建成功');
                this.temporaryDialogVisible = false;
                this.getTaskReportList(); // 查询任务报事列表
                this.summitBtn = true;
              }
            });
        } else {
          this.$message.error('请完善信息');
        }
        return true;
      });
    },
    /**
     *点击确认 报事任务
     *
     * */
    confirmMatter() {
      this.$refs.matterForms.validate((valid) => {
        if (valid) {
          if (!this.summitBtn) {
            this.summitBtn = false;
            return false;
          }
          const obj = {
            bizTaskTypeId: this.matterFormObj.bizTaskTypeId, // 业务基本类型id
            content: this.matterFormObj.content, // 报事内容
            remark: this.matterFormObj.remark, // 备注
            pics: this.matterFormObj.pics ? this.matterFormObj.pics.join() : '', // 图片 最多四张
            positionIds: this.matterFormObj.positionIds, // 职能id 多选数组
            spaceName: this.matterFormObj.spaceName, // 所在空间名称
            space_id: this.activeSpace && this.matterFormObj.spaceName
            === this.activeSpace.name ?
              this.activeSpace.id : null, // 如果空间名称和选中的空间名称一样 说明是选取的 不是输入的
            comeFrom: 4, // 工单来源 1:安卓，2:ios，3:手机，4:网页，5:第三方,6:系统
            projectId: this.projectId, // 项目id
          };
          this.$http.post(this.api.taskApi.reportAdd, obj)
            .then((res) => {
              if (res) {
                this.$message.success('新增成功');
                this.matterDialogVisible = false;
                this.getTaskReportList();
                this.summitBtn = true;
              }
            });
        } else {
          this.$message.error('请完善信息');
        }
        return true;
      });
    },
    /**
     * 获取上传图片返回的地址
     *
     * */
    uploadMatterImg(res) {
      this.matterFormObj.pics = res;
    },
    /**
     * 获取任务图片
     *
     * */
    getTemporaryImg(res) {
      this.temporaryForm.pics = res;
    },
    /**
     * 点击新增图片
     *
     * */
    uploadImg(name) {
      this.$refs[name].upload();
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
          this.projectId = res.list[0].id;
          this.getTaskType(); // 获取类型
          this.getSpaceList(); // 查询空间列表
          this.getTaskReportList(); // 查询任务报事列表
        });
    },
    /**
     * 获取项目包含的任务类型
     * 仅供查询使用
     *
     * */
    getTaskType() {
      this.$http.post(this.api.taskApi.getType, { projectId: this.projectId })
        .then((res) => {
          if (res) {
            this.taskTypeList = res.list.filter(v => v.basicTaskType === '2' || v.basicTaskType === '1');
            this.getTaskTypeByUser();
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
     * 切换分页
     *
     * */
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getTaskReportList();
    },
    /**
     * 打开关闭选择弹窗
     *
     * */
    openChooseSpace() {
      this.spaceVisible = !this.spaceVisible;
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
     * 点击el-tree 节点 获取子节点
     * */
    nodeTreeClick(obj) {
      this.matterFormObj.spaceName = obj.name;
      this.activeSpace = obj;
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
     * 点击新增任务
     *
     * */
    handleAddMatter(val) {
      this.matterFormObj.bizTaskTypeId = val.id;
      this.matterDialogVisible = true;
      this.getPosition(val.id); // 查询职能
    },
  },
  created() {
  },
  mounted() {
    this.getProjectList(); // 查询项目列表
  },
  watch: {
    nameLike() {
      this.currentPage = 1;
    },
    matterDialogVisible(val) {
      if (val) {
        this.activeSpace = null;
        this.matterFormObj.name = '';
        this.matterFormObj.spaceName = '';
        this.matterFormObj.space_id = '';
        this.matterFormObj.content = '';
        this.matterFormObj.pics = [];
        this.matterFormObj.positionIds = [];
      }
    },
    temporaryDialogVisible(val) {
      if (val) {
        this.activeSpace = null;
        this.temporaryForm.name = '';
        this.temporaryForm.spaceList = [];
        this.temporaryForm.placeName = '';
        this.temporaryForm.content = '';
        this.temporaryForm.pics = [];
        this.temporaryForm.positionIds = [];
      }
    },
  },
  computed: {
    SearchSelectArr() {
      let arr = [];
      if (this.activeTabIndex === 4) {
        // 报事搜索
        arr = [{ value: 1, name: '事件名称' }];
      } else {
        // 任务 和我相关 历史任务搜索
        arr = [{ value: 1, name: '任务编号' }, { value: 2, name: '任务描述' }, { value: 3, name: '报事人' }, { value: 4, name: '任务地址' }];
      }
      return arr;
    },
    // 是否是临时任务
    isTemporaryTask() {
      return this.activeTabIndex !== 4;
    },
  },
};
</script>

<style scoped type="text/less" lang="less">
  .task-list{
    .task-content{
      padding: 30px;
      background-color: #ffffff;
    }
    .task-tab{
      height: 70px;
      position: relative;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      .header-tab{
        height: 40px;
        line-height: 40px;
        position: absolute;
        bottom: 0;
        left: 0;
        width: 800px;
        display: flex;
        align-items: center;
        justify-content: left;
        .item-tab{
          width: 160px;
          height: 0;
          border-bottom: 40px solid #ececed;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          text-align: center;
          cursor: pointer;
          margin-left: -5px;
          &:first-child{
            margin-left: 0;
          }
        }
        .active-tab{
          border-bottom: 40px solid #fff;
          z-index: 1000;
        }
      }
      .header-right{
        float: right;
        display: inline-flex;
        justify-content: space-between;
      }
    }
  }
</style>

