<template>
  <div class="personnel-add " >
    <panelContentHeader>
    </panelContentHeader>
    <div class="edit-content">
      <el-form :model="personnelForm"
               :rules="rules"
               ref="personnelForm"
               label-width="90px">
        <el-row>
          <div v-content-title>基本信息</div>
          <el-col :span="24" class="upload-item-icon">
            <i class="el-icon-plus" @click="uploadImg(uploadProps[0])"></i>
            <el-form-item label="人员头像">
              <upload
                :ref="uploadProps[0]"
                @getUrl="uploadLogo"
                :list="logoList"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <!--基本信息-->
        <el-row class="basic-panel">
          <el-col :span="8">
            <el-form-item label="登录名" >
              <el-input v-model="personnelForm.loginName" disabled
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="密码"  class="inline-form-choice">
              <el-input v-model="personnelForm.psw" type="password" disabled></el-input>
              <el-button size="mini" @click="openChangePsw">重置密码</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="personnelForm.name"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!---->
        <el-row>
          <el-col :span="8">
            <el-form-item label="性别" prop="gender">
              <el-select v-model="personnelForm.gender" placeholder="请选择性别">
                <el-option label="男" value="M"></el-option>
                <el-option label="女" value="F"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="电话" prop="phone">
              <el-input v-model="personnelForm.phone" ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="资历" prop="qualific">
              <el-input v-model="personnelForm.qualific"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!---->
        <el-row>
          <el-col :span="8">
            <el-form-item label="入职时间" prop="entryAt">
              <el-date-picker
                v-model="personnelForm.entryAt"
                type="date"
                format="yyyy 年 MM 月 dd 日"
                value-format="timestamp"
                placeholder="请选择入职时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="薪资" prop="salary">
              <el-input v-model="personnelForm.salary"></el-input>
              <span class="input-tips">元</span>
            </el-form-item>
          </el-col>
        </el-row>
        <!--基本信息 end-->
        <!--相关项目  关联部门  -->
        <div class=" related">
          <div v-content-title>
            <i class="el-icon-plus" @click="addItem()"></i>
            相关项目
          </div>
          <div class="item" v-for="(item,index) in personnelForm.accountQueries" :key="item.date">
            <i class="el-icon-minus"
               @click="deleteItemVal('accountQueries',index,item.projectId)"
               v-if="personnelForm.accountQueries.length>1"></i>
            <el-row>
              <el-col :span="8">
                <el-form-item label="项目"
                              :prop="'accountQueries.'+index+'.projectId'"
                              :rules="rules.related"
                >
                  <el-select v-model="item.projectId"
                             filterable
                             @change="selectChildProject(item.projectId, index, 1)"
                             placeholder="请选项目名称">
                    <el-option v-for="(child,index) in projectList"
                               :key="index"
                               :disabled="projectIdArr.indexOf(child.id) >= 0"
                               :label="child.name" :value="child.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="所属公司"
                              :prop="'accountQueries.'+index+'.companySubId'"
                              :rules="rules.companySubId"
                >
                  <el-select v-model="item.companySubId"
                             filterable
                             :disabled="!item.projectId"
                             placeholder="请选所属公司">
                    <el-option v-for="child in personnelForm.accountQueries[index].companySubList"
                               :key="child.companySubId"
                               :label="child.companySubName" :value="child.companySubId">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="加入时间"
                              :prop="'accountQueries.'+index+'.joinAt'"
                              :rules="rules.related"
                >
                  <el-date-picker
                    v-model="item.joinAt"
                    type="date"
                    format="yyyy 年 MM 月 dd 日"
                    value-format="timestamp"
                    placeholder="请选择加入时间">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item
                  :rules="rules.related"
                  class="inline-form-choice"
                  :prop="'accountQueries.'+index+'.positionName'"
                  label="部门职能">
                  <el-input disabled v-model="item.positionName" ></el-input>
                  <el-button size="mini" @click="getDeptTreeList(item.projectId,index)"
                             :disabled="!item.projectId">选择部门 </el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>
        <!--相关项目 end-->
        <!--备注信息-->
        <div class="related">
          <div v-content-title>备注</div>
          <el-row>
            <el-col :span="12" >
              <el-form-item label="备注信息" prop="remark">
                <el-input
                  type="textarea"
                  v-model="personnelForm.remark"
                  :rows="3"
                  placeholder="请输入内容">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <!--备注信息-->
      </el-form>
    </div>
    <div class="fixed-control">
      <el-button plain @click="$cancel" >取消</el-button>
      <el-button  type="primary" @click="submitForm">确定</el-button>
    </div>
    <!--选择职能弹窗-->
    <func-dialog :visible="visible"
                  @changeClose="changeClose"
                 :deptTree="deptTree" @getPositionObj="getPositionObj"
                 :isChoosePosition="true"></func-dialog>
    <!--选择职能弹窗-->
    <!--密码弹窗-->
    <el-dialog
      title="重置密码"
      width="20%"
      :visible.sync="pswDialog"
    >
      <el-form
        :rules="rules"
        @submit.native.prevent
        :model="pwsForm"
        ref="pwsForm"
        class="p-l-20 p-r-20"
        label-width="90px"
      >
        <el-form-item label="输入新密码" prop="psw">
          <el-input v-model="pwsForm.psw" ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="pswDialog = false" size="small" plain>取消</el-button>
          <el-button @click="confirmPassword" size="small" type="primary">确认</el-button>
         </span>
    </el-dialog>
  </div>
