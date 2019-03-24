/**
* Created by c on 2018/6/5.
*/
<template>
  <div class="project-details">
    <panelContentHeader>
      <template>
        <el-button
          size="medium"
          type="primary"
          class="m-l-15"
          @click="goEdit">编辑</el-button>
      </template>
    </panelContentHeader>
    <!--基本信息-->
    <div v-content>
      <div class=" flex" v-content-title>
        <span class="m-r-25">基本信息</span>
        <div class="project-level-ui m-r-15">
          <span  class="status-yellow">LV.{{result.projectLv}}</span>
        </div>
        <grade-ui :num="result.status"></grade-ui>
      </div>
      <el-row class="m-t-30">
        <el-col class="pic-item" :span="6">
          <div class="pic-item-content">
            <img :src="result.background" class="big-img" alt=""/>
            <div class="pic-center">
              <img :src="result.icon" class="small-img" width="100" height="100" alt=""/>
              <span class="project-name font-22">
                {{result.name}}
              </span>
              <span class="project-leader font-16">
                {{result.personChargeName}}
              </span>
            </div>
          </div>
        </el-col><el-col :span="6">
        <info-item-ui title="当前动作方">

          <b v-if="result.projectEvent && result.projectEvent.actionType === '1'">介谷方</b>
          <b v-if="result.projectEvent && result.projectEvent.actionType === '2'">客户方</b>
          <b v-if="result.projectEvent && result.projectEvent.actionType === '3'">第三方</b>
        </info-item-ui>
        <info-item-ui title="项目简称">{{result.shortName}}</info-item-ui>
        <info-item-ui title="项目编号">{{result.projectCode}}</info-item-ui>
        <info-item-ui title="省市区">{{filterName}}</info-item-ui>
        <info-item-ui title="详细地址">{{result.address}}</info-item-ui>
        <info-item-ui title="初次接触时间">
          {{$day(Number(result.firstContactAt)).format('YYYY/MM/DD')}}
        </info-item-ui>
      </el-col>
        <el-col :span="6">
          <info-item-ui title="蓝牙">
            {{blueTooth[Number(result.beaconVersion)-1].label}}
          </info-item-ui>
          <info-item-ui title="业态">
            <b v-for="item in yetaiList"
               :key="item.value"
               v-if=" item.value  === result.yetai">
              {{item.label}}
            </b>
          </info-item-ui>
          <info-item-ui title="项目占地面积">
            {{result.floorArea}}
            <b v-if="result.floorArea">
              m<sup>2</sup>
            </b>
            <b v-else>暂无</b>
          </info-item-ui>
          <info-item-ui title="项目收费面积">
            {{result.chargeArea}}
            <b v-if="result.chargeArea">
              m<sup>2</sup>
            </b>
            <b v-else>暂无</b>
          </info-item-ui>
          <info-item-ui title="项目建筑面积">
            {{result.buildingArea}}
            <b v-if="result.buildingArea">
              m<sup>2</sup>
            </b>
            <b v-else>暂无</b>
          </info-item-ui>
        </el-col>
        <el-col :span="6">
          <info-item-ui title="经度">{{result.lng}}</info-item-ui>
          <info-item-ui title="纬度">{{result.lat}}</info-item-ui>
          <info-item-ui title="项目证书">
            <div v-for="item in result.projectCertList"
                 :key="item.id" @click="watchCerPic(item.pic1)"
                 class="remark-img">
              {{item.remark}}
            </div>
          </info-item-ui>
          <info-item-ui title="备注信息">{{result.remark}}</info-item-ui>
        </el-col>
      </el-row>
    </div>
    <!--基本信息 end-->
    <!--组织架构-->
    <el-row class="m-b-20 m-t-20" :gutter="20">
      <el-col :span="12" class=" related-project">
        <div v-content-inline>
          <div v-content-inline-title class="flex-justify-between  flex-center">
            项目组织架构
            <router-link :to="{name:'operationOrganize', params: id }">
              <el-button
                size="medium"
                plain
                >编辑</el-button>
            </router-link>
          </div>
          <el-scrollbar tag="div"  >
            <p class="company-name p-l-30">
              <span class="name">{{result.mainCompany.name}}</span>
            </p>
            <infinite-collapse :data="depList" :isChoosePosition="false"></infinite-collapse>
            <img
              src="../../assets/img/icon-img/icon-empty-dep.png"
              class="empty-icon-text"
              v-if="!result.mainCompany.name"
              alt=""/>
          </el-scrollbar>
        </div>
      </el-col>
      <el-col :span="12" class="related-project">
        <div v-content-inline>
          <div v-content-inline-title class=" flex-justify-between">
            功能模块
            <router-link :to="{name:'projectEdit', params: id }">
              <el-button
                plain
               size="medium"
              >编辑</el-button>
            </router-link>
          </div>
          <img
            src="../../assets/img/icon-img/icon-empty-dep.png"
            class="empty-icon-text"
            />
          <!--<el-scrollbar tag="div" style="height: 300px">-->
            <!--<el-tabs v-model="activeName" >-->
              <!--<el-tab-pane label="OVERLORD" name="overlord">-->
                <!--<span slot="label" class="m-l-30"><i class="icon-date overload "></i></span>-->
                <!--<div class="item-li flex-justify">-->
                  <!--此功能暂未开放-->
                <!--</div>-->
              <!--</el-tab-pane>-->
              <!--<el-tab-pane label="SEER" name="seer">-->
                <!--<span slot="label"><i class="icon-date  seer"></i></span>-->
                <!--<div class="item-li flex-justify">-->
                  <!--此功能暂未开放-->
                <!--</div>-->
              <!--</el-tab-pane>-->
              <!--<el-tab-pane label="TRACKER" name="tracker">-->
                <!--<span slot="label"><i class="icon-date tracker"></i></span>-->
                <!--<div class="item-li" v-for="item in trackerList" :key="item.id">-->
                  <!--<div class="left">-->
                      <!--<span class="title">-->
                        <!--{{item.nameCn}}-->
                      <!--</span>-->
                  <!--</div>-->
                  <!--<div class="right">-->
                    <!--{{item.remark}}-->
                  <!--</div>-->
                <!--</div>-->
              <!--</el-tab-pane>-->
              <!--<el-tab-pane label="PROVIDER" name="provider">-->
                <!--<span slot="label"><i class="icon-date provider"></i></span>-->
                <!--<div class="item-li flex-justify">-->
                  <!--此功能暂未开放-->
                <!--</div>-->
              <!--</el-tab-pane>-->
              <!--<el-tab-pane label="SENTRY" name="sentry">-->
                <!--<span slot="label"><i class="icon-date sentry"></i></span>-->
                <!--<div class="item-li flex-justify">-->
                  <!--此功能暂未开放-->
                <!--</div>-->
              <!--</el-tab-pane>-->
            <!--</el-tabs>-->
          <!--</el-scrollbar>-->
        </div>
      </el-col>
    </el-row>
    <!--组织架构-->
    <!--相关联络人 相关项目-->
    <el-row  :gutter="20" class=" m-t-20 m-b-20">
      <el-col :span="12" class="related-project">
        <div v-content-inline>
          <div v-content-inline-title>
            相关联络人
          </div>
          <el-scrollbar tag="div" >
            <div class="item-li" v-for="item in result.linkmanList" :key="item.id">
            <span class="title">
            {{item.name}}
            </span>
             <!-- <client-tag :num="item.relationProject"></client-tag>-->
              <item-tag :num="item.relationProject"></item-tag>
              <span class="control m-r-25">
            <router-link :to="{name:'crmDetails',params:{id:item.id}}">
               <el-button  plain>前往</el-button>
            </router-link>
            </span>
            </div>
          </el-scrollbar>
        </div>
      </el-col>
      <!---->
      <el-col :span="12" class="related-project">
        <div v-content-inline>
          <div v-content-inline-title>
            客户公司
          </div>
          <el-scrollbar tag="div" >
            <el-collapse v-model="activeNames">
              <el-collapse-item>
                <template slot="title">
                  <div class="collapse-title flex-center flex-justify-between p-r-30 go-title">
                    <span class="name">
                      {{result.mainCompany.name}}
                    </span>
                    <span>
                      <el-button plain>前往</el-button>
                    </span>
                  </div>
                </template>
                <div class="collapse-content p-l-100">
                  <div class="font-18 p-t-15 p-b-15">合作公司</div>
                  <ul>
                    <li class="font-16 p-t-20 p-b-20 border-bottom"
                        v-for="item in result.companySubs" :key="item.companySubId">
                      {{item.companySubName}}
                    </li>
                  </ul>
                </div>
              </el-collapse-item>
            </el-collapse>
            <div v-content-inline-title  class="p-t-20">
              相关客户
            </div>
            <div class="item-li flex-justify nothingColor" v-if="!result.companyList.length">
              暂无相关客户数据
            </div>
            <div class="item-li" v-for="item in result.companyList" :key="item.id">
                  <span class="title">
                    {{item.name}}
                  </span>
              <child-tag :num="item.relationProject"></child-tag>
              <span class="control m-r-25">
                    <router-link :to="{name:'crmDetails',params:{id:item.id}}">
                      <el-button  plain>前往</el-button>
                    </router-link>
                  </span>
            </div>
          </el-scrollbar>
        </div>
      </el-col>
    </el-row>
    <!--相关联络人 相关项目-->
    <!--相关合同-->
    <el-row class="m-b-20 m-t-20" :gutter="20">
      <el-col :span="12" class="p-r-10">
        <div v-content-inline>
          <div v-content-inline-title>
            相关合同
          </div>
          <el-scrollbar tag="div">
            <el-table
              :data="result.contractList"
              style="width: 100%">
              <el-table-column
                prop="contractCode"
                label="合同编号"
              >
              </el-table-column>
              <el-table-column
                prop="fee"
                label="合同标的">
                <template slot-scope="scope">{{Number(scope.row.fee) / 100}}</template>
              </el-table-column>
              <el-table-column
                label="合同时间"
              >
                <template slot-scope="scope">
                  {{$day(Number(scope.row.startAt)).format('YYYY-MM-DD')}}
                  - {{$day(Number(scope.row.endAt)).format('YYYY-MM-DD')}}
                </template>
              </el-table-column>
              <el-table-column
                label="操作"
              >
                <template slot-scope="scope">
                  <router-link :to="{name:'financeDetails',params:{id:scope.row.id}}">
                    <el-button size="small" plain>前往</el-button>
                  </router-link>
                </template>
              </el-table-column>
            </el-table>
          </el-scrollbar>
        </div>
      </el-col>
      <el-col :span="12" class="p-r-10">
        <div v-content-inline>
          <div v-content-inline-title>
            待开发
          </div>
        </div>
      </el-col>
    </el-row>
    <!--相关合同 end-->
    <!--查看证书-->
    <el-dialog  :visible.sync="dialogTableVisible">
      <div v-if="!pic" class="title">该证书暂无图片</div>
      <img v-else :src="pic" alt="" class="remark-logo">
    </el-dialog>
  </div>
