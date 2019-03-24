/**
 * Created by c on 2019/2/21.
 */
<template>
<div class="message-list">
  <panelContentHeader>
    <template>
      <el-button size="medium" type="primary">全部已读</el-button>
    </template>
  </panelContentHeader>
  <!--列表-->
  <div v-content class="message-list-content">
    <transition name="slider">
      <div class="header-tab">
        <span class="tab-item"
              :key="index"
              @click="chooseTab(index)"
              :class="{'active-tab': activeTabIndex === index}"
              v-for="(item,index) in tabList"
        >{{item}}</span>
      </div>
    </transition>
    <div v-table>
      <el-table
        :data="result.list"
      >
        <el-table-column
          label="消息类型"
          prop="msgType"
        >
          <template slot-scope="scope">
            <statistics-ui :num="scope.row.msgType"></statistics-ui>
          </template>
        </el-table-column>
        <el-table-column
          label="消息内容"
          prop="content"
        >
        </el-table-column>
        <el-table-column
          prop="time"
          label="创建时间"
        >
          <template slot-scope="scope">
            {{scope.row.pushAt}}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="150px"
        >
          <template slot-scope="scope">
            <div class="control-item">
              <el-button  size="small" type="primary" style="color: #fff"
                          v-if="scope.row.status === '1'"
                          @click="handleReady(scope.row.id,scope.row.targetId,scope.row.msgType)"
              >前往处理</el-button>
              <router-link v-else :to="{ name: 'taskDetail',
                params: { id: scope.row.targetId, projectId: projectId } }">
                  <el-button size="small" plain>查看详情</el-button>
              </router-link>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination
        background
        layout="prev, pager, next"
        :page-size="result.pageSize"
        @current-change="handleCurrentChange(currentPage)"
        :current-page.sync="currentPage"
        :total="result.total">
      </el-pagination>
    </div>
  </div>
  <!--列表 end-->
</div>
</template>
<script>
export default{
  name: 'message-list',
  components: {},
  data() {
    return {
      currentPage: 1,
      tabList: ['任务', '申请', '警告'], // tab切换
      activeTabIndex: 0, // tabIndex
      result: {
        list: [],
      },
      userId: this.$cookie.get('userId'),
      projectId: this.$route.params.id,
      isShowDetail: [104, 106], // 是否显示查看详情页面
    };
  },
  methods: {
    /**
    *点击前往时候 需要更改消息状态
    *
    * */
    handleReady(id, taskId, msgType) {
      const arr = [];
      arr.push(id);
      this.$http.post(this.api.statisticsApi.editMsgStatus, arr).then((res) => {
        if (res) {
          if (this.isShowDetail.indexOf(Number(msgType)) > -1) {
            this.$router.push({ name: 'matterDetail', params: { id: taskId, projectId: this.projectId } });
          } else {
            this.$router.push({ name: 'taskDetail', params: { id: taskId, projectId: this.projectId } });
          }
        }
      });
    },
    /**
     * 切换分页
     *
     * */
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getList();
    },
    /**
     * 切换分页
     *
     * */
    getList() {
      const obj = {
        projectId: this.projectId,
        status: null,
        userId: this.userId,
        pageIndex: this.currentPage,
        pageSize: 10,
      };
      this.$http.post(this.api.statisticsApi.getUserMsgList, obj)
        .then((res) => {
          res.list.forEach((item) => {
            item.pushAt = item.pushAt === null ? '暂无' : this.$day(Number(item.pushAt)).format('YYYY/MM/DD');
            item.checkAt = item.checkAt === null ? '暂无' : this.$day(Number(item.checkAt)).format('YYYY/MM/DD');
          });
          this.result = JSON.parse(JSON.stringify(res));
        });
    },
    /**
     * 切换tab
     *
     * */
    chooseTab(index) {
      this.activeTabIndex = index;
      // 暂时只有任务有数据
      this.getList();
    },
  },
  created() {
    this.getList();
  },
};
</script>

<style lang="less" type="text/less" scoped>
  .message-list{
    .message-list-content{
      margin-top: 30px;
      position: relative;
      .header-tab{
        position: absolute;
        left: 0;
        top: -40px;
        .tab-item{
          width: 190px;
          height: 0;
          border-bottom: 40px solid #ececed;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          text-align: center;
          margin-left: -10px;
          transition: all .3s;
          z-index: 1;
          line-height: 40px;
          cursor: pointer;
          position: relative;
          &:first-child{
            margin-left: 0;
          }
          &.active-tab{
            z-index: 99;
            border-bottom-color: #ffffff;
          }
        }
      }
    }
  }
</style>
