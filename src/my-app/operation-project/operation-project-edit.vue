/**
* Created by c on 2018/6/5.
*/
<template>
  <div>
    <panelContentHeader>
      <template>
      </template>
    </panelContentHeader>
    <div class="project-edit edit-content" v-edit>
      <el-form :model="projectForm"
               :rules="projectRules"
               ref="projectFormRef"
               label-width="120px">
        <!--基本信息-->
        <el-row>
          <div v-content-title>基本信息</div>
          <el-col :span="24" class="upload-item-icon">
            <i class="el-icon-plus" @click="uploadImg(uploadProps[0])"></i>
            <el-form-item label="项目logo" prop="icon">
              <!--prop icon 无法检测到上传组件值的变化 用input 绑定值做替代 并隐藏-->
              <el-input v-model="projectForm.icon" v-show="false"></el-input>
              <upload
                :ref="uploadProps[0]"
                @getUrl="uploadLogo"
                :list="logoList"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="项目状态" prop="status">
              <el-select  v-model="projectForm.status" placeholder="请选择可读权限">
                <el-option v-for="item in projectStatusList"
                           :key="item.key"
                           :label='item.label'
                           :value='item.value'></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="当前动作方" prop="projectEvent">
              <el-select v-model="projectForm.projectEvent.actionType" placeholder="请选择当前动作方">
                <el-option
                  v-for="item in eventList"
                  :label="item.label"
                  :value="item.value"
                  :key="item.key"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="动作方备注" v-if="projectForm.projectEvent.actionType == 3">
              <el-input v-model="eventName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="项目编号" prop="projectCode">
              <el-input  v-model="projectForm.projectCode" maxlength="9"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="优先级" prop="projectLv">
              <el-select  v-model="projectForm.projectLv" placeholder="请选择可读权限">
                <el-option
                  :label="item.label"
                  :value="item.value"
                  v-for="item in priorityList"
                  :key="item.value">
                  <i class="icon-small"
                     :class="item.icon"
                  ></i>
                  <span>{{item.label}}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="项目名称" prop="name">
              <el-input v-model="projectForm.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="项目简称">
              <el-input v-model="projectForm.shortName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="项目占地面积" class="inline-form" prop="floorArea">
              <el-input v-model="projectForm.floorArea"></el-input>
              <span>m²</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="项目收费面积" class="inline-form" prop="chargeArea">
              <el-input v-model="projectForm.chargeArea"></el-input>
              <span>m²</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="项目建筑面积" class="inline-form" prop="buildingArea">
              <el-input v-model="projectForm.buildingArea"></el-input>
              <span>m²</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16" class="lng-form">
            <el-form-item label="经度/纬度" class="inline-form" prop="lng">
              <el-input v-model="projectForm.lng"></el-input>
              <span>/</span>
            </el-form-item>
            <el-form-item  prop="lat" class="inline-form">
              <el-input v-model="projectForm.lat"></el-input>
              <el-button size="small" class="m-l-20" plain
                         @click='open'>通过地图选择</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="客户公司" prop="companyId">
              <el-select v-model="projectForm.companyId"
                         @change="getSonCompanyById" placeholder="请选择">
                <el-option
                  v-for="item in customerList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="合作公司">
              <el-select v-model="companySubIds"
                         multiple
                         placeholder="请选择"
                         :disabled="!projectForm.companyId">
                <el-option
                  v-for="item in companySonArr"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
              <span v-if="!projectForm.companyId" style="color: #7b8aa4;">请先选择客户公司</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="业态" prop="yetai">
              <el-select v-model="projectForm.yetai" placeholder="请选择业态">
                <el-option
                  :label="item.label"
                  :value="item.value"
                  v-for="item in yetaiList"
                  :key="item.key">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="当前负责人" prop="personCharge">
              <el-select v-model="projectForm.personCharge">
                <el-option
                  v-for="item in manageList"
                  :label="item.name"
                  :value="item.id"
                  :key="item.key"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="初次接触时间" prop="firstContactAt">
              <el-date-picker
                v-model="projectForm.firstContactAt"
                type="date"
                format="yyyy 年 MM 月 dd 日"
                value-format="timestamp"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="省,直辖市" prop="zoonId">
              <city-choice @getCity="cityHandler" :default-list="cityDefault"></city-choice>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16">
            <el-form-item label="详细地址">
              <el-input v-model="projectForm.address"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="upload-item-icon">
            <i class="el-icon-plus" @click="uploadImg(uploadProps[1])"></i>
            <el-form-item label="项目图片" >
              <upload
                :ref="uploadProps[1]"
                @getUrl="uploadProjectImg"
                :list="projectImg"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="蓝牙">
              <el-select v-model="projectForm.beaconVersion">
                <el-option v-for="item in blueTooth"
                           :label="item.label"
                           :value="item.value"
                           :key="item.key"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!--基本信息 end-->
        <!--相关客户-->
        <div class="related">
          <div v-content-title>
            <i class="el-icon-plus" @click="addItem(1)"></i>
            相关客户
          </div>
          <div class="item" v-for="(item,index) in projectForm.companyList" :key="item.date">
            <i class="el-icon-minus" @click="deleteItem('companyList',index)"></i>
            <el-row>
              <el-col :span="8">
                <el-form-item label="客户名称"
                              :prop="'companyList.'+ index + '.id'"
                              :rules="projectRules.related">
                  <el-select v-model="item.id" filterable>
                    <el-option v-for="(item,index) in customerList"  :key="index"
                               :label="item.name" :value="item.id"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="角色类型"
                              :prop="'companyList.'+ index + '.relationProject'"
                              :rules="projectRules.related"
                >
                  <el-select v-model="item.relationProject"
                             placeholder="请选择角色类型">
                    <el-option
                      v-for="item in projectRole"
                      :label="item.label"
                      :key="item.key"
                      :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>
        <!--相关客户-->
        <!--相关联络人-->
        <div class="related">
          <div v-content-title>
            <i class="el-icon-plus" @click="addItem(2)"></i>
            相关联络人
          </div>
          <div class="item" v-for="(item,index) in projectForm.linkmanList" :key="item.date">
            <i class="el-icon-minus" @click="deleteItem('linkmanList',index)"></i>
            <el-row>
              <el-col :span="8">
                <el-form-item label="联络人名称"
                              :prop="'linkmanList.'+ index + '.id'"
                              :rules="projectRules.related"
                >
                  <el-select v-model="item.id"
                             filterable
                  >
                    <el-option v-for="(item,index) in crmList"  :key="index"
                               :label="item.name" :value="item.id"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="角色类型"
                              :prop="'linkmanList.'+ index + '.relationProject'"
                              :rules="projectRules.related"
                >
                  <el-select v-model="item.relationProject" placeholder="请选择角色类型">
                    <el-option
                      v-for="item in linkManRole"
                      :label="item.label"
                      :key="item.key"
                      :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>
        <!--相关联络人 end-->
        <!--项目证书-->
        <div class="related">
          <div v-content-title>
            <i class="el-icon-plus" @click="addItem(3)"></i>
            项目证书
          </div>
          <div class="item"
               v-for="(item,index) in projectForm.projectCertList" :key="item.date"
               v-if="item.valid === '1'"
               >
            <i class="el-icon-minus" @click="deleteItem('projectCertList',index, item)"></i>
            <el-row>
              <el-col :span="8">
                <el-form-item label="证书名称"
                              :prop="'projectCertList.' + index + '.remark'"
                              :rules="projectRules.certificateName"
                >
                  <el-input  v-model="item.remark" ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24" class="upload-item-icon">
                <i class="el-icon-plus"
                   @click="uploadImg(uploadProps[index + 2])"></i>
                <el-form-item label="证书图片"
                              :prop="'projectCertList.' + index + '.pic1'"
                              :rules="projectRules.related"
                >
                  <el-input v-model="item.pic1" v-show="false"></el-input>
                  <upload
                    :ref="uploadProps[index + 2]"
                    @getUrl="uploadCerImg"
                    :list="certificateImg[index]"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>
        <!--项目证书 end-->
        <!--备注-->
        <el-row>
          <div v-content-title>备注</div>
          <el-col :span="16">
            <el-form-item label="备注信息">
              <el-input v-model="projectForm.remark" type="textarea" :rows="3"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!--备注 end-->
      </el-form>
      <el-dialog
        title="选择项目经纬度"
        :visible.sync="dialogVisible"
        width="30%"
      >
        <div id="allmap" class="map"></div>
        <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false" size="small" plain>取 消</el-button>
      <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
      </el-dialog>
      <!--底部-->
      <!--<footerBox :routers="routers" @saveChange="editProject"></footerBox>-->
      <div class="fixed-control">
        <el-button plain @click="$cancel">取消</el-button>
        <el-button  type="primary" @click="editProject">保存</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { englishAndNum, number } from '../../libs/plugins/validate';

