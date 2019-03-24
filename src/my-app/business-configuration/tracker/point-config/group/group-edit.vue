/**
 * Created by c on 2019/1/8.
 */
<template>
<div class="group-edit">
  <panelContentHeader></panelContentHeader>
  <div v-content>
    <el-row  class="group-info p-t-10">
      <el-col :span="11" class="m-r-15">
        <div class="item-panel-title">分组列表</div>
        <info-item-ui title="分组名称"
                      class="p-l-30 p-t-30  w-80"
                      is-require
                      :font="14" :label-width="80">
          <el-input v-model="result.name" ></el-input>
        </info-item-ui>
        <info-item-ui title="分组内容" class="p-l-30" :font="14" :label-width="80" last>
          <el-button size="middle"
                     @click="chooseItem(item.id)"
                     :class="{'el-button--primary':activeIndex === item.id}"
                     v-for="item in btnArr" :key="item.id">{{item.name}}</el-button>
        </info-item-ui>
        <el-scrollbar tag="div" style="height: 510px">
          <ul class="item-panel-content">
            <!-- 设备列表-->
            <li class="item"
                :key="item.id"
                v-if="activeIndex === 1"
                v-for="item in result.devices ">
              <i class="el-icon-minus" @click="deleteDevicesItem(item)"></i>
              <span>{{item.name}}</span>
            </li>
            <!-- 设备列表-->
            <!--设施列表-->
            <li class="item"
                :key="item.id"
                v-if="activeIndex === 2"
                v-for="item in result.facilities ">
              <i class="el-icon-minus" @click="deleteDevicesItem(item)"></i>
              <span>{{item.name}}</span>
            </li>
            <!--设施列表-->
            <!--事件列表-->
            <el-collapse
              v-if="activeIndex === 3">
              <el-collapse-item v-for="(item,index) in result.events" :key="index">
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
            <!--事件列表-->
          </ul>
        </el-scrollbar>
      </el-col>
      <el-col :span="11">
        <div class="item-panel-title">{{infoTitle}}</div>
        <info-item-ui title="关联空间"
                      class="p-l-30 p-t-30  w-80"
                      :font="14"
                      :label-width="80">
          <div class="flex">
            <div class="border w-100 flex-center p-l-20 space-item">{{activeSpace.name}}</div>
            <el-button size="small" plain class="m-l-15"
                       @click="spaceVisible = true"
                       v-show="activeIndex !== 3"
            >选择</el-button>
          </div>
        </info-item-ui>
        <el-scrollbar tag="div" style="height: 475px">
          <ul class="item-panel-content" v-if="activeIndex !== 3">
            <li class="item"
                v-for="item in infoList"
                :key="item.id">
              <el-checkbox v-model="item.checked" @change="changeItem(item)"></el-checkbox>
              <span class="p-l-30">{{item.name}}</span>
            </li>
          </ul>
          <!--事件列表-->
          <el-collapse
            v-else>
            <el-collapse-item v-for="(item,index) in infoList" :key="index">
              <template slot="title">
                <div class="title flex-justify-between w-100" @click.stop>
                  <el-checkbox v-model="item.checked" @change="changeItem(item)"></el-checkbox>
                  <span>{{item.name}}</span>
                  <span>
                  {{item.positionName}}
                  </span>
                  <div>
                    <el-button plain size="mini" @click="editEvent(item)">编辑</el-button>
                    <el-button plain size="mini" @click="deleteEvent(item)">删除</el-button>
                  </div>
                </div>
              </template>
              <ul class="list">
                <li class="m-l-40"
                    :key="childIndex"
                    v-for="(child, childIndex) in item.patrolContent">
                  <span>
                      {{childIndex+1}}
                    </span>
                  <span class="word-break p-l-15" >{{child}}</span>
                </li>
              </ul>
            </el-collapse-item>
          </el-collapse>
        </el-scrollbar>
        <!--事件列表-->
        <!--新增事件按钮-->
        <div class="bottom" v-if="activeIndex === 3">
          <el-button size="middle" type="primary" @click="editEvent(false)">新增事件</el-button>
        </div>
        <!--新增事件按钮 end-->
      </el-col>
    </el-row>
  </div>
  <!--底部操作栏-->
  <div class="fixed-control">
    <el-button plain @click="$cancel()">取消</el-button>
    <el-button  type="primary" @click="submit">确定</el-button>
  </div>
  <!--底部操作栏 end-->
  <!--选择空间-->
  <!--选择空间弹窗-->
  <space-move :data="spaceList"
              :projectName="spaceTitle"
              :spaceVisible="spaceVisible"
              @getNodeTree="getNodeTree"
              @handleClose="handleClose"
  >
  </space-move>
  <!--选择空间弹窗 end-->
  <!--选择空间 end-->
  <!--新增事件弹窗-->
  <el-dialog :visible="eventDialogVisible" width="25%" title="新增事件">
    <el-form :model="eventForm"
             label-width="100px"
             ref="eventForm"
             :rules="rules"
             class="p-l-30 p-r-30"
    >
      <el-form-item label="事件名称" prop="name">
        <el-input v-model="eventForm.name"></el-input>
      </el-form-item>
      <el-form-item label="负责人职能" class="inline-form-choice" prop="positionName">
        <el-input v-model="eventForm.positionName" v-show="false"></el-input>
        <div class="border w-100 flex-center p-l-15">{{eventForm.positionName}}</div>
        <el-button plain size="small" @click="showDepList = !showDepList">选择</el-button>
      </el-form-item>
      <div class="dialog-choose-dep"
           v-if="showDepList"
      >
        <el-scrollbar tag="div" style="height: 350px">
          <infinite-collapse
            :data="deptTree"
            :selectedPosition="selectedPosition"
            @getPositionItem="getPosition"></infinite-collapse>
        </el-scrollbar>
      </div>
      <el-form-item label="巡视内容"
                    prop="content"
                    class="inline-form-choice">
        <el-input v-model="eventForm.content" type="textarea" :rows="6"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeEventDialog">取 消</el-button>
      <el-button type="primary" @click="confirmEventDialog">确 定</el-button>
    </span>
  </el-dialog>
  <!--新增事件弹窗 end-->