</template>
<script>
import gradeUi from '../../components/ui/grade-ui';
import clientTag from '../../components/ui/client-tag-ui'; // 人员标签
import itemTag from '../../components/ui/item-tag-ui'; // 联络人
import childTag from '../../components/ui/child-tag-ui'; // 相关客户
import infiniteCollapse from '../../components/common/func-dialog/infinite-collapse/infinite-collapse';

export default {
  name: 'project-details',
  components: { gradeUi, clientTag, infiniteCollapse, itemTag, childTag },
  data() {
    return {
      pic: '', // 查看证书图片
      dialogTableVisible: false, // 证书图片弹框
      activeNames: ['1'], // 折叠面板
      id: this.$route.params.id, // 项目id
      depList: [], // 部门列表
      result: {
        name: '',
        beaconVersion: 1,
        linkmanList: [], // 相关联络人
        companyList: [], // 相关客户
        mainCompany: {}, // 主公司
        companySubs: [], // 合作公司
        projectDepts: [], // 组织架构
        zone: {
          lv2Name: '',
        },
      },
      blueTooth: [
        { value: '1', label: '旧蓝牙' },
        { value: '2', label: '新蓝牙' },
        { value: '3', label: 'NFC' },
      ],
      activeName: 'tracker',
      trackerList: [],
      linkmanList: [
        {
          name: '2131231',
          relationProject: 1,
        },
        {
          name: '2131231',
          relationProject: 1,
        },
        {
          name: '2131231',
          relationProject: 1,
        },
        {
          name: '2131231',
          relationProject: 1,
        },
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
    };
  },
  methods: {
    /**
     * 查询部门
     * */
    getDep() {
      this.$http.get(this.api.operationApi.companyMsg, {
        params: {
          projectId: this.id,
          positionValid: null,
        },
      }).then((res) => {
        this.depList = res;
        this.eachData(this.depList);
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
     *点击查看 图片
     *
     * */

    watchCerPic(pic) {
      this.pic = pic;
      this.dialogTableVisible = true;
    },
    /**
    *
    * 点击编辑按钮跳转
    * */
    goEdit() {
      this.$router.push({ name: 'operationEdit', params: this.id });
    },
    /**
     * 数据解构更换
     *
     * */
    getArrData(arr) {
      arr.forEach((obj) => {
        obj.children = obj.deptSonList;
        if (obj.deptSonList) {
          this.getArrData(obj.deptSonList);
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
        this.result = res;
        if (this.result.projectDepts.length >= 1) {
          this.getArrData(this.result.projectDepts);
        }
        this.$setTitle(res.name);
      });
    },
    /**
     *根据projectId 查询相关的权限信息
     *
     * */
    getRoleListByProjectId() {
      this.$http.get(this.api.projectApi.getRoleListById, {
        params: {
          projectId: this.id,
        },
      }).then((res) => {
        if (res.permissionTreeVOS.length > 0) {
          this.trackerList = res.permissionTreeVOS[0].children;
        }
      });
    },
  },
  computed: {
    /**
     *计算市区 名字 的拼写
     *
     * */
    filterName() {
      const zone = this.result.zone;
      if (zone.lv2Name) {
        return `${zone.lv1Name}/${zone.lv2Name}`;
      }
      return zone.lv1Name;
    },
  },
  mounted() {
    this.getProjectDetails();
    this.getDep();
  },
};
</script>

<style lang="less" type="text/less" scoped>
  .project-details{
    .content-inline-title{
      .edit-btn{
        float: right;
        width: 120px;
        height: 38px;
      }
      .go-title{
        width: 100%;
      }
    }
    .company-name{
      height: 55px;
      display: flex;
      span.name{
        font-weight: 400;
      }
      font-size: 18px;
      padding: 0 30px;
      align-items: center;
      justify-content: space-between;
    }
    .pic-item{
      .pic-item-content{
        position: relative;
        max-width: 340px;
        height: 340px;
        display: flex;
        align-items: center;
        overflow:hidden;
        justify-content: center;
      }
      .big-img{
        position: absolute;
        width: 100%;
        height: 100%;
        background: #5a72c2;
      }
      .pic-center{
        z-index: 1;
        display: flex;
        align-items: center;
        flex-direction: column;
        color: #ffffff;
        .small-img{
          .circular(100);
        }
        .project-name{
          padding: 20px 0;
        }
      }
    }
  }
</style>
