/**
* Created by c on 2018/5/28.
*/
<template>
  <div class="crm-edit tables " v-edit>
      <el-form
        :model="crmForm"
        status-icon
        :rules="rules"
        ref="crmFormRef"
        label-width="100px"
        class="demo-crmForm">
        <!--基本信息-->
          <el-row class="basic-panel">
            <div v-content-title>基本信息</div>
            <el-col :span="8">
              <el-form-item label="姓名" prop="name">
                <el-input  v-model.trim="crmForm.name" ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="性别" prop="gender">
                <el-select v-model="crmForm.gender" placeholder="请选择性别">
                  <el-option label="男" value="M"></el-option>
                  <el-option label="女" value="F"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="职位" prop="positionName">
                <el-input  v-model="crmForm.positionName" ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="联系电话" prop="phone1">
                <el-input  v-model="crmForm.phone1" placeholder="请输入手机号" ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="联系电话" prop="phone2">
                <el-input  v-model="crmForm.phone2" placeholder="请输入手机号" ></el-input>
              </el-form-item>

            </el-col>
            <el-col :span="8">
              <el-form-item label="联系电话" prop="phone3">
                <el-input  v-model="crmForm.phone3"  placeholder="请输入手机号" ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="关系等级" prop="gender1">
                <el-select v-model="crmForm.relationLv" placeholder="请选择关系等级">
                  <el-option v-for="item in levelList"
                             :key="item.key"
                             :label="item.name"
                             :value="item.value"
                  >
                    <i class="icon-small"
                       :class="item.icon"
                    ></i>
                    <span>{{item.name}}</span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="邮箱" prop="email">
                <el-input  v-model="crmForm.email" ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="联络地址" prop="address">
                <el-input  v-model="crmForm.address"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        <!--基本信息 end-->
        <!--相关客户-->
        <div class=" related">
          <div v-content-title>
            <i class="el-icon-plus" @click="addItem(1)"></i>
            相关客户
          </div>
          <div class="item" v-for="(item,index) in crmForm.customerList" :key="item.date">
            <i class="el-icon-minus" @click="deleteItem('customerList',index)"></i>
            <el-row >
              <el-col :span="8">
                <el-form-item label="客户名称"
                              :prop="'customerList.' + index + '.id'"
                              :rules="rules.related"
                >
                  <el-select v-model="item.id"
                             filterable
                             placeholder="请选择客户">
                    <el-option v-for="(item,index) in customerList" :key="index"
                               :label="item.name"
                               :value="item.id"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="角色类型"
                              :prop="'customerList.' + index + '.relationLinkman'"
                              :rules="rules.related"
                >
                  <el-select v-model="item.relationLinkman"
                             placeholder="请选择角色类型">
                    <el-option v-for="(item) in relationList"
                               :key="item.key"
                               :label="item.name"
                               :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>
        <!--相关客户 end-->
        <!--相关项目-->
        <div class=" related">
          <div v-content-title>
            <i class="el-icon-plus" @click="addItem(2)"></i>
            相关项目
          </div>
          <div class="item" v-for="(item,index) in   crmForm.projectList" :key="item.date">
            <i class="el-icon-minus" @click="deleteItem('projectList',index)"></i>
            <el-row>
              <el-col :span="8">
                <el-form-item label="项目名称"
                              :prop="'projectList.' + index + '.id'"
                              :rules="rules.related"
                >
                  <el-select v-model="item.id"
                             filterable
                             placeholder="请选项目名称">
                    <el-option v-for="(item,index) in projectList"  :key="index"
                               :label="item.name" :value="item.id"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="角色类型"
                              :prop="'projectList.' + index + '.relationLinkman'"
                              :rules="rules.related"
                >
                  <el-select v-model="item.relationLinkman" placeholder="请选择角色类型">
                   <el-option v-for="item in projectRole"
                             :key="item.key"
                             :label='item.name'
                             :value='item.value'></el-option>
                </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>
        <!--相关项目 end-->
        <!--特殊信息-->
        <div class=" related">
          <div v-content-title>
            <i class="el-icon-plus" @click="addItem(3)"></i>
            特殊信息
          </div>
          <div class="item" v-for="(item,index) in  crmForm.linkmanParamList" :key="item.date">
            <i class="el-icon-minus" @click="deleteItem('linkmanParamList',index)"></i>
            <el-row>
              <el-col :span="8">
                <el-form-item label="标题"
                              :prop="'linkmanParamList.' + index + '.name'"
                              :rules="rules.related" >
                  <el-input  v-model="item.name" ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="可读权限"
                              :prop="'linkmanParamList.' + index + '.readLv'"
                              :rules="rules.related">
                  <el-select v-model="item.readLv" placeholder="请选择可读权限">
                  <el-option :label="item.readLv"
                             v-for="(item,index) in 10" :key="index"
                             :value="item"></el-option>
                </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="info-item">
              <el-col :span="16">
                <el-form-item label="备注"
                              :prop="'linkmanParamList.' + index + '.content'"
                              :rules="rules.related"
                >
                  <el-input
                    type="textarea"
                    :rows="3"
                    placeholder="请输入内容"
                    maxlength="100"
                    v-model="item.content">
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>
        <!--特殊信息 end-->
      </el-form>
  </div>
