/**
 * Created by c on 2019/1/22.
 */
<template>
  <div class="p-b-80 daily-task-tpl-edit">
    <panelContentHeader :title="isStatic?'固定岗任务':'巡视岗任务'">
    </panelContentHeader>
    <!--content-->
    <div class=" edit-content">
      <el-form label-width="100px" :model="taskForm"  ref="taskForm" :rules="taskFormRules">
        <div v-content-title>
          基本信息
        </div>
        <el-row>
          <el-col :span="8">
            <el-form-item label="任务名称" prop="name">
              <el-input v-model="taskForm.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="选择职能" prop="positionIds">
              <el-select
                multiple
                v-model="taskForm.positionIds" @change="getPeopleList" placeholder="选择职能">
                <el-option v-for="item in positionList"
                           :key="item.id"
                           :label='item.name'
                           :value='item.id'></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="isStatic">
            <el-form-item label="标准在岗时间" class="w-60" prop="dutyMinute">
              <el-time-picker
                v-model="taskForm.dutyMinute"
                :picker-options="{selectableRange: '00:00:00 - 23:59:59'}"
                format="H小时m分钟"
                value-format="HH:mm"
                placeholder="在岗时间">
              </el-time-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24" class="upload-item-icon">
            <i class="el-icon-plus" @click="openDialogPeople"></i>
            <el-form-item label="执行人员" prop="userIds">
              <el-select
                multiple
                v-model="taskForm.userIds" v-show="false" >
                <el-option v-for="item in positionList"
                           :key="item.id"
                           :label='item.name'
                           :value='item.id'></el-option>
              </el-select>
              <div class="dep-item">
              <span
                :key="index"
                v-for="(item,index) in choosePeopleList">
                <i class=" el-icon-close" @click="deletePeople(index)"></i>
                {{item.name}}
              </span>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="任务描述" prop="content">
              <el-input v-model="taskForm.content" type="textarea" :rows="4"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="位置选择" v-if="!isStatic">
              <el-checkbox-group  v-model="taskForm.locationSelection">
                <el-checkbox label="1">按顺序打点</el-checkbox>
                <el-checkbox label="2">记录GPS点位</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          <!--选择点位-->
          <el-col :span="24" class="point-group">
            <div v-content-title>选择点位</div>
            <el-col :span="11" class="m-r-10 border">
              <div class="item-panel-title is-require">
                选择点位
              </div>
              <div class="item-panel-content">
                <el-row class="p-l-30 p-r-30 p-t-20">
                  <el-col :span="10">
                    <el-select
                      placeholder="请选择部门"
                      @change="getBeaconListByDep" v-model="taskForm.depId">
                      <el-option
                        v-for="item in depList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </el-col>
                  <el-col :span="10" :offset="4">
                    <el-input
                      prefix-icon="el-icon-search"
                      v-model="beaconSearchValue"
                      @input="getBeaconListByDep"
                      placeholder="请输入搜索"></el-input>
                  </el-col>
                </el-row>
                <el-scrollbar tag="ul" class="point-list">
                  <li>
                    <span class="w-10"></span>
                    <span class="w-90">点位名称</span>
                  </li>
                  <li v-for="item in beaconList" :key="item.id">
                    <div v-if="isStatic">
                    <span class="w-10" >
                      <el-radio
                        v-model="taskForm.virtualBeaconId"
                        :label="item.id">
                        <span class="p-l-20"> {{item.name}} </span>
                      </el-radio>
                    </span>
                    </div>
                    <div v-else class="w-100">
                      <span class="w-10">
                        <el-checkbox
                          v-model="item.checked"
                          @change="beaconItem(item)"></el-checkbox>
                      </span>
                      <span class="w-80">
                        {{item.name}}
                      </span>
                    </div>

                  </li>
                </el-scrollbar>
              </div>
            </el-col>
            <el-col :span="11" class="m-l-10 border" v-if="!isStatic">
              <div class="item-panel-title">
                已选点位
                <i class="iconfont icon-iconfonttime"></i>
              </div>
              <el-scrollbar tag="ul" class="point-list" style="height: 444px">
                <li>
                  <span class="w-25"></span>
                  <span class="w-50">点位名称</span>
                  <span class="w-25">操作</span>
                </li>
                <li v-for="(item, index) in chooseBeaconList" :key="index">
                  <span class="w-25">
                    <b class="index p-r-25">{{index + 1}}</b>
                    <i class="el-icon-minus" @click="deleteBeacon(item)"></i></span>
                  <span class="w-45 font-bold ellipsis">{{item.name}}</span>
                  <span class="w-30 flex-center">
                    <el-button size="mini"
                               icon="el-icon-sort-up"
                               plain
                               v-if="chooseBeaconList.length !==1 && index !== 0"
                               @click="moveBeacon(index, index-1)">上移</el-button>
                    <el-button
                      size="mini"
                      icon="el-icon-sort-down"
                      plain
                      v-if="chooseBeaconList.length !== 1 && index !== chooseBeaconList.length-1"
                      @click="moveBeacon(index, index+1)">下移</el-button>
                  </span>
                </li>
              </el-scrollbar>
            </el-col>
          </el-col>
          <!--选择点位 end-->
        </el-row>
        <el-row v-if="!isStatic">
          <!--任务周期-->
          <el-col :span="8">
            <el-form-item label="任务周期" prop="period">
              <el-radio-group v-model="taskForm.period">
                <el-radio label="1">按日</el-radio>
                <el-radio label="2">按周</el-radio>
                <el-radio label="3">按月</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="任务次数" class="w-50" prop="patrolCount">
              <el-input v-model="taskForm.patrolCount" ></el-input>
              <span class="input-tips">次</span>
            </el-form-item>
          </el-col>
          <!--任务周期 end-->
        </el-row>
      </el-form>
    </div>
    <!--底部操作栏-->
    <div class="fixed-control">
      <el-button plain @click="$cancel()">取消</el-button>
      <el-button  type="primary" @click="submit">确定</el-button>
    </div>
    <!--底部操作栏 end-->
    <!--content end -->
    <!--选择人员弹窗-->
    <el-dialog
      :visible="peopleDialogVisible"
      title="选择分配人员"
      width="35%">
      <div class="p-l-30 p-r-30">
        <div class="dep-item">
      <span
        :key="item.id"
        v-if="item.checked"
        @click="item.checked = false"
        v-for="(item) in peopleList">
        <i class=" el-icon-close"></i>
          {{item.name}}
      </span>
        </div>
        <!--执行人员列表-->
        <el-scrollbar tag="ul" style="height: 300px" class="border m-t-20 dialog-list">
          <li>
            <span class="w-15"></span>
            <span class="w-20">姓名</span>
            <span class="w-20">部门</span>
            <span class="w-20">职能</span>
            <span class="w-25">联系方式</span>
          </li>
          <li v-for="item in peopleList " :key="item.id">
          <span class="w-15">
            <el-checkbox v-model="item.checked"></el-checkbox>
          </span>
            <span class="w-20 name">{{item.name}}</span>
            <span class="w-20">{{item.account.projectDeptName}}</span>
            <span class="w-20">{{item.account.positionName}}</span>
            <span class="w-25">{{item.phone}}</span>
          </li>
        </el-scrollbar>
        <!--执行人员列表 end-->
      </div>
      <span slot="footer" class="dialog-footer">
      <el-button @click="peopleDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="confirmGroupDialog">确 定</el-button>
    </span>
    </el-dialog>
    <!--选择人员弹窗 end-->
  </div>
