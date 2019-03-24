<template>
  <div class="service-plan-add">
    <!--头部-->
    <panelContentHeader>
      <template>
      </template>
    </panelContentHeader>
    <!--头部-->
    <div class="servicePlan">
      <el-row :gutter="20">
        <!--左侧保养类型 一级-->
        <el-col :span="6">
          <div class="grid-content">
            <h3>保养类型</h3>
            <!--系统渲染-->
            <div class="item" v-for="(item,index) in kindsArr" :key="index">
                <div class="item-content">
                  <!--系统类型名-->
                  <div  :class="{'activeColor':active === index,
                  'item-title':true}" @click="handleSearchChild(index,item.id)">
                    {{item.name}}
                  </div>
                  <!--编辑 删除按钮-->
                  <el-row class="edit-icon">
                    <el-col :span="4" class="item-icon">
                      <i class="el-icon-edit-outline" @click="editSystem(item)"></i>
                    </el-col>
                    <el-col :span="4" class="item-icon">
                      <i class="el-icon-delete" @click="delSystem(item)"></i>
                    </el-col>
                  </el-row>
                </div>
              <!--渲染职能-->
              <div class="position-content" >
                <span class='type-name'
                v-for="child in item.positionList"
                :key="child.id">{{child.positionName}}、</span>
              </div>
            </div>
            <!--系统渲染-->
            <!--添加数据池-->
            <div v-if="systemIsShow">
              <!--保养类型-->
              <el-row :gutter="20" class="botm-box category">
                <el-col :span="24" class="item-title">
                  <el-input v-model="inputObj.name"
                            placeholder="请输入保养类型"
                            clearable></el-input>
                </el-col>
              </el-row>
              <!--任务类型-->
              <el-row :gutter="20" class="botm-box">
                <el-col :span="24" class="item-title">
                  <el-select v-model="inputObj.bizTaskTypeId"  placeholder="选择任务类型">
                    <el-option
                      v-for="item in projectCategoryList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-col>
              </el-row>
              <el-row :gutter="20" class="botm-box">
                <el-col :span="18" class="item-title" >
                  <div class="positionBox">
                    <span v-if="!positionIds.length"
                    class="title-position">请选择职能</span>
                    <span v-for="item in positionIds" :key="item.id">
                    {{item.positionName? item.positionName: item.name}}、
                    </span>
                  </div>
                </el-col>
                <el-col :span="4">
                  <el-button size="mini" @click="getDeptTreeList(projectId)"
                  class="spaceBtn">选择</el-button>
                </el-col>
              </el-row>
              <!--底部操作-->
              <div>
                <el-button @click="handleCancle" >取消</el-button>
                <el-button @click="addPlanTaskKind">确认</el-button>
              </div>
            </div>
            <!--添加部门按钮-->
            <el-button
              style="margin-top: 30px;"
              size="medium"
              type="primary"
              @click="handleAddPent"
            >添加部门</el-button>
            <!--添加部门按钮-->
          </div>
        </el-col>
        <!--左侧保养类型 end-->
        <!--右侧列表-->
        <el-col :span="18">
          <div class="grid-content" style="height: 800px;">
            <!--项目搜索-->
            <div class="header-box">
              <!--<el-scrollbar tag="div">-->
              <!--头部tab栏-->
                <div class="tabs">
                  <!--tab-->
                    <div class="item-tab"
                         :class="[{'active-tab': child.id === activeTab}]"
                         v-for="child in tabArr"
                         @click="handleChangePage(child.id)"
                         :key="child.id">
                      <span class="text-content">{{child.name}}</span>
                      <span class="icon">
                    <i class="el-icon-edit-outline" @click="editSonSystem(child)"></i>
                    <i class="el-icon-delete" @click="handleSonSystem(-1, '删除成功',child)"></i>
                  </span>
                    </div>
                    <!--添加-->
                    <div class="plus-icon" @click="handleAddSystem">
                      <i class="el-icon-plus"></i>
                    </div>
                </div>
              <!--头部tab栏 end -->
              <!--</el-scrollbar>-->
            </div>
            <el-scrollbar tag="div">
              <el-table
                :data="tableData"
                class="tables"
                style="width: 100%">
                <el-table-column
                  label="操作"
                  width="80px"
                  >
                  <template slot-scope="scope">
                    <div>
                      <i class="el-icon-edit-outline el-icon"
                         @click="editKeepSystem(scope.row,2)"
                         style="margin-right: 10px"></i>
                      <i class="el-icon-delete el-icon"
                         @click="delSystemDate(scope.row)"></i>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="name"
                  label="保养类别"
                >
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.name"
                              :class="{planBorderShow:planActive === scope.row.taskId}"
                              :disabled="planActive !== scope.row.taskId"
                              @change="rowTableChange(scope.row)"></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="remark"
                  label="任务要求"
                >
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.content"
                              :class="{planBorderShow:planActive === scope.row.taskId}"
                              :disabled="planActive !== scope.row.taskId"
                              @change="rowTableChange(scope.row)"></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="spaceList"
                  label="服务区域"
                  width="200px">
                  <template slot-scope="scope">
                    <div class="area"
                      @click="handleChoiceSpace(scope.row)"
                     :class="{planBorderShow:planActive === scope.row.taskId}">
                      <span v-for="item in scope.row.spaceList" :key="item.id">
                      {{item.spaceName?item.spaceName:item.name}},</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="periodName"
                  label="周期"
                >
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.period"
                               @change="rowTableChange(scope.row)"
                               :class="{planBorderShow:planActive === scope.row.taskId}"
                               :disabled="planActive !== scope.row.taskId">
                      <el-option
                        v-for="item in dateList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="vendorName"
                  label="负责方">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.vendor"
                               @change="rowTableChange(scope.row)"
                               :class="{planBorderShow:planActive === scope.row.taskId}"
                               :disabled="planActive !== scope.row.taskId">
                      <el-option
                        v-for="item in serviceList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </template>
                </el-table-column>
              </el-table>
              <el-row>
                <el-col :span="8" style="margin-top:30px;">
                  <el-button  v-if="isPlanBtn" @click="confrimTask">确认</el-button>
                </el-col>
              </el-row>
              <!--新增数据一栏-->
              <el-form ref="formObjRef"
                       :model="formObj"
                       label-width="80px"
                       v-if = "isPlan"
                       key="formObj1">
                <el-row :gutter="20" class="left-box"
                 v-for="(formObj, index) in formObjArr" :key="formObj.id">
                  <el-col :span="3">
                    <el-button @click="confrimTask(formObj, index)">确认</el-button>
                  </el-col>
                  <el-col :span="4">
                    <el-input type="text" placeholder="保养类别(必填)"
                              clearable
                              v-model="formObj.name"></el-input>
                  </el-col>
                  <el-col :span="4">
                    <el-input type="text" placeholder="任务要求"
                              clearable v-model="formObj.content"></el-input>
                  </el-col>
                  <el-col :span="6">
                    <!--空间选择-->
                    <el-row>
                      <el-col :span="18">
                        <div class="positionBox ">
                          <span v-if="formObj.spacecheckedList && !formObj.spacecheckedList.length"
                                class="title-position">请选择空间(必选)</span>
                                <span v-for="item in formObj.spacecheckedList" :key="item.id">
                          {{item.name}}、
                          </span>
                        </div>
                      </el-col>
                      <el-col :span="6">
                        <el-button size="mini" @click="moveSpace(index)"
                        class="spaceBtn">选择</el-button>
                      </el-col>
                    </el-row>
                    <!--空间-->
                  </el-col>
                  <el-col :span="3">
                    <el-select v-model="formObj.period"
                               clearable
                               placeholder="周期(必填)">
                      <el-option
                        v-for="item in dateList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </el-col>
                  <el-col :span="4">
                    <el-select v-model="formObj.vendor"
                               clearable placeholder="服务方(必填)">
                      <el-option
                        v-for="item in serviceList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </el-col>
                </el-row>
              </el-form>
              <!--新增数据一栏-->
              <!--按钮-->
              <div>
                <el-button
                  style="margin-top: 30px;"
                  size="medium"
                  type="primary"
                  @click="addFormObj"
                >新增</el-button>
                <el-button
                  style="margin-top: 30px;"
                  size="medium"
                  type="primary"
                  @click="addPpm"
                >下一步</el-button>
              </div>
              <!--按钮-->
            </el-scrollbar>
          </div>
        </el-col>
        <!--右侧列表 end-->
      </el-row>
      <!--空间弹框-->
      <el-dialog
        width="35%"
        :visible="spaceVisible"
        title="选择服务区域">
        <div class="dialog-content m-t-30 p-l-25 p-r-25">
          <div class="choose-position">
            <!--空间-->
            <choice-space :data="data"
              @getNodeTree="getNodeTree"
              @getCheckedArr="getCheckedArr"
              ref="tree"
              :spaceIdList="spaceIdList"
              >
            </choice-space>
            <!--空间-->
            <!--已经选的-->
            <div class="choice-text">
              <span>已选空间</span>
              <div>
                <el-scrollbar tag="div">
                  <div class="space-title" v-for="obj in checkedList" :key="obj.id">
                    <i class="el-icon-close" @click="delNode(obj)"></i>
                    <span>{{obj.path?obj.path:obj.spaceName}}</span>
                  </div>
                </el-scrollbar>
              </div>
            </div>
            <!--已经选的 end-->
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
        <el-button @click="spaceVisible = false">取 消</el-button>
        <el-button type="primary" @click="spaceCheckConfim">确 认</el-button>
      </span>
      </el-dialog>
      <!--空间弹框 end-->
      <!--选择职能弹窗-->
      <el-dialog
        width="35%"
        :visible="funcDialogVisible"
        title="选择职能">
        <div class="dialog-content m-t-30 p-l-25 p-r-25">
          <div class="choose-position">
            <el-scrollbar tag="div" style="height: 350px">
              <infinite-collapse
                :singleElection="false"
                :data="depList"
                v-if="funcDialogVisible"
                :selectedPosition="positionIds"
                @getPositionItem="getPosition"></infinite-collapse>
            </el-scrollbar>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
        <el-button @click="funcDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 认</el-button>
      </span>
      </el-dialog>
      <!--选择职能弹窗 end-->
      <!--添加系统-->
      <el-dialog
        title="添加系统"
        :visible.sync="systemVisible"
        width="24%">
        <el-form ref="systemObj" :model="systemObj" label-width="100px">
          <el-form-item label="系统名称">
            <el-input v-model="systemObj.name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button @click="systemVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSystem">确 定</el-button>
      </span>
      </el-dialog>
      <!--添加系统 end-->
      <!--底部确定取消-->
      <div class="fixed-control">
        <el-button plain @click="$cancel" >取消</el-button>
        <el-button  type="primary" @click="submitForm">保存计划并退出</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import infiniteCollapse from '../../../../../components/common/func-dialog/infinite-collapse/infinite-collapse';