import upload from '../../components/common/upload/upload';
import cityChoice from '../../components/common/city-choice/city-choice';

const BMap = window.BMap; // 全局注册BMap对象
export default {
  name: 'operation-project-edit',
  components: { upload, cityChoice },
  data() {
    const event = (rule, value, callback) => {
      if (!value.actionType) {
        return callback(new Error('请选择当前动作方'));
      }
      callback();
      return true;
    };
    return {
      companySonArr: [], // 子公司
      routers: '/project/project-list',
      // blueTooth
      blueTooth: [
        { value: '1', label: '旧蓝牙' },
        { value: '2', label: '新蓝牙' },
        { value: '3', label: 'NFC' },
      ],
      // 项目优先级
      priorityList: [
        { value: '1', label: '一级', icon: 'icon-circle-red' },
        { value: '2', label: '二级', icon: 'icon-circle-yellow' },
        { value: '3', label: '三级', icon: 'icon-circle-blue' },
      ],
      // 业务状态
      yetaiList: [
        { value: '1', label: '园区' },
        { value: '2', label: '工业' },
        { value: '3', label: '住宅' },
        { value: '4', label: '商业' },
        { value: '5', label: '办公' },
        { value: '6', label: '综合体' },
        { value: '7', label: '酒店' },
        { value: '8', label: '学校' },
        { value: '9', label: '医院' },
        { value: '10', label: '政府' },
        { value: '11', label: '租赁式项目' },
        { value: '12', label: '自有资产' },
      ],
      // 客户角色
      projectRole: [
        { value: '1', label: '大业主' },
        { value: '2', label: '开发商' },
        { value: '3', label: '设计商' },
        { value: '4', label: '物业公司' },
      ],
      // 联系人角色
      linkManRole: [
        { value: '1', label: '项目负责人' },
        { value: '2', label: '项目决策人' },
        { value: '3', label: '条线负责人' },
        { value: '4', label: '条线决策人' },
      ],
      // 事件列表 第三方是需输入备注名称
      eventList: [
        { value: '1', label: '介谷方' },
        { value: '2', label: '客户方' },
        { value: '3', label: '第三方' },
      ],
      id: this.$route.params.id, // 项目id
      customerList: [], // 客户列表
      crmList: [], // crm联络人
      manageList: [], // 人员列表
      eventNames: '', // 第三方动作方备注名称
      cityDefault: {}, // 返回的地区值
      projectStatusList: [{
        value: '1',
        label: '已接触',
      }, {
        value: '2',
        label: '已立项',
      }, {
        value: '3',
        label: '合同谈判',
      }, {
        value: '4',
        label: '实施中',
      }, {
        value: '5',
        label: '运维中',
      }, {
        value: '6',
        label: '已关闭',
      }],
      companySubIds: [], // 子公司集合
      projectForm: {
        companyList: [], // 相关客户
        linkmanList: [], // 联络人
        companySubIds: [],
        projectCompanyList: [], // 相关客户
        companyId: '',
        mainCompany: { name: '', id: '' }, // 主公司
        companySubs: [], // 子公司
        address: '', // 项目地址
        background: '', // 项目背景图
        buildingArea: '', // 建筑面积
        chargeArea: '', // 收费面积
        developerName: '', // 开发商名称
        firstContactAt: '', // 初次接触时间
        floorArea: '', // 占地面积
        icon: '', // 项目icon
        lat: '', // 经度
        lng: '', // 维度
        name: '', // 项目名称
        beaconVersion: null, // 新旧蓝牙
        personCharge: '', // 负责人id
        projectCode: '', // 项目编号
        projectCustomerList: [], // 项目对应客户
        projectLinkmanList: [], // 项目联络人
        projectLv: '', // 优先级
        propertyName: '', // 物业公司名称
        proprietorName: '', //  业主名称
        remark: '', // 备注
        shortName: '', // 项目简称
        status: '', // 状态
        yetai: '', // 业务状态
        zoonId: '', // 地区id
        projectEvent: {
          actionType: '',
        }, // 事件列表
        projectCertList: [], // 项目证书列表
      }, // 项目详情表单
      uploadProps: [this.$uuid(), this.$uuid()],
      logoList: [], // logo图片 列表
      projectImg: [], // 项目图片
      certificateImg: [], // 项目证书图片
      activeIndex: '', // 新增项目证书的id标识
      projectRules: {
        icon: [
          { required: true, message: '请上传项目logo', trigger: 'change' },
        ],
        status: [
          { required: true, message: '请选择项目状态', trigger: 'change' },
        ],
        projectLv: [
          { required: true, message: '请选择项目优先级', trigger: 'change' },
        ],
        projectEvent: [
          { required: true, validator: event, message: '请选择当前动作方', trigger: 'change' },
        ],
        projectCode: [
          { required: true, validator: englishAndNum, trigger: 'change' },
        ],
        yetai: [
          { required: true, message: '请选择项目业务状态', trigger: 'change' },
        ],
        floorArea: [
          { required: false, validator: number, trigger: 'change' },
        ],
        buildingArea: [
          { required: false, validator: number, trigger: 'change' },
        ],
        chargeArea: [
          { required: false, validator: number, trigger: 'change' },
        ],
        lng: [
          { required: false, validator: number, trigger: 'change' },
        ],
        lat: [
          { required: false, validator: number, trigger: 'change' },
        ],
        zoonId: [
          { required: true, message: '请选择地区', trigger: 'change' },
        ],
        personCharge: [
          { required: true, message: '请选择项目负责人', trigger: 'change' },
        ],
        firstContactAt: [
          { required: true, message: '请选择项目初次接触时间', trigger: 'change' },
        ],
        related: [
          { required: true, message: '不能为空', trigger: 'change' },
        ],
        name: [
          { required: true, message: '项目名称不能为空', trigger: 'blur' },
        ],
        certificateName: [
          { required: true, message: '证书名称不能为空', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' },
        ],
        companyId: [
          { required: true, message: '请选择客户公司', trigger: 'change' },
        ],
      }, // 项目表单验证规则
      dialogVisible: false, // 是否展开 百度地图页面
    };
  },
  methods: {
    /**
     *根據客戶公司 選擇 子公司
     *
     * */
    getSonCompanyById(id, type) {
      this.$http.post(`${this.api.projectApi.getSonList}?companyId=${id}`).then((res) => {
        this.companySonArr = res;
        if (type !== 1) {
          this.companySubIds = [];
        }
      });
    },
    /**
     * 获取项目详情
     *
     * */
    getProjectDetails() {
      this.$http.post(this.api.projectApi.getProjectInfo, {
        needContract: true,
        neddProjectDept: true,
        projectId: this.id,
      }).then((res) => {
        this.projectForm = res;
        this.projectForm.companySubIds = [];
        // 处理 子公司
        if (res.companySubs) {
          res.companySubs.forEach((obj) => {
            this.companySubIds.push(obj.companySubId);
          });
        }
        this.projectForm.companyId = this.projectForm.mainCompany.id;
        // 处理 查询 合作子客户
        if (this.projectForm.companyId) {
          this.getSonCompanyById(this.projectForm.companyId, 1);
        }
        this.$setTitle(res.name);
        // 处理logo
        if (res.icon) {
          this.logoList.push({ url: res.icon });
        }
        // 处理背景图片
        if (res.background) {
          this.projectImg.push({ url: res.background });
        }
        // 处理项目证书
        if (res.projectCertList) {
          res.projectCertList.forEach((item) => {
            this.$set(item, 'valid', '1');
            if (item.pic1) {
              this.certificateImg.push([{ url: item.pic1 }]);
              this.uploadProps.push(this.$uuid);
            } else {
              this.certificateImg.push([]);
            }
          });
        } else {
          this.certificateImg.push([]);
        }
        // 处理动作方
        if (res.projectEvent === null) {
          res.projectEvent = {
            actionName: '',
            actionType: '',
            remark: '',
          };
        }
        if (Number(res.projectEvent.actionType) === 3) {
          this.eventName = res.projectEvent.remark;
        }
        // 处理地区
        this.cityDefault = res.zone;
      });
    },
    uploadImg(name) {
      const refs = this.$refs[name];
      // 重要！！！ 上传组件 被循环出来 取到的ref 值为数组 要取第0个
      if (Array.isArray(refs)) {
        this.$refs[name][0].upload();
      } else {
        this.$refs[name].upload();
      }
    },
    /**
     * 新增 客户 项目 信息
     * @param 1 客户 2 联络人 3 项目证书
     * */
    addItem(type) {
      switch (type) {
        case 1:
          // 新增客户
          this.projectForm.companyList.push({ id: '', relationProject: '' });
          break;
        case 2:
          // 新增联络人
          this.projectForm.linkmanList.push({ linkmanId: '', relationProject: '' });
          break;
        case 3:
          if (this.projectForm.projectCertList === null) {
            this.projectForm.projectCertList = [];
          }
          this.projectForm.projectCertList.push({ remark: '', pic1: '', category: 1, valid: '1' });
          this.certificateImg.push([]);
          this.uploadProps.push(this.$uuid());
          break;
        default:
      }
    },
    /**
     * 删除相关条目
     * 客户 项目 信息
     * */
    deleteItem(val, index, item) {
      if (item.id) {
        this.$set(item, 'valid', '-1'); // 如果是删除原来的 传-1
      } else {
        this.projectForm[val].splice(index, 1);
      }
    },
    /**
     * 获取 经度，纬度
     *
     * */
    showInfo(e) {
      this.map.clearOverlays(); // 每次先清楚上一次的经纬度
      this.pointObj = {
        lng: e.point.lng,
        lat: e.point.lat,
      };
      const point = new BMap.Point(e.point.lng, e.point.lat); // 创建经纬度的点
      this.marker = new BMap.Marker(point); // 根据经纬度点找位置
      this.map.addOverlay(this.marker);// 将标注添加到地图中
      this.marker.setAnimation(BMAP_ANIMATION_BOUNCE); // eslint-disable-line
    },
    /**
     * 地图渲染
     *
     * */
    ready() {
      const point = new BMap.Point(this.projectForm.lng, this.projectForm.lat); // 创建点坐标
      this.map = new BMap.Map('allmap'); //  创建地图实例
      const marker = new BMap.Marker(point);
      this.map.addOverlay(marker);// 将标注添加到地图中
      /* eslint-disable no-undef */
      marker.setAnimation(BMAP_ANIMATION_BOUNCE);
      this.map.centerAndZoom(point, 15); //  初始化地图，设置中心点坐标和地图级别
      this.map.addControl(new BMap.MapTypeControl());
      this.map.enableScrollWheelZoom(true); // 启用滚轮放大缩小，默认禁用
      this.map.enableDoubleClickZoom(true); // 启用地图惯性拖拽，默认禁用
      this.map.addEventListener('click', this.showInfo);
    },
    /**
     * 点击确定把经纬度的点渲染页面
     *
     * */
    confirm() {
      this.projectForm.lng = this.pointObj.lng;
      this.projectForm.lat = this.pointObj.lat;
      this.dialogVisible = false; // 关闭地图页面
    },
    /**
     * 获取地图组件传来的id
     *
     * */
    cityHandler(val) {
      this.projectForm.zoonId = val;
    },
    /**
     * 打开弹窗
     *
     * */
    open() {
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.ready();
      });
    },
    /**
     * 查询客户列表
     * */
    getCustomerList() {
      this.$http.post(this.api.companyApi.companyList, {
        pageNum: this.currentPage,
        pageSize: 9999,
      })
        .then((res) => {
          this.customerList = res.list;
        });
    },
    /**
     * 查询crm list
     *
     * */
    getCrmList() {
      this.$http.post(this.api.crmApi.getCrmList, {
        pageNum: this.currentPage,
        pageSize: 9999,
      })
        .then((res) => {
          this.crmList = res.list;
        });
    },
    /**
     * 查询人员列表
     *
     * */
    getManageList() {
      this.$http.post(this.api.manageApi.manageList, { isBrief: 1, category: 1 })
        .then((res) => {
          this.manageList = res.list;
        });
    },
    /**
     * 获取上传logo返回的地址
     *
     * */
    uploadLogo(res) {
      this.projectForm.icon = res[0] ? res[0] : '';
    },
    /**
     * 获取上传logo返回的地址
     *
     * */
    uploadProjectImg(res) {
      this.projectForm.background = res[0] ? res[0] : '';
    },
    /**
     * 获取证书上传的图片
     *
     * */
    uploadCerImg(res, key) {
      const index = this.uploadProps.indexOf(key);
      this.projectForm.projectCertList[index - 2].pic1 = res[0] ? res[0] : '';
    },
    /**
     * 编辑项目
     *
     * */
    editProject() {
      this.projectForm.companySubIds = this.companySubIds;
      const form = this.projectForm;
      if (Number(this.projectForm.projectEvent.actionType) === 3) {
        this.projectForm.projectEvent.remark = this.eventName;
      }
      const linkman = [];
      form.linkmanList.forEach((item) => {
        const newItem = {
          linkmanId: item.id,
          relationLinkman: item.relationProject,
        };
        linkman.push(newItem);
      });

      const customerMan = [];
      form.companyList.forEach((item) => {
        const newItem = {
          companyId: item.id,
          relationCompany: item.relationProject,
        };
        customerMan.push(newItem);
      });
      const obj = {
        address: form.address, // 项目地址
        background: form.background, // 项目背景图片 最多一张
        buildingArea: form.buildingArea, // 项目建筑面积
        chargeArea: form.chargeArea, // 项目收费面积
        developerName: form.developerName, // 开发商名称
        firstContactAt: form.firstContactAt, // 初次接触时间
        floorArea: form.floorArea, // 项目占地面积
        icon: form.icon, // logo
        id: this.$route.params.id, // 项目
        lat: form.lat, // 项目维度
        lng: form.lng, // 项目经度
        name: form.name, // 项目名称
        beaconVersion: form.beaconVersion, // 新旧蓝牙
        personCharge: form.personCharge, // 项目负责人id
        projectCertList: form.projectCertList, // 相关证书
        projectCode: form.projectCode, // 项目编号
        projectCompanyList: customerMan, // 相关客户
        projectEvent: form.projectEvent, // 项目事件表
        projectLinkmanList: linkman, // 项目联络人
        projectLv: form.projectLv, // 项目优先级
        propertyName: form.propertyName, // 物业公司名称
        proprietorName: form.proprietorName, // 业主名称
        remark: form.remark, // 项目备注
        shortName: form.shortName, // 项目简称
        status: form.status, // 项目状态
        yetai: form.yetai, // 业务状态
        zoonId: form.zoonId, // 省市区id
        companyId: form.companyId, // 主公司
        companySubIds: form.companySubIds, // 子公司的id
      };
      this.$refs.projectFormRef.validate((valid) => {
        if (valid) {
          this.$http.post(this.api.projectApi.editProjectInfo, obj)
            .then((res) => {
              if (res) {
                this.$message.success('修改项目详情成功');
                this.$deleteTag();
                if (this.projectForm.status === '5') {
                  this.$router.push({ name: 'operationList' });
                } else {
                  this.$router.push({ name: 'projectList' });
                }
              }
            });
        }
      });
    },
  },
  mounted() {
    this.getProjectDetails(); // 查询项目详情
    this.getCrmList(); // 查询crm联系人
    this.getManageList(); // 查询人员列表
    this.getCustomerList(); // 查询客户列表
  },
};
</script>

<style lang="less" type="text/less" scoped>
  .project-edit{
    .map-content{
      position: absolute;
      width: 60%;
      height: 80%;
      left:0;
      right:0;
      bottom:0;
      top:0;
      margin:auto;
      z-index: 100;
      background-color: #fff;
      padding-top:10px;
    }
    .item{
      .icon-close{
        margin:auto;
        cursor:pointer;
        font-size: 24px;
        float: right;
      }
    }
    .map{
      height: 400px;
    }
  }
</style>
