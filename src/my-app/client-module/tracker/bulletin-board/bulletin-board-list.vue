/**
 * Created by c on 2019/1/24.
 */
<template>
<div class="bulletin-board-list">
  <panelContentHeader>
    <info-item-ui title="项目"
                  :font="14"
                  last
                  class="header-select"
                  :label-width="100">
      <el-select v-model="projectId"  placeholder="全部项目"
                 @change="getList">
        <el-option
          v-for="item in projectArr"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
    </info-item-ui>
  </panelContentHeader>
  <!--公告列表-->
  <div v-content>
    <el-row>
      <el-col :span="12" class="p-r-10">
        <div v-content-title>
          <div class="flex-center flex-justify-between">
            <span>
              现显示公告
            </span>
            <router-link :to="{name:'bulletinBoardAdd', params: { projectId: projectId }}">
              <el-button  type="primary">{{!btnType? '新增公告': '更新公告'}}</el-button>
            </router-link>
          </div>
        </div>
        <!--公告-->
        <div class="bulletin-item"
             v-for="(item) in result"
             v-if="item.valid === '2'"
             :key="item.id">
          <info-item-ui title="公告标题" :label-width="80" :font="14">{{item.title}}</info-item-ui>
          <info-item-ui
            title="发布人"
            :label-width="80"
            :font="14">{{item.createByName}}</info-item-ui>
          <info-item-ui
            title="日期"
            :label-width="80"
            last
            :font="14"
            border
            class="p-b-20">{{$day(Number(item.createAt)).format('YYYY/MM/DD')}}</info-item-ui>
          <div class="bottom">
            <router-link
              :to="{name: 'bulletinBoardDetails',params: { id:item.id },query: { type:1 }}">
              <el-button type="primary" class="m-r-15">查看公告</el-button>
            </router-link>
            <el-button type="danger" @click="deleteBoard(item.id)">删除公告</el-button>
          </div>
        </div>
        <!--公告 end-->
      </el-col>
    </el-row>
    <!--历史公告列表-->
    <div v-content-title class="m-t-20">历史公告</div>
    <el-row class="history-list">
      <el-col
        :span="12"
        v-for="(item) in result"
        v-if="item.valid === '1'"
        :key="item.id">
        <!--公告-->
        <div class="bulletin-item">
          <info-item-ui title="公告标题" :label-width="80" :font="14">{{item.title}}</info-item-ui>
          <info-item-ui
            title="发布人"
            :label-width="80"
            :font="14">{{item.createByName}}</info-item-ui>
          <info-item-ui
            title="日期"
            :label-width="80"
            last
            :font="14"
            border
            class="p-b-20">{{$day(Number(item.createAt)).format('YYYY/MM/DD')}}</info-item-ui>
          <div class="bottom">
            <router-link
              :to="{name: 'bulletinBoardDetails',params: { id:item.id },query: { type:2 }}">
              <el-button type="primary" class="m-r-15">查看公告</el-button>
            </router-link>
          </div>
        </div>
        <!--公告 end-->
      </el-col>
    </el-row>
    <!--历史公告列表 end-->
  </div>
  <!--公告列表 end-->
</div>
</template>
<script>
export default{
  name: 'bulletin-board-list',
  components: {},
  data() {
    return {
      projectId: -99999, // 项目id
      projectArr: [],
      result: [],
      btnType: false,
    };
  },
  methods: {
    /**
     * 删除公告
     *
     * */
    deleteBoard(itemId) {
      this.$confirm('是否确认删除公告，删除后无法还原，请确认', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$http.post(this.api.bulletinApi.edit, { id: itemId, valid: 0 })
          .then((res) => {
            if (res) {
              this.$message.success('删除成功');
              this.getList();
            }
          });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除',
        });
      });
    },
    /**
     * 获取公告栏列表
     *
     * */
    getList() {
      this.$http.post(this.api.bulletinApi.list, { projectId: this.projectId })
        .then((res) => {
          if (res) {
            this.result = res.list;
            this.btnType = this.result.some(v => v.valid === '2');
          }
        });
    },
    /**
     * 查询项目列表
     */
    getProjectList() {
      this.$http.post(this.api.projectApi.projectList, {
        pageIndex: 1,
        pageSize: 9999,
        searchName: '',
        status: null,
        unStatus: null,
      })
        .then((res) => {
          this.projectArr = res.list;
          if (this.$route.query.projectId) {
            this.projectId = this.$route.query.projectId;
          } else {
            this.projectId = this.projectArr[0].id;
          }
          this.getList();
        });
    },
  },
  mounted() {
    this.getProjectList();
  },
};
</script>

<style lang="less" type="text/less" scoped>
  .bulletin-board-list{
    .history-list{
      .el-col{
        &:nth-child(n){
          padding-right: 10px;
        }
        &:nth-child(2n){
          padding-left: 10px;
        }
      }
    }
    .bulletin-item{
      .border;
      padding: 30px 20px 0 20px;
      margin-bottom: 20px;
      .bottom{
        display: flex;
        justify-content: flex-end;
        padding: 10px 0;
      }
    }
    .header-select{
      width: 400px;
      .el-select{
        background: #ffffff;
      }
    }
  }
</style>