</template>
<script>
import { positiveInteger } from '../../../../../../libs/plugins/validate';

export default{
  name: 'daily-task-tpl-edit',
  components: {},
  data() {
    return {
      peopleDialogVisible: false,
      bizTaskTypeId: this.$route.params.bizTaskTypeId, // 任务类型id
      type: this.$route.params.type, // 固定岗 static 路径岗 route
      projectId: this.$route.params.projectId, // 项目id
      taskId: this.$route.params.taskId, // 项目id
      positionList: '', // 职能列表
      peopleList: [], // 人员列表 根据所选职能查询人员
      choosePeopleList: [], // 选中的人员列表
      depList: [], // 部门列表
      beaconList: [], // 蓝牙列表
      chooseBeaconList: [], // 选择的蓝牙列表 巡视岗 排序 用
      beaconSearchValue: '', // 搜索蓝牙时用到的
      result: {}, //  详情
      taskForm: {
        name: '',
        positionIds: [],
        depId: '', // 部门id
        content: '', // 任务描述
        userIds: [], // 执行人员列表
        dutyMinute: '', // 标准在岗时间
        locationSelection: [], // 位置选择
        patrolCount: '', // 任务次数
        period: '', // 周期
        virtualBeaconId: '', // 点位id
        virtualBeaconIds: '', // 点位id 合集
      },
      taskFormRules: {
        name: [
          { required: true, message: '请输入任务名称', trigger: 'change' },
          { min: 1, max: 20, message: '任务名称长度1-20个字符' },
        ],
        positionIds: [
          { required: true, message: '请选择职能', trigger: 'change' },
        ],
        dutyMinute: [
          { required: true, message: '请选择在岗时间', trigger: 'change' },
        ],
        userIds: [
          { required: true, message: '请选择执人员', trigger: 'change' },
        ],
        period: [
          { required: true, message: '请选择任务周期', trigger: 'change' },
        ],
        patrolCount: [
          { required: true, validator: positiveInteger, trigger: 'change', message: '请输入任务次数' },
        ],
        content: [
          { required: true, message: '请输入任务描述', trigger: 'change' },
          { min: 1, max: 128, message: '任务描述长度1-128个字符' },
        ],
      },
    };
  },
  methods: {
    /**
     * 数组上下移动
     *
     * */
    moveBeacon(index, $index) {
      const swapItems = (arr, index1, index2) => {
        arr[index1] = arr.splice(index2, 1, arr[index1])[0];
        return arr;
      };
      swapItems(this.chooseBeaconList, index, $index);
    },
    /**
     * 删除已经选中的点位
     *
     * */
    deleteBeacon(item) {
      this.chooseBeaconList = this.chooseBeaconList.filter(v => v.id !== item.id);
      this.beaconList.forEach((beacon) => {
        if (beacon.id === item.id) {
          beacon.checked = false;
        }
      });
    },
    /**
     * 选择蓝牙点位
     *
     * */
    beaconItem(item) {
      if (item.checked) {
        this.chooseBeaconList.push(item);
      } else {
        this.chooseBeaconList = this.chooseBeaconList.filter(v => v.id !== item.id);
      }
    },
    /**
     *
     * 删除已经选择的人员
     *
     * */
    deletePeople(index) {
      this.choosePeopleList.splice(index, 1);
      this.taskForm.userIds.splice(index, 1);
    },
    /**
     * 确认选择的人员
     *
     * */
    confirmGroupDialog() {
      this.choosePeopleList = this.peopleList.filter(v => v.checked);
      this.taskForm.userIds = this.choosePeopleList.map(v => v.id);
      this.peopleDialogVisible = false;
    },
    /**
     * 打开选择人员
     *
     * */
    openDialogPeople() {
      this.peopleDialogVisible = true;
      const chooseIds = this.choosePeopleList.map(v => v.id);
      this.peopleList.forEach((item) => {
        if (chooseIds.indexOf(item.id) !== -1) {
          this.$set(item, 'checked', true);
        } else {
          this.$set(item, 'checked', false);
        }
      });
    },
    /**
     * 查询相关职能
     *
     * */
    getPositionShare() {
      // 相关职能
      this.$http.get(this.api.taskApi.positionShareable,
        { params: { projectId: this.projectId, bizTaskTypeId: this.bizTaskTypeId } })
        .then((res) => {
          this.positionList = res;
        });
    },
    /**
     * 查询人员列表
     *
     * */
    getPeopleList() {
      this.choosePeopleList = []; // 清空选中的人员
      this.$http.post(this.api.taskApi.manageList, {
        category: 2,
        bizTaskTypeId: this.bizTaskTypeId,
        projectId: this.projectId, // 项目的id
        userId: this.$store.state.user.info.id, // 用户id
        positionIds: this.taskForm.positionIds, //  创建工单时所选的职能id
      }).then((res) => {
        this.peopleList = res.list;
        const ids = this.result.userList.map(v => v.userId); // 取出已经选中的人员 id

        // 获取已经分配的人员id 把选中的人员打钩
        this.peopleList.forEach((item) => {
          if (ids.includes(item.id)) {
            this.$set(item, 'checked', true);
          } else {
            this.$set(item, 'checked', false);
          }
        });
        // 把打钩的人员取出
        this.confirmGroupDialog();
      });
    },
    /**
     * 查询蓝牙是需要的部门列表
     *
     * */
    getDepList() {
      this.$http.post(this.api.taskApi.getDepList, {
        needPosition: false, // 是否需要职位
        needSon: false, // 是否需要子部门
        projectId: this.projectId, // 项目id
      })
        .then((res) => {
          if (res) {
            this.depList = res;
            this.taskForm.depId = res[0].id;
            this.getBeaconListByDep();
          }
        });
    },
    /**
     * 根据部门id 查询蓝牙列表
     *
     * */
    getBeaconListByDep() {
      this.$http.post(this.api.businessSpaceApi.businessSpaceList, {
        projectId: this.projectId, // 项目id
        projectDeptIds: [this.taskForm.depId], // 部门id
        nameLike: this.beaconSearchValue, // 蓝牙名称
      })
        .then((res) => {
          if (res) {
            this.beaconList = res.list;
            const chooseBeaconIds = this.chooseBeaconList.map(v => v.id); // 获取已经选中的蓝牙id
            this.beaconList.forEach((item) => {
              if (chooseBeaconIds.indexOf(item.id) === -1) {
                this.$set(item, 'checked', false);
              } else {
                this.$set(item, 'checked', true);
              }
            });
          }
        });
    },
    /**
     *
     * 确认新增日常任务
     *
     * */
    submit() {
      if (this.isStatic) {
        // 这里是新建固定岗任务
        this.$refs.taskForm.validate((valid) => {
          console.log(this.taskForm.dutyMinute);
          if (valid) {
            if (this.taskForm.virtualBeaconId !== '') {
              this.$http.post(this.api.taskApi.staticAdd, {
                bizTaskTypeId: this.bizTaskTypeId, // 业务基本型id
                comeFrom: 4, // 工单来源
                projectId: this.projectId, // 项目id
                id: this.taskId, // 任务id
                dutyMinute: (this.taskForm.dutyMinute.split(':')[0] * 60) + Number(this.taskForm.dutyMinute.split(':')[1]), // 需要在岗时间
                name: this.taskForm.name, // 名称
                content: this.taskForm.content, // 备注
                positionIds: this.taskForm.positionIds, // 职能id
                userIds: this.taskForm.userIds, // 人员id
                virtualBeaconId: this.taskForm.virtualBeaconId, // 蓝牙id
              })
                .then((res) => {
                  if (res) {
                    this.$message.success('修改固定岗任务成功');
                    this.$deleteTag();
                    this.$router.push({ name: 'dailyTaskTplList' });
                  }
                });
            } else {
              this.$message.error('请选择点位');
            }
          } else {
            this.$message.error('请输入完整信息');
          }
        });
      } else {
        // 这里是新建路径岗任务
        this.$refs.taskForm.validate((valid) => {
          if (valid) {
            if (this.chooseBeaconList.length > 0) {
              this.$http.post(this.api.taskApi.routeAdd, {
                bizTaskTypeId: this.bizTaskTypeId, // 业务基本型id
                comeFrom: 4, // 工单来源
                projectId: this.projectId, // 项目id
                isGps: this.taskForm.locationSelection.includes('2') ? 1 : 0, // 是否需要记录gps
                isSort: this.taskForm.locationSelection.includes('1') ? 1 : 0, // 是否需要按照顺序打卡
                patrolCount: this.taskForm.patrolCount, // 巡视次数
                virtualBeaconIds: this.chooseBeaconList.map(v => v.id), // 巡视蓝牙列表
                period: this.taskForm.period, // 周期
                name: this.taskForm.name, // 名称
                id: this.taskId, // 任务id
                content: this.taskForm.content, // 备注
                positionIds: this.taskForm.positionIds, // 职能id
                userIds: this.taskForm.userIds, // 人员id
              })
                .then((res) => {
                  if (res) {
                    this.$message.success('修改巡视岗任务成功');
                    this.$deleteTag();
                    this.$router.push({ name: 'dailyTaskTplList' });
                  }
                });
            } else {
              this.$message.error('请选择点位');
            }
          } else {
            this.$message.error('请输入完整信息');
          }
        });
      }
    },
    /**
     *
     * 查询日常任务详情
     *
     * */
    getDetail() {
      const url = this.isStatic ?
        this.api.taskApi.staticInfo :
        this.api.taskApi.routeInfo; // 根据日常任务类型 请求不同的接口
      this.$http.get(url, { params: { taskId: this.taskId, projectId: this.projectId } })
        .then((res) => {
          if (res) {
            this.result = res;
            this.taskForm.name = res.name; // 名称
            // 职能
            this.taskForm.positionIds = res.positionList.map(v => v.positionId);
            // 根据职能查询人员列表 计算出已经选取的人员
            this.getPeopleList();
            this.taskForm.content = res.content; // 备注
            // 计算标准在岗时间
            const dutyTime = Number(res.dutyMinute);
            this.taskForm.dutyMinute = `${parseInt(dutyTime / 60, 10)}:${dutyTime - (parseInt(dutyTime / 60, 10) * 60)}`;
            // 周期
            this.taskForm.period = res.period;
            // 任务次数
            this.taskForm.patrolCount = res.patrolCount;
            // 计算蓝牙点位
            // 固定岗
            if (this.isStatic) {
              this.taskForm.virtualBeaconId = res.beaconList[0].virtualBeaconId;
            } else {
              this.chooseBeaconList = res.beaconList;
              this.chooseBeaconList.forEach((item) => {
                this.$set(item, 'id', item.virtualBeaconId);
                this.$set(item, 'name', item.virtualBeaconName);
              });
            }
            // 计算位置选择
            if (res.isGps === '1') {
              this.taskForm.locationSelection.push('2');
            }
            if (res.isSort === '1') {
              this.taskForm.locationSelection.push('1');
            }
            this.getDepList();
          }
        });
    },
  },
  computed: {
    /**
     * 是否是固定岗
     *
     * */
    isStatic() {
      return this.type === 'static';
    },
  },
  mounted() {
    this.getPositionShare(); // 查询可分享的职能
    this.getDetail();
  },
};
</script>

