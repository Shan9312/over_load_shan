/**
* Created by c on 2018/7/21.
*/
<template>
	<div class="space-list">
    <!--头部样式-->
    <div class="header-body">
      <el-row>
        <el-col :span="24">
          <!--左边的面包屑-->
          <div class="header-lf space-level">
            <span :class="{'last-child': !levelList.length }"
            class="title-icon"
            @click="handleIndex">列表首页</span>
            <span
              class="text"
              :class="{'last-child': levelList.length == index+1 }"
              v-for="(item, index) in levelList"
              :key="index"
              @click="quickSpace(item,index)"
            >
        <i class="el-icon-arrow-right title"
           @click="UpperLevel"></i>
        {{item.name}}
        </span>
          </div>
        </el-col>
      </el-row>
    <!--头部样式-->
    </div>
    <div v-content>
      <!--项目搜索-->
      <div class="flex-justify-between">
          <info-item-ui title="项目" :label-width="50" color="#2f3747">
            <el-select v-model="projectId" class="w-100"  placeholder="全部"
                       @change="selectProjectList">
              <el-option
                v-for="item in projectArr"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </info-item-ui>
        <div>
          <el-input class="panel-content-header-input"
                    placeholder="请输入空间描述"
                    v-model="searchName"
          >
            <i slot="suffix" class="el-input__icon el-icon-search"
               @click="getSpaceListByName"></i>
          </el-input>
          <!--导入按钮-->
          <file-upload
            :projectId="projectId"
            @uploadSuc="uploadSuc"
            :names="names"
            :url="api.uploadApi.uploadFile">
          </file-upload>
          <!--导入按钮-->
          <el-button
            size="medium"
            type="primary"
            class="m-l-15"
          >表格导出</el-button>
          <el-button
            size="medium"
            type="primary"
            class="m-l-15"
            @click="spaceAdd"
          >新建空间</el-button>
          <el-button
            size="medium"
            type="primary"
            class="m-l-15"
            @click="isShowBtn=!isShowBtn"
          >更多操作</el-button>
          <div v-if="isShowBtn" style="display: inline-block!important;">
            <el-button plain @click="moveSpace" class="icon-btn" >移动到</el-button>
            <el-button class="icon-btn icon-btn-del" plain @click="delSpace">删除</el-button>
            <el-button plain @click="erWeiCode" class="icon-btn icon-btn-erwei">
              导出空间二维码</el-button>
          </div>
        </div>
      </div>
      <div  style="height: 800px">
        <el-scrollbar >
          <div class="space-content">
            <div class="content-header">
              <span class="span-info">空间描述</span>
              <span class="span-type">空间类型</span>
              <span class="span-type">空间属性</span>
              <span class="span-control p-l-30">操作</span>
            </div>
            <ul class="content-list">
              <li class="item-li"
                  v-for="(item,index) in result"
                  :class="{'enter-class':item.default}"
                  :key="index"
                  :draggable="levelList.length > 0"
                  @dragstart="dragStart(item)"
                  @dragend="dragEnd"
              >
                <!--空间描述-->
                <span class="span-info">
                  <span v-if="isShowBtn">
                      <el-checkbox v-model="item.checked"></el-checkbox>
                  </span>
                  <span class="space-name" @click="spaceNext(item)">
                    <i class="sprites-img"></i>
                    {{item.name}}
                  </span>
                </span>
                <!--空间描述-->
                <!--空间类型-->
                <span class="span-type">{{item.categoryName? item.categoryName: '暂无'}}</span>
                <!--空间类型-->
                <!--空间属性-->
                <span class="span-type">
                  {{item.propName?item.propName: "暂无"}}
                </span>
                <!--空间属性-->
                <!--操作-->
                <span class="span-control p-l-30">
                  <div class="control-item">
                    <el-button
                          @click="editSpace(item)"
                          size="small"
                          class="m-r-15"
                          plain>编辑</el-button>
                    <!--<el-button  size="small" plain @click="moveSpace(item)">移动</el-button>-->
                  </div>
                </span>
                <!--操作-->
              </li>
              <li
                class="default-tips"
                v-if="!result.length && !assetsList.length">该空间无相关信息</li>
              <!--空间列表-->
              <!--资产列表-->
              <li class="item-li"
                  v-for="item in assetsList"
                  :key="item.id">
                <!--资产描述-->
                <span class="span-info">
                  <span v-if="isShowBtn">
                      <el-checkbox v-model="item.checked"></el-checkbox>
                  </span>
                  <span class="space-name">
                    <img class="assets-img assets-icon"
                         v-if="item.category === 1"
                         src="../../assets/img/space/assets_1.png"/>
                    <img class="facitiy-img assets-icon" v-else
                         src="../../assets/img/space/assets_2.png"/>
                    {{item.name}}
                </span>
                </span>
                <!--资产描述-->
                <!--资产类型-->
                <span class="span-type">
                {{item.categoryName? item.categoryName: '暂无'}}
                </span>
                <!--资产类型-->
                <!--资产属性-->
                <span class="span-type">
                  {{item.projectSpaceName?item.projectSpaceName: "租户区"}}
                </span>
                <!--资产属性-->
                <!--资产操作-->
                <span class="span-control p-l-30">
                  <div class="control-item">
                    <el-button
                      @click="editAssets(item)"
                      size="small"
                      class="m-r-15"
                      plain>编辑</el-button>
                    <el-button  size="small" plain @click="detailAssets(item)">查看</el-button>
                  </div>
                </span>
                <!--资产操作-->
              </li>
              <!--资产列表-->
            </ul>
          </div>
        </el-scrollbar>
      </div>
    </div>
    <!--移动分组弹窗-->
    <space-move :data="data"
                :projectName="projectName"
                :spaceVisible="dialogVisible"
                @getNodeTree="getNodeTree"
                @handleClose="handleClose">
    </space-move>
    <!--移动分组弹窗end-->
    <!--删除空间弹框-->
    <div class="delBox">
      <el-dialog
          :visible.sync="delVisible"
          width="30%">
          <span class="title"><i class="el-icon-warning icon-warning"></i>是否删除该空间或资产</span>
          <p class="content">空间或资产删除后无法恢复，请确认！</p>
          <span slot="footer" class="dialog-footer">
          <el-button @click="delVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmDelete">确 定</el-button>
          </span>
      </el-dialog>
    </div>
    <!--删除空间弹框-->
	</div>