import choiceSpace from '../../../../../components/common/dialog-choice-space/space-choice';

export default {
  components: { infiniteCollapse, choiceSpace },
  data() {
    return {
      systemObj: {
        name: '', // 添加系统名称
        taskId: this.$route.params.id, // 计划id
      },
      systemVisible: false, // 添加系统
      activeTab: '1', // tab 的头
      taskName: '1', // 任务搜索
      // 页面头部 tab 标题
      tabArr: [],
      positionIds: [], // 获取选中的职能
      selectedPosition: [], // 职能
      funcDialogVisible: false, // 职能
      systemIsShow: false, // 是否增加系统
      spaceVisible: false, // 空间弹框
      kindsArr: [], // 分类列表
      systemArr: [], // 系统数组
      tableData: [], // 保养列表
      projectId: this.$route.query.projectId, // 项目的id
      projectArr: [], // 项目列表
      paramsId: 0,
      // 任务类型
      projectCategoryList: [],
      formObjArr: [], //
      formObj: {
        name: '',
        period: '', // 周期
        vendor: '', // 供应商
        content: '', // 任务要求
        spaceList: [], // 空间列表
        kindId: '', // 分类
        valid: '', // 1,-1 是否有效
        spacecheckedList: [], // 选择空间的数组
      }, // 新增保养对象
      projectName: '', // 项目名称
      formObjate: {
        taskId: this.$route.params.id,
        name: '',
        lineList: [],
        list: [], // 选中的条线
      }, // 窗口 信息
      lineList: [], // 条线数组
      rules: {
        list: [{ required: true, message: '不能为空', trigger: 'change' }],
        name: [{ required: true, message: '不能为空', trigger: 'change' }],
      },
      ppmPlan: {}, //  弹出信息
      message: '', // 提示信息
      active: 0, // 默认 第一个字段 显示颜色
      dateList: [], // 周期
      serviceList: [], // 服务
      kindId: this.taskId, // 子系统的id
      isBorder: false, // input边框消失
      ActiveBorder: -1,
      isBtn: false, // 显示确定按钮
      queryObj: {}, // 系统新增编辑时的 对象
      inputObj: {
        name: '', // 系统的编辑id
        positionIds: [], // 任务职能
        bizTaskTypeId: '', // 临时任务id
        taskId: '',
      },
      taskId: this.$route.params.id, // 计划id
      isPlan: true, // 显示添加类别
      isPlanBtn: false, // 显示类别确认按钮
      planActive: 1, // table 中input 边显示
      dialogVisible: false,
      data: [], // 空间数据
      depList: [], // 职能
      checkedList: [], // 选中的节点
      checkedArr: [], // 选中的节点树
      parentId: '', // lv1 系统的id
      sonId: '', // lv2 系统的id
      keepId: '', // lv3 保养类型的id
      childLv3Id: '', // lv3 選擇當前類型的id;
      activeFormObj: -1, // 新增保养类型时 选择当前对象的下标
      spaceIdList: [], // 選中空間的id
      activeIndex: -1, // 点击编辑时 获得当前的下标index
    };
  },
  methods: {
    /**
    * lv1 添加部门按钮
    * */
    handleAddPent() {
      this.systemIsShow = !this.systemIsShow;
      this.positionIds = [];
    },
    /**
    * lv 3 點擊服務區域 展開 空間彈框
    *
    * */
    handleChoiceSpace(obj) {
      if (this.isPlanBtn && obj.id === this.childLv3Id) {
        this.spaceVisible = true;
        this.spaceFormat();
        this.spaceIdList = obj.spaceList.map(son => son.spaceId);
        // this.checkedList = JSON.parse(JSON.stringify(obj.spaceList));
        // this.$refs.tree.getChecked();
      }
    },
    /**
    * 选中空间弹窗的点击 确认
    *
    * */
    spaceCheckConfim() {
      if (this.spaceIdList.length) {
        this.tableData.forEach((son) => {
          if (son.id === this.childLv3Id) {
            son.spaceList = JSON.parse(JSON.stringify(this.checkedList));
          }
        });
      } else {
        this.formObjArr[this.activeFormObj].spacecheckedList
          = JSON.parse(JSON.stringify(this.checkedList));
        this.formObjArr[this.activeFormObj].spaceList = this.checkedList.map(item => item.id);
      }
      this.spaceVisible = false;
    },
    /**
    *手动获取当前下的系统
    *
    * */
    handleSearchChild(index, id) {
      this.active = index;
      this.parentId = id;
      this.handleGetSonSystem(id);
    },
    /**
    * 获取任务类型
    *
    * */
    getTaskType() {
      this.$http.post(this.api.clientApi.getTaskType, {
        basicTaskType: 1, // 这边表示 临时任务
        ids: null,
        projectId: this.projectId,
      }).then((res) => {
        this.projectCategoryList = res.list;
      });
    },
    /**
    * 保存并计划退出
    * */
    submitForm() {
      this.$message.success('新增成功');
      this.$deleteTag(); // 关闭新增页
      this.$router.push({ name: 'ppmCenter' });
    },
    /**
    * 点击下一步.跳转 ppm 周期表
    *
    * */
    addPpm() {
      this.$router.push({
        name: 'ppmAddCalender',
        params: { id: this.parentId },
        query: { projectId: this.projectId },
      });
    },
    /**
    *
    * 点击新增 添加一条数据
    * */
    addFormObj() {
      const obj = {
        name: '',
        period: '', // 周期
        vendor: '', // 供应商
        content: '', // 任务要求
        spaceList: [], // 空间列表
        kindId: '', // 分类
        valid: '', // 1,-1 是否有效
        spacecheckedList: [], // 空间数组
      };
      this.formObjArr.push(obj);
      this.isPlan = true;
      this.isPlanBtn = false;
      this.planActive = -1;
      this.keepId = '';
    },
    /**
    *
    * 删除当前选中的 节点
    * */
    delNode(obj) {
      this.checkedList.forEach((child, index) => {
        if (child.id === obj.id) {
          this.checkedList.splice(index, 1);
        }
      });
      this.$refs.tree.setCheckedKeys(this.checkedList.map(item => item.id));
    },
    /**
    *选中的节点树
    *
    * */
    getCheckedArr(arr) {
      this.checkedList = arr;
    },
    /**
     *
     * lv2 获取保养类型下 的系统
     * */
    handleGetSonSystem(id) {
      this.$http.get(this.api.clientApi.getSonSystem, {
        params: { parentId: id } }).then((res) => {
        this.tabArr = res;
        if (res.length > 0) {
          this.activeTab = res[0].id;
          this.sonId = res[0].id;
          this.getRightListBysystemId(this.sonId);
        } else {
          this.getRightListBysystemId(null);
        }
      });
    },
    /**
    *
    * lv2 系统新增/编辑/删除
    * */
    handleSonSystem(valid, msg, obj) {
      if (obj !== null) {
        this.systemObj = obj;
      }
      this.systemObj.pid = this.parentId;
      this.systemObj.valid = valid; // 删除 有效
      this.systemObj.taskId = this.taskId;
      this.$http.post(this.api.clientApi.addSystemSon, this.systemObj).then(() => {
        this.$message.success(msg);
        this.handleGetSonSystem(this.parentId);
        this.systemObj = {};
        this.systemVisible = false;
      });
    },
    /**
    * lv2 编辑系统
    *
    * */
    editSonSystem(obj) {
      this.sonId = obj.id;
      this.systemObj = obj;
      this.systemVisible = true;
    },
    /**
    *  lv2 添加系统弹窗 确定
    *
    * */
    handleSystem() {
      if (!this.systemObj.name) {
        this.$message.error('请填写系统名称');
        return false;
      }
      if (!this.sonId) {
        this.handleSonSystem(1, '新增成功', this.systemObj);
        this.sonId = '';
      } else {
        this.handleSonSystem(1, '编辑成功', this.systemObj);
      }
      return true;
    },
    /**
     *
     * lv2 分别取获取对应的列表数据
     * */
    handleChangePage(val) {
      this.activeTab = val;
      this.sonId = val;
      this.getRightListBysystemId(val);
      this.formObjArr = [];
    },
    /**
    * lv1 查询保养类型的列表
    *
    * */
    getKindsArr() {
      this.$http.get(this.api.clientApi.getKindsArr, {
        params: { planId: this.taskId } }).then((res) => {
        if (res.length) {
          this.kindsArr = res;
          this.parentId = res[0].id;
          this.handleGetSonSystem(res[0].id);
        }
      });
    },
    /**
     * lv 2手动添加 tab的系统
     *
     * */
    handleAddSystem() {
      if (!this.parentId) {
        this.$message.warning('左菜栏的保养类型不能为空');
        return false;
      }
      this.systemVisible = true;
      return true;
    },
    /**
    * lv1 分类系统的删除,编辑,新增
    *
    * */
    handleKindsArr(valid, msg, obj) {
      if (!obj.name) {
        this.$message.error('请输入保养类型');
        return false;
      }
      if (!obj.bizTaskTypeId) {
        this.$message.error('请选择任务类型');
        return false;
      }
      if (!obj.positionIds.length) {
        this.$message.error('请选择职能');
        return false;
      }
      obj.valid = valid;
      obj.taskId = this.taskId;
      this.$http.post(this.api.clientApi.addPlanTaskKind, obj).then(() => {
        this.$message.success(msg);
        this.getKindsArr();
        this.inputObj = {};
        this.systemIsShow = false;
      });
      return true;
    },
    /**
     *lv1 分类的增加
     *
     * */
    addPlanTaskKind() {
      this.inputObj.positionIds = this.positionIds.map(obj => obj.id);
      if (this.inputObj.id) {
        this.handleKindsArr(1, '编辑成功', this.inputObj);
      } else {
        this.handleKindsArr(1, '新增成功', this.inputObj);
      }
    },
    /**
     * 获得选中的职能
     *
     * */
    getPosition(data) {
      this.positionIds = data; // 拿到
    },
    /**
    *lv1 分类的 取消按钮
    *
    * */
    handleCancle() {
      this.positionIds = [];
      this.inputObj = {};
    },
    /**
     *lv1 分类的编辑
     *
     * */
    editSystem(item) {
      this.systemIsShow = true;
      this.inputObj = JSON.parse(JSON.stringify(item));
      item.positionList.forEach((obj) => {
        obj.id = obj.positionId;
        obj.checked = true;
      });
      this.positionIds = item.positionList;
    },
    /**
     *lv1 分类的删除
     *
     * */
    delSystem(item) {
      this.inputObj = item;
      this.inputObj.positionIds = item.positionList.map(obj => obj.id);
      this.handleKindsArr(-1, '删除成功', this.inputObj);
    },
    /**
    *
    * 职能弹框点击确定
    * */
    confirm() {
      this.inputObj.positionIds = this.positionIds;
      this.funcDialogVisible = false;
    },
    /**
     *查询部门结构
     *
     * */
    getDeptTreeList(id) {
      if (!id) {
        this.$message.error('请选择所属项目');
        return false;
      }
      this.funcDialogVisible = true;
      this.$http.get(this.api.operationApi.companyMsg, {
        params: {
          projectId: id,
          positionValid: '',
          deptValid: '',
        },
      }).then((res) => {
        this.depList = res;
      });
      return true;
    },
    /**
     * 点击移动空间
     *
     * */
    moveSpace(index) {
      this.activeFormObj = index;
      if (this.projectId) {
        this.spaceVisible = true;
        this.spaceIdList = [];
      } else {
        this.$message.error('请先选择项目');
      }
    },
    /**
     *点击移动 弹框出现 空间列表
     *
     * */
    spaceFormat() {
      this.$http.get(this.api.spaceApi.spaceFormat, { params: { projectId: this.projectId,
      } }).then((res) => {
        this.data = JSON.parse(JSON.stringify(res));
        this.getDataChecked(this.data);
      });
    },
    /**
     *
     * 给data Tree 添加checked
     * */
    getDataChecked(arr) {
      if (arr && arr.length > 0) {
        arr.forEach((child) => {
          this.$set(child, 'checked', false);
          if (child.spaceSonList && child.spaceSonList.length > 0) {
            this.getDataChecked(child.spaceSonList);
          }
        });
      }
    },
    /**
     *获取选定的空间节点 给显示框
     *
     * */
    getNodeTree(val) {
      console.log(val);
    },
    /**
     *取消按钮
     *
     * */
    handleClose(val) {
      this.spaceVisible = val;
    },
    /**
     * lv 3获取周期列表
     * */
    getDateList() {
      this.$http.get(this.api.dictionaryApi.getDateList).then((res) => {
        this.dateList = res;
      });
    },
    /**
     * lv3 获取服务列表
     * */
    getBusinessList() {
      this.$http.get(this.api.dictionaryApi.getBusinessList).then((res) => {
        this.serviceList = res;
      });
    },
    /**
     *lv3 根据系统id 获取系统信息
     *
     * */
    getRightListBysystemId(id) {
      this.tableData = [];
      if (!id) {
        return false;
      }
      this.kindId = id;
      this.$http.get(
        this.api.clientApi.getUpkeep, {
          params: {
            kinId: id,
          },
        },
      ).then((res) => {
        res.forEach((item) => {
          item.id = item.taskId;
        });
        this.tableData = res;
      });
      return true;
    },
    /**
     *
     * lv2 添加系统
     * */
    addystemUpdate() {
      this.inputObj.id = '';
      this.systemIsShow = !this.systemIsShow;
      this.isBtn = !this.isBtn;
    },
    /**
    * lv3 点击编辑按钮
    * */
    editKeepSystem(item) {
      // this.spaceIdList = JSON.parse(JSON.stringify(item.spaceList));
      this.childLv3Id = item.id;
      this.$nextTick(() => {
        this.planActive = item.taskId;
      });
      this.isPlanBtn = true;
      this.isPlan = false;
      this.keepId = item.taskId;
      this.formObj = item;
    },
    /**
     * lv3 保养类型的新增，编辑, 删除
     *
     * */
    addTaskData(valid, msg, obj, index) {
      if (!this.sonId) {
        this.$message.error('请先添加系统');
        return false;
      }
      if (!obj.name) {
        this.$message.error('保养类别名称不能为空');
        return false;
      }
      if (!obj.content) {
        this.$message.error('请填写任务要求');
        return false;
      }
      if (!obj.spaceList.length) {
        this.$message.error('请选择空间');
        return false;
      }
      if (!obj.period) {
        this.$message.error('周期不能为空');
        return false;
      }
      if (!obj.vendor) {
        this.$message.error('责任方不能为空');
        return false;
      }
      obj.kindId = this.sonId;
      obj.valid = valid;
      this.$http.post(this.api.clientApi.addTaskData, obj).then(() => {
        this.$message.success(msg);
        this.planActive = -1;
        this.isPlanBtn = false;
        this.formObjArr.splice(index, 1);
        this.getRightListBysystemId(this.sonId);
      });
      return true;
    },
    /**
    *  lv3 保养类型的新增，编辑,
    *
    * */
    confrimTask(item, index) {
      if (this.keepId) {
        this.formObj.spaceList.forEach((son) => {
          if (son.id) {
            son.spaceId = son.id;
          }
        });
        this.formObj.spaceList = this.formObj.spaceList.map(child => child.spaceId);
        this.addTaskData(1, '编辑成功', this.formObj);
        this.keepId = '';
      } else {
        this.addTaskData(1, '新增成功', item, index);
      }
    },
    /**
     *lv 3 删除保养类型
     *
     * */
    delSystemDate(obj) {
      obj.kindId = this.kindId;
      obj.valid = -1;
      this.formObj = JSON.parse(JSON.stringify(obj));
      this.formObj.spaceList = this.formObj.spaceList.map(child => child.id);
      this.addTaskData(-1, '删除成功', this.formObj);
    },
    /**
     *保养编辑触发change事件
     *
     * */
    rowTableChange(obj) {
      this.formObj = obj;
    },
    /**
     *点击添加类别
     *
     * */
    addTaskDataType() {
      this.isPlan = !this.isPlan;
    },
  },
  watch: {
  },
  created() {
    // this.getProjectList(); // 查询项目
    this.getTaskType();
    this.getKindsArr(); // 查询分类列表
    this.getBusinessList(); // 获取服务方
    this.getDateList(); // 获取周期
    this.spaceFormat(); // 获取空间列表
    // this.getServiceSonList();
    // this.getLineList();
    // this.getServiceList();
  },
  mounted() {
  },
};
</script>
<style type="text/less" lang="less" scoped>
  .servicePlan {
    .item-content {
      display: flex;
      justify-content: space-between;
      .item-title {
        color: #14112d;
      }
      .activeColor {
        /*color: #14112d;*/
        color: #647fd8;
        .edit-icon {
          display: block;
        }
      }
      .edit-icon {
        display: none;
        width: 100px;
        & > .el-col {
          margin-right: 20px;
          cursor: pointer;
        }
      }
      &:hover {
        .edit-icon {
          display: block;
        }
        /*.item-title{*/
        /*color: #647fd8;*/
        /*}*/
      }
    }
    .grid-content {
      min-height: 2000px;
      /*height: 100vh;*/
      background: #fff;
      border-radius: 5px;
      padding: 15px 30px;
      width: 100%;
      position: relative;
      .header-box {
        position: absolute;
        top: -40px;
        left: 0px;
        width: 100%;
        padding-bottom: 15px;
        .tabs {
          display: flex;
          justify-content: left;
          line-height: 40px;
          align-items: flex-end;
          width: 100%;
          overflow-x: auto;
          overflow-y: hidden;
          .plus-icon {
            width: 50px;
            height: 40px;
            transform: skew(11deg);
            background: #ececed;
            margin-left: -2px;
            & > .el-icon-plus {
              color: #7b8aa4;
              transform: skew(-11deg);
              font-size: 22px !important;
              background: transparent;
              position: relative;
              left: 8px;
              top: 2px;
            }
            .el-icon-plus:hover {
              color: #7b8aa4 !important;
              border-color: transparent !important;
            }
          }
          & > .item-tab:first-child {
            margin-left: 0px;
          }
          .item-tab {
            transition: all .5s;
            margin-left: -8px;
            height: 0;
            border-bottom: 40px solid #ececed;
            border-left: 8px solid transparent;
            border-right: 8px solid transparent;
            text-align: left;
            cursor: pointer;
            position: relative;
            padding: 0 10px;
            display: flex;
            justify-content: space-between;
            .text-content{
              width: 85px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              height: 40px;
            }
            .icon {
              height: 40px;
              width: 50px;
              & > i {
                margin-right: 5px;
              }
            }
          }
          .active-tab {
            border-bottom: 40px solid #fff;
            z-index: 1000;
          }

        }
      }
      .title {
        font-size: 16px;
        margin-bottom: 15px;
        color: #c5cbd2;
      }
      h3 {
        font-size: 14px;
        color: #c5cbd2;
        font-weight: normal;
        margin: 15px auto 30px;
      }
      .item {
        padding: 10px 0px;
        color: #14112d;
        font-size: 16px;
        cursor: pointer;
        .activeColor {
          color: #647fd8;
        }
        &:hover {
          .item-icon {
            display: block;
            color: #000;
          }
        }
      }
      .left-box {
        margin: 20px 0px;
        color: #000;
      }
      .botm-box {
        margin: 20px 0;
      }
      .positionBox {
        border: 1px solid #e5e5e5;
        min-height: 34px;
        line-height: 34px;
        padding: 0 5px;
        margin-top: 4px;
        display: flex;
        font-size: 14px;
        justify-content: left;
        flex-wrap: wrap;
        .title-position {
          color: #c5cbd2;
          font-size: 16px;
          line-height: 34px;
          padding-left: 15px;
        }
      }
      .type-name {
        color: #7b8aa4;
        font-size: 12px;
        padding: 2px 3px;
      }
      .position-content {
        margin-top: 10px;
      }
    }
    .el-icon {
      cursor: pointer;
    }
    .choice-text {
      margin-top: 20px;
      display: flex;
      justify-content: space-between;
      padding: 0px 20px;
      & > div {
        border-radius: 4px;
        border: solid 1px #e5e5e5;
        height: 150px;
        width: 85%;
        display: flex;
        justify-content: left;
        flex-wrap: wrap;
        padding: 5px 10px;
        .space-title {
          height: 30px;
          line-height: 30px;
          border-radius: 4px;
          color: #647fd8;
          padding: 0 10px;
          background: #eff2fb;
          margin-right: 10px;
          margin-bottom: 10px;
          display: inline-block;
          & > i {
            font-weight: 600;
            cursor: pointer;
          }
        }
      }
    }
    .area{
      /*border:1px solid #e9e9e9;*/
      color:#14112d;
      /*cursor: not-allowed;*/
      font-size: 14px;
      border-radius: 2px;
      height: 36px;
      line-height: 36px;
      width: 100%;
      &>span{
        display: inline!important;
      }
    }
  }
</style>
