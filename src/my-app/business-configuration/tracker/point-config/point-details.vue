/**
 * Created by c on 2019/1/2.
 */
<template>
<div class="point-details ">
  <panelContentHeader>
    <template>
      <el-button type="primary" size="medium" @click="goEdit">编辑</el-button>
    </template>
  </panelContentHeader>
  <!--基本信息-->
  <div v-content class="m-b-30">
    <div v-content-title>
      基本信息
    </div>
    <el-row>
      <el-col :span="7">
        <info-item-ui :font="14" :label-width="100" title="点位名称">
          {{result.name}}
        </info-item-ui>
      </el-col>
      <el-col :span="12" class="p-r-10">
        <info-item-ui :font="14" :label-width="100" title="归属部门">
          <template>
            <el-popover trigger="hover" placement="bottom-start" width="400">
              <span
                v-for="(item,index) in result.projectDeptDTOS"
                :key="item.id">{{item.nameStr}}
                <b v-if="result.projectDeptDTOS.length !== index+1">,</b> </span>
              <div slot="reference" class="name-wrapper">
                <div class="ellipsis w-60">
                 <span
                   v-for="(item,index) in result.projectDeptDTOS"
                   :key="item.id">{{item.nameStr}}
                <b v-if="result.projectDeptDTOS.length !== index+1">,</b> </span>
                </div>
              </div>
            </el-popover>
          </template>
        </info-item-ui>
      </el-col>
      <el-col :span="5">
        <info-item-ui :font="14" :label-width="100" title="MAC地址/ UID">
          {{result.mac}}
        </info-item-ui>
      </el-col>
    </el-row>
    <info-item-ui :font="14" :label-width="100" title="关联空间" last>
      <div v-if="!result.projectSpaceDTO" style="color:red;">
        <i class="el-icon-warning"></i>
        该空间已删除, 请重新选择
      </div>
      <span v-else>{{result.projectSpaceDTO && result.projectSpaceDTO.path}}</span>
    </info-item-ui>
  </div>
  <!--基本信息 end-->
  <!--分组信息-->
  <div v-content>
    <div v-content-title>
      分组信息
    </div>
    <el-row class="group-info">
      <el-col :span="12">
        <div class="group-info-content m-r-10">
          <div class="item-panel-title">
            分组列表
          </div>
          <info-item-ui
            title="选择部门"
            class="p-l-30 p-t-30 p-r-100 w-80"
            :font="14"
            :label-width="100">
            <el-select v-model="activeDepId" @change="chooseDepSelect">
              <el-option
                v-for="(item) in result.projectDeptDTOS"
                :key="item.id"
                :label="item.nameStr"
                :value="item.id">
              </el-option>
            </el-select>
          </info-item-ui>
          <el-scrollbar tag="div" style="height: 500px">
            <el-collapse>
              <el-collapse-item
                :key="item.id"
                :name="item.id"
                v-for="(item,index) in activeDep.assetGroupListDTOS">
                <template slot="title">
                  <div class="title flex-justify-between" @click.stop>
                    <span>{{item.name}}</span>
                    <span>
                        <router-link
                          :to="{name:'groupEdit',params:{groupId: item.id, beaconId: beaconId }}">
                        <el-button size="mini" plain>编辑</el-button>
                        </router-link>
                        <el-button size="mini" plain @click="deleteGroup(item,index)">删除</el-button>
                      </span>
                  </div>
                </template>
                <ul class="list">
                  <li class="m-l-80"
                      :class="{
                      'active':
                       activeGroupInfo.id === item.id &&
                       activeGroupInfo.name === 'devices'}"
                      @click="chooseItem('devices', item.devices, item.id)">
                    设备({{item.devices.length}})
                  </li>
                  <li class="m-l-80"
                      :class="{
                      'active':
                       activeGroupInfo.id === item.id &&
                       activeGroupInfo.name === 'facilities'}"
                      @click="chooseItem('facilities', item.facilities, item.id)">
                    设施({{item.facilities.length}})
                  </li>
                  <li class="m-l-80"
                      :class="{
                      'active':
                       activeGroupInfo.id === item.id &&
                       activeGroupInfo.name === 'events'}"
                      @click="chooseItem('events', item.events, item.id)">
                    事件({{item.events.length}})
                  </li>
                </ul>
              </el-collapse-item>
            </el-collapse>
          </el-scrollbar>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="group-info-content m-l-10">
          <div class="item-panel-title">
            {{infoTitle}}
          </div>
          <el-scrollbar tag="div" style="height: 600px">
            <el-collapse v-if="activeGroupInfo.name === 'events'">
              <el-collapse-item v-for="(item,index) in activeGroupInfo.list" :key="index">
                <template slot="title">
                  <div class="title flex-justify-between w-60">
                    <span>{{item.name}}</span>
                    <span>
                        {{item.positionName}}
                      </span>
                  </div>
                </template>
                <ul class="list">
                  <li class="m-l-40"
                      :key="childIndex"
                      v-for="(child, childIndex) in item.patrolContent">
                    <span>
                      {{childIndex+1}}
                    </span>
                    <sapn class="word-break p-l-15" >{{child}}</sapn>
                  </li>
                </ul>
              </el-collapse-item>
            </el-collapse>
            <!--设备设施-->
            <ul class="equipment-list" v-else>
              <li v-for="item in activeGroupInfo.list" :key="item.id">
                {{item.name}}
              </li>
            </ul>
            <!--设备设施 end-->
          </el-scrollbar>
        </div>
      </el-col>
    </el-row>
  </div>
  <!--分组信息 end-->
