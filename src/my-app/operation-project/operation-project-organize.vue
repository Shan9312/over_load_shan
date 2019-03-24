<template>
  <div class="operation-organize">
    <panelContentHeader>
    </panelContentHeader>
    <div v-content>
      <el-row class="p-t-10">
        <el-col :span="8">
          <div class="left-content content">
            <div class="header-content">{{projectInfo.name}}</div>
            <div class="lf-body-content body-content">
              <p class="company-name"
                 @click="chooseCompany"
                 :class="{'active-name': activeDep.level == 0}">
                <span class="name">{{companyName}}</span>
              </p>
              <el-scrollbar
                tag="div"
                :style="{height:contentHeight+'px'}">
                <infinite-collapse
                  :data="companyData[0].deptSonList"
                  ref="infiniteCollapse"
                  :isChoosePosition="false"
                  @changeActiveData="getChooseDep">
                </infinite-collapse>
                <img
                  src="../../assets/img/icon-img/icon-empty-dep.png"
                  class="empty-icon-text"
                  v-if="companyData[0].deptSonList.length === 0"
                  alt=""/>
              </el-scrollbar>
            </div>
          </div>
        </el-col>
        <el-col :span="16" class="p-l-20">
          <div class="right-content content">
            <div class="header-content">
              <span>
                  {{activeDep.name}}
                <img
                  class="p-l-30 cursor"
                  src="../../assets/img/icon-img/icon-edit.png"
                  @click="addDepDialogVisible(true)"
                  v-if="activeDep.level !== 0"
                  alt=""/>
              </span>
            </div>
            <section>
              <div class="department-list">
                <div class="company-name">
                  <span class="name">下属部门</span>
                  <span class="control">
                  <el-button plain size="mini" @click="addDepDialogVisible(false)">添加部门</el-button>
                  <el-button
                    plain
                    size="mini"
                    @click="batchDisabled(activeDep.deptSonList)">批量停用</el-button>
                </span>
                </div>
                <el-scrollbar tag="div"
                              :style="{height:contentHeight+'px'}"
                >
                  <ul class="dep-ul">
                    <li v-for="item in activeDep.deptSonList" :key="item.id">
                      <span>
                        <el-checkbox
                          v-model="item.checked"
                          :disabled="item.valid == 0 "
                        ></el-checkbox>
                        <b
                          :class="{ 'disabled-item' : item.valid == 0 }"
                        >{{item.name}}</b>
                      </span>
                      <span>
                        <el-button
                          plain
                          size="mini"
                          v-if="item.valid == 0"
                          @click="openItem(item,1)">复用</el-button>
                      </span>
                    </li>
                    <img
                      src="../../assets/img/icon-img/icon-empty-dep.png"
                      class="empty-icon-text"
                      v-if="activeDep.deptSonList.length ===  0"
                      alt=""/>
                  </ul>
                </el-scrollbar>
              </div>
              <div class="func-list"  v-if="activeDep.level !== 0">
                <div class="company-name">
                  <span class="name">包含职能</span>
                  <span class="control">
                  <el-button plain size="mini" @click="openFuncDialog(false)">添加职能</el-button>
                  <el-button
                    plain
                    size="mini"
                    @click="batchDisabled(activeDep.positionList)">批量停用</el-button>
                </span>
                </div>
                <el-scrollbar tag="div"
                              :style="{height:contentHeight+'px'}"
                              >
                  <el-table
                    :data="activeDep.positionList"
                    v-if="activeDep.positionList.length !== 0"
                    :row-class-name="tableRowClassName"
                  >
                    <el-table-column
                      label="职能名称"
                      class-name="main"
                    >
                      <template slot="header" slot-scope="scope">
                        <span class="p-l-40"
                        >职能名称</span>
                      </template>
                      <template slot-scope="scope" >
                        <el-checkbox
                          v-model="scope.row.checked"
                          :disabled="scope.row.valid == 0"></el-checkbox>
                        <span class="name-item"
                              :class="{ 'disabled-item' : scope.row.valid == 0 }"
                        >
                          <img
                            src="../../assets/img/icon-img/icon-lock.png"
                            v-if="scope.row.valid == 1" alt=""/>
                          <img
                            src="../../assets/img/icon-img/icon-lock-disabled.png"
                            v-if="scope.row.valid == 0" alt=""/>
                             {{scope.row.name}}
                        </span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="职能描述"
                    >
                      <template slot-scope="scope">
                        <span
                          :class="{ 'disabled-item' : scope.row.valid == 0 }"
                        >
                             {{scope.row.remark}}
                        </span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="操作"
                      width="80px"
                    >
                      <template slot-scope="scope">
                        <el-button size="mini"
                                   plain
                                   v-if="scope.row.valid == 1"
                                   @click="openFuncDialog(scope.row)">编辑</el-button>
                        <el-button size="mini"
                                   plain
                                   v-else
                                  @click="openItem(scope.row, 1)"
                                   >复用</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                  <img
                    src="../../assets/img/icon-img/icon-empty-dep.png"
                    class="empty-icon-text"
                    v-else/>
                </el-scrollbar>
              </div>
            </section>
          </div>
        </el-col>
      </el-row>
    </div>
    <!--添加部门-->
    <el-dialog
      title="部门信息"
      :visible="departmentVisible"
      width="25%">
      <el-scrollbar tag="div">
        <div class="control p-l-30 p-r-30 p-t-30">
          <el-form :model="departmentForm"
                   :rules="rules"
                   ref="departmentForm"
                   @submit.native.prevent
                   label-width="100px">
            <el-form-item label="部门名称" prop="name">
              <el-input v-model="departmentForm.name"></el-input>
            </el-form-item>
            <el-form-item
              class="inline-form-choice"
              label="上级部门"
              :rules="rules.depName"
              >
              <div class="input-item-border w-100"
                   :class="{'input-disabled-color':activeDep.level === 0}">
                {{departmentForm.directParentName}}
              </div>
              <el-input v-model="departmentForm.directParentName" v-if="false"></el-input>
              <el-button size="mini"
                         v-if="activeDep.level !== 0"
                         @click="showDepSelect('departmentForm')">选择</el-button>
            </el-form-item>
          </el-form>
          <div class="dep-choice" v-if="departmentForm.showDepList">
            <div class="header-content">选择部门</div>
            <el-scrollbar class="dialog-select-dep" tag="div">
              <infinite-collapse
                :data="companyData"
                :isChoosePosition="false"
                @changeActiveData="getDialogChooseDep"
                :hideDepId ="hideId"
                :showPosition="false"
              ></infinite-collapse>
            </el-scrollbar>
          </div>
        </div>
      </el-scrollbar>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDepDialog()">取 消</el-button>
        <el-button type="primary" @click="addDep()">确 定</el-button>
      </span>
    </el-dialog>
    <!--添加部门-->
    <!--添加部门-->
    <el-dialog
      title="职能信息"
      :visible="funcDialogVisible"
      width="25%">
      <div class="control p-r-30 p-l-30 p-t-30">
        <el-form :model="funcForm"
                 :rules="rules"
                 ref="funcForm"
                 label-width="100px">
          <el-form-item label="职能名称" prop="name">
            <el-input v-model="funcForm.name"></el-input>
          </el-form-item>
          <el-form-item label="职能描述" prop="remark">
            <el-input v-model="funcForm.remark"></el-input>
          </el-form-item>
          <el-form-item
            class="inline-form-choice"
            label="所在部门"
            :rules="rules.depName"
          >
            <div class="input-item-border w-100"
                 :class="{'input-disabled-color':!funcForm.isEdit}">
              {{funcForm.depName}}
            </div>
            <el-input v-model="funcForm.depName" v-if="false"></el-input>
            <el-button
              size="mini"
              @click="showDepSelect('funcForm')"
              v-if="funcForm.isEdit"
            >选择</el-button>
          </el-form-item>
        </el-form>
        <div class="dep-choice" v-if="funcForm.showDepList">
          <div class="header-content">选择部门</div>
          <el-scrollbar class="dialog-select-dep"  tag="div">
            <infinite-collapse
              :showPosition="false"
              :isChoosePosition="false"
              :data="companyData[0].deptSonList"
              @changeActiveData="getDialogChooseDep"
            ></infinite-collapse>
          </el-scrollbar>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeFuncDialog()">取 消</el-button>
        <el-button type="primary" @click="addFunc()">确 定</el-button>
      </span>
    </el-dialog>
    <!--添加部门-->
    <div class="fixed-control">
      <el-button plain @click="$cancel">取消</el-button>
      <el-button  type="primary" @click="submitForm">确定</el-button>
    </div>
  </div>
