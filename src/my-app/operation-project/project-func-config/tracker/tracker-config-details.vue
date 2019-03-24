/**
* Created by c on 2018/12/18.
*/
<template>
	<div class="tracker-config-details">
    <panelContentHeader>
      <template>
        <el-button
          size="medium"
          type="primary"
          class="m-l-15"
          @click="deleteTask"
          v-if="type === 'task'"
        >删除</el-button>
        <el-button
          size="medium"
          type="primary"
          class="m-l-15"
          @click="goEdit"
        >编辑</el-button>
      </template>
    </panelContentHeader>
    <div class="header m-b-30">
      <div v-content class="p-b-20">
        <el-row>
          <el-col :span="8" class="border-right">
            <info-item-ui title="功能名称">
              <span class="m-l-30" v-if="type === 'task'">{{result.name}}</span>
              <span class="m-l-30" v-else>{{$route.query.name}}</span>
            </info-item-ui>
            <info-item-ui title="功能图标" last>
              <span class="m-l-30 img-item" >
                  <img :src="result.iconDict.value3" v-if="type === 'task'"/>
                  <img :src="`../../../../../static/img/icon-${$route.query.icon}.png`"  v-else />
              </span>
            </info-item-ui>
          </el-col>
          <el-col :span="8" class="p-l-30 border-right" v-if="type === 'task'">
            <div class="task-type">
              <div class="title">
                功能类型
              </div>
              <div class="content m-t-30">
                <span
                  class="item m-r-15 m-b-15"
                  v-if="result.secondLvPermissionId == item.id"
                  v-for="item in funcList" :key="item.id">{{item.nameCn}}</span>
              </div>
            </div>
          </el-col>
          <el-col :span="8" class="p-l-30"
                  v-if="type === 'task' && result.secondLvPermissionId === '2'">
            <div class="task-type">
              <div class="title">
                任务标签
              </div>
              <div class="content m-t-30">
                <span class="tag m-r-15"
                      v-for="item in result.projectTags"
                      :key="item.id">{{item.name}}</span>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="content">
      <div v-content>
        <div v-content-title>
          参与职能与权限分配
        </div>
        <el-table
          :data="tableData"
          border
          style="width: 100%"
          class="no-hover-table"
        >
          <el-table-column
            label="参与职能"
            class-name="cell-flex-column"
            width="240px"
            prop="name">
            <template slot="header" slot-scope="scope">
              <div class="flex-justify-between">
                <span>参与职能</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            v-for="item in tableHead"
            :label="item.label"
            :key="item.property"
            :prop="item.property"
            class-name="cell-flex-column"
          >
            <template  slot-scope="scope">
              <div
                class="w-100 m-b-15"
                v-for="child in scope.row[item.property]"
                :key="child.id" v-if="child.show">
                <div class="title flex-justify-between">
                  <span>
                    {{child.nameCn}}
                  </span>
                </div>
                <div v-if="child.category !== '2' ">
                  <div class=" main-blue m-t-15"
                       v-if="child.positionIds.length > 0">
                  <span
                    v-for="(position,index) in child.positionIds"
                    :key="position.id">{{position.name}}
                    <b v-if="child.positionIds.length-1 !== index ">、</b>
                  </span>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
	</div>
