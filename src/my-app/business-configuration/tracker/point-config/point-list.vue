/**
* Created by c on 2019/1/2.
*/
<template>
	<div class="point-list">
    <panelContentHeader>
      <template>
        <el-input class="panel-content-header-input"
                  placeholder="请输入点位名称" v-model="nameLike">
          <i slot="suffix" class="el-input__icon el-icon-search" @click="searchName"></i>
        </el-input>
        <el-button
          size="medium"
          type="primary"
          class="m-l-15"
          @click="goAddPoint"
          >创建点位</el-button>
        <!--导入按钮-->
        <file-upload
          :projectId="projectId"
          @uploadSuc="uploadSuc"
          :names="names"
          :url="api.uploadApi.uploadPoint">
        </file-upload>
        <!--导入按钮-->
        <el-button
          size="medium"
          type="primary"
          class="m-l-15"
          @click="showBtn = !showBtn"
        >更多操作</el-button>
        <el-button
          size="medium"
          class="m-l-15"
          type="primary"
          @click="deleteItem()"
          plain
          v-if="showBtn"
        >删除</el-button>
      </template>
    </panelContentHeader>
    <div v-content>
      <div class="header  flex-center">
        <info-item-ui title="项目" :label-width="50" :font="14">
          <el-select v-model="projectId"  placeholder="全部"
                     @change="getDepList">
            <el-option
              v-for="item in projectArr"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </info-item-ui>
        <info-item-ui title="选择部门" :font="14" :label-width="70" class="m-l-30">
          <div class="flex">
            <div class="dep-item">
              <span
                :key="item.id"
                v-for="(item,index) in confirmDepList">
                <i class="el-icon el-icon-close" @click="deleteConfirmDep(index)"></i>
                {{item.nameStr}}
              </span>
            </div>
            <el-button size="small" plain class="m-l-15" @click="openDepDialog">选择</el-button>
          </div>
        </info-item-ui>
      </div>
      <el-scrollbar tag="div" v-table>
        <el-table
          :data="result.list"
          style="width: 100%">
          <el-table-column
            label="点位名称"
            class-name="checked"
          >
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.checked" v-if="showBtn"></el-checkbox>
              <span class="m-l-30">{{scope.row.name}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="归属部门"
          >
            <template slot-scope="scope">
              <div v-if="scope.row.nameLength < 10">
                <span
                  v-for="(item,index) in scope.row.projectDeptDTOS"
                  :key="index"
                >{{item.nameStr}}</span>
              </div>
              <el-popover trigger="hover" placement="bottom" v-else>
              <span
                v-for="(item,index) in scope.row.projectDeptDTOS"
                :key="item.id">
                {{item.nameStr}}<b v-if="scope.row.projectDeptDTOS.length !== index+1">,</b> </span>
                <div slot="reference" class="name-wrapper">
                  <div class="ellipsis" style="width: 200px">
                <span
                  v-for="(item,index) in scope.row.projectDeptDTOS"
                  :key="index"
                >{{item.nameStr}}<b v-if="scope.row.projectDeptDTOS.length !== index+1">,</b>
                </span>
                  </div>
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column
            label="相关任务数量"
            prop="taskCou"
          >
          </el-table-column>
          <el-table-column
            prop="time"
            label="创建时间"
          >
            <template slot-scope="scope">
              {{$day(Number(scope.row.createAt)).format('YYYY/MM/DD')}}
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
          >
            <template slot-scope="scope">
              <div class="control-item">
                <router-link
                  :to="{name:'pointEdit',params:{ beaconId:scope.row.id, projectId: projectId}}">
                  <el-button  size="small" plain>修改</el-button>
                </router-link>
                <router-link
                  :to="{name:'pointDetails',params:{beaconId:scope.row.id, projectId: projectId }}">
                  <el-button  size="small" plain>查看</el-button>
                </router-link>
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
        <!--<el-button @click="closeFuncDialog()">取 消</el-button>-->
        <el-button type="primary" @click="confirmDialog">确 定</el-button>
      </span>
    </el-dialog>
    <!--选择部门弹窗 end-->
	</div>
</template>
<script>
import infiniteCollapse from '../../../../components/common/func-dialog/infinite-collapse/infinite-collapse'; // 无限下拉部门职能
import fileUpload from '../../../../components/common/file-upload/FileUpload';


export default {
  name: 'point-list',
  components: { infiniteCollapse, fileUpload },
  data() {
    return {
      names: '点位导入',
      nameLike: '', // 点位名称
      projectArr: '', // 项目列表
      projectId: '', // 选中的项目id
      deptTree: [], //  部门列表
      showBtn: false,
      showCheckbox: true, // 是否显示多选框
      dialogVisibleDep: false, // 选择部门弹窗
      dialogDepList: [], // 未确认之前的勾选的部门
      confirmDepList: [], // 确认之后的部门
      currentPage: 1,
      result: {},
    };
  },
  methods: {
    /**
     *表格导入成功后 返回res
     *
     * */
    uploadSuc(res) {
      if (res.code === '10000') {
        this.getDepList();
      }
    },
    /**
     * 按照名称搜索
     *
     * */
    searchName() {
      this.currentPage = 1;
      this.getBeaconList();
    },
    /**
     * 删除确认完的部门
     *
     * */
    deleteConfirmDep(index) {
      this.confirmDepList.splice(index, 1);
      this.dialogDepList = this.confirmDepList;
      this.getBeaconList();
    },
    /**
     * 删除蓝牙点位
     *
     * */
    deleteItem() {
      const idArr = this.result.list.filter(v => v.checked).map(v => v.id);
      if (idArr.length > 0) {
        this.$confirm('是否删除蓝牙点位?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          this.$http.post(this.api.virtualBeaconApi.deleteBatch, idArr)
            .then((res) => {
              if (res) {
                this.$message.success('删除成功');
                this.getBeaconList();
              }
            });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          });
        });
      } else {
        this.$message.error('请选择蓝牙点位');
      }
    },
    /**
     * 跳转到新建点位
     *
     * */
    goAddPoint() {
      this.$router.push({ name: 'pointAdd', params: { projectId: this.projectId } });
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
     * 确认弹窗
     *
     * */
    confirmDialog() {
      this.dialogVisibleDep = false;
      this.confirmDepList = Array.from(this.dialogDepList);
    },
    /**
     * 打开弹窗
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
     * 获取选择出来的部门
     *
     * */
    getChooseDepList(list) {
      this.dialogDepList = list;
      // 循环选中的部门 给部门名字加上一级部门的名称
      this.dialogDepList.forEach((item) => {
        const nameArr = item.parentName.split('/');
        item.nameStr = `${nameArr[0]}-${nameArr[nameArr.length - 1]}`;
      });
    },
    /**
     * 获取分页
     *
     */
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getBeaconList();
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
          if (!this.projectId) {
            this.projectId = this.projectArr[0].id;
          }
          this.getDepList();
        });
    },
    /**
     * 查询部门列表
     *
     *
     */
    getDepList() {
      this.nameLike = '';
      this.confirmDepList = [];
      this.$http.get(this.api.operationApi.companyMsg, {
        params: {
          projectId: this.projectId,
          positionValid: null,
        },
      }).then((res) => {
        this.deptTree = res;
        this.getBeaconList();
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
     * 查询蓝牙点位列表
     *
     * */
    getBeaconList() {
      this.$http.post(this.api.virtualBeaconApi.list, {
        projectId: this.projectId,
        pageIndex: this.currentPage,
        nameLike: this.nameLike,
        pageSize: 5,
        projectDeptIds: this.confirmDepList.map(v => v.id),
      })
        .then((res) => {
          this.result = res;
          this.result.list.forEach((item) => {
            this.$set(item, 'checked', false);
            // 循环部门
            let nameL = '';
            item.projectDeptDTOS.forEach((dep) => {
              let nameStr = '';
              if (dep.level === '1') {
                nameStr = `${dep.name}`;
              } else {
                const arr = dep.parentName.split('-');
                nameStr = `${arr[arr.length - 2]}-${dep.name}`;
              }
              nameL += nameStr;
              this.$set(dep, 'nameStr', nameStr);
            });
            this.$set(item, 'nameLength', nameL.length);
          });
        });
    },
  },
  computed: {
    /**
     * 选择的部门id合集
     *
     * */
    chooseDepIdArr() {
      return this.dialogDepList.map(v => v.sign);
    },
  },
  watch: {
    confirmDepList() {
      this.getBeaconList();
    },
  },
  mounted() {
    if (this.$route.query.projectId) {
      this.projectId = this.$route.query.projectId;
    }
    this.getProjectList();
  },
};
</script>

<style lang="less" type="text/less" scoped>
.point-list{
  .dialog-dep-list{
    .infinite-collapse-dialog{
      height: 250px;
      .border();
      border-bottom: none;
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
  .header{
    .dep-item{
      .border();
      display: flex;
      align-items: center;
      padding: 5px 10px;
      min-width: 200px;
      border-radius: 3px;
      span{
        background: #fafafa;
        margin-right: 10px;
        font-size: 16px;
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
  }
}
</style>