</template>
<script>
import infiniteCollapse from '../../components/common/func-dialog/infinite-collapse/infinite-collapse';

export default {
  name: 'operation-project-organize',
  components: { infiniteCollapse },
  data() {
    return {
      contentHeight: 0,
      projectId: this.$route.params.id, // 公司id
      companyName: '介谷公司',
      hideId: null,
      projectInfo: {
        name: '',
      },
      activeDep: {
        name: '',
        deptSonList: [],
        positionList: [],
      }, // 选中的部门对象
      departmentVisible: false, // 部门新增弹窗
      dialogDepVisible: false, // 弹窗内的下拉组件
      funcDialogVisible: false, // 职能弹窗
      companyData: [{
        deptSonList: [],
        positionList: [],
        id: -1,
        name: '',
        level: 0,
        valid: 1,
      }],
      departmentForm: {
        name: '', // 部门名称
        parentDep: {}, // 上级部门对象
        directParentName: '',
        showDepList: false,
        isEdit: false, // 是否是编辑部门
      }, // 部门 form
      funcForm: {
        name: '',
        remark: '', // 描述
        depName: '', // 所在部门名称
        depObj: {},
        id: '', // id
      }, // 职能form
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'change' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'change' },
        ],
        remark: [
          { required: false, message: '请输入描述', trigger: 'change' },
          { min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'change' },
        ],
        depName: [
          { required: true, message: '请选择层级', trigger: 'change' },
        ],
      },
      postData: {
        deptUpsertList: [], // 部门列表
        positionUpsertList: [], // 职能列表
      },
    };
  },
  methods: {
    /**
     * 停用 启用 部门 或者职能
     *
     * */
    openItem(item, type) {
      item.valid = type;
      item.edit = true;
      item.checked = false;
    },
    /**
     * 批量停用
     *
     * */
    batchDisabled(data) {
      data.forEach((item) => {
        if (item.checked) {
          this.openItem(item, 0);
        }
      });
    },
    /**
     * 关闭职能弹窗
     *
     * */
    closeFuncDialog() {
      this.funcDialogVisible = false;
      this.funcForm.showDepList = false;
      this.funcForm.remark = '';
      this.funcForm.depName = '';
      this.funcForm.name = '';
      this.funcForm.id = '';
    },
    /**
     * 打开职能弹窗
     *
     * */
    openFuncDialog(item) {
      this.funcDialogVisible = true;
      this.funcForm.isEdit = false;
      if (item) {
        // 这里是修改
        this.funcForm = JSON.parse(JSON.stringify(item));
        this.funcForm.depObj = this.activeDep;
        this.funcForm.isEdit = true;
      }
      this.$set(this.funcForm, 'depName', this.activeDep.name);
      this.$set(this.funcForm, 'showDepList', false);
    },
    /**
     * 根据activeDep
     * 添加职能
     *
     * */
    addFunc() {
      const form = this.funcForm;
      const isEdit = form.isEdit; // flag 是否正在编辑部门
      this.$refs.funcForm.validate((valid) => {
        if (valid) {
          let obj = {};
          if (isEdit) {
            // 这里是编辑部门
            obj = {
              id: form.id,
              name: form.name,
              projectId: this.projectId,
              valid: 1,
              edit: true,
              sign: form.sign,
              userIds: form.userIds,
              remark: form.remark,
              webDeptId: form.depObj.webId,
              projectDeptId: form.depObj.id,
            };
            // 先把原来的职能删除 再重新添加新的
            let delIndex = null; // 标记删除的下标 从哪里删除 就从哪里插入
            this.activeDep.positionList.forEach((item, index) => {
              if (obj.sign === item.sign) {
                delIndex = index;
                this.activeDep.positionList.splice(index, 1);
              }
            });
            if (
              form.depObj.id === this.activeDep.id ||
              (!form.depObj.id && form.depObj.webId === this.activeDep.webId)) {
              this.activeDep.positionList.splice(delIndex, 0, obj);
            } else {
              form.depObj.positionList.push(obj);
            }
          } else {
            // 这里是新增部门
            obj = {
              id: null,
              name: form.name,
              remark: form.remark,
              projectDeptId: this.activeDep.id,
              projectId: this.projectId,
              valid: 1,
              sign: new Date().getTime(), // 唯一识别码
              edit: true,
              userIds: [],
              webDeptId: this.activeDep.webId ? this.activeDep.webId : null,
            };
            this.activeDep.positionList.push(obj);
          }
          this.closeFuncDialog();
        } else {
          this.$message.error('请输入完整信息');
        }
      });
    },
    /**
     * 获取选择弹窗选择部门组件 选中的值
     *
     * */
    getDialogChooseDep(data) {
      if (this.departmentVisible) {
        // 部门弹窗
        this.departmentForm.parentDep = data;
        this.departmentForm.directParentName = data.name;
      } else {
        // 职能弹窗
        this.funcForm.depName = data.name;
        this.funcForm.depObj = data;
      }
    },
    /**
     * 打开弹窗内的选择部门组件
     * 参数为不同的form 名字
     * */
    showDepSelect(type) {
      this[type].showDepList = !this[type].showDepList;
    },
    /**
     * 获取选中的部门数据
     * 包含 id 和name
     * */
    getChooseDep(data) {
      if (data) {
        this.activeDep = data;
      } else {
        this.activeDep = this.companyData[0];
      }
    },
    /**
     *  选中公司
     *  即为 选中第0级 的部门
     *
     * */
    chooseCompany() {
      this.activeDep = this.companyData[0];
      this.$refs.infiniteCollapse.depItemArr = [];
    },
    /**
     * 点击添加部门
     * 打开新增弹窗
     *
     * */
    addDepDialogVisible(type) {
      this.hideId = null;
      if (type) {
        // 编辑部门
        this.departmentForm.name = this.activeDep.name;
        this.departmentForm.directParentName = this.activeDep.directParentName;
        this.departmentForm.parentDep = {};
        this.hideId = Number(this.activeDep.sign);
      } else {
        // 新增部门
        this.departmentForm.name = '';
        this.departmentForm.parentDep = this.activeDep;
        this.departmentForm.directParentName = this.activeDep.name;
      }
      this.departmentForm.isEdit = type;
      this.departmentVisible = true;
    },
    /**
     * 关闭部门弹窗
     *
     * */
    closeDepDialog() {
      this.departmentVisible = false;
      this.departmentForm.showDepList = false;
    },
    /**
     * 循环找出编辑的部门层级对象
     *
     * */
    depEachLevel(data, item) {
      data.forEach((child, index) => {
        if (child.sign === item.sign) {
          child.name = item.name;
          child.id = item.id;
          child.webId = item.webId;
          child.level = item.level;
          child.edit = true;
          child.pid = item.pid;
          child.sign = item.sign;
          child.pidSign = item.pidSign;
          child.webPid = item.webPid;
          child.directParentName = item.directParentName;
          if (item.level) {
            this.depLevel(child.deptSonList, Number(child.level) + 1);
            this.setDepList(this.companyData[0].deptSonList, child);
            data.splice(index, 1);
          }
        } else if (child.deptSonList) {
          this.depEachLevel(child.deptSonList, item);
        }
      });
    },
    /**
     * 把修改好的部门 塞到对应的层级
     *
     * */
    setDepList(data, item) {
      // 如果是第一层 直接塞进去
      if (Number(item.level) === 1) {
        data.push(item);
      } else {
        data.forEach((child) => {
          if (child.sign === item.pidSign) {
            if (child.deptSonList === undefined) {
              this.$set(child, 'deptSonList', []);
            }
            child.deptSonList.push(item);
          } else if (child.deptSonList) {
            this.setDepList(child.deptSonList, item);
          }
        });
      }
    },
    /**
     * 重新计算 level
     * */
    depLevel(data, level) {
      data.forEach((item) => {
        item.level = level;
        this.$set(item, 'edit', true);
        if (item.deptSonList) {
          this.eachData(item.deptSonList, item.level + 1);
        }
      });
    },
    /**
     * 新增部门
     * 根据上级部门id 生成 pid
     *
     * */
    addDep() {
      const form = this.departmentForm;
      const isEdit = form.isEdit; // flag 是否正在编辑部门
      this.$refs.departmentForm.validate((valid) => {
        if (valid) {
          let obj = {};
          if (isEdit) {
            // 这里是编辑部门
            obj = {
              name: form.name,
              id: this.activeDep.id ? this.activeDep.id : null,
              webId: this.activeDep.webId ? this.activeDep.webId : null,
              level: JSON.stringify(form.parentDep) !== '{}' ? Number(form.parentDep.level) + 1 : this.activeDep.level,
              pid: JSON.stringify(form.parentDep) !== '{}' ? form.parentDep.id : null,
              webPid: JSON.stringify(form.parentDep) !== '{}' ? form.parentDep.webId : null,
              sign: this.activeDep.sign,
              directParentName: JSON.stringify(form.parentDep) !== '{}' ? form.parentDep.name : this.activeDep.directParentName,
              pidSign: JSON.stringify(form.parentDep) !== '{}' ? form.parentDep.sign : this.activeDep.pidSign,
            };
            // 循环找出 修改对应的层级
            this.depEachLevel(this.companyData[0].deptSonList, obj);
          } else {
            // 这里是新增部门
            obj = {
              name: form.name,
              id: form.id ? form.id : null,
              webId: new Date().getTime(),
              level: Number(form.parentDep.level) + 1,
              pid: form.parentDep.id ? form.parentDep.id : null,
              projectId: this.projectId,
              webPid: form.parentDep.webId ? form.parentDep.webId : null,
              valid: 1,
              sign: new Date().getTime(),
              pidSign: form.parentDep.sign,
              directParentName: form.parentDep.name,
              positionList: [],
              deptSonList: [],
              checked: false,
              edit: true,
            };
            form.parentDep.deptSonList.push(obj);
          }
          this.closeDepDialog();
        } else {
          this.$message.error('请输入完整信息');
        }
      });
    },

    /**
     * 动态计算 表格每一行的class
     *
     * */
    tableRowClassName(row) {
      if (row.row.disabled) {
        return 'table-row-disabled';
      }
      return '';
    },
    /**
    *获取所有公司的部门信息
    *
    * */
    getDep() {
      this.$http.get(this.api.operationApi.companyMsg, {
        params: {
          projectId: this.projectId,
          positionValid: null,
        },
      }).then((res) => {
        this.companyData[0].deptSonList = res;
        this.companyData[0].name = this.companyName;
        this.companyData[0].sign = -123456;
        this.companyData[0].pidSign = -654321;
        this.activeDep = this.companyData[0];
        this.eachData(this.companyData[0].deptSonList);
      });
    },
    /**
     * 查询项目详情
     *
     * */
    getProjectInfo() {
      this.$http.post(this.api.projectApi.getProjectInfo, {
        projectId: this.projectId,
      }).then((res) => {
        this.projectInfo = res;
        this.companyName = res.mainCompany ? res.mainCompany.name : '暂无公司名称';
        this.getDep();
      });
    },
    /**
     * 循环拿到的数据
     *  加入层级
     *
     * */
    eachData(data) {
      data.forEach((item) => {
        this.$set(item, 'checked', false);
        this.$set(item, 'sign', item.id);
        this.$set(item, 'pidSign', item.pid);
        item.positionList.forEach((position) => {
          position.sign = position.id;
        });
        if (Number(item.level) === 1) {
          item.directParentName = this.companyName;
        }
        if (item.deptSonList) {
          this.eachData(item.deptSonList);
        }
      });
    },
    /**
     * 整理数据 发送给后端
     * 找出所有带edit为true的对象
     * */
    findChangeItem(data) {
      data.forEach((item) => {
        if (item.edit) {
          this.postData.deptUpsertList.push(item);
        }
        item.positionList.forEach((position) => {
          if (position.edit) {
            this.postData.positionUpsertList.push(position);
          }
        });
        if (item.deptSonList) {
          this.findChangeItem(item.deptSonList);
        }
      });
    },
    /**
     *提交新增部门表单
     *
     * */
    submitForm() {
      this.findChangeItem(this.companyData[0].deptSonList);
      this.$http.post(this.api.operationApi.editDep, this.postData)
        .then((res) => {
          if (res) {
            this.$message.success('编辑成功！');
            this.$deleteTag();
            this.$router.push({ name: 'operation' });
          }
        });
    },
  },
  created() {
    this.getDep(); // 获取部门信息
    this.getProjectInfo();
  },
  mounted() {
    const clintHeight = document.documentElement.clientHeight;
    this.contentHeight = clintHeight - 70 - 70 - 60 - 48 - 60 - 36 - 55; // 计算主内容高度
  },
};
</script>