</div>
</template>
<script>
import spaceMove from '../../../../../components/common/dialog-space-move/space-move'; // 选择空间组件
import infiniteCollapse from '../../../../../components/common/func-dialog/infinite-collapse/infinite-collapse'; // 无限下拉部门职能

export default{
  name: 'group-edit',
  components: { spaceMove, infiniteCollapse },
  data() {
    return {
      activeIndex: 1,
      eventDialogVisible: false,
      showDepList: false, // 选择部门列表显示
      spaceTitle: '选择空间',
      spaceVisible: false, // 选择空间弹窗
      isAddEvent: false, // 是否是新增事件
      groupId: this.$route.params.groupId, // 资产分组id
      beaconId: this.$route.params.beaconId, // 蓝牙点位id
      deptTree: [], //  部门职能树形结构
      selectedPosition: [], // 选中的职能列表
      infoTitle: '添加设备', // 右侧显示的title
      level: 1, // 循环部门层级用到
      eventForm: {
        name: '',
        positionId: '',
        positionName: '',
        content: '',
        id: '',
      },
      rules: {
        name: [
          {
            required: true, min: 1, max: 20, message: '事件名称1-20字符', trigger: 'change',
          },
        ],
        positionName: [
          {
            required: true, message: '请选择负责人职能', trigger: 'change',
          },
        ],
        content: [
          {
            required: true, message: '请输入巡视内容', trigger: 'change',
          },
          {
            min: 1, max: 128, message: '巡视内容长度不合法',
          },
        ],
      },
      result: {}, // 该分组详情
      beaconResult: {}, // 蓝牙点位详情
      spaceList: [], // 空间列表
      activeSpace: {
        id: '',
        name: '',
      }, // 选中的空间 默认是上个页面蓝牙详情选择的空间
      infoList: [], // 右侧显示的列表
      btnArr: [ // 左侧按钮
        {
          id: 1,
          name: '添加设备',
        },
        {
          id: 2,
          name: '添加设施',
        },
        {
          id: 3,
          name: '添加事件',
        },
      ],
    };
  },
  methods: {
    /**
     * 删除分组内的事件
     *
     * */
    deleteEvent(item) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$http.post(
          this.api.assetsApi.updateBatchAssets,
          { assetIds: [item.id], valid: 0, projectSpaceId: item.projectSpaceId })
          .then((res) => {
            if (res) {
              this.$message.success('删除成功');
              this.getAssetsBySpace();
              // 删除左侧事件列表里面的元素
              this.result.events = this.result.events.filter(v => v.id !== item.id);
              const assetIds = [
                ...this.result.devices.map(v => v.id),
                ...this.result.events.map(v => v.id),
                ...this.result.facilities.map(v => v.id)]; // 去除 事件 设施 设备的id
              this.$http.post(this.api.virtualBeaconApi.editGroup,
                {
                  assetIds,
                  id: this.result.id,
                  name: this.result.name,
                });
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
     * 关闭选择空间
     *
     * */
    handleClose(val) {
      this.spaceVisible = val;
    },
    /**
     * 获取选择的职能
     *
     * */
    getPosition(item) {
      if (item) {
        this.eventForm.positionId = item.id;
        this.eventForm.positionName = item.name;
      } else {
        this.eventForm.positionId = '';
        this.eventForm.positionName = '';
      }
    },
    /**
     * 确认事件弹窗
     *
     * */
    confirmEventDialog() {
      this.$refs.eventForm.validate((valid) => {
        if (valid) {
          // 新增事件
          this.$http.post(this.api.assetsApi.insertAssets,
            {
              category: 3, // 资产类型 事件 3
              name: this.eventForm.name, // 资产名称
              id: this.eventForm.id, // 资产id
              patrolContent: this.eventForm.content, // 巡视内容
              positionId: this.eventForm.positionId, // 职能id
              assetCode: this.eventForm.name, // 资产编号 TODO 暂用资产名称
              projectId: this.beaconResult.projectId, // 项目id
              projectSpaceId: this.beaconResult.projectSpaceId, // 空间id
            })
            .then((res) => {
              if (res) {
                this.eventForm.id = res;
                if (this.isAddEvent) {
                  this.$message.success('新增事件成功');
                } else {
                  this.$message.success('修改事件成功');
                }
                this.getAssetsBySpace(this.eventForm); // 调用资产列表
                this.closeEventDialog(); // 关闭弹窗
              }
            });
        }
      });
    },
    /**
     * 关闭事件弹窗
     *
     * */
    closeEventDialog() {
      this.eventDialogVisible = false;
      this.showDepList = false;
    },
    /**
     * 编辑 新增 事件详情
     *
     * */
    editEvent(item) {
      this.eventDialogVisible = true;
      this.eventForm.content = ''; // 请空 防止加上上次的内容
      if (item) {
        // 编辑事件
        this.selectedPosition = item.positionId ? [item.positionId] : [];
        this.eventForm.name = item.name;
        this.eventForm.positionId = item.positionId;
        this.eventForm.positionName = item.positionName;
        this.eventForm.id = item.id;
        item.patrolContent.forEach((patrol, index) => {
          this.eventForm.content += `${patrol}${item.patrolContent.length - 1 !== index ? '&' : ''}`;
        });
        this.isAddEvent = false; // 标记为编辑事件
      } else {
        // 新增事件
        this.selectedPosition = [];
        this.eventForm.name = '';
        this.eventForm.positionId = '';
        this.eventForm.positionName = '';
        this.eventForm.id = '';
        this.isAddEvent = true; // 标记为新增事件
      }
    },
    /**
     * 获取选择的空间
     *
     * */
    getNodeTree(data) {
      this.spaceVisible = false;
      this.activeSpace.id = data.id;
      if (data.level === '1') {
        // 如果是一级空间
        this.activeSpace.name = `${data.name}`;
      } else {
        const pathArr = data.path.split('/');
        this.activeSpace.name = `${pathArr[pathArr.length - 2]} - ${data.name}`;
      }
      this.getAssetsBySpace(); // 查询资产列表
    },
    /**
     * 点击icon 删除设备或设施
     *
     * */
    deleteDevicesItem(data) {
      const type = this.activeIndex === 1 ? 'devices' : 'facilities';
      this.infoList.forEach((item) => {
        if (item.id === data.id) {
          item.checked = false;
        }
      });
      this.result[type] = this.result[type].filter(v => v.id !== data.id);
    },
    /**
     * 取消或者选中资产
     *
     * */
    changeItem(item) {
      const checked = item.checked; // 是否勾选了当前设备设施
      let type;
      if (this.activeIndex === 1) {
        type = 'devices';
      } else if (this.activeIndex === 2) {
        type = 'facilities';
      } else {
        type = 'events';
      }
      if (checked) {
        // 如果勾选了 左侧塞一条设备
        this.result[type].push(item);
      } else {
        this.result[type] = this.result[type].filter(v => v.id !== item.id);
      }
    },
    /**
     * 选择显示的类型
     *
     * */
    chooseItem(id) {
      this.activeIndex = id;
      this.infoTitle = this.btnArr[id - 1].name;
      if (id === 3) {
        // 计算出当前选择的空间路径
        const space = this.beaconResult.projectSpaceDTO;
        if (space.level === '1') {
          this.activeSpace.name = `${space.name}`;
        } else if (space.level === '2') {
          this.activeSpace.name = `${space.path}-${space.name}`;
        } else {
          const pathArr = space.path.split('-');
          this.activeSpace.name = `${pathArr[pathArr.length - 2]}-${space.name}`;
        }
        this.activeSpace.id = space.id;
      }
      this.getAssetsBySpace();
    },
    /**
     * 查询分组详情
     *
     * */
    getGroupDetails() {
      this.$http.get(
        this.api.virtualBeaconApi.groupDetails, { params: { assetGroupId: this.groupId } })
        .then((res) => {
          this.result = res;
          this.getBeaconDetails(); // 查询蓝牙点位详情
          // 处理事件列表中展开显示的巡视内容 用'&'分开
          this.result.events.forEach((event) => {
            event.patrolContent = event.patrolContent.split('&');
          });
        });
    },
    /**
     * 查询蓝牙点位详情
     *
     * */
    getBeaconDetails() {
      this.$http.get(
        this.api.virtualBeaconApi.details,
        { params: { virtualBeaconId: this.beaconId } })
        .then((res) => {
          this.beaconResult = res;
          this.activeSpace.id = this.beaconResult.projectSpaceId; // 第一次用蓝牙详情绑定的空间查询设备设施
          // 计算出当前选择的空间路径
          const space = this.beaconResult.projectSpaceDTO;
          if (space.level === '1') {
            this.activeSpace.name = `${space.name}`;
          } else if (space.level === '2') {
            this.activeSpace.name = `${space.path}-${space.name}`;
          } else {
            const pathArr = space.path.split('-');
            this.activeSpace.name = `${pathArr[pathArr.length - 2]}-${space.name}`;
          }
          this.getAssetsBySpace(); // 查询资产列表
          this.getSpaceList(); // 查询空间列表
          this.getSingleDepList(this.result.projectDeptDTO.id); // 获取部门子集职能或者部门
        });
    },
    /**
     * 查询空间列表
     *
     * */
    getSpaceList() {
      this.$http.get(
        this.api.spaceApi.spaceFormat,
        { params: { projectId: this.beaconResult.projectId } }).then((res) => {
        this.spaceList = res;
      });
    },
    /**
     * 根据选择空间id 查询改空间下的设备或设施
     *
     * */
    getAssetsBySpace(eventForm) {
      this.$http.post(this.api.assetsApi.getAssetsList, {
        valid: 1,
        pageSize: 9999,
        projectId: this.beaconResult.projectId, // 项目id
        projectSpaceId:
          this.activeIndex !== 3 ?
            this.activeSpace.id :
            this.beaconResult.projectSpaceId, // 空间的 id 如果是事件 空间传蓝牙点位绑定的空间id
        categoryIds: [this.activeIndex], // 资产设备, 1; 设备 2,设施 , 3事件
      }).then((res) => {
        res.list.forEach((child) => {
          child.checked = false;
        });
        let type;
        if (this.activeIndex === 1) {
          type = 'devices';
        } else if (this.activeIndex === 2) {
          type = 'facilities';
        } else {
          type = 'events';
        }
        const ids = this.result[type].map(v => v.id);
        this.infoList = res.list;
        this.infoList.forEach((item) => {
          if (ids.indexOf(item.id) === -1) {
            this.$set(item, 'checked', false);
          } else {
            this.$set(item, 'checked', true);
          }
          item.patrolContent = item.patrolContent.split('&');
        });
        // 根据是否传入eventForm 判断事件列表数据变更 修改左侧显示的事件名称 职能 和巡视内容
        if (eventForm) {
          this.result[type].forEach((item) => {
            if (item.id === eventForm.id) {
              item.name = eventForm.name;
              item.positionName = eventForm.positionName;
              item.patrolContent = eventForm.content.split('&');
            }
          });
        }
      });
    },
    /**
     * 查询单个部门子集的部门和职能
     *
     * */
    getSingleDepList(id) {
      this.$http.post(
        this.api.operationApi.getDepByIds,
        { ids: [id], needPosition: true, needSon: true, projectId: this.beaconResult.projectId })
        .then((res) => {
          this.deptTree = res;
          this.eachDep(this.deptTree);
        });
    },
    /**
     *
     * 处理部门层级的level
     *
     * */
    eachDep(data) {
      data.forEach((item) => {
        item.level = this.level;
        if (item.deptSonList.length !== 0) {
          this.eachDep(item.deptSonList);
        }
      });
      this.level = this.level + 1;
    },
    /**
     * 编辑分组
     *
     * */
    submit() {
      if (this.result.name === '' || this.result.name.length > 20) {
        this.$message.error('分组名称1-20字符');
        return false;
      }
      const assetIds = [
        ...this.result.devices.map(v => v.id),
        ...this.result.events.map(v => v.id),
        ...this.result.facilities.map(v => v.id)]; // 取出 事件 设施 设备的id
      this.$http.post(this.api.virtualBeaconApi.editGroup,
        {
          assetIds,
          id: this.result.id,
          name: this.result.name,
        })
        .then((res) => {
          if (res) {
            this.$message.success('编辑分组成功');
            this.$deleteTag();
            this.$router.push({ name: 'pointEdit', params: { beaconId: this.beaconId, projectId: this.beaconResult.projectId } });
          }
        });
      return true;
    },
  },
  mounted() {
    this.getGroupDetails(); // 查询分组详情
  },
};
</script>

<style lang="less" type="text/less" scoped>
  .group-edit{
    .inline-form-choice{
      .border{
        color: @main-color;
      }
    }
    .item-panel-title{
      height: 36px;
      display: flex;
      align-items: center;
      padding: 0 30px;
      background: #f5f5f5;
    }
    .space-item{
      height: 34px;
    }
    .group-info{
      .el-col{
        position: relative;
        .border();
        min-height: 680px;
        .bottom{
          display: flex;
          height: 64px;
          justify-content: flex-end;
          align-items: center;
          position: absolute;
          bottom: 0;
          width: 100%;
          z-index: 999;
          padding-right: 30px;
          border-top: 1px solid @bottom-color;
          button{
            font-size: 14px;
            height: 38px;
          }
        }
      }
      .item-panel-content{
        .item{
          height: 80px;
          display: flex;
          align-items: center;
          border-bottom: 1px solid @bottom-color;
          padding-left: 30px;
        }
      }
    }
  }
</style>