</template>
<script>
export default {
  name: 'tracker-config-details',
  components: {},
  data() {
    return {
      permissionId: this.$route.params.id,
      queryId: this.$route.params.queryId, // 一级权限id 或者 二级权限id 用来查询权限子节点
      projectId: this.$route.params.projectId, // 项目id
      type: this.$route.query.taskType, // 标识 任务类功能 公共功能 其他功能
      result: {
        iconDict: {},
      }, // 项目功能配置详情
      funcList: [], // 功能类型
      tableHead: [], // 表头数据
      tableData: [], // 表格数据
    };
  },
  methods: {
    /**
     * 修改该项
     *
     * */
    goEdit() {
      this.$router.push(
        { name: 'trackerConfigEdit',
          params: { id: this.permissionId, queryId: this.queryId, projectId: this.projectId },
          query: {
            taskType: this.type,
            icon: this.$route.query.icon,
            name: this.$route.query.name,
          },
        });
    },
    /**
     * 删除该项
     *
     * */
    deleteTask() {
      this.$confirm('是否删除该项目功能?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$http.post(this.api.operationApi.addBizTaskType, { id: this.result.id, valid: 0 })
          .then((res) => {
            if (res) {
              this.$message.success('删除成功');
              this.$cancel();
            }
          });
      }).catch(() => {});
    },
    /**
     * 根据一级id查询二级权限
     *
     * */
    getPermission() {
      this.$http.get(
        this.api.operationApi.getPermissionTree, { params: { id: this.queryId } })
        .then((res) => {
          this.funcList = res.children;
          // 如果是任务类功能配置
          // 查询详情
          this.$http.get(
            this.api.operationApi.getBizTaskTypeDetails, { params: { id: this.permissionId } })
            .then((data) => {
              this.result = data;
              this.$route.meta.title = data.name;
              document.title = `${data.name} - OverLord`;
              const tree = this.funcList.filter(v => v.id === this.result.secondLvPermissionId);
              this.getTable(tree[0].children);
            });
        });
    },
    /**
     * 查询公共权限 子节点
     *
     * */
    getCommonPermission() {
      this.$http.get(this.api.operationApi.getPermissionByRoot, { params: { id: this.queryId } })
        .then((res) => {
          // 如果是公共功能配置
          this.$route.meta.title = res.nameCn;
          document.title = `${res.nameCn} - OverLord`;
          const lv4Arr = [];
          res.children.forEach((item) => {
            item.children.forEach((child) => { lv4Arr.push(child.id); });
          });
          this.$http.post(
            this.api.operationApi.getCommonPermissionDetails,
            { permissionIds: lv4Arr, projectId: this.projectId })
            .then((data) => {
              this.result.positionPermissions = data;
              this.getTable(res.children);
            });
        });
    },
    /**
     * 显示动态表格数据
     *
     * */
    getTable(list) {
      this.tableHead = [];
      const row = {}; // 每一行的数据
      list.forEach((item, index) => {
        const propsData = [];
        this.tableHead.push({ label: item.nameCn, property: `props${index}` });
        item.children.forEach((children) => {
          propsData.push({
            id: children.id,
            remark: children.remark,
            category: children.category,
            name: children.name,
            nameCn: children.nameCn,
            positionIds: [], // 四级权限绑定的职能
          });
        });
        row.id = null;
        row.name = null;
        row[`props${index}`] = propsData;
      });
      this.result.positionPermissions.forEach((item) => {
        // 循环取出 i
        row.id = item.position.id;
        row.name = item.position.name;
        for (let i = 0; i < list.length; i += 1) {
          const lv3Obj = row[`props${i}`]; // 数组
          lv3Obj.forEach((lv4) => {
            // 取出 找到的对象
            const currentLvObj =
              item.positionPermissionTargetDTOS.filter(v => v.permissionDTO.id === lv4.id);
            if (currentLvObj.length !== 0) {
              lv4.positionIds = currentLvObj[0].targetPositions;
              lv4.show = true;
            } else {
              lv4.positionIds = [];
              lv4.show = false;
            }
          });
        }
        this.tableData.push(JSON.parse(JSON.stringify(row))); // 防止对象拷贝
      });
    },
  },
  mounted() {
    if (this.type === 'task') {
      this.getPermission();
    } else {
      this.getCommonPermission();
    }
  },
};
</script>

<style lang="less" type="text/less" scoped>
  .tracker-config-details{
    .header{
      .border-right{
        border-right: 1px solid @bottom-color;
      }
      .img-item{
        width: 77px;
        height: 77px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 1px 12px 0 rgba(38,123,209,0.2);
      }
      .task-type{
        .title{
          color: @secondary-color;
        }
        .content{
          .item{
            padding: 10px 28px;
            background: #f7f8fd;
            border-radius: 3px;
            font-size: 14px;
            color: @main-blue;
            border: 1px solid @main-blue;
          }
          .tag{
            padding: 2px 20px;
            border-radius: 15px;
            font-size: 12px;
            background: #f2f6fc;
            margin-bottom: 5px;
            color: @main-blue;
          }
        }
      }
    }
  }
</style>
