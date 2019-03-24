/**
* Created by c on 2018/12/21.
*/
<template>
	<div class="tracker-config-add">
    <panelContentHeader></panelContentHeader>
    <div class="header m-b-30">
      <div v-content class="p-b-20">
        <el-row>
          <el-col :span="8" class="border-right">
            <el-form :model="form" label-width="100px" ref="form" :rules="rules">
              <el-form-item label="功能名称" class="p-r-30" prop="name">
                <el-input v-model="form.name" v-if="!this.isCommon"
                ></el-input>
                <span v-else>{{$route.query.name}}</span>
              </el-form-item>
              <el-form-item label="功能图标" class="p-r-30" prop="iconId">
                <el-input v-model="form.iconId" v-show="false"></el-input>
                <span class="img-item cursor m-l-30"
                      :class="{'box-shadow-none': !form.iconId}"
                      v-if="!this.isCommon"
                      @click="openIconDialog">
                <img :src="form.icon.value3" v-if="form.iconId" class="active-img"/>
                <img
                  src="../../../../assets/img/icon-img/icon-upload.jpg"  v-else />
                </span>
                <span v-else class="m-l-30 img-item cursor ">
                  <img :src="`../../../../../static/img/icon-${$route.query.icon}.png`"
                  />
              </span>
              </el-form-item>
            </el-form>
            <!--<info-item-ui title="功能名称" is-require>-->
              <!--<span class="p-l-30">-->
                <!--<el-input-->
                  <!--v-model="form.name"-->
                  <!--maxlength="6"-->
                  <!--v-if="!this.isCommon"-->
                  <!--class="w-60"></el-input>-->
                <!--<span v-else>{{$route.query.name}}</span>-->
              <!--</span>-->
            <!--</info-item-ui>-->
            <!--<info-item-ui title="功能图标" last is-require>-->
              <!--<span class="m-l-30 img-item cursor"-->
                    <!--:class="{'box-shadow-none': !form.icon.id}"-->
                    <!--@click="openIconDialog" v-if="!this.isCommon">-->
                <!--<img :src="form.icon.value3" v-if="form.icon.id"/>-->
                <!--<img-->
                  <!--src="../../../../assets/img/icon-img/icon-upload.jpg"  v-else />-->
              <!--</span>-->
              <!--<span v-else class="m-l-30 img-item cursor ">-->
                  <!--<img :src="`../../../../../static/img/icon-${$route.query.icon}.png`"-->
                       <!--/>-->
              <!--</span>-->
            <!--</info-item-ui>-->
          </el-col>
          <el-col :span="8" class="p-l-30 border-right" v-if="!this.isCommon">
            <div class="task-type">
              <div class="title">
                功能类型
              </div>
              <div class="content m-t-30">
                <span class="item m-r-15 m-b-15 cursor active"
                      v-for="item in funcList"
                      v-if="form.secondLvPermissionId === item.id"
                      :key="item.id"
                >{{item.nameCn}}</span>
              </div>
            </div>
          </el-col>
          <el-col :span="8" class="p-l-30" v-if="form.secondLvPermissionId === '2'">
            <div class="task-type">
              <div class="title flex-justify-between flex-center">
                任务标签
                <el-button size="mini" plain  @click="openTaskDialog">选择</el-button>
              </div>
              <div class="content m-t-30">
                <span class="tag m-r-15 m-b-5"
                      :key="item.id"
                      v-if="form.taskTagList.indexOf(item.id) !== -1"
                      v-for="item in tagList">{{item.name}}</span>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="content p-b-50">
      <div v-content>
        <div v-content-title>
          参与职能与权限分配配置
        </div>
        <!--表格-->
        <el-table
          :data="tableData"
          border
          style="width: 100%"
          class="no-hover-table"
        >
          <el-table-column
            label="参与职能"
            class-name="cell-flex-column"
            width="240px"
            prop="name">
            <template slot="header" slot-scope="scope">
              <div class="flex-justify-between">
                <span>参与职能</span>
                <span class="cursor main-blue" @click="openDialog(true,tableData)">添加</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            v-for="item in tableHead"
            :label="item.label"
            :key="item.property"
            :prop="item.property"
            class-name="cell-flex-column"
          >
            <template  slot-scope="scope">
              <div
                class="w-100 m-b-15"
                v-for="child in scope.row[item.property]"
                :key="child.id">
                <div class="title flex-justify-between">
                  <span>
                    {{child.nameCn}}
                  </span>
                  <span>
                    <el-checkbox v-model="child.checked"></el-checkbox>
                  </span>
                </div>
                <div v-if="child.category !== '2' ">
                  <div class="cursor main-blue m-t-15"
                       @click="openDialog(false,child)"
                       v-if="child.positionIds.length > 0">
                  <span
                    v-for="(position,index) in child.positionIds"
                    :key="position.id">{{position.name}}
                    <b v-if="child.positionIds.length-1 !== index ">、</b>
                  </span>
                  </div>
                  <div
                    class="cursor main-blue m-t-15"
                    @click="openDialog(false,child)"
                    v-if="child.positionIds.length === 0 && child.checked">
                    选择
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <!--表格 end-->
      </div>
    </div>
    <!--选择职位弹窗-->
    <el-dialog
      width="35%"
      :visible="funcDialogVisible"
      title="权限与组织架构">
      <div class="dialog-content m-t-30 p-l-25 p-r-25">
        <info-item-ui
          title="功能名称"
          :label-width="100"
          align="top"
          v-if="!addRowType"
          :font="14">
          {{bottomAuthority.remark}}
        </info-item-ui>
        <info-item-ui
          title="已选职能"
          :label-width="100"
          align="top"
          :font="14">
          <div class="border p-t-5 p-l-5 p-r-5">
            <span v-for="(item,index) in positionList" :key="item.id" >{{item.name}}
            <b v-if="positionList.length-1 !== index ">、</b>
            </span>
          </div>
        </info-item-ui>
        <div class="choose-position">
          <el-scrollbar tag="div" style="height: 350px">
            <infinite-collapse
              :singleElection="false"
              :data="depList"
              v-if="funcDialogVisible"
              :selectedPosition="selectedPosition"
              @getPositionItem="getPosition"></infinite-collapse>
          </el-scrollbar>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog">取 消</el-button>
        <el-button type="primary" @click="confirmDialog">确 认</el-button>
      </span>
    </el-dialog>
    <!--选择职位弹窗-->
    <!--选择任务标签-->
    <el-dialog :visible="taskDialogVisible" width="30%" title="选择该任务相关标签">
      <div class="dialog-content m-t-30 p-l-25 p-r-25">
        <info-item-ui title="添加新标签" :label-width="100" :font="14">
          <div class="flex w-100">
            <el-input v-model="addTagName"/>
            <el-button size="mini" plain class="m-l-20" @click="addTag">添加</el-button>
          </div>
        </info-item-ui>
        <info-item-ui
          class="m-b-30"
          title="已选标签"
          :label-width="100"
          align="top"
          :font="14">
          <div class="border p-t-5 p-l-5 p-r-5">
            <span class="tag m-r-15 m-b-15"
                  :key="item.id"
                  v-if="item.checked"
                  v-for="item in tagList">{{item.name}}</span>
          </div>
        </info-item-ui>
        <info-item-ui
          title="已有标签库"
          :label-width="100"
          :font="14"
          align="top"
        >
        <el-scrollbar tag="div" style="height: 300px" class="border">
          <ul>
            <li class="tag-li flex-justify-between" v-for="item in tagList" :key="item.id">
              <span v-if="tagForm.editId !== item.id">
                <el-checkbox v-model="item.checked"></el-checkbox>
                <span class="name m-l-20">
                {{item.name}}
              </span>
              </span>
              <span class="cursor" v-if="tagForm.editId !== item.id" @click="editTagShow(item)">
                <img src="../../../../assets/img/icon-img/icon-edit.png" alt=""/>
              </span>
              <span class="inline-form-choice w-100" v-if="tagForm.editId === item.id">
                <el-input v-model="tagForm.name"></el-input>
                <el-button size="mini" plain @click="cancelEditTag">取消</el-button>
                <el-button size="mini" plain @click="confirmEditTag">确认</el-button>
              </span>
            </li>
          </ul>
        </el-scrollbar>
        </info-item-ui>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelTaskDialog">取 消</el-button>
        <el-button type="primary" @click="confirmTaskDialog">确 认</el-button>
      </span>
    </el-dialog>
    <!--选择任务标签 end-->
    <!--选择icon-->
    <el-dialog
      :visible="iconDialogVisible"
      width="750px"
      title="选择一个常用的图标"
    >
      <div class="el-content icon-list">
        <span
          v-for="(item,index) in iconList"
          :key="index"
          @click="chooseIcon(item)"
          :class="{'m-b-0': index > 4}">
          <img :src="item.value3" v-if="iconItem.id !== item.id" alt=""/>
          <img :src="item.value1" v-else class="active" alt=""/>
        </span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeIconDialog">取 消</el-button>
        <el-button type="primary" @click="confirmIconDialog">确 认</el-button>
      </span>
    </el-dialog>
    <!--选择icon end-->
    <!--保存返回-->
    <div class="fixed-control">
      <el-button plain @click="$cancel" >取消</el-button>
      <el-button  type="primary" @click="submit">确定</el-button>
    </div>
    <!--保存返回 end-->
	</div>