<style scoped type="text/less" lang="less">
.operation-organize{
  .input-item-border{
    border: 1px solid #e5e5e5;
    padding: 0 15px;
    height: 36px;
    line-height: 36px;
    color: @main-color;
  }
  .input-disabled-color{
    color:#c5cbd2;
  }
  .dep-choice{
    .header-content{
      height: 36px;
      line-height: 36px;
      color: @main-color;
      background-color: #f5f5f5;
      padding:0 30px;
    }
  }
  .panel-content{
    .content{
      color: @main-color;
      border: solid 1px #eef1fb;
      .header-content{
        height: 36px;
        display: flex;
        align-items: center;
        background-color: #f5f5f5;
        padding:0 30px;
        span{
          display: flex;
          align-items: center;
        }
      }
      section{
        display: flex;
        .department-list{
          transition: all .3s ease;
          flex: 1;
          border-right: 1px solid @bottom-color;
          .dep-ul{
            li{
              display: flex;
              padding: 16px 30px;
              justify-content: space-between;
              .border-bottom();
              &:last-child{
                border-bottom: none;
              }
              b{
                font-size: 16px;
                padding-left: 50px;
              }
            }
          }
        }
        .func-list{
          flex: 1.5;
          .func-name-table{
            background: @main-color;
          }
          .el-table{
            .name-item{
              display: inline-flex;
              align-items: center;
              img{
                width: 16px;
                height: 15px;
                margin: 0 25px;
              }
            }
          }
        }
      }
      .company-name{
        height: 55px;
        display: flex;
        &.active-name{
          background: rgba(102,128,216,.05);
        }
        span.name{
          font-weight: 500;
        }
        cursor: pointer;
        font-size: 18px;
        padding: 0 30px;
        align-items: center;
        justify-content: space-between;
      }
    }
  }

}
</style>
