/**
* Created by c on 2018/6/4.
*/
<template>
    <div class="company-edit ">
      <panelContentHeader>
      </panelContentHeader>
      <div class="edit-content">
        <el-form
          :model="companyForm"
          status-icon
          ref="companyForm"
          label-width="100px"
          :rules="rules"
          class="company-form">
          <!--基本信息-->
          <el-row class="basic-panel">
            <div v-content-title>基本信息</div>
            <el-col :span="8">
              <el-form-item label="公司名称" prop="name">
                <el-input  v-model="companyForm.name" ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="公司规模" prop="companySize">
                <el-select v-model="companyForm.companySize" placeholder="请选择公司规模">
                  <el-option v-for="item in companySizeList"
                             :key="item.value"
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
              <el-form-item label="公司类型" prop="category">
                <el-select v-model="companyForm.category" placeholder="请选择公司类型">
                  <el-option v-for="item in companyTypeList"
                             :key="item.value"
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
          </el-row>
          <el-row >
            <el-col :span="8">
              <el-form-item label="省/市区" prop="zoneId">
                <el-input v-model="companyForm.zoneId" v-show="false"></el-input>
                <city-choice @getCity="cityHandler" :default-list="cityDefault"></city-choice>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="16">
              <el-form-item label="详细地址">
                <el-input v-model="companyForm.address"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <div v-content-title>
              开票信息
            </div>
            <el-col :span="8">
              <el-form-item label="开户行信息" prop="billAccountBank">
                <el-input  v-model="companyForm.billAccountBank" ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="开户行账号" prop="billAccountNo">
                <el-input  v-model="companyForm.billAccountNo" maxlength="19"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="信用代码" prop="billCreditCode">
                <el-input  v-model="companyForm.billCreditCode" maxlength="18"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="开票地址" prop="billAddress">
                <el-input  v-model="companyForm.billAddress" ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!--基本信息 end-->
          <!--相关联络人-->
          <div class=" related">
            <div v-content-title>
              <i class="el-icon-plus" @click="addItem(1)"></i>
              相关联络人
            </div>
            <div class="item" v-for="(item,index) in companyForm.linkmanList" :key="item.date">
              <i class="el-icon-minus" @click="deleteItem('linkmanList',index)"></i>
              <el-row >
                <el-col :span="8">
                  <el-form-item label="联络人名称"
                                :prop="'linkmanList.' + index + '.id'"
                                :rules="rules.related"
                  >
                    <el-select v-model="item.id"
                               filterable
                               placeholder="请选联络人名称">
                      <el-option v-for="(item,index) in companyList"  :key="index"
                                 :label="item.name" :value="item.id"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="角色类型"
                                :prop="'linkmanList.' + index + '.relationCompany'"
                                :rules="rules.related"
                  >
                    <el-select v-model="item.relationCompany" placeholder="请选择角色类型">
                      <el-option v-for="item in relationList"
                                 :key="item.key"
                                 :label='item.name'
                                 :value='item.value'></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </div>
          <!--相关联络人 end-->
          <!--相关项目-->
          <div class="related-info related">
            <div v-content-title>
              <i class="el-icon-plus" @click="addItem(2)"></i>
              相关项目
            </div>
            <div class="item" v-for="(item,index) in  companyForm.projectList" :key="item.date">
              <i class="el-icon-minus" @click="deleteItem('projectList',index)"></i>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="项目名称"
                                :prop="'projectList.' + index + '.id'"
                                :rules="rules.related"
                  >
                    <el-select v-model="item.id"
                               filterable
                               placeholder="请选择角色">
                      <el-option v-for="(item,index) in projectList" :key="index"
                                 :label="item.name"
                                 :value="item.id"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="角色类型"
                                :prop="'projectList.' + index + '.relationCompany'"
                                :rules="rules.related"
                  >
                    <el-select v-model="item.relationCompany" placeholder="请选择角色类型">
                      <el-option v-for="(item) in projectRole"
                                 :key="item.key"
                                 :label="item.name"
                                 :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </div>
          <!--相关项目 end-->
          <!--相关客户-->
          <div class="related-info related">
            <div v-content-title>
              <i class="el-icon-plus" @click="addItem(3)"></i>
              合作客户
            </div>
            <div class="item"
                 v-for="(item,index) in  companyForm.companySubUpsertQueries"
                 :key="item.date">
              <i class="el-icon-minus" @click="deleteItem('companySubUpsertQueries',index)"></i>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="客户名称"
                                :prop="'companySubUpsertQueries.' + index + '.name'"
                                :rules="rules.cooperativeClientName"
                  >
                    <el-input v-model="item.name"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </div>
          <!--相关客户 end-->
          <div>
            <div v-content-title>
              备注
            </div>
            <el-row class="info-item">
              <el-col :span="16">
                <el-form-item label="备注信息" prop="remark">
                  <el-input
                    type="textarea"
                    :rows="3"
                    placeholder="请输入内容"
                    v-model="companyForm.remark">
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-form>
      </div>
      <!--底部操作栏-->
      <div class="fixed-control">
        <el-button plain @click="$cancel()">取消</el-button>
        <el-button  type="primary" @click="submitForm">确定</el-button>
      </div>
      <!--底部操作栏 end-->
    </div>