</template>
<script>
import { phone, email } from '../../libs/plugins/validate';

export default {
  name: 'crm-edit',
  components: {},
  data() {
    return {
      levelList: [
        { name: '优秀', value: '4', icon: 'icon-circle-red', key: 4 },
        { name: '普通', value: '2', icon: 'icon-circle-yellow', key: 2 },
        { name: '良好', value: '3', icon: 'icon-circle-blue', key: 3 },
        { name: '较差', value: '1', icon: 'icon-circle-dark', key: 1 },
      ], // 关系等级
      relationList: [
        { name: '引荐人', value: '1', key: 1 },
        { name: '联络人', value: '2', key: 2 },
        { name: '决策人', value: '3', key: 3 },
      ], // 客户角色类型
      projectRole: [
        { name: '项目负责人', value: '1', key: 1 },
        { name: '项目决策人', value: '2', key: 2 },
        { name: '条线负责人', value: '3', key: 3 },
        { name: '条线决策人', value: '4', key: 4 },
      ], // 项目角色类型
      customerList: [], // 客户列表
      projectList: [], // 项目列表
      crmForm: {
        name: '', // 客户姓名
        gender: '', // 客户性别
        positionName: '', // 职位
        phone1: '', // 电话
        phone2: '', // 电话
        phone3: '', // 电话
        email: '', // email
        address: '', // 联络地址
        relationLv: '', // 关系等级
        customerList: [], // 相关客户
        projectList: [], // 相关项目
        linkmanParamList: [], // 相关信息
      },
      rules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
        ],
        phone1: [
          { required: true, validator: phone, trigger: 'change' },
        ],
        phone2: [
          { validator: phone, trigger: 'change' },
        ],
        phone3: [
          { validator: phone, trigger: 'change' },
        ],
        email: { validator: email, trigger: 'change' },
        gender: [
          { required: true, message: '请选择性别', trigger: 'change' },
        ],
        gender1: [
          { required: false, message: '请选择性别', trigger: 'change' },
        ],
        related: [
          { required: true, message: '不能为空', trigger: 'blur' },
        ],
      },
      id: this.$route.params.id, // 用户id
    };
  },
  methods: {
    /**
     * 新增 客户 项目 信息
     * @param 1 客户 2 项目 3 信息
     * */
    addItem(type) {
      switch (type) {
        case 1:
          // 新增客户
          this.crmForm.customerList.push({ relationLinkman: '', id: '' });
          break;
        case 2:
          // 新增项目
          this.crmForm.projectList.push({ relationLinkman: '', id: '' });
          break;
        case 3:
          this.crmForm.linkmanParamList.push({ name: '', readLv: '', content: '' });
          break;
        default:
      }
    },
    /**
     * 删除相关条目
     * 客户 项目 信息
     * */
    deleteItem(val, index) {
      this.crmForm[val].splice(index, 1);
    },
    /**
     *查询客户列表
     *
     * */
    getList() {
      this.$http.post(this.api.customerApi.customerList, {
        pageNum: 1,
        pageSize: 9999,
        searchName: '',
      }).then((res) => {
        this.customerList = res.list;
      });
    },
    /**
     *查询项目列表
     * pageNum=1&pageSize=9999&searchName
     * */
    getProjectList() {
      this.$http.get(this.api.projectApi.projectList, { params: { pageNum: 1, pageSize: 9999, searchName: '' } })
        .then((res) => {
          this.projectList = res.list;
        });
    },
    /**
     *crm 編輯頁面
     *
     * */
    addCrm() {
      this.$refs.crmFormRef.validate((valid) => {
        if (valid) {
          this.$http.post(this.api.crmApi.addCrm, this.crmForm)
            .then((res) => {
              if (res) {
                this.$message({
                  message: '新增成功',
                  type: 'success',
                });
                this.$router.push({ name: 'crmList' });
              }
            });
        }
      });
    },
  },
  watch: {
    save: {
      handler: 'addCrm',
      deep: true,
    },
  },
  computed: {
    save() {
      return this.$eventBus.save;
    },
  },
  mounted() {
    this.getList(); // 查询客户列表
    this.getProjectList(); // 查询项目列表
  },
};
</script>

<style lang="less" type="text/less" scoped>
</style>