</template>

<script>
import sha1 from 'sha1';

import { nameCn, phone, password, money } from '../../libs/plugins/validate';
import upload from '../../components/common/upload/upload';
import funcDialog from '../../components/common/func-dialog/func-dialog';

export default {
  name: 'personnel-add',
  components: { upload, funcDialog },
  data() {
    const checkName = (rule, value, cb) => {
      const reg = /^[0-9-a-zA-Z]+?$/;
      if (rule.required) {
        if (!value) {
          cb(new Error('请输入登录名'));
        } else if (value.length > 11) {
          cb(new Error('登录名限制6~11位(英文或数字)'));
        } else if (value.length < 6) {
          cb(new Error('登录名限制6~11位(英文或数字)'));
        } else if (!reg.test(value)) {
          cb(new Error('请输入正确格式(英文或数字)'));
        } else {
          this.$http.get(this.api.personnelApi.checkLoginName, {
            params: {
              loginName: value,
            },
          })
            .then((res) => {
              if (Number(res)) {
                cb(new Error('用户名已存在！'));
              } else {
                cb();
              }
            });
        }
      }
    };
    return {
      pwsForm: {
        psw: '',
      },
      pswDialog: false, // 密码重置弹窗
      indexProject: -1, // 定义选中部门的下标值
      deptTree: [], // 部门组织架构
      visible: false, // 是否显示 部门弹框
      isOpenDialog: false, // 是否打开 部门职能
      projectChildList: [], // 项目所属子公司
      projectArr: [], // 项目列表
      // 项目详情表单
      uploadProps: [this.$uuid()],
      logoList: [], // logo图片 列表
      personnelForm: {
        loginName: '', // 登录名
        psw: '', // 密码
        password: '', // 加密后的密码
        name: '', // 名称
        phone: '', // 电话
        qualific: '', // 资历
        entryAt: '', // 入职日期
        salary: '', // 薪资
        // 相关项目角色绑定
        accountQueries: [
          {
            projectId: '', // 项目id
            companySubId: '', // 所属公司
            companySubName: '', // 公司名称
            joinAt: '', // 加入时间
            positionName: '', // 部门idid
            positionId: '', // 职能id
            companySubList: [], // 所属项目列表
          },
        ],
      },
      projectList: this.$store.state.projectList, // 项目列表
      rules: {
        remark: [
          { message: '请输入备注信息', trigger: 'blur' },
          { min: 1, max: 200, message: '备注信息最多200字符' },
        ],
        loginName: [
          { required: true, validator: checkName, trigger: 'change' },
        ],
        name: [
          { validator: nameCn, trigger: 'change', required: true },
          { min: 1, max: 15, message: '姓名限制在1到15个字符', trigger: 'change' },
        ],
        phone: [
          { validator: phone, trigger: 'change' },
        ],
        related: [
          { required: true, message: '不能为空', trigger: 'change' },
        ],
        companySubId: [
          { type: 'string', required: true, message: '请选择所属公司', trigger: 'change' },
        ],
        psw: [
          { validator: password, trigger: 'change', required: true },
        ],
        qualific: [
          { min: 1, max: 15, message: '限制在 1到15 个字符', trigger: 'change' },
        ],
        salary: [
          { validator: money, trigger: 'change' },
          { min: 1, max: 15, message: '薪资限制15字符', trigger: 'change' },
        ],
      },
      userId: this.$route.params.id, // 用户id
    };
  },
  methods: {
    /**
    *确认修改密码
    * confirm
    * */
    confirmPassword() {
      this.$refs.pwsForm.validate((valid) => {
        if (valid) {
          this.$http.get(this.api.loginApi.changePwd, { params: {
            pwdNew: sha1(this.pwsForm.psw),
            userId: this.userId,
          } }).then(() => {
            this.personnelForm.psw = this.pwsForm.psw;
            this.$message.success('密码修改成功');
            this.pswDialog = false;
          });
        }
        return false;
      });
    },
    /**
     *查询 人员管理信息
     *
     * */
    getPersonnelList() {
      this.$http.get(this.api.personnelApi.getPersonnelDetails, {
        params: {
          userId: this.userId,
        },
      }).then((res) => {
        res.accountQueries = res.accounts;
        res.accountQueries.forEach((obj, index) => {
          obj.companySubList = [];
          this.selectChildProject(obj.projectId, index);
        });
        res.psw = res.password;
        this.personnelForm = res;
        this.$setTitle(res.name);
        // 处理logo
        if (res.icon) {
          this.logoList.push({ url: res.icon });
        }
      });
    },
    /**
     * 打开重置密码弹窗
     *
     * */
    openChangePsw() {
      this.pswDialog = true;
      this.pwsForm.psw = '';
    },
    /**
     *获取职位信息
     *
     * */
    getPositionObj(data) {
      this.personnelForm.accountQueries[this.indexProject].positionName = data.positionObj.name;
      this.personnelForm.accountQueries[this.indexProject].positionId = data.positionObj.id;
      this.visible = data.isClose;
    },
    /**
     *查询部门结构
     *
     * */
    getDeptTreeList(id, index) {
      this.indexProject = index;
      this.$http.get(this.api.operationApi.companyMsg, {
        params: {
          projectId: id,
          positionValid: '',
          deptValid: '',
        },
      }).then((res) => {
        this.deptTree = res;
        this.eachData(this.deptTree);
        this.visible = true;
      });
    },
    /**
     * 循环拿到的数据
     *  加入层级
     *
     * */
    eachData(data) {
      data.forEach((item) => {
        this.$set(item, 'sign', item.id);
        if (item.deptSonList) {
          this.eachData(item.deptSonList);
        }
      });
    },
    /**
     *弹框事件
     *
     * */
    changeClose(val) {
      this.visible = val;
    },
    /**
     *
     * 根据项目 查询 子公司
     * */
    selectChildProject(id, index, type) {
      if (type === 1) {
        this.personnelForm.accountQueries[index].companySubId = '';
        this.personnelForm.accountQueries[index].companySubName = '';
        this.personnelForm.accountQueries[index].positionName = '';
        this.personnelForm.accountQueries[index].positionId = '';
      }
      this.$http.get(this.api.projectApi.getSonListByProject, {
        params: { projectId: id },
      }).then((res) => {
        this.personnelForm.accountQueries[index].companySubList = res;
      });
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
          this.projectList = res.list;
        });
    },
    uploadImg(name) {
      this.$refs[name].upload();
    },
    /**
     * 获取上传logo返回的地址
     *
     * */
    uploadLogo(res) {
      this.personnelForm.icon = res[0] ? res[0] : '';
    },
    /**
     * 新增 项目
     *
     * */
    addItem() {
      this.personnelForm.accountQueries
        .push({ projectId: '', companySubId: '', companySubName: '', companySubList: [], joinAt: '', positionName: '', positionId: '' });
    },
    /**
     * 删除 相关项目
     *
     * */
    deleteItemVal(val, index) {
      this.personnelForm[val].splice(index, 1); // 页面列表中删除掉
      this.$message.success('删除成功');
    },
    /**
     *点击保存
     *
     * */
    submitForm() {
      this.$refs.personnelForm.validate((valid) => {
        if (valid) {
          this.personnelForm.password = this.personnelForm.psw;
          this.$http.post(this.api.personnelApi.insertPersonnel, this.personnelForm).then((res) => {
            if (res) {
              this.$message.success('创建成功');
              this.$cancel();
            }
          });
        } else {
          this.$message.error('请完善信息');
        }
        return true;
      });
    },
  },
  computed: {
    projectIdArr() {
      const arr = [];
      this.personnelForm.accountQueries.forEach((item) => {
        arr.push(item.projectId);
      });
      return arr;
    },
  },
  created() {
    this.getProjectList(); // 项目列表
    this.getPersonnelList(); // 或许人员详情
  },
};
</script>

<style scoped type="text/less" lang="less">
  .personnel-add {
    .input-tips{
      position: absolute;
      right: -20px;
      top: 0;
    }
    .inline-form-choice{
      .el-form-item__content{
        display: flex;
      }
    }
  }
</style>