</template>
<script>
import spaceMove from '../../components/common/dialog-space-move/space-move';
import fileUpload from '../../components/common/file-upload/FileUpload';

export default {
  name: 'space-list',
  components: { spaceMove, fileUpload },
  data() {
    return {
      names: '表格导入',
      assetsList: [], // 资产熟悉
      fileList: [], // 文件數組
      showCheck: true, //
      projectArr: [],
      projectId: this.$store.state.projectId, // 选择项目
      projectName: '', // 项目名字
      isShowBtn: false, // 是否显示 移动，删除按钮
      pid: 0, // 父级空间id
      result: [], // 空间列表
      levelList: [],
      moveSpaceObj: {}, // 要移动的目标空间
      dialogVisible: false, // 弹窗
      activeSpaceId: '', // 移动的空间id
      dialogSpaceList: [], // 弹窗里面的空间层级
      dragFlag: true, // 拖拽标识
      props: {
        label: 'name',
        isLeaf: 'leaf',
      },
      arrCheck: [], // 选择空间的数组集
      delVisible: false, // 删除弹框
      searchName: '', // 名字搜索空
      data: [],
      defaultProps: {
        children: 'spaceSonList',
        name: 'name',
      },
      spaceArrChoose: [], // 选择移动空间的id
      assetsArrChoose: [], // 选择移动资产的id
      spaceIds: [], //
      assetsIds: [], //
      spacePid: null, // 移动父元素的 pid
      router: this.$route,
    };
  },
  methods: {
    /**
    *表格导入成功后 返回res
    *
    * */
    uploadSuc(res) {
      if (res.code === '10000') {
        this.getSpaceList();
      }
    },
    /**
     *获取选定的空间节点 给显示框
     *
     * */
    getNodeTree(val) {
      this.spacePid = val.id;
      this.moveSpaceAssets();
    },
    /**
     *取消按钮
     *
     * */
    handleClose(val) {
      this.dialogVisible = val;
    },
    /**
    *
    *点击列表页的字段 刷新页面
    * */
    handleIndex() {
      this.pid = 0;
      this.levelList = [];
      this.getSpaceList();
    },
    /**
    * 点击空间二维码
    *
    * */
    erWeiCode() {
      if (this.isCheckSpace('space')) {
        this.getIds();
        if (this.assetsIds.length) {
          this.$message.error('资产暂无二维码,请选择空间');
          return false;
        }
        const url = this.api.spaceApi.getErwei;
        this.$http({
          url,
          method: 'post',
          responseType: 'blob',
          data: {
            space_ids: this.spaceIds,
          },
        }).then((res) => {
          const content = res;
          const blob = new Blob([content], { type: 'aplication/zip' });
          const fileName = '空间二维码.zip';
          if ('download' in document.createElement('a')) { // 非IE下载
            const elink = document.createElement('a');
            elink.download = fileName;
            elink.style.display = 'none';
            elink.href = window.URL.createObjectURL(blob);
            elink.target = '_black';
            document.body.appendChild(elink);
            elink.click();
            window.URL.revokeObjectURL(elink.href); // 释放URL 对象
            document.body.removeChild(elink);
          } else { // IE10+下载
            navigator.msSaveBlob(blob, fileName);
          }
        }).catch((error) => {
          console.log(error);
        });
      }
      return true;
    },
    /**
    * 点击新建空间
    * */
    spaceAdd() {
      if (this.$cookie.get('levelList')) {
        this.levelList = JSON.parse(this.$cookie.get('levelList'));
        if (this.levelList.length > 0) {
          this.pid = this.levelList[this.levelList.length - 1].id;
        }
      }
      this.$router.push({ name: 'spaceAdd', params: { id: this.projectId } });
    },
    /**
    *点击空间描述 搜索框
    *
    * */
    getSpaceListByName() {
      this.getSpaceList();
    },
    /**
     * 查询项目列表
     * */
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
          // 获取项目列表 默认选第一个去请求空间列表
          if (!this.projectId) {
            this.projectId = this.projectArr[0].id;
          }
          const item = this.projectArr.filter(obj => obj.id === this.projectId);
          this.projectName = item[0].name;
          this.getSpaceList();
        });
    },
    /**
     * 查询空间列表
     * */
    getSpaceList() {
      this.$http.post(this.api.spaceApi.spaceList,
        {
          projectId: this.projectId,
          pid: this.pid,
          nameLike: this.searchName,
          id: null,
        })
        .then((res) => {
          res.spaces.forEach((item) => {
            this.$set(item, 'checked', false);
          });
          this.result = res.spaces;
          res.assets.forEach((item) => {
            this.$set(item, 'checked', false);
          });
          this.assetsList = res.assets;
        });
    },
    /**
     * 选择项目 查看 空间列表
     *
     * */
    selectProjectList(id) {
      this.projectId = id;
      const item = this.projectArr.filter(obj => obj.id === this.projectId);
      this.projectName = item[0].name;
      this.pid = 0;
      this.levelList = [];
      this.getSpaceList();
    },
    /**
     * 取消模态框
     *
     * */
    cancel() {
      this.dialogVisible = false;
    },
    /**
     *点击移动 弹框出现 空间列表
     *
     * */
    spaceFormat() {
      this.$http.get(this.api.spaceApi.spaceFormat, { params: { projectId: this.projectId,
      } }).then((res) => {
        this.data = res;
      });
    },
    /**
     * 获取空间下一级
     *
     * */
    spaceNext(data) {
      this.pid = data.id;
      this.getLevel(data);
      this.getSpaceList();
    },
    /**
     * 层级面包屑数组
     *
     * */
    getLevel(data) {
      this.levelList
        .push({ name: data.name, id: data.id, level: data.level, projectId: data.projectId });
    },
    /**
     * 点击层级快捷入口
     * 传入index 截取点击后的数组
     * */
    quickSpace(item, index) {
      const levelLength = this.levelList.length;
      if (index === levelLength - 1) {
        return false;
      }
      this.pid = item.id;
      this.levelList.splice(index + 1, (levelLength - 1) - index);
      this.getSpaceList();
      return true;
    },
    /**
     * 返回上一级
     *
     * */
    UpperLevel() {
      this.levelList.splice(this.levelList.length - 1, 1);
      if (this.levelList.length === 0) {
        this.pid = 0;
      } else {
        this.pid = this.levelList[this.levelList.length - 1].id;
      }
      this.getSpaceList();
    },
    /**
    * 判断是否选中 数组集合
    *
    * */
    isCheckSpace(type) {
      this.spaceArrChoose = this.result.filter(obj => obj.checked);
      if (this.spaceArrChoose.length) {
        this.spaceArrChoose.forEach((obj) => {
          this.spaceIds.push(obj.id);
        });
      }
      this.assetsArrChoose = this.assetsList.filter(item => item.checked);
      this.arrCheck = this.spaceArrChoose.concat(this.assetsArrChoose);
      if (this.arrCheck.length <= 0) {
        if (type === 'space') {
          this.$message.error('请选择空间');
        } else {
          this.$message.error('请选择空间或资产设备');
        }
        return false;
      }
      return true;
    },
    /**
     * 点击移动空间
     *
     * */
    moveSpace() {
      if (this.isCheckSpace()) {
        this.dialogVisible = true;
        this.spaceFormat();
      }
    },
    /**
     * 点击删除空间
     *
     * */
    delSpace() {
      if (this.isCheckSpace()) {
        this.delVisible = true;
      }
    },
    /**
    *获取空间 和 资产 混合的集合 获取id
    *
    * */
    getIds() {
      this.spaceIds = [];
      this.assetsIds = [];
      if (this.assetsArrChoose.length) {
        this.assetsArrChoose.forEach((obj) => {
          this.assetsIds.push(obj.id);
        });
      }
      if (this.spaceArrChoose.length) {
        this.spaceArrChoose.forEach((obj) => {
          this.spaceIds.push(obj.id);
        });
      }
    },
    /**
    *批量移动空间和资产
    *
    * */
    moveSpaceAssets() {
      if (!this.spacePid) {
        this.$message.error('请选择移动的空间');
        return false;
      }
      this.getIds();
      this.$http.post(this.api.spaceApi.spaceAssetsMove, {
        asset_ids: this.assetsIds,
        space_ids: this.spaceIds,
        space_pid: this.spacePid,
        updateBy: null,
      }).then((res) => {
        if (res) {
          this.$message.success('移动空间层级成功');
          this.dialogVisible = false;
          this.getSpaceList();
        }
      });
      return true;
    },
    /**
     * 确认删除
     *
     * */
    confirmDelete() {
      if (this.isCheckSpace()) {
        this.getIds();
        this.$http.post(this.api.spaceApi.deleteSpace, {
          asset_ids: this.assetsIds,
          space_ids: this.spaceIds,
        })
          .then((res) => {
            if (res) {
              this.$message.success('删除空间成功');
            }
            this.getSpaceList();
            // this.$store.commit('CHANGE_DELETE_VALUE', false);
            this.delVisible = false;
          });
      }
    },
    /**
     * 开始拖拽 目标层级
     *
     * */
    dragStart(item) {
      this.activeSpaceId = item.id;
    },
    /**
     * 拖拽进入目标元素
     *
     * */
    dragEnter() {
      if (this.dragFlag) {
        this.$message.success('松开鼠标移入上级');
      }
      this.dragFlag = false;
    },
    /**
     * 松开鼠标移动层级
     *
     * */
    dragEnd() {
      this.dragFlag = true;
      let obj = this.levelList[this.levelList.length - 2];
      if (!obj) {
        obj = {
          id: 0,
          level: 1,
        };
      }
      this.$http.post(this.api.spaceApi.saveSpaceDetails,
        {
          id: this.activeSpaceId,
          level: obj.level,
          pid: obj.id,
        },
      )
        .then((res) => {
          if (res) {
            this.$message.success('空间移动到上一级');
            this.pid = obj.id;
            this.levelList.splice(this.levelList.length - 1, 1);
            this.getSpaceList();
          }
        });
    },
    /**
     * 编辑空间
     *
     * */
    editSpace(item) {
      this.$router.push(
        {
          name: 'spaceEdit',
          params: { id: this.projectId, pid: item.id },
        },
      );
    },
    /**
    *查看资产编辑
    *
    * */
    editAssets(item) {
      this.$router.push(
        {
          name: 'assetsEdit',
          params: { id: item.id },
        },
      );
    },
    /**
    *查看资产详情
    *
    * */
    detailAssets(item) {
      const isShow = 1;
      this.$cookie.set('isShowSpace', isShow);
      this.$router.push({
        name: 'assetsDetails',
        params: { id: item.id },
      });
    },
  },
  computed: {
  },
  watch: {
    levelList(val) {
      this.$cookie.set('levelList', JSON.stringify(val));
    },
  },
  mounted() {
    this.getProjectList();
  },
  created() {
    if (this.$cookie.get('levelList')) {
      this.levelList = JSON.parse(this.$cookie.get('levelList'));
      if (this.levelList.length > 0) {
        this.pid = this.levelList[this.levelList.length - 1].id;
        this.projectId = this.levelList[0].projectId;
      }
    }
  },
};
</script>