</template>
<script>
import infiniteCollapse from '../../../../components/common/func-dialog/infinite-collapse/infinite-collapse';

export default {
  name: 'tracker-config-add',
  components: { infiniteCollapse },
  data() {
    return {
      projectId: this.$route.params.projectId, // 项目id
      queryId: this.$route.params.queryId, // 一级权限id 或者二级权限id 根据此id查询子节点
      permissionId: this.$route.params.id, // 该权限id
      type: this.$route.query.taskType, // 标识 任务类功能 公共功能 其他功能
      projectPermission: [], // 项目权限
      bottomAuthority: {}, // 底层权限 职能列表标记 推出是哪个权限
      funcDialogVisible: false, // 弹窗显示
      taskDialogVisible: false, // 任务弹窗显示
      iconDialogVisible: false, // icon选择弹窗
      iconItem: {}, // 选中的icon
      addRowType: true, // 标记添加表格一行还是行内的四级权限
      positionList: [], // 弹窗选中的职能对象列表
      funcList: [],
      tableHead: [], // 表头
      tableRow: {}, // 表格数据模板
      tableData: [], // 表格数据
      depList: [], // 部门列表
      tagList: [], // 标签列表
      iconList: [], // icon 列表
      form: {
        name: '',
        taskTagList: [], // 任务标签
        iconId: null,
        icon: {},
      },
      addTagName: '', // 新增标签的名称
      rules: {
        name: [
          { required: true, trigger: 'change', message: '请输入功能名称' },
          { min: 1, max: 6, message: '功能名称长度1-6' },
        ],
        iconId: [
          { required: true, trigger: 'change', message: '请选择功能图标' },
        ],
      },
      tagForm: {
        name: '',
        editId: null,
        projectId: null,
      },
    };
  },
  methods: {
    /**
     * 选择icon
     *
     * */
    chooseIcon(item) {
      this.iconItem = item;
    },
    /**
     * 打开选择icon 弹窗
     *
     * */
    openIconDialog() {
      this.iconDialogVisible = true;
      this.iconItem = this.form.icon;
    },
    /**
     * 关闭选择icon 弹窗
     *
     * */
    closeIconDialog() {
      this.iconDialogVisible = false;
    },
    /**
     * 确认选中的icon
     *
     * */
    confirmIconDialog() {
      this.iconDialogVisible = false;
      this.form.icon = JSON.parse(JSON.stringify(this.iconItem));
      this.form.iconId = this.form.icon.id;
    },
    /**
     * 获取icon 列表
     *
     * */
    getIconList() {
      this.$http.get(this.api.operationApi.getIconList)
        .then((res) => {
          this.iconList = res;
        });
    },
    /**
     * 打开选择职能弹窗
     *  type 是否为添加一行数据
     *
     * */
    openDialog(type, data) {
      this.addRowType = type;
      if (!this.addRowType) {
        this.bottomAuthority = data;
        this.positionList = data.positionIds;
      } else {
        this.positionList = data;
      }
      this.funcDialogVisible = true;
    },
    /**
     * 确认弹窗
     * 根据addRowType 判断是添加的那种类型的职能
     * */
    confirmDialog() {
      if (this.addRowType) {
        // 这里是添加一行的数据
        // 循环选择的职能 根据id判断列表里面是否有这条数据
        const ids = this.tableData.map(v => v.id); // 取出表格数据的id
        this.positionList.forEach((item) => {
          const obj = JSON.parse(JSON.stringify(this.tableRow)); // 拷贝模板数据
          if (ids.indexOf(item.id) === -1) { // 把表格数据没有的加入
            obj.name = item.name;
            obj.remark = item.remark;
            obj.category = item.category;
            obj.id = item.id;
            this.tableData.push(obj);
          }
        });
        // 循环表格 把取消的职能删掉
        this.tableData = this.tableData.filter(v => this.selectedPosition.indexOf(v.id) !== -1);
      } else {
        // 这里是给四级权限添加职能
        const ids = this.bottomAuthority.positionIds.map(v => v.id); // 去除底层权限id
        this.positionList.forEach((item) => {
          if (ids.indexOf(item.id) === -1) {
            this.bottomAuthority.positionIds.push(item);
          }
        });
        this.bottomAuthority.positionIds.forEach((item, index) => {
          if (this.selectedPosition.indexOf(item.id) === -1) {
            this.bottomAuthority.positionIds.splice(index, 1);
          }
        });
      }
      this.funcDialogVisible = false;
    },
    /**
     * 获得选中的职能
     *
     * */
    getPosition(data) {
      this.positionList = data;
    },
    /**
     * 取消弹窗
     *
     * */
    cancelDialog() {
      this.funcDialogVisible = false;
    },
    /**
     * 根据一级id查询二级权限
     *
     * */
    getPermission() {
      this.$http.get(
        this.api.operationApi.getPermissionTree, { params: { id: this.queryId } })
        .then((res) => {
          this.funcList = res.children;
          this.$http.get(
            this.api.operationApi.getBizTaskTypeDetails, { params: { id: this.permissionId } })
            .then((data) => {
              this.form = data;
              this.$route.meta.title = data.name;
              document.title = `${data.name} - OverLord`;
              this.form.icon = data.iconDict;
              this.form.iconId = data.iconDict.id;
              // 取出选择的标签
              const tagIds = data.projectTags.map(v => v.id);
              this.form.taskTagList = tagIds;
              this.tagList.forEach((item) => {
                if (tagIds.indexOf(item.id) !== -1) {
                  item.checked = true;
                }
              });
              const tree = this.funcList.filter(v => v.id === this.form.secondLvPermissionId);
              this.getTable(tree[0].children);
            });
        });
    },
    /**
     * 查询公共权限 子节点
     *
     * */
    getCommonPermission() {
      this.$http.get(this.api.operationApi.getPermissionByRoot, { params: { id: this.queryId } })
        .then((res) => {
          // 如果是公共功能配置
          this.$route.meta.title = res.nameCn;
          document.title = `${res.nameCn} - OverLord`;
          const lv4Arr = [];
          res.children.forEach((item) => {
            item.children.forEach((child) => { lv4Arr.push(child.id); });
          });
          this.$http.post(
            this.api.operationApi.getCommonPermissionDetails,
            { permissionIds: lv4Arr, projectId: this.projectId })
            .then((data) => {
              this.form.positionPermissions = data;
              this.getTable(res.children);
            });
        });
    },
    /**
     * 处理表格模板
     *
     * */
    getTableRow(list) {
      list.forEach((item, index) => {
        const propsData = [];
        item.children.forEach((children) => {
          propsData.push({
            id: children.id,
            remark: children.remark,
            category: children.category,
            name: children.name,
            nameCn: children.nameCn,
            lv: children.lv,
            checked: false,
            positionIds: [], // 四级权限绑定的职能
          });
        });
        this.tableRow.id = null;
        this.tableRow.category = null;
        this.tableRow.remark = null;
        this.tableRow.name = null;
        this.tableRow.nameCn = null;
        this.tableRow[`props${index}`] = propsData;
      });
    },
    /**
     * 显示动态表格数据
     *
     * */
    getTable(list) {
      this.tableHead = [];
      const row = {}; // 每一行的数据
      list.forEach((item, index) => {
        const propsData = [];
        this.tableHead.push({ label: item.nameCn, property: `props${index}` });
        item.children.forEach((children) => {
          propsData.push({
            id: children.id,
            remark: children.remark,
            category: children.category,
            name: children.name,
            nameCn: children.nameCn,
            positionIds: [], // 四级权限绑定的职能
          });
        });
        row.id = null;
        row.remark = null;
        row.name = null;
        row[`props${index}`] = propsData;
      });
      this.form.positionPermissions.forEach((item) => {
        // 循环取出 i
        row.id = item.position.id;
        row.remark = item.position.remark;
        row.name = item.position.name;
        for (let i = 0; i < list.length; i += 1) {
          const lv3Obj = row[`props${i}`]; // 数组
          lv3Obj.forEach((lv4) => {
            // 取出 找到的对象
            const currentLvObj =
              item.positionPermissionTargetDTOS.filter(v => v.permissionDTO.id === lv4.id);
            if (currentLvObj.length !== 0) {
              lv4.checked = true;
              lv4.positionIds = currentLvObj[0].targetPositions;
            } else {
              lv4.checked = false;
              lv4.positionIds = [];
            }
          });
        }
        this.tableData.push(JSON.parse(JSON.stringify(row))); // 防止对象拷贝
      });
      this.getTableRow(list); // 处理表格每一行的模板
    },
    /**
     * 获取部门
     *
     * */
    getDep() {
      this.$http.get(this.api.operationApi.companyMsg, {
        params: {
          projectId: this.projectId,
          positionValid: null,
        },
      }).then((res) => {
        this.depList = res;
      });
    },
    /**
     * 查询标签库
     *
     * */
    getTaskTag() {
      this.$http.get(this.api.operationApi.getTskTag, { params: { projectId: this.projectId } })
        .then((res) => {
          res.forEach((item) => {
            if (this.chooseTagIds.indexOf(item.id) === -1) {
              this.$set(item, 'checked', false);
            } else {
              this.$set(item, 'checked', true);
            }
          });
          this.tagList = res;
        });
    },
    /**
     * 新增标签
     *
     * */
    addTag() {
      if (this.addTagName !== '' && this.addTagName.length < 9) {
        const obj = {
          name: this.addTagName,
          projectId: null,
        };
        this.$http.post(this.api.operationApi.addEditTag, obj)
          .then((res) => {
            if (res) {
              this.getTaskTag();
              this.$message.success('新增标签成功');
              this.addTagName = '';
            }
          });
      } else {
        this.$message.error('请输入完整信息');
      }
    },
    /**
     * 确认修改标签
     *
     * */
    confirmEditTag() {
      if (this.tagForm.name !== '' && this.addTagName.length < 9) {
        const obj = {
          name: this.tagForm.name,
          id: this.tagForm.id,
        };
        this.$http.post(this.api.operationApi.addEditTag, obj)
          .then((res) => {
            if (res) {
              this.getTaskTag();
              this.cancelEditTag();
              this.$message.success('修改标签成功');
            }
          });
      } else {
        this.$message.error('请输入完整信息');
      }
    },
    /**
     * 打开编辑标签 输入框
     *
     * */
    editTagShow(item) {
      if (this.tagForm.editId) {
        this.$message.error('一次只能打开一个编辑框');
        return false;
      }
      this.tagForm.name = item.name;
      this.tagForm.id = item.id;
      this.tagForm.editId = item.id;
      return true;
    },
    /**
     * 关闭编辑标签 输入框
     *
     * */
    cancelEditTag() {
      this.tagForm.editId = null;
    },
    /**
     * 关闭选择任务
     *
     * */
    cancelTaskDialog() {
      this.taskDialogVisible = false;
    },
    /**
     * 打开选择任务标签
     *
     * */
    openTaskDialog() {
      this.taskDialogVisible = true;
    },
    /**
     * 确认选择标签弹窗
     *
     * */
    confirmTaskDialog() {
      this.form.taskTagList = JSON.parse(JSON.stringify(this.chooseTagIds));
      this.taskDialogVisible = false;
    },
    /**
     * 添加权限
     *
     * */
    submit() {
      if (!this.isCommon) {
        this.$refs.form.validate((valid) => {
          if (valid) {
            const arr = [];
            this.tableData.forEach((item) => {
              const obj = {};
              const permissionArr = [];
              obj.positionId = item.id;
              this.tableHead.forEach((header) => {
                item[header.property].forEach((last) => {
                  if (last.checked) {
                    permissionArr.push({
                      permissionId: last.id,
                      targetPositionIds: last.positionIds.map(v => v.id),
                    });
                  }
                });
              });
              obj.positionPermissionTargetQueries = permissionArr;
              arr.push(obj);
            });
            const obj = {
              iconCategory: this.form.icon.param,
              name: this.form.name,
              id: this.form.id,
              projectId: this.projectId,
              projectTagIds: this.chooseTagIds,
              secondLvPermissionId: this.form.secondLvPermissionId.id,
              positionPermissionQueries: arr,
            };
            this.$http.post(this.api.operationApi.addBizTaskType, obj)
              .then((res) => {
                if (res) {
                  this.$message.success('修改成功');
                  this.$deleteTag();
                  this.$router.push(
                    { name: 'trackerConfigDetails',
                      params:
                        {
                          id: this.permissionId,
                          queryId: this.queryId,
                          projectId: this.projectId },
                      query: {
                        taskType: this.type,
                        icon: this.$route.query.icon,
                        name: this.$route.query.name,
                      },
                    });
                }
              });
          }
        });
      } else {
        if (this.tableData.length === 0) {
          this.$message.error('请输入完成信息');
          return false;
        }
        const arr = [];
        let ids = [];
        this.tableData.forEach((item) => {
          const obj = {};
          const permissionArr = [];
          obj.positionId = item.id;
          ids = [];
          this.tableHead.forEach((header) => {
            item[header.property].forEach((last) => {
              ids.push(last.id);
              if (last.checked) {
                permissionArr.push({
                  permissionId: last.id,
                  targetPositionIds: last.positionIds.map(v => v.id),
                });
              }
            });
          });
          obj.positionPermissionTargetQueries = permissionArr;
          arr.push(obj);
        });
        const obj = {
          permissionIds: ids,
          projectId: this.projectId,
          positionPermissionQueries: arr,
        };
        this.$http.post(this.api.operationApi.addEditCommonPermission, obj)
          .then((res) => {
            if (res) {
              this.$message.success('修改成功');
              this.$deleteTag();
              this.$router.push(
                { name: 'trackerConfigDetails',
                  params:
                    {
                      id: this.permissionId,
                      queryId: this.queryId,
                      projectId: this.projectId },
                  query: {
                    taskType: this.type,
                    icon: this.$route.query.icon,
                    name: this.$route.query.name,
                  },
                });
            }
          });
      }
      return true;
    },
  },
  computed: {
    // 选中的职能id 用来显示已经勾选的职能在
    selectedPosition() {
      return this.positionList.map(v => v.id);
    },
    chooseTagIds() {
      const arr = this.tagList.filter(v => v.checked);
      return arr.map(v => v.id);
    },
    isCommon() {
      return this.type === 'common';
    },
  },
  mounted() {
    this.getDep();
    this.getTaskTag();
    this.getIconList();
    if (!this.isCommon) {
      this.getPermission();
    } else {
      this.getCommonPermission();
    }
  },
};
</script>

