/**
* Created by c on 2018/6/11.
*/
<template>
  <div class="assets-details tables ">
    <!--头部 end-->
    <div class="header-body">
      <!--左边的面包屑-->
      <div class="flex-justify-between">
        <div class="header-lf space-level" v-if="isShow">资产详情</div>
        <div class="header-lf space-level" v-else >
          <span class="title-icon">列表首页</span>
          <span class="text"
                :class="{'last-child': levelList.length == index+1 }"
                v-for="(item, index) in levelList"
                :key="index">
            <i class="el-icon-arrow-right title"></i>
            {{item.name}}
          </span>
        </div>
        <el-button size="medium" type="primary" class="btn" @click="goEditPage">编辑</el-button>
      </div>
      <!--头部样式-->
    </div>
    <!--头部-->
    <!--基本信息-->
    <el-row class="basic-info" v-content v-if="tableData" >
      <div v-content-title>基本信息</div>
      <el-col :span="8">
        <div class="info-item m-t-30">
          <info-item-ui title="资产名称">{{tableData.name}}</info-item-ui>
        </div>
        <div class="info-item m-t-30">
          <info-item-ui title="资产编号">{{tableData.assetCode}}</info-item-ui>
        </div>
        <div class="pic-item flex">
          <span class="pic-item-text">
            <div class="label">资产图片</div>
          </span>
          <img :src="img" alt="" class="img-icon"
               @click="open(img)"
            v-for="(img,index) in tableData.pics" :key="index">
        </div>
        <div class="info-item m-t-30">
          <info-item-ui title=" 资产类型">{{tableData.categoryName}}</info-item-ui>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="info-item m-t-30">
          <info-item-ui title="所属项目">{{ tableData.projectName }}</info-item-ui>
        </div>
        <div class="info-item m-t-30">
          <info-item-ui title="所属空间">{{tableData.projectSpaceName}}
            <div v-if="tableData.space_valid === -1" style="color:red;">
            <i class="el-icon-warning"></i>
            该空间已删除, 请重新选择
            </div>
          </info-item-ui>
        </div>
        <div class="info-item m-t-30">
          <info-item-ui title="负责人职能">{{tableData.positionName}}</info-item-ui>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="info-item m-t-30">
          <div class="other">其他信息</div>
          <info-item-ui title="生产厂家">{{tableData.factory}}</info-item-ui>
        </div>
        <div class="info-item m-t-30">
          <info-item-ui title="使用年限">{{tableData.maxYear}} 年</info-item-ui>
        </div>
        <div class="info-item m-t-30">
          <info-item-ui title="规格型号">{{tableData.spec}}</info-item-ui>
        </div>
        <div class="info-item m-t-30">
          <info-item-ui title="购买日期">{{tableData.buyTime}}</info-item-ui>
        </div>
        <div class="info-item m-t-30">
          <info-item-ui title="备注">{{tableData.remark}}</info-item-ui>
        </div>
      </el-col>
    </el-row>
    <!--基本信息 end-->
    <!--子合同和款项信息-->
    <el-row :gutter="20" class="m-t-20 m-b-20">
      <el-col :span="12" >
        <div v-content style="height: 770px">
          <div v-content-title>巡视内容</div>
          <el-scrollbar tag="div" >
            <div class="icon-imgs hasNo" v-if="!patrolList.length">
              <img src="../../assets/img/icon-img/hasNo.png" alt="" >
            </div>
            <div v-else>
              <ul class="patrolContent">
                <li v-for="(child,index) in patrolList" :key="index">
                  <span>{{ index + 1}}.</span>
                  <span>{{ child }}</span>
                </li>
              </ul>
            </div>
          </el-scrollbar>
        </div>
      </el-col>
      <el-col :span="12">
        <div v-content style="height: 770px">
          <div v-content-title>待开发</div>
          <el-scrollbar tag="div" >
            <div class="icon-imgs">
              <img src="../../assets/img/icon-img/icon_no.png" alt="" >
            </div>
          </el-scrollbar>
        </div>
      </el-col>
    </el-row>
    <!--子合同和款项信息 end-->
    <el-dialog
      :visible.sync="dialogVisible">
        <div class="bigImg">
          <img :src="imgUrl" alt="">
        </div>
    </el-dialog>
  </div>
