<template>
  <div class='landing-page'>
    <div>
      <div class='lang-header'>
        <p class="lf-user">
          <i class="user-icon"></i>
          用户名
        </p>
        <img src="../../assets/img/logo.png" alt="" class="logo-icon">
      </div>
      <!--<div class="lang-content el-scrollbar__view">-->
        <el-scrollbar tag="div"  v-table class="lang-content el-scrollbar__view">
        <div class="item-box " ref="item">
        <div class="item-content" v-for="(item,index) in detailsArr"
             :key="index"
             @click="goDetails(item.pathName)"
             @mouseover="showActive(index,true)"
             @mouseout="showActive(index,false)"
             >
            <p class="img-icon">
                <img :src="item.imgUrl" alt="" v-show="activeId !== index">
                <transition name="fade" mode="out-in">
                  <img v-show="activeId === index" :src="item.imgUrlHover" alt="">
                </transition>
            </p>
            <span class="title">{{item.title}}</span>
        </div>
      </div>
        </el-scrollbar>
      <!--</div>-->
    </div>
  </div>
</template>
<script>
const arr = [
  // {
  //   imgUrl: require('../../assets/img/landing-page/home_icon_crm_nor.png'),
  //   imgUrlHover: require('../../assets/img/landing-page/home_icon_crm_hover.png'),
  //   title: '联系人',
  //   pathName: 'crmList',
  // },
  {
    imgUrl: require('../../assets/img/landing-page/home_icon_client_nor.png'),
    imgUrlHover: require('../../assets/img/landing-page/home_icon_client_hover.png'),
    title: '客户模块',
    pathName: 'company',
  },
  {
    imgUrl: require('../../assets/img/landing-page/home_icon_project_nor.png'),
    imgUrlHover: require('../../assets/img/landing-page/home_icon_project_hover.png'),
    title: '项目模块',
    pathName: 'project',
  },
  // {
  //   imgUrl: require('../../assets/img/landing-page/home_icon_contract_nor.png'),
  //   imgUrlHover: require('../../assets/img/landing-page/home_icon_contract_hover.png'),
  //   title: '财务&合同',
  //   pathName: 'finance',
  // },
  // {
  //   imgUrl: require('../../assets/img/landing-page/home_icon_permission_nor.png'),
  //   imgUrlHover: require('../../assets/img/landing-page/home_icon_permission_hover.png'),
  //   title: '角色&权限',
  //   pathName: 'roleList',
  // },
  {
    imgUrl: require('../../assets/img/landing-page/home_icon_space_nor.png'),
    imgUrlHover: require('../../assets/img/landing-page/home_icon_space_hover.png'),
    title: '空间资产',
    pathName: 'space',
  },
  {
    imgUrl: require('../../assets/img/landing-page/home_icon_people_nor.png'),
    imgUrlHover: require('../../assets/img/landing-page/home_icon_people_hover.png'),
    title: '人员',
    pathName: 'personnelList',
  },
  // {
  //   imgUrl: require('../../assets/img/landing-page/home_icon_equipment_nor.png'),
  //   imgUrlHover: require('../../assets/img/landing-page/home_icon_equipment_hover.png'),
  //   title: '资产',
  //   pathName: 'assets',
  // },
  {
    imgUrl: require('../../assets/img/landing-page/home_icon_task_nor.png'),
    imgUrlHover: require('../../assets/img/landing-page/home_icon_task_hover.png'),
    title: '业务模块',
  },
  {
    imgUrl: require('../../assets/img/landing-page/home_icon_statistics_nor.png'),
    imgUrlHover: require('../../assets/img/landing-page/home_icon_statistics_hover.png'),
    title: '统计',
  },
  {
    imgUrl: require('../../assets/img/landing-page/home_icon_seer_nor.png'),
    imgUrlHover: require('../../assets/img/landing-page/home_icon_seer_hover.png'),
    title: 'SEER',
  },
  {
    imgUrl: require('../../assets/img/landing-page/home_icon_tracker_nor.png'),
    imgUrlHover: require('../../assets/img/landing-page/home_icon_tracker_hover.png'),
    title: 'TRACKER',
    pathName: 'trackerMain',
  },
  {
    imgUrl: require('../../assets/img/landing-page/home_icon_provider_nor.png'),
    imgUrlHover: require('../../assets/img/landing-page/home_icon_provider_hover.png'),
    title: 'PROVIDER',
  },
  {
    imgUrl: require('../../assets/img/landing-page/home_icon_sentry_nor.png'),
    imgUrlHover: require('../../assets/img/landing-page/home_icon_sentry_hover.png'),
    title: 'SENTRY',
  },
];
export default{
  name: 'landing-page',
  data() {
    return {
      detailsArr: arr,
      activeId: -1, // 定义图片的id值
      num: arr.length % 4,
      colorList: ['lv', 'hong', 'huang', 'lan'], // 4種顔色
    };
  },
  methods: {
    /**
     * 跳转到对应模块
     *
     * */
    goDetails(name) {
      const pathName = name;
      this.$router.push({ name: pathName });
    },
    /**
     * 鼠标移入更换图片
     *
     * */
    showActive(id, isEnter) {
      if (isEnter) {
        this.activeId = id;
        const itemClass = '  item-content';
        this.$refs.item.children[id].className = this.colorList[id % 4] + itemClass;
      } else {
        this.activeId = -1;
        this.$refs.item.children[id].className = 'item-content';
      }
    },
  },
};
</script>
<style lang="less" scoped type="text/less">
.landing-page{
  background: #f5f5f5;
  .lang-header{
    position: absolute;
    left:0;
    top:0;
    width:100%;
    height:70px;
    line-height: 70px;
    background-color:#fff;
    padding:0 30px;
    .lf-user{
      float: left;
      .user-icon{
        width: 36px;
        height: 36px;
        border-radius: 17px;
        background-color: #888;
        display: inline-block;
        vertical-align: middle;
        margin-right:5px;
      }
    }
    .logo-icon{
      float: right;
      margin-top:20px;
      width: 180px;
    }
  }
  .lang-content{
    /*border:1px solid red;*/
    margin-top:70px;
    padding-top:23px;
    margin: 70px auto;
    width: 100%;
    height: 800px;
    .item-box{
      width: 1370px;
      margin:0 auto;
      height: 100vh;
      .item-content{
        height: 200px;
        width:200px;
        text-align: center;
        background:#fff;
        float: left;
        margin:10px;
        font-size: 20px;
        color:@main-color;
        cursor: pointer;
        .img-icon{
          width: 70px;
          height: 70px;
          margin:38px auto;
          text-align: center;
          position: relative;
          &>img{
            width: 100%;
            position: absolute;
            left: 0;
            height: 70px;
          }
        }
        &:hover{
          color:#fff;
        }
      }
      .hong {
        background: linear-gradient(0deg, #e33839 0%, #fe929c 100%);
        box-shadow: 0px 10px 10px 0px rgba(227, 56, 57, 0.4);
      }
      .huang{
        background: linear-gradient(0deg, #fa742b 0%, #fd9a44 50%, #ffc05c 100%);
        box-shadow: 0px 10px 10px 0px rgba(250, 116, 43, 0.4);

      }
      .lan {
        background: linear-gradient(0deg, #1779e6 0%, #79b8ff 100%);
        box-shadow: 0px 10px 10px 0px rgba(17, 121, 230, 0.4);
      }
      .lv{
        background: linear-gradient(0deg, #1bbc44 1%, #b8e270 100%);
        box-shadow: 0px 10px 10px 0px rgba(35, 190, 70, 0.4);
      }
    }
 }
}
</style>
