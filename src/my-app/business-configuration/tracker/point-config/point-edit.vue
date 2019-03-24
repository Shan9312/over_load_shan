/**
 * Created by c on 2019/1/2.
 */
<template>
<div class="point-edit">
  <panelContentHeader></panelContentHeader>
  <div class="edit-content">
    <!--基本信息-->
    <el-form :model="pointForm" ref="pointForm" label-width="125px" :rules="rules">
      <div v-content-title>
        基本信息
      </div>
      <el-row >
        <el-col :span="8">
          <el-form-item label="点位名称" prop="name">
            <el-input v-model="pointForm.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="MAC地址/ UID" prop="mac" class="inline-form-choice">
            <el-input v-model="pointForm.mac" :disabled="!editMacType"></el-input>
            <el-button
              plain
              size="small"
              @click=" editMacType = !editMacType">{{!editMacType ? '编辑' : '确认'}}</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="归属部门" prop="dep" class="inline-form-choice">
            <el-input v-model="pointForm.dep" v-show="false"></el-input>
            <div class="dep-item ">
              <div class="ellipsis">
              <span
              :key="item.id"
              v-for="(item) in confirmDepList">
                {{item.nameStr}}
              </span>
              </div>
            </div>
            <el-button plain size="small" @click="openDepDialog">选择</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="关联空间" prop="space" class="inline-form-choice">
            <el-input v-model="pointForm.space" v-show="false"></el-input>
            <div class="space-item">
              {{pointForm.space}}
            </div>
            <el-button plain size="small" @click="openSpaceDialog">选择</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!--基本信息 end-->
    <!--分组信息-->
    <div class="group-info">
      <div v-content-title>分组信息</div>
      <el-row>
        <el-col :span="10" class="m-r-20">
          <div class="item-panel-title">
            分组列表
          </div>
          <div class="group-info-content">
            <info-item-ui title="选择部门" class="p-l-30 p-t-30 p-r-100" :font="14" :label-width="100">
              <el-select v-model="activeDepId" @change="chooseDepSelect">
                <el-option
                  v-for="(item) in confirmDepList"
                  :key="item.id"
                  :label="item.nameStr"
                  :value="item.id">
                </el-option>
              </el-select>
            </info-item-ui>
            <el-scrollbar tag="div" style="height: 424px">
              <el-collapse>
                <el-collapse-item
                  :key="item.id"
                  v-for="(item,index) in activeDep.assetGroupListDTOS">
                  <template slot="title">
                    <div class="title flex-justify-between" @click.stop>
                      <span>{{item.name}}</span>
                      <span>
                        <el-button size="mini"
                                   plain
                                   @click="editGroup(index, activeDep.id)">编辑</el-button>
                      <el-button size="mini" plain @click="deleteGroup(item,index)">删除</el-button>
                      </span>
                    </div>
                  </template>
                  <ul class="list">
                    <li class="m-l-80"
                        :class="{
                      'active':
                       (activeGroupInfo.id === item.id || activeGroupInfo.id === item.date) &&
                       activeGroupInfo.name === 'devices'}"
                        @click="chooseItem('devices', item.devices, item.id?item.id:item.date)">
                      设备({{item.devices.length}})
                    </li>
                    <li class="m-l-80"
                        :class="{
                      'active':
                      (activeGroupInfo.id === item.id || activeGroupInfo.id === item.date) &&
                       activeGroupInfo.name === 'facilities'}"
                      @click="chooseItem('facilities',item.facilities, item.id?item.id:item.date)">
                      设施({{item.facilities.length}})
                    </li>
                    <li class="m-l-80"
                        :class="{
                      'active':
                       (activeGroupInfo.id === item.id || activeGroupInfo.id === item.date) &&
                       activeGroupInfo.name === 'events'}"
                        @click="chooseItem('events', item.events, item.id?item.id:item.date)">
                      事件({{item.events.length}})
                    </li>
                  </ul>
                </el-collapse-item>
              </el-collapse>
            </el-scrollbar>
            <div class="bottom">
              <el-button size="middle" type="primary" @click="openGroupDialog">新增分组名称</el-button>
            </div>
          </div>
        </el-col>
        <el-col :span="10">
          <div class="item-panel-title">
            <span>{{infoTitle}}</span>
          </div>
          <div class="group-info-content">
            <el-scrollbar tag="div" style="height: 600px">
              <el-collapse v-if="activeGroupInfo.name === 'events'">
                <el-collapse-item v-for="(item,index) in activeGroupInfo.list" :key="index">
                  <template slot="title">
                    <div class="title flex-justify-between">
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
  <!--选择部门弹窗-->
  <el-dialog
    :visible="dialogVisibleDep"
    title="选择部门"
    class="dialog-dep-list"
    width="30%">
    <div class="p-l-30 p-r-30">
      <el-scrollbar class="infinite-collapse-dialog" tag="div">
        <infinite-collapse
          :data="deptTree"
          :showPosition="false"
          :isChoosePosition="false"
          :selectedDepartment="false"
          :selectedDep="dialogDepList"
          @changeActiveData="getChooseDepList"
        ></infinite-collapse>
      </el-scrollbar>
      <info-item-ui title="已选部门" :label-width="70" :font="14" align="top">
        <div class="dialog-dep-item">
            <span v-for="(item,index) in dialogDepList" :key="item.id">
              <i class="el-icon el-icon-close"
                 @click="deleteDep(index)"
              ></i>{{item.nameStr}}</span>
        </div>
      </info-item-ui>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeDepDialog">取 消</el-button>
      <el-button type="primary" @click="confirmDepDialog">确 定</el-button>
    </span>
  </el-dialog>
  <!--选择部门弹窗 end-->
  <!--选择空间弹窗-->
  <space-move :data="spaceList"
              :projectName="spaceTitle"
              :spaceVisible="spaceVisible"
              @getNodeTree="getNodeTree"
              @handleClose="handleClose"
  >
  </space-move>
  <!--选择空间弹窗 end-->
  <!--新增分组弹窗-->
  <el-dialog :visible="dialogGroupVisible" title="新建分组名称" width="25%">
    <el-form
      :model="groupForm"
      ref="groupForm"
      label-width="125px"
      :rules="groupRules"
      class="p-l-10 p-r-30">
      <el-form-item label="输入名称" prop="name">
        <el-input v-model="groupForm.name" ></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogGroupVisible = false">取 消</el-button>
      <el-button type="primary" @click="confirmGroupDialog">确 定</el-button>
    </span>
  </el-dialog>
  <!--新增分组弹窗 end-->
  <!--底部操作栏-->
  <div class="fixed-control">
    <el-button plain @click="$cancel()">取消</el-button>
    <el-button  type="primary" @click="submit()">确定</el-button>
  </div>
  <!--底部操作栏 end-->
