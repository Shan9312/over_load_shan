/**
* Created by c on 2018/12/18.
*/
<template>
	<div class="tracker-config">
    <el-row class="m-t-20">
      <div v-content-title>
        项目使用Tracker软件
        <el-checkbox
          v-model="activeItem.isCheck"
          @change="checkPermission(activeItem)"
          class="m-l-50"></el-checkbox>
      </div>
    </el-row>
    <!--项目功能选择-->
    <el-row class="project-func-choose m-t-20">
      <div v-content-title>
        项目功能选择
      </div>
      <el-col :span="24">
        <div class="item"
             :key="index"
             v-if="item.id !== '42'"
             v-for="(item,index) in result">
          <el-checkbox
            v-model="item.isCheck"
            @change="checkPermission(item)"
            :disabled="!activeItem.isCheck"> </el-checkbox>
          <span class="label">{{item.nameCn}}</span>
        </div>
      </el-col>
    </el-row>
    <!--项目功能选择-->
    <!--任务类功能-->
    <el-row class="task-choose m-t-40">
      <div v-content-title>
        任务类功能
        <el-button
          plain
          size="mini"
          class="m-l-20"
          @click="addTrackerConfig"
        >添加</el-button>
      </div>
      <div class="task-choose-content">
        <div class="item"
             :key="index"
             @click="goTrackerDetails(item, 'task')"
             v-for="(item,index) in funcList">
          <div class="img-item">
            <img :src="item.iconDict.value3" alt=""/>
          </div>
          <span class="name">
            {{item.name}}
          </span>
        </div>
      </div>
    </el-row>
    <!--任务类功能 end-->
    <!--公共功能配置-->
    <el-row class="task-choose m-t-40">
      <div v-content-title>
        公共功能配置
      </div>
      <div class="task-choose-content">
        <div class="item"
             :key="item.id"
             @click="goTrackerDetails(item, 'common')"
             v-if="item.isBindBasicType === '0' && item.id !== '42' && item.isCheck"
             v-for="item in result">
          <div class="img-item">
            <img :src="`../../../../../static/img/icon-${item.name}.png`" alt=""/>
          </div>
          <span class="name">
            {{item.nameCn}}
          </span>
        </div>
      </div>
    </el-row>
    <!--公共功能配置 end-->

    <!--其他功能配置 -->
    <el-row class="task-choose m-t-40">
      <div v-content-title>
        其他功能配置
      </div>
      <div class="task-choose-content">
        <div class="item"
             :key="item.id"
             v-if="item.isBindBasicType === '0' && item.id === '42' && result[0].isCheck"
             @click="goTrackerDetails(item, 'common')"
             v-for="item in result">
          <div class="img-item">
            <img :src="`../../../../../static/img/icon-${item.name}.png`" alt=""/>
          </div>
          <span class="name">
            {{item.nameCn}}
          </span>
        </div>
      </div>
    </el-row>
    <!--其他功能配置 end-->
	</div>
</template>
<script>
export default {
  name: 'tracker-config',
  props: {
    activeItem: Object,
  },
  components: {},
  data() {
    return {
      result: [],
      projectId: this.$route.params.id,
      funcList: [],
      projectPermission: [],
    };
  },
  methods: {
    /**
     * 获取显示的权限
     *
     * */
    getPermission() {
      this.$http.post(this.api.operationApi.getAtoms, { lvs: [2], pid: this.activeItem.id })
        .then((res) => {
          this.result = res;
          this.result.forEach((item) => {
            item.isCheck = item.isCheck !== '0';
          });
          this.getPermissionByProjectId();
        });
    },
    /**
     * 根据项目id 查询
     * 功能权限
     * */
    getPermissionByProjectId() {
      this.$http.post(this.api.operationApi.getPermissionByProjectId, { projectId: this.projectId })
        .then((res) => {
          this.funcList = res.list;
          this.getPermissionProject();
        });
    },
    /**
     * 权限绑定和取消
     *
     * */
    checkPermission(item) {
      this.$http.post(`${this.api.operationApi.inlete}?type=${item.isCheck ? 1 : 0}&projectId=${this.projectId}&permissionId=${item.id}`)
        .then((res) => {
          console.log(res);
        });
    },
    /**
     * 获取项目权限
     *
     * */
    getPermissionProject() {
      this.$http.get(
        this.api.operationApi.getProjectPermission, { params: { projectId: this.projectId } })
        .then((res) => {
          this.projectPermission = res;
          const arr = this.projectPermission.map(v => v.id);
          this.activeItem.isCheck = arr.indexOf(this.activeItem.id) !== -1;
          this.result.forEach((v) => {
            v.isCheck = arr.indexOf(v.id) !== -1;
          });
        });
    },
    /**
     * 跳转到tracker权限新增
     *
     * */
    addTrackerConfig() {
      const ids = this.result.filter(v => v.isCheck);
      if (ids.length === 0) {
        this.$message.error('请选择项目功能');
        return false;
      }
      this.$router.push({ name: 'trackerConfigAdd', params: { permissionId: this.activeItem.id, projectId: this.projectId }, query: { taskType: 'task', icon: null, name: null } });
      return true;
    },
    /**
     * 跳转到任务详情
     *
     * */
    goTrackerDetails(item, type) {
      let queryItem;
      if (type === 'task') {
        // 如果是任务类功能
        queryItem = this.activeItem;
      } else {
        queryItem = item;
      }
      this.$router.push({ name: 'trackerConfigDetails', params: { id: item.id, queryId: queryItem.id, projectId: this.projectId }, query: { taskType: type, icon: queryItem.name, name: queryItem.nameCn } });
    },
  },
  mounted() {
    this.getPermission();
  },
};
</script>

<style lang="less" type="text/less" scoped>
  .tracker-config{
    .project-func-choose{
      .item{
        display: inline-flex;
        align-items: center;
        width: 210px;
        .label{
          margin-left: 30px;
        }
      }
    }
    .task-choose{
      .task-choose-content{
        .item{
          display: inline-flex;
          align-items: center;
          margin-right: 80px;
          margin-bottom: 40px;
          width: 130px;
          justify-content: center;
          flex-direction: column;
          cursor: pointer;
          .img-item{
            height: 110px;
            width: 110px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 1px 12px 0 rgba(38,123,209,0.2);
          }
          .name{
            margin-top: 30px;
          }
        }
      }
    }
  }
</style>