<style lang="less" type="text/less" scoped>
.tracker-config-add{
  .tag{
    padding: 2px 20px;
    border-radius: 15px;
    font-size: 12px;
    background: #f2f6fc;
    color: @main-blue;
  }
  .tag-li{
    padding: 15px 25px;
    align-items: center;
    span{
      display: inline-flex;
      align-items: center;
    }
  }
  .icon-list{
    padding: 20px 40px 0 40px;
    span{
      background: #ffffff;
      width: 94px;
      height: 94px;
      border-radius: 5px;
      overflow: hidden;
      display: inline-block;
      margin-right: 50px;
      margin-bottom: 50px;
      box-shadow: 0 1px 12px 0 rgba(38,123,209,0.2);
      &:nth-child(5n){
        margin-right: 0;
      }
      .active{
        background: @main-blue;
      }
    }
  }
  .border{
    min-height: 100px;
  }
  .header{
    .border-right{
      border-right: 1px solid @bottom-color;
    }
    .img-item{
      width: 77px;
      height: 77px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 1px 12px 0 rgba(38,123,209,0.2);
    }
    .box-shadow-none{
      box-shadow: none;
    }
    .content{
      .item{
        padding: 10px 28px;
        border-radius: 5px;
        font-size: 14px;
        border: 1px solid #dcdfe6;
        color: @main-color;
        &.active{
          background: #f7f8fd;
          color: @main-blue;
          border: 1px solid @main-blue;
        }
      }
    }
  }
}
</style>