<style lang="less" type="text/less" scoped>
  .daily-task-tpl-edit{
    .is-require{
      position: relative;
      &:after{
        content: '*';
        color: #f56c6c;
        position: absolute;
        left: 10px;
        top: 6px;
      }
    }
    .dep-item{
      align-items: center;
      padding: 5px 10px;
      min-width: 200px;
      border-radius: 3px;
      span{
        background: #fafafa;
        margin-right: 10px;
        font-size: 16px;
        height: 30px;
        line-height: 30px;
        border-radius: 3px;
        padding: 0 10px;
        color: @main-color;
        i{
          cursor: pointer;
          font-weight: bold;
          font-size: 14px;
          color: @auxiliary-color;
        }
      }
    }
    .item-panel-title{
      height: 36px;
      display: flex;
      align-items: center;
      padding: 0 30px;
      background: #f5f5f5;
    }
    .point-group{
      .point-list{
        height: 384px;
        li{
          padding: 20px 30px;
          border-bottom: 1px solid @bottom-color;
          display: flex;
          align-items: center;
          span{
            font-size: 16px;
          }
          &:first-child{
            border: none;
            padding: 20px 30px 0 30px;
            color: @auxiliary-color;
          }
        }
      }
    }
    // 弹窗里面的执行人员列表
    .dialog-list{
      li{
        display: flex;
        padding: 20px 30px;
        border-bottom: 1px solid @bottom-color;
        .name{
          color: @main-color;
        }
      }
    }
  }
</style>
