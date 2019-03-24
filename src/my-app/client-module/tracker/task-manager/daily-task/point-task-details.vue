/**
 * Created by c on 2019/1/2.
 */
<template>
<div class="point-task-details ">
  <panelContentHeader>
    <template>
      <el-button type="primary" size="medium" @click="goPoint">查看点位详情</el-button>
    </template>
  </panelContentHeader>
  <!--基本信息-->
  <div v-content v-full-content>
    <div v-content-title>
      基本信息
    </div>
    <el-row>
      <el-col :span="7">
        <info-item-ui :font="14" :label-width="100" title="点位名称">
          {{pointResult.name}}
        </info-item-ui>
      </el-col>
      <el-col :span="12" class="p-r-10">
        <info-item-ui :font="14" :label-width="100" title="归属部门">
          <template>
            {{pointResult.projectDeptDTOS.map(v => v.name).join()}}
          </template>
        </info-item-ui>
      </el-col>
    </el-row>
    <info-item-ui :font="14" :label-width="100" title="关联空间">
      {{pointResult.projectSpaceDTO.path}}
    </info-item-ui>
    <!--打卡记录-->
    <div class="punch-record m-t-60">
      <info-item-ui :font="14" :label-width="100" title="选择日期">
        <el-date-picker
          v-model="time"
          type="datetimerange"
          @change="getBeaconList"
          value-format="timestamp"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </info-item-ui>
    </div>
    <!--打卡记录 end-->
    <el-scrollbar v-table style="height: 400px">
      <el-table
        :data="result.list"
        style="width: 100%">
        <el-table-column
          label="打卡时间"
          width="300px"
          class-name="main"
        >
          <template slot-scope="scope">
            {{$day(Number(scope.row.createAt)).format('YYYY/MM/DD HH:mm')}}
          </template>
        </el-table-column>
        <el-table-column
          label="执行人"
          class-name="main"
          prop="name"
        >
        </el-table-column>
        <el-table-column
          label="部门"
        >
          <template slot-scope="scope">
            {{scope.row.depts.join()}}
          </template>
        </el-table-column>
        <el-table-column
          label="是否有故障"
        >
          <template slot-scope="scope">
            {{scope.row.status === '1'?'否': '是'}}
          </template>
        </el-table-column>
        <el-table-column
          label="相关发起工单"
        >
          <template slot-scope="scope">
            <div class="control-item">
                <el-button  size="small" plain
                            @click="openTaskList(scope.row.orderNoList)">查看</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-scrollbar>
    <div class="pagination">
      <el-pagination
        background
        layout="prev, pager, next"
        :page-size="result.pageSize"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :total="result.total">
      </el-pagination>
    </div>
  </div>
  <!--基本信息 end-->
  <!--查看相关工单-->
  <el-dialog
    :visible="taskListVisible"
    width="30%"
    title="相关发起工单"
  >
    <el-table
      :data="taskListDialog"
      style="width: 100%">
      <el-table-column
        label="工单名称"
        width="300px"
        prop="name"
        class-name="main"
      >
      </el-table-column>
      <el-table-column
        label="操作"
        width="100px"
      >
        <template slot-scope="scope">
          <div class="control-item">
            <router-link
              :to="{ name:'taskDetail',
                  params: {id: scope.row.taskId, projectId: projectId} }">
              <el-button  size="small" plain>查看</el-button>
            </router-link>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <span slot="footer" class="dialog-footer">
        <el-button @click="taskListVisible = false">取 消</el-button>
      </span>
  </el-dialog>
  <!--查看相关工单 end-->
</div>
</template>
<script>
export default{
  name: 'point-details',
  components: {},
  data() {
    return {
      beaconId: this.$route.params.beaconId, // 蓝牙点位id
      projectId: this.$route.params.projectId, // 部门id
      time: [this.$day(Number(this.$route.params.time)).startOf('day'),
        this.$day(Number(this.$route.params.time)).endOf('day')], // 起止时间
      result: {}, // 记录详情
      currentPage: 1,
      taskListVisible: false, // 工单弹窗
      pointResult: {
        projectSpaceDTO: {},
        projectDeptDTOS: [],
      }, // 点位详情
      taskListDialog: [], // 弹窗里面的任务列表
    };
  },
  methods: {
    /**
     * 打开任务详情弹窗
     *
     * */
    openTaskList(item) {
      this.taskListDialog = item;
      this.taskListVisible = true;
    },
    /**
     * 查询点位详情
     *
     * */
    getBeaconDetails() {
      this.$http.get(
        this.api.virtualBeaconApi.details,
        { params: { virtualBeaconId: this.beaconId } })
        .then((res) => {
          this.pointResult = res;
          // 计算空间显示路径
          if (this.pointResult.projectSpaceDTO.level === '1') {
            this.pointResult.projectSpaceDTO.path = `${this.pointResult.projectSpaceDTO.name}`;
          } else {
            const arr = this.pointResult.projectSpaceDTO.path.split('-');
            this.pointResult.projectSpaceDTO.path = `${arr[arr.length - 1]}-${this.pointResult.projectSpaceDTO.name}`;
          }
        });
    },
    /**
     * 切换分页
     *
     * */
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getBeaconList();
    },
    /**
     * 编辑蓝牙点位
     *
     * */
    goPoint() {
      this.$router.push({ name: 'pointDetails', params: { beaconId: this.beaconId, projectId: this.projectId } });
    },
    /**
     * 查询蓝牙点位详情
     *
     * */
    getBeaconList() {
      this.$http.post(this.api.taskApi.pointTaskList, {
        beaconId: this.beaconId, // 蓝牙id
        projectId: this.projectId, // 项目id
        begTime: this.time[0], // 开始时间
        endTime: this.time[1], // 结束时间
        pageSize: 10,
        currentPage: this.currentPage, // 当前页
      })
        .then((res) => {
          if (res) {
            this.result = res;
            this.result.list.forEach((item) => {
              item.depts = item.depts ? item.depts.split(',') : [];
            });
          }
        });
    },
  },
  mounted() {
    this.getBeaconList(); // 查询点位打卡记录
    this.getBeaconDetails(); // 查询蓝牙点位详情
  },
};
</script>

<style lang="less" type="text/less" scoped>
  .point-details{
    .item-panel-title{
      height: 36px;
      display: flex;
      align-items: center;
      padding: 0 30px;
      background: #f5f5f5;
    }
    .group-info{
      .group-info-content{
        height: 635px;
        position: relative;
        .border();
        .bottom{
          display: flex;
          height: 80px;
          justify-content: flex-end;
          align-items: center;
          position: absolute;
          bottom: 0;
          width: 100%;
          padding-right: 30px;
          border-top: 1px solid @bottom-color;
          button{
            font-size: 14px;
            height: 38px;
          }
        }
      }
      .equipment-list{
        li{
          padding-left: 30px;
          font-size: 16px;
          display: flex;
          height: 60px;
          align-items: center;
          border-bottom: 1px solid @bottom-color;
        }
      }
    }
  }
</style>
