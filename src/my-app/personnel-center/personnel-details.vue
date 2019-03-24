<template>
  <div class="personnel-details">
    <!--头部-->
    <panelContentHeader>
      <template>
        <el-button size="medium" type="primary" class="m-l-15" @click="goEditPage">编辑</el-button>
      </template>
    </panelContentHeader>
    <!--头部 end-->
    <!--人员详情 人员信息-->
    <div v-content>
      <div class="personnel-details-info ">
        <div class="info-top flex">
          <div class="img-item m-r-40">
            <div class="img m-r-30">
              <img :src="result.icon" alt=""/>
            </div>
            <div class="name-item" >
              <span class="name font-22 m-b-10">{{result.name}}</span>
              <span class="num font-16">{{result.loginName}}</span>
            </div>
          </div>
          <div class="info-right flex w-100">
            <div class="item">
              <div class="title">性别</div>
              <div class="info">{{result.gender}}</div>
            </div>
            <div class="item">
              <div class="title">资历</div>
              <div class="info">{{result.qualific?result.qualific: '暂无' }}</div>
            </div>
            <div class="item">
              <div class="title">入职时间</div>
              <div class="info">{{result.entryAt}}</div>
            </div>
            <div class="item">
              <div class="title">电话</div>
              <div class="info">{{result.phone?result.phone: '暂无'}}</div>
            </div>
            <div class="item">
              <div class="title">薪资</div>
              <div class="info">{{result.salary? `${result.salary}元` : '暂无'}}</div>
            </div>
            <div class="item item-remark">
              <div class="title">备注</div>
              <div class="info">{{result.remark? result.remark: '暂无'}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--人员详情 人员信息 end-->
    <el-row class="m-t-20 m-b-20">
      <!--人员详情 部门条线-->
      <el-col :span="12" class="p-r-10">
        <div v-content-inline>
          <div v-content-inline-title>相关项目</div>
          <el-scrollbar tag="div" >
            <el-table
              :data="result.accounts">
              <el-table-column
                label="项目名称"
                prop="projectName"
                class-name="main"
              >
              </el-table-column>
              <el-table-column
                label="部门"
                align="center"
                prop="projectDeptName"
              >
              </el-table-column>
              <el-table-column
                label="所属公司"
                align="center"
                prop="companySubName"
              >
              </el-table-column>
              <el-table-column
                label="职能"
                prop="positionName"
              >
              </el-table-column>
              <el-table-column
                label="加入时间"
                prop="joinAt"
              >
              </el-table-column>
            </el-table>
          </el-scrollbar>
        </div>
      </el-col>
      <!--人员详情 部门条线 end-->
      <!--排班功能表待开发中-->
      <el-col :span="12" class="p-l-10">
        <div v-content-inline>
          <div v-content-inline-title>排班功能</div>
          <div >
            <img style="height: 400px" src="../../assets/img/icon-img/empty-icon.png" alt=""/>
          </div>
        </div>
      </el-col>
      <!--排班功能表待开发中-->
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'personnel-details',
  data() {
    return {
      result: {}, // 详情
      id: this.$route.params.id, // 人员id
      relationRole: [],
      activeNames: [], // 折叠面板 打开时候保存id
    };
  },
  methods: {
    /**
     * 获取人员详情
     *
     * */
    getPersonnelDetails() {
      this.$http.get(this.api.personnelApi.getPersonnelDetails, { params: { userId: this.id } })
        .then((res) => {
          if (res.gender === 'F') {
            res.gender = '女';
          } else if (res.gender === 'M') {
            res.gender = '男';
          } else {
            res.gender = '暂无';
          }
          res.entryAt = res.entryAt ? this.$day(Number(res.entryAt)).format('YYYY/MM/DD') : '暂无';
          this.result = res;
          this.$setTitle(res.name);
          this.result.accounts.forEach((item) => {
            item.joinAt = this.$day(Number(item.joinAt)).format('YYYY/MM/DD');
          });
        });
    },
    /**
     * 点击折叠面板
     *
     * */
    handleChange(data, index) {
      if (this.activeNames.indexOf(data.projectId) === -1) {
        this.activeNames.push(data.projectId);
        // 根据项目id 查询相关角色
        this.$http.get(this.api.personnelApi.getRoleWithProject,
          {
            params: { userId: this.id, projectId: data.projectId },
          },
        )
          .then((res) => {
            this.relationRole[index].roleList = res;
          });
      }
    },
    /**
     * 点击跳转到修改人员页面
     *
     * */
    goEditPage() {
      this.$router.push({ name: 'personnelEdit', params: this.id });
    },
  },
  mounted() {
    this.getPersonnelDetails();
  },
};
</script>

<style lang="less" type="text/less" scoped>
  .personnel-details {
    .personnel-details-info {
      .info-top {
        .info-right {
          align-items: center;
          justify-content: space-between;
        }
      }
      .img-item {
        display: flex;
        align-items: center;
        width: 360px;
        img {
          display: inline-block;
          width: 100px;
          background: #2f3747;
          height: 100px;
          border-radius: 5px;
        }
        .name-item{
          display: flex;
          flex-direction: column;
          align-items: center;
          .name{
            font-weight: 500;
            color: @main-color;
          }
          .num{
            color: @secondary-color;
          }
        }
      }
      .item {
        color: @secondary-color;
        .title {
          font-size: 14px;
          margin-bottom: 30px;
          color: @main-gray;
        }
        .main {
          color: @main-color;
        }
      }
      .item-remark{
        max-width: 250px;
        .info{
          overflow: hidden!important;
          text-overflow: ellipsis;
        }
      }
    }
    .content-list {
      .item {
        ul.item-ui {
          min-height: 50px;
          li {
            margin-left: 40px;
            padding: 15px 0;
            display: flex;
            font-size: 16px;
            justify-content: space-between;
            border-bottom: 1px solid @bottom-color;
            span {
              color: @main-color;
            }
            .remark {
              color: @secondary-color;
            }
          }
        }
      }
    }
  }
</style>