</div>
</template>
<script>
import infiniteCollapse from '../../../../components/common/func-dialog/infinite-collapse/infinite-collapse'; // 无限下拉部门职能
import spaceMove from '../../../../components/common/dialog-space-move/space-move'; // 选择空间组件

export default{
  name: 'point-edit',
  components: { spaceMove, infiniteCollapse },
  data() {
    // 验证蓝牙名称在改项目下是否存在
    const usableName = (rule, value, callback) => {
      if (value) {
        // 查询蓝牙列表
        if (value.length > 20) {
          callback(new Error('点位名称长度最长不超过20字符'));
        } else {
          this.$http.post(this.api.virtualBeaconApi.list, {
            name: value,
            projectId: this.projectId,
            pageSize: 9999,
          })
            .then((res) => {
              if (res.list.length > 2) {
                callback(new Error('输入点位名称已存在'));
              } else if (res.list.length === 1 && res.list[0].id !== this.beaconId) {
                callback(new Error('输入点位名称已存在'));
              } else {
                callback();
              }
            });
        }
      } else {
        callback(new Error('请输入点位名称'));
      }
    };
    // 验证蓝牙mac地址是否存在
    const usableMac = (rule, value, callback) => {
      if (value) {
        this.$http.post(this.api.virtualBeaconApi.list, {
          mac: value,
          pageSize: 9999,
        })
          .then((res) => {
            if (res.list.length > 2) {
              callback(new Error('该地址已经存在'));
            } else if (res.list.length === 1 && res.list[0].id !== this.beaconId) {
              callback(new Error('该地址已经存在'));
            } else {
              callback();
            }
          });
      } else {
        callback(new Error('请输入mac地址/UID'));
      }
      return true;
    };
    return {
      projectId: this.$route.params.projectId, // 项目id
      beaconId: this.$route.params.beaconId, // 蓝牙点位id
      dialogVisibleDep: false, // 选择部门弹窗
      spaceVisible: false, // 选择空间弹窗
      dialogGroupVisible: false, // 新增分组弹窗
      editMacType: false, // 编辑mac地址
      dialogDepList: [], // 未确认之前的勾选的部门
      confirmDepList: [], // 确认之后的部门
      spaceTitle: '选择空间',
      activeSPace: {}, // 选中的空间
      spaceList: [], // 空间列表
      deptTree: [], // 部门列表
      activeDep: {}, // 选中的部门
      activeDepId: null, // 选中的部门id
      infoTitle: '', // 右侧分组显示的title
      activeGroupInfo: {
        id: '',
        name: '',
        list: [],
      },
      groupForm: {
        name: '', // 分组名称
      },
      groupRules: {
        name: [
          {
            required: true, min: 1, max: 20, message: '分组名称1-20字符', trigger: 'change',
          },
        ],
      },
      pointForm: {
        name: '', // 点位名称
        mac: '', // mac 地址
        dep: '', // 部门
        space: '', // 空间
        spaceId: '', // 空间id
      },
      rules: {
        name: [
          { required: true, validator: usableName, trigger: 'change' },
        ],
        mac: [
          { required: true, validator: usableMac, trigger: 'change' },
        ],
        dep: [
          { required: true, message: '请选择部门', trigger: 'change' },
        ],
        space: [
          { required: true, message: '请选择空间', trigger: 'change' },
        ],
      },
    };
  },
  methods: {
    /**
     * 删除分组
     *
     * */
    deleteGroup(item, index) {
      this.$confirm('确认是否删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        if (item.id) {
          this.$http.post(this.api.virtualBeaconApi.editGroup, { id: item.id, valid: -1 })
            .then((res) => {
              if (res) {
                this.$message.success('删除成功');
                this.activeDep.assetGroupListDTOS.splice(index, 1);
              }
            });
        } else {
          this.activeDep.assetGroupListDTOS.splice(index, 1);
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除',
        });
      });
    },
    /**
     * 切换部门
     *
     * */
    chooseDepSelect() {
      // 获取部门下面的分组详情
      this.activeDep =
        this.confirmDepList.filter(v => v.id === this.activeDepId)[0];
      if (this.activeDep.assetGroupListDTOS) {
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
      } else {
        this.$set(this.activeDep, 'assetGroupListDTOS', []);
      }
      // 右侧列表置空
      this.infoTitle = '';
      this.activeGroupInfo.id = '';
      this.activeGroupInfo.name = '';
      this.activeGroupInfo.list = [];
    },
    /**
     * 关闭选择空间
     *
     * */
    handleClose(val) {
      this.spaceVisible = val;
    },
    /**
     * 编辑分组
     * 通过传递的index 和depId 找出点击是哪个分组
     * */
    editGroup(index, depId) {
      this.$refs.pointForm.validate((valid) => {
        if (valid) {
          const virtualBeaconDeptQueries = [];
          console.log(this.confirmDepList);
          this.confirmDepList.forEach((group) => {
            const assetGroups = [];
            group.assetGroupListDTOS.forEach((item) => {
              assetGroups.push({
                name: item.name,
                valid: 1,
                id: item.id,
              });
            });
            virtualBeaconDeptQueries.push(
              {
                assetGroups,
                projectDeptId: group.id,
              });
          });
          const obj = {
            name: this.pointForm.name,
            mac: this.pointForm.mac,
            id: this.beaconId,
            projectSpaceId: this.pointForm.spaceId,
            projectId: this.projectId,
            virtualBeaconDeptQueries,
          };
          this.$http.post(this.api.virtualBeaconApi.edit, obj)
            .then((res) => {
              if (res) {
                // 循环返回的结果 找出分组id 和蓝牙点位的id 跳转到分组编辑的页面 并且关闭改新增页面
                res.virtualBeaconDeptInsertDTOS.forEach((item) => {
                  if (item.projectDeptId === depId) {
                    this.$deleteTag(); // 关闭新增页
                    this.$router.push({ name: 'groupEdit', params: { groupId: item.assetGroupIds[index], beaconId: res.virtualBeaconId } });
                  }
                });
              }
            });
        } else {
          this.$message.error('编辑分组会新增该点位,请确认信息正确');
        }
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
     * 打开新增分组名称弹窗
     *
     * */
    openGroupDialog() {
      if (Object.keys(this.activeDep).length === 0) {
        this.$message.warning('请选择归属部门');
        return false;
      }
      this.groupForm.name = '';
      this.dialogGroupVisible = true;
      return true;
    },
    /**
     * 确认添加分组弹窗
     *
     * */
    confirmGroupDialog() {
      this.$refs.groupForm.validate((valid) => {
        if (valid) {
          this.activeDep.assetGroupListDTOS.push({
            name: this.groupForm.name,
            id: null,
            date: new Date().getTime(),
            devices: [],
            facilities: [],
            events: [],
          });
          this.dialogGroupVisible = false;
        }
      });
    },
    /**
     *打开选择空间弹窗
     *
     * */
    openSpaceDialog() {
      this.spaceVisible = true;
    },
    /**
     * 获取选择的空间
     *
     * */
    getNodeTree(data) {
      this.activeSPace = data;
      this.spaceVisible = false;
      this.pointForm.spaceId = data.id;
      if (data.level === '1') {
        // 如果是一级空间
        this.pointForm.space = `${data.name}`;
      } else {
        const pathArr = data.path.split('/');
        this.pointForm.space = `${pathArr[pathArr.length - 2]} - ${data.name}`;
      }
    },
    /**
     * 打开部门弹窗
     *
     * */
    openDepDialog() {
      if (this.deptTree.length === 0) {
        this.$message.warning('该项目暂无部门');
        return false;
      }
      this.dialogVisibleDep = true;
      this.dialogDepList = Array.from(this.confirmDepList);
      return true;
    },
    /**
     * 取消部门弹窗
     *
     * */
    closeDepDialog() {
      this.dialogVisibleDep = false;
    },
    /**
     * 删除部门
     * 点击icon 删除选中的部门
     * 通过选中的部门列表更新组件内的选中的值
     *
     * */
    deleteDep(index) {
      this.dialogDepList.splice(index, 1);
    },
    /**
     * 删除确认完毕的部门
     *
     * */
    deleteConfirmDep(index) {
      this.confirmDepList.splice(index, 1);
    },
    /**
     * 确认弹窗
     *
     * */
    confirmDepDialog() {
      this.dialogVisibleDep = false;
      this.confirmDepList = Array.from(this.dialogDepList);
    },
    /**
     * 获取选择出来的部门
     *
     * */
    getChooseDepList(list) {
      this.dialogDepList = list;
      // 循环选中的部门 给部门名字加上一级部门的名称
      this.dialogDepList.forEach((item) => {
        const nameArr = item.parentName.split('/');
        if (item.level === '1') {
          item.nameStr = `${nameArr[0]}`;
        } else {
          item.nameStr = `${nameArr[0]}-${nameArr[nameArr.length - 1]}`;
        }
      });
    },
    /**
     * 查询部门列表
     *
     *
     */
    getDepList() {
      this.$http.get(this.api.operationApi.companyMsg, {
        params: {
          projectId: this.projectId,
          positionValid: null,
        },
      }).then((res) => {
        this.deptTree = res;
        // 循环部门 加上标记
        this.eachData(this.deptTree);
      });
    },
    /**
     * 递归循环部门列表
     * 给每个部门加上 sign
     *
     */
    eachData(data) {
      data.forEach((item) => {
        this.$set(item, 'sign', item.id);
        this.$set(item, 'isChecked', false);
        if (item.deptSonList.length !== 0) {
          this.eachData(item.deptSonList);
        }
      });
    },
    /**
     * 查询空间列表
     * */
    getSpaceList() {
      this.$http.get(
        this.api.spaceApi.spaceFormat, { params: { projectId: this.projectId } }).then((res) => {
        this.spaceList = res;
      });
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
          // 把数据塞到from表单里面
          this.pointForm.name = res.name; // 点位名称
          this.pointForm.mac = res.mac; // 点位名称
          this.confirmDepList = res.projectDeptDTOS; // 部门
          // 循环选中的部门 给部门名字加上一级部门的名称
          this.confirmDepList.forEach((item) => {
            this.$set(item, 'sign', item.id);
            this.$set(item, 'isChecked', true);
            item.parentName = item.parentName.replace(/-/g, '/');
            const nameArr = item.parentName.split('/');
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
          this.activeDepId = this.confirmDepList[0].id;
          this.chooseDepSelect();
          // 处理空间
          this.activeSPace = res.projectSpaceDTO;
          this.pointForm.spaceId = res.projectSpaceId;
          if (res.projectSpaceDTO.level === '1') {
            this.pointForm.space = `${res.projectSpaceDTO.name}`;
          } else {
            const arr = res.projectSpaceDTO.path.split('-');
            this.pointForm.space = `${arr[arr.length - 1]}-${res.projectSpaceDTO.name}`;
          }
        });
    },
    /**
     * 提交蓝牙点位信息
     *
     * */
    submit() {
      this.$refs.pointForm.validate((valid) => {
        if (valid) {
          const virtualBeaconDeptQueries = [];
          this.confirmDepList.forEach((group) => {
            const assetGroups = [];
            if (group.assetGroupListDTOS) {
              group.assetGroupListDTOS.forEach((item) => {
                assetGroups.push({
                  name: item.name,
                  valid: 1,
                  id: item.id,
                });
              });
            }
            virtualBeaconDeptQueries.push(
              {
                assetGroups,
                projectDeptId: group.id,
              });
          });
          const obj = {
            name: this.pointForm.name,
            mac: this.pointForm.mac,
            id: this.beaconId,
            projectSpaceId: this.pointForm.spaceId,
            projectId: this.projectId,
            virtualBeaconDeptQueries,
          };
          this.$http.post(this.api.virtualBeaconApi.edit, obj)
            .then((res) => {
              if (res) {
                this.$message.success('修改点位成功');
                this.$deleteTag(); // 关闭新增页
                this.$router.push({ name: 'pointList', query: { projectId: this.projectId } });
                if (this.$route.query.fromDetails === '1') {
                  this.$router.push({ name: 'pointDetails', params: { beaconId: this.beaconId, projectId: this.projectId } });
                }
              }
            });
        } else {
          this.$message.error('请确认信息正确');
        }
      });
    },
  },
  watch: {
    confirmDepList() {
      this.pointForm.dep = this.confirmDepList.length > 0 ? 1 : '';
    },
  },
  mounted() {
    this.getDepList();
    this.getSpaceList();
    this.getBeaconDetails();
  },
};
</script>

<style lang="less" type="text/less" scoped>
.point-edit{
  .dialog-dep-list{
    .infinite-collapse-dialog{
      height: 250px;
      .border();
      margin-bottom: 30px;
    }
    .dialog-dep-item{
      padding: 10px;
      min-height: 200px;
      .border();
      border-radius: 3px;
      span{
        height: 30px;
        display: inline-flex;
        align-items: center;
        background: rgba(100,127,216,0.1);
        font-size: 16px;
        padding: 0 10px;
        border-radius: 3px;
        margin-bottom: 10px;
        color: @main-blue;
        margin-right: 20px;
        i{
          cursor: pointer;
          font-weight: bold;
          margin-right: 15px;
        }
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
  .dep-item{
    .border();
    padding: 5px 10px;
    width: 100%;
    border-radius: 3px;
    display: flex;
    align-items: center;
    min-width: 0;
    span{
      padding-right: 5px;
    }
  }
  .space-item{
    .border();
    display: flex;
    align-items: center;
    padding: 5px 10px;
    width: 100%;
    border-radius: 3px;
  }
  .group-info{
    .el-col{
      height: 635px;
      position: relative;
      .border();
      .bottom{
        display: flex;
        height: 80px;
        z-index: 99;
        background: #ffffff;
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