</template>
<script>
import cityChoice from '../../components/common/city-choice/city-choice';
import { englishAndNum, positiveInteger } from '../../libs/plugins/validate';

export default {
  name: 'company-add',
  components: { cityChoice },
  data() {
    return {
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
      // 公司规模
      companySizeList: [
        { name: '微型(50人以下)', value: 1 },
        { name: '小型(50人至299人)', value: 2 },
        { name: '中型(300人至1000人)', value: 3 },
        { name: '大型(1000人及以上)', value: 4 },
      ],
      // 公司类型
      companyTypeList: [
        { name: '央企', value: 1 },
        { name: '国企', value: 2 },
        { name: '民营', value: 3 },
        { name: '合资', value: 4 },
        { name: '外企', value: 5 },
      ],
      companyList: [], // 客户列表
      projectList: [], // 项目列表
      cityDefault: {}, // 返回的地区值
      companyForm: {
        name: '', // 客户名称
        companySize: '', // 公司规模
        category: '', // 公司类型
        address: '', // 详细地址
        billAccountNo: '', // 开户行账号
        billAccountBank: '', // 开户行信息
        billAddress: '', // 开票地址
        billCreditCode: '', // 信用代码
        linkmanList: [], // 相关联络人
        projectList: [], // 相关项目
        companySubUpsertQueries: [], // 合作客户
        remark: '', // 备注
        zoneId: null,
      },
      rules: {
        remark: [
          { message: '请输入备注信息', trigger: 'blur' },
          { min: 1, max: 200, message: '备注信息最多200字符' },
        ],
        name: [
          { required: true, message: '请输入公司名称', trigger: 'blur' },
          { min: 1, max: 20, message: '公司名称最多20字符' },
        ],
        companySize: [
          { required: true, message: '请选择公司规模', trigger: 'change' },
        ],
        category: [
          { required: true, message: '请选择公司类型', trigger: 'change' },
        ],
        zoneId: [
          { required: true, message: '请输入选择省市区', trigger: 'change' },
        ],
        billAccountNo: [
          { validator: positiveInteger, trigger: 'change' },
        ],
        billAccountBank: [
          { message: '请输入开户行信息', trigger: 'blur' },
        ],
        billCreditCode: [
          { validator: englishAndNum, trigger: 'change' },
        ],
        billAddress: [
          { message: '请输入开票地址', trigger: 'blur' },
        ],
        cooperativeClientName: [
          { required: true, message: '请输入合作客户名称', trigger: 'blur' },
          { min: 1, max: 20, message: '合作客户名称最多20字符' },
        ],
        related: [
          { required: true, message: '不能为空', trigger: 'change' },
        ],
      },
    };
  },
  methods: {
    /**
     * 获取地图组件传来的id
     *
     * */
    cityHandler(val) {
      this.companyForm.zoneId = val;
    },
    /**
     * 新增 客户 项目 信息
     * @param 1 客户 2 项目 3 信息
     * */
    addItem(type) {
      switch (type) {
        case 1:
          // 新增联络人
          this.companyForm.linkmanList.push({ relationCompany: '', id: '' });
          break;
        case 2:
          // 新增项目
          this.companyForm.projectList.push({ relationLinkman: '', id: '' });
          break;
        case 3:
          // 新增相关客户
          this.companyForm.companySubUpsertQueries.push({ name: '', id: '', valid: 1 });
          break;
        default:
      }
    },
    /**
     * 删除相关条目
     * 客户 项目 信息
     * */
    deleteItem(val, index) {
      this.companyForm[val].splice(index, 1);
    },
    /**
     * 新增客户
     *
     * */
    submitForm() {
      this.$refs.companyForm.validate((valid) => {
        if (valid) {
          this.$http.post(this.api.companyApi.addCompany, this.companyForm)
            .then((res) => {
              if (res) {
                this.$message({
                  message: '新增成功',
                  type: 'success',
                });
                this.$router.push({ name: 'companyList' });
              }
            });
        }
      });
    },

    /**
     *查询联络人列表
     *
     * */
    getCrmList() {
      this.$http.post(this.api.crmApi.getCrmList, {
        pageNum: 1,
        pageSize: 9999,
        searchName: '',
      }).then((res) => {
        this.companyList = res.list;
      });
    },
    /**
     *查询项目列表
     * pageNum=1&pageSize=9999&searchName
     * */
    getProjectList() {
      this.$http.post(this.api.projectApi.projectList, { params: { pageIndex: 1, pageSize: 9999, searchName: '' } })
        .then((res) => {
          this.projectList = res.list;
        });
    },
  },
  mounted() {
    this.getCrmList(); // 查询客户列表
    this.getProjectList(); // 查询项目列表
  },
};
</script>

<style lang="less" type="text/less" scoped>
.company-edit{
  .related{
    .info-item{
      margin-bottom: 30px;
    }
  }
}
</style>
