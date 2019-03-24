/**
* Created by c on 2018/5/28.
*/
<template>
  <div class="crm-details tables ">
      <!--基本信息-->
        <el-row class="basic-info">
          <el-col :span="8" class="left">
            <div v-content >
            <div v-content-title>
              基本信息
              <relation-tag :num="result.relationLv"></relation-tag>
            </div>
            <div class="info-item pic-item">
              <span class="user-pic-f sprites-img m-r-30" v-if="result.gender === 'F'"></span>
              <span class="user-pic-m sprites-img m-r-30" v-else></span>
              <span class="user-name">
                <b class="name">{{result.name}}</b>
                <b class="position">{{result.positionName}}</b>
              </span>
            </div>
            <div class="info-item">
              <span class="info-label">
                联系电话
              </span>
              <span class="info-intro">
                <b>{{result.phone1}}</b>
                <b>{{result.phone2}}</b>
                <b>{{result.phone3}}</b>
              </span>
            </div>
            <div class="info-item">
              <span class="info-label">
                邮箱
              </span>
              <span class="info-intro">
                <b>{{result.email}}</b>
              </span>
            </div>
            <div class="info-item">
              <span class="info-label">
                联络地址
              </span>
              <span class="info-intro">
                <b>{{result.address}}</b>
              </span>
            </div>
            </div>
          </el-col>
          <el-col :span="16" class="privacy-info">
            <div v-content>
              <div class="flex">
                <div class="privacy-info-left">
                  <div class="info-item"
                       :key="index"
                       v-for="(item,index) in result.linkmanParamList">
                    <div class="info-label">
                      {{item.name}}
                    </div>
                    <div class="control" @click="openSpecial(item,index)">
                      <span v-if="activeItem.index !== index">
                        展开
                        <i class="el-icon-arrow-right"></i>
                      </span>
                      <span v-if="activeItem.index === index">
                        收起
                        <i class="el-icon-arrow-right"></i>
                      </span>
                    </div>
                  </div>
                </div>
                <div class="big-panel" v-if="activeItem.item">
                  <div class="title">
                    {{activeItem.item.name}}
                  </div>
                  <div class="content">
                    {{activeItem.item.content}}
                  </div>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      <!--基本信息 end-->
    <!--相关客户和相关项目-->
      <el-row  :gutter="20" class="m-t-20 m-b-20">
        <el-col :span="12" class="related-customer">
          <div  v-content>
            <div v-content-title>
              相关客户
            </div>
            <el-scrollbar  tag="div"  v-table>
              <div class="item-li" v-for="item in result.customerList" :key="item.id">
                <div class="left">
                  <span class="control m-r-25">
                    <router-link :to="{name:'customerDetails',params:{id:item.id}}">
                      <el-button size="small" plain>前往</el-button>
                    </router-link>
                  </span>
                  <span class="title">
                    {{item.name}}
                  </span>
                </div>
                <div class="right">
                  <client-tag :num="item.relationLinkman"></client-tag>
                </div>
              </div>
            </el-scrollbar>
          </div>
        </el-col>
        <el-col :span="12" class="related-project">
          <div v-content >
            <div v-content-title>
              相关项目
            </div>
            <el-scrollbar tag="div" v-table >
              <div class="item-li" v-for="item in result.projectList" :key="item.id">
                <div class="left">
                  <span class="control m-r-25">
                    <router-link :to="{name:'projectDetails',params:{id:item.id}}">
                      <el-button size="small" plain>前往</el-button>
                    </router-link>
                  </span>
                  <span class="title">
                    {{item.name}}
                  </span>
                </div>
                <div class="right">
                  <item-tag :num="item.relationLinkman"></item-tag>
                </div>
              </div>
            </el-scrollbar>
          </div>
        </el-col>
      </el-row>
    <!--相关客户和相关项目 end-->
    <!--操作记录-->
    <!--操作记录 end-->
  </div>
</template>
<script>
import relationTag from '../../components/ui/relation-tag-ui'; // 关系标签
import clientTag from '../../components/ui/client-tag-ui'; // 人员标签
import itemTag from '../../components/ui/item-tag-ui'; // 人员职务标签

export default {
  name: 'crm-details',
  components: { relationTag, clientTag, itemTag },
  data() {
    return {
      id: this.$route.params.id, // 详情id
      result: {}, // 详情数据
      activeItem: {
        item: {},
        index: {},
      },
    };
  },
  methods: {
    /**
     * 获取crm详情
     *
     * */
    getCrmDetails() {
      this.$http.post(this.api.crmApi.getCrmDetail, { id: this.id })
        .then((res) => {
          this.result = res;
          this.$setTitle(res.name);
        });
    },
    /**
     * 打开个人喜好
     *
     * */
    openSpecial(item, index) {
      if (this.activeItem.index === index) {
        this.activeItem.index = null;
        this.activeItem.item = null;
      } else {
        this.activeItem.index = index;
        this.activeItem.item = item;
      }
    },
  },
  mounted() {
    this.getCrmDetails();
    console.log(this.result);
  },
};
</script>

<style lang="less" type="text/less" scoped>
  .crm-details{
      .tag{
        color: #409eff;
        font-size: 12px;
        padding: 3px 12px;
        border-radius: 50px;
        margin-left: 100px;
        background: #ecf6ff;
      }
      .basic-info{
        .panel-content{
          height: 450px;
        }
        .el-card{
          height: 450px;
        }
        .pic-item{
          align-items: center;
          .user-pic-f{
            min-width: 100px;
            height: 100px;
            border-radius: 5px;
            .background-position(-10,-892)
          }
          .user-pic-m{
            min-width: 100px;
            height: 100px;
            border-radius: 5px;
            .background-position(-10,-774)
          }
          .user-name{
            b{
              display: block;
            }
            .name{
              font-weight: 800;
              font-size: 22px;
              word-break: break-all;
            }
            .position{
              color: #7b8aa4;
            }
          }
        }
        .info-item{
          display: flex;
          margin-bottom: 20px;
          color: #2f3747;
          .info-label{
            min-width: 130px;
            color: #7b8aa4;
          }
        }
        .privacy-info{
          padding-left: 20px;
          .el-card{
            padding-top: 50px;
          }
          .privacy-info-left{
            min-width: 380px;
          }
          .info-item{
            justify-content: space-between;
            padding-right: 50px;
            .info-label{
              color: #2f3747;
            }
            .control{
              cursor: pointer;
              color: #7b8aa4;
            }
          }
        }
        .big-panel{
          .title{
            color: #2f3747;
            margin-bottom: 30px;
          }
          .content{
            color: #9fa9ba;
            line-height: 24px;
          }
        }
      }
    }
</style>