</div>
</template>
<script>
export default{
  name: 'point-details',
  components: {},
  data() {
    return {
      beaconId: this.$route.params.beaconId, // 蓝牙点位id
      projectId: this.$route.params.projectId, // 项目id
      activeDepId: null, // 选中的部门id
      activeDep: {}, // 选中的部门
      infoTitle: '', // 右侧分组显示的title
      activeGroupInfo: {
        id: '',
        name: '',
        list: [],
      },
      result: {
        projectSpaceDTO: {}, // 关联的空间
        projectDeptDTOS: {}, // 关联的部门
      },
    };
  },
  methods: {
    /**
     * 编辑蓝牙点位
     *
     * */
    goEdit() {
      this.$router.push({ name: 'pointEdit', params: { beaconId: this.beaconId, projectId: this.projectId }, query: { fromDetails: '1' } });
    },
    /**
     * 删除分组
     *
     * */
    deleteGroup(item, index) {
      this.$confirm('是否删除分组?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$http.post(this.api.virtualBeaconApi.editGroup, { id: item.id, valid: -1 })
          .then((res) => {
            if (res) {
              this.$message.success('删除成功');
              this.activeDep.assetGroupListDTOS.splice(index, 1);
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
     * 选择分组 显示的内容
     * 设备 设施 事件
     *
     * */
    chooseItem(name, list, id) {
      switch (name) {
        case 'devices':
          this.infoTitle = '设备列表';
          break;
        case 'events':
          this.infoTitle = '事件列表';
          break;
        case 'facilities':
          this.infoTitle = '设施列表';
          break;
        default:
          break;
      }
      this.activeGroupInfo.name = name;
      this.activeGroupInfo.list = list;
      this.activeGroupInfo.id = id;
    },
    /**
     * 切换部门
     *
     * */
    chooseDepSelect() {
      // 获取部门下面的分组详情
      this.activeDep = this.result.projectDeptDTOS.filter(v => v.id === this.activeDepId)[0];
      if (!this.activeDep.isApply) {
        this.activeDep.assetGroupListDTOS.forEach((item) => {
          this.$http.get(
            this.api.virtualBeaconApi.groupDetails, { params: { assetGroupId: item.id } })
            .then((res) => {
              item.devices = res.devices; // 设备列表
              item.facilities = res.facilities; // 设施列表
              item.events = res.events; // 事件列表
              // 处理事件列表中展开显示的巡视内容 用'&'分开
              item.events.forEach((event) => {
                event.patrolContent = event.patrolContent.split('&');
              });
            });
        });
        this.activeDep.isApply = true;
      }
      // 右侧列表置空
      this.infoTitle = '';
      this.activeGroupInfo.id = '';
      this.activeGroupInfo.name = '';
      this.activeGroupInfo.list = [];
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
          this.result = res;
          // 计算空间显示路径
          if (this.result.projectSpaceDTO !== null) {
            if (this.result.projectSpaceDTO.level === '1') {
              this.result.projectSpaceDTO.path = `${this.result.projectSpaceDTO.name}`;
            } else {
              const arr = this.result.projectSpaceDTO.path.split('-');
              this.result.projectSpaceDTO.path = `${arr[arr.length - 1]}-${this.result.projectSpaceDTO.name}`;
            }
          }
          // 计算部门显示路径
          this.result.projectDeptDTOS.forEach((item) => {
            const nameArr = item.parentName.split('-');
            if (item.level === '1') {
              item.nameStr = `${nameArr[0]}`;
            } else {
              item.nameStr = `${nameArr[0]}-${nameArr[nameArr.length - 1]}`;
            }
            item.assetGroupListDTOS.forEach((group) => {
              this.$set(group, 'devices', []);
              this.$set(group, 'events', []);
              this.$set(group, 'facilities', []);
            });
            this.$set(item, 'isApply', false);
          });
          this.activeDepId = this.result.projectDeptDTOS[0].id;
          this.chooseDepSelect();
        });
    },
  },
  mounted() {
    this.getBeaconDetails();
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