<style lang="less" type="text/less" scoped>
.space-list{
  .header-body{
    .header-lf{
      display: flex;
      align-items: center;
      height: 70px;
      color: #c5cbd2;
      font-size: 20px;
      min-width: 500px;
      .title-icon{
        cursor: pointer;
      }
      .title{
        display: inline-block;
        color: #c5cbd2!important;
      }
      .last-child{
        color: #2f3747;
        cursor: pointer;
      }
      .text{
        cursor: pointer;
      }
    }
  }
  // 项目
  .panel-content{
  .box-main{
    margin-bottom:20px;
    line-height: 70px;
      .select-box{
        width: 260px;
      }
    }

  }
  .space-content{
    min-height: 500px;
    .span-control{
      width: 25%;
    }
    .span-info{
      padding-left: 20px;
      width: 55%;
    }
    .span-type{
      width: 20%;
      padding-left:0px!important;
    }
    .content-header{
      padding: 12px 0;
      font-size: 14px;
      display: flex;
      color: @auxiliary-color;
      span{
        display: inline-block;
        &:nth-child(2){
          padding-left: 100px;
        }
      }
    }
    .content-list{
      .default-tips{
        justify-content: center;
        color: @secondary-color;
      }
      li{
        font-size: 16px;
        display: flex;
        padding: 12px 0;
        align-items: center;
        background: #ffffff;
        border-bottom: 1px solid #ebeef5;
        &:hover{
          background: #f7f8fd;
        }
        span{
          display: inline-flex;
          align-items: center;
        }
        .space-name{
          cursor: pointer;
          margin-left:10px;
        }
        i{
          display: inline-block;
          width: 36px;
          height: 36px;
          margin-right: 60px;
          .background-position(-10, -385)
        }
      }
    }
  }
  .el-table {
    .space-name{
      cursor: pointer;
      display: flex;
      align-items: center;
      color: @main-color;
      i{
        display: inline-block;
        width: 36px;
        height: 36px;
        margin-right: 60px;
        .background-position(-10, -385)
      }
    }
  }
}
</style>
