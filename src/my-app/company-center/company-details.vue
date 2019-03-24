/**
* Created by c on 2018/6/4.
*/
<template>
	<div class="company-details tables ">
    <panelContentHeader>
      <template>
        <el-button
          size="medium"
          type="primary"
          class="m-l-15"
          @click="goEditCompany">编辑客户</el-button>
      </template>
    </panelContentHeader>
      <!--基本信息-->
      <el-row class="basic-info" v-content>
          <el-col :span="8" >
              <div v-content-title>
                基本信息
              </div>
            <info-item-ui title="公司名称">{{result.name}}</info-item-ui>
            <info-item-ui title="客户编号">{{result.companyCode}}</info-item-ui>
            <info-item-ui title="公司规模">
              <b v-if="result.companySize == 1">微型(50人以下)</b>
              <b v-if="result.companySize == 2">小型(50人至299人)</b>
              <b v-if="result.companySize == 3">中型(300人至1000人)</b>
              <b v-if="result.companySize == 4">大型(1000人及以上)</b>
            </info-item-ui>
            <info-item-ui title="公司类型">
              <b v-if="result.category == 1">央企</b>
              <b v-if="result.category == 2">国企</b>
              <b v-if="result.category == 3">民营</b>
              <b v-if="result.category == 4">合资</b>
              <b v-if="result.category == 5">外企</b>
            </info-item-ui>
            <info-item-ui title="详细地址">{{ `${filterName} ${result.address}` }}</info-item-ui>
          </el-col>
          <el-col :span="16" class="p-t-40">
            <info-item-ui title="开户行账号">{{result.billAccountNo}}</info-item-ui>
            <info-item-ui title="开户行信息">{{result.billAccountBank}}</info-item-ui>
            <info-item-ui title="开票地址">{{result.billAddress}}</info-item-ui>
            <info-item-ui title="信用代码">{{result.billCreditCode}}</info-item-ui>
            <info-item-ui title="备注信息">{{result.remark}}</info-item-ui>
          </el-col>
      </el-row>
      <!--基本信息 end-->
    <!--相关客户和相关项目-->
      <el-row  class="m-t-20 m-b-20">
        <el-col :span="8" class="p-r-20">
          <div v-content-inline >
            <div v-content-inline-title>
              相关联络人
            </div>
            <el-scrollbar tag="div">
              <div class="item-li" v-for="item in result.linkmanList" :key="item.id">
                  <span class="title">
                    {{item.name}}
                  </span>
                  <client-tag-ui :num="item.relationCompany"></client-tag-ui>
                <router-link :to="{name:'crmDetails',params:{id:item.id}}">
                  <el-button size="small" plain>查看</el-button>
                </router-link>
              </div>
            </el-scrollbar>
          </div>
        </el-col>
        <el-col :span="8" class="p-r-20">
          <div v-content-inline>
            <div v-content-inline-title>
              相关项目
            </div>
            <el-scrollbar tag="div">
              <div class="item-li" v-for="item in result.projectList" :key="item.id">
                <span class="title">
                    {{item.name}}
                </span>
                <child-tag-ui :num=item.relationCompany></child-tag-ui>
                <router-link :to="{name:'projectDetails',params:{id:item.id}}">
                <el-button size="small" plain>前往</el-button>
              </router-link>
              </div>
            </el-scrollbar>
          </div>
        </el-col>
        <el-col :span="8">
          <div v-content-inline>
            <div v-content-inline-title>
              合作客户
            </div>
            <el-scrollbar tag="div">
              <div class="item-li" v-for="item in result.companySubList" :key="item.id">
                <span class="title">
                    {{item.name}}
                </span>
              </div>
            </el-scrollbar>
          </div>
        </el-col>
      </el-row>
    <!--相关客户和相关项目 end-->
	</div>
</template>
<script>
import clientTag from '../../components/ui/client-tag-ui'; // 人员标签
import itemTag from '../../components/ui/item-tag-ui'; // 人员职务标签

export default {
  name: 'company-details',
  components: { itemTag, clientTag },
  data() {
    return {
      id: this.$route.params.id, // 详情id
      result: {
        zone: {},
      },
    };
  },
  methods: {
    /**
     * 获取客户详情
     *
     * */
    getCompanyDetails() {
      this.$http.post(this.api.companyApi.getCompanyDetail, { id: this.id })
        .then((res) => {
          this.result = res;
          // if (res.zone.lv1Name) {} else if() {} else{}
          this.$setTitle(res.name);
        });
    },
    /**
     * 跳转到编辑客户页面
     *
     * */
    goEditCompany() {
      this.$router.push({ name: 'companyEdit', params: { id: this.id } });
    },
  },
  mounted() {
    this.getCompanyDetails();
  },
  computed: {
    /**
     *计算市区 名字 的拼写
     *
     * */
    filterName() {
      const zone = this.result.zone;
      if (zone.lv2Name) {
        return `${zone.lv1Name} ${zone.lv2Name}`;
      } else if (zone.lv3Name) {
        return `${zone.lv1Name} ${zone.lv2Name} ${zone.lv3Name}`;
      }
      return zone.lv1Name;
    },
  },
};
</script>

<style lang="less" type="text/less" scoped>
  .company-details{
      .basic-info{
        .el-card{
          height: 450px;
        }
        .pic-item{
          align-items: center;
          .user-pic{
            padding-right: 15px;
            img{
              border-radius: 5px;
            }
          }
          .user-name{
            b{
              display: block;
            }
            .name{
              font-weight: 800;
              font-size: 22px;
            }
            .position{
              color: #7b8aa4;
            }
          }
        }
      }
    }
</style>