</template>
<script>

export default {
  name: 'assets-details',
  data() {
    return {
      tableData: {},
      assetId: this.$route.params.id,
      imgUrl: '',
      dialogVisible: false,
      patrolList: [], // 故障列表
      id: this.$route.params.id,
      levelList: [], // 标题列表
      isShow: false, // 是否是空间进入
    };
  },
  methods: {
    /**
     * 根据空间的id ,查找路径名称
     *
     * */
    searchPathNameBySpaceId(id) {
      this.$http.post(this.api.spaceApi.pathBatch, id).then((res) => {
        const arr = res[0].pnames;
        const pathName = arr.reverse().join('/');
        if (pathName) {
          this.tableData.projectSpaceName = `${pathName}/${this.tableData.projectSpaceName}`;
        }
      });
    },
    /**
     * 点击跳转到资产编辑页面
     *
     * */
    goEditPage() {
      this.$router.push({ name: 'assetsEdit', params: this.id });
    },
    /**
     *查询资产详情
     *
     * */
    getAssetsDetails() {
      this.$http.get(this.api.assetsApi.getAssetsDetails, {
        params: {
          assetId: this.assetId,
        },
      }).then((res) => {
        res.buyTime = res.buyTime ? this.$day(Number(res.buyTime)).format('YYYY/MM/DD') : '暂无';
        const str = res.patrolContent;
        if (str !== '') {
          if (str.search('&') === -1) {
            this.patrolList.push(str);
          } else {
            this.patrolList = res.patrolContent.split('&');
          }
        }
        const spaceId = [];
        spaceId.push(res.projectSpaceId);
        this.tableData = res;
        this.searchPathNameBySpaceId(spaceId);
      });
    },
    /**
     * 点击发大图片
     *
     * */
    open(val) {
      this.imgUrl = val;
      this.dialogVisible = true;
    },
  },
  created() {
    this.getAssetsDetails();
    // 判断空间列表是否有层级嵌套
    if (Number(this.$cookie.get('isShowSpace')) === 1) {
      if (this.$cookie.get('levelList')) {
        this.levelList = JSON.parse(this.$cookie.get('levelList'));
        this.isShow = false;
      }
    } else {
      this.isShow = true;
    }
  },
};
</script>

<style lang="less" type="text/less" scoped>
  .assets-details{
    .header-body{
      .header-lf{
        display: flex;
        padding-bottom: 20px;
        align-items: center;
        color: #c5cbd2;
        font-size: 20px;
        min-width: 500px;
        .title-icon{
          cursor: pointer;
        }
        .title{
          display: inline-block;
          color: #c5cbd2!important;
        }
        .last-child{
          color: #2f3747;
          cursor: pointer;
        }
        .text{
          cursor: pointer;
        }
      }
    }
    .patrolContent{
       &>li{
        line-height:50px;
        border-bottom: 1px solid #f0f4f8;
       }
    }
    .other{
      font-size: 18px;
      float: right;
      font-size: 18px;
      position: absolute;
      top: 20px;
    }
    .icon-imgs{
      text-align: center;
    }
    .hasNo{
      padding-top: 40px;
    }
    .pic-item{
      align-items: center;
      position: relative;
      .img-icon {
        position: relative;
        width: 50px;
        height: 50px;
        left:70px;
        margin-right: 7px;
      }
      .img-icon-big {
        position: absolute;
        width: 100px;
        height: 100px;
        left: 15%;
        margin-right: 7px;
        background-color: #fff;
      }
      .download{
        position: relative;
        .square(100);
        overflow: hidden;
        border-radius: 5px;
        .background-position(-10,-1011);
        a{
          position: absolute;
          width: 100%;
          text-align: center;
          font-size: 12px;
          color: #ffffff;
          height: 26px;
          bottom: 0;
          line-height: 26px;
          background: rgba(0,0,0,.3);
        }
      }
      .pic-item-text{
        .label{
          font-size: 16px;
          color: @secondary-color;
        }
        .info{
          color: @main-color;
          .icon{
            font-size: 20px;
          }
          .num{
            font-size: 40px;
          }
        }
      }
    }
  }
</style>
