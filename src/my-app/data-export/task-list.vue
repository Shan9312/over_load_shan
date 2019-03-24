<template>
   <div class="task-list">
    <!--头部面包屑切换-->
    <div class="task-tab">
    <!--标签头-->
      <div class="header-tab">
        <div class="item-tab"
             :class="[{'active-tab': child.id === activeTabIndex}]"
             v-for="child in tabArr"
             @click="handleChangePage(child.id)"
             :key="child.id">
          {{child.name}}
        </div>
      </div>
      <!--右侧搜索按钮-->
      <div class="box-right">
        <el-select v-model="projectId" placeholder="请选择" @change="selectProjectList">
          <el-option
            v-for="item in projectArr"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </div>
    </div>
    <!--头部面包屑切换 end-->
     <div v-content class="task-content" >
       <transition name="slider" mode="out-in">
         <div v-if="activeTabIndex === 1" key="tab1">
           <!--搜索 4个-->
           <div class="search-box">
             <div class="search-box-left">
               <div class="item">
                 <span class="title">时间区间</span>
                 <el-date-picker
                   v-model="InterimTimeList"
                   type="daterange"
                   :editable="false"
                   :clearable="false"
                   value-format="yyyy-MM-dd"
                   range-separator="至"
                   start-placeholder="开始日期"
                   end-placeholder="结束日期"
                   @change="InterimTimeListChange"
                 >
                 </el-date-picker>
                 <el-radio-group v-model="searchInterimForm.queryType">
                   <el-radio label="1">按发布时间</el-radio>
                   <el-radio label="2">按完成时间</el-radio>
                 </el-radio-group>
               </div>
               <div class="item">
                 <span class="title">类型、标签筛选</span>
                 <el-select
                   v-model="searchInterimForm.bizTaskTypeId"
                   placeholder="请选择"
                   @change="getBizTaskTypeDetails"
                   style="width: 126px">
                   <el-option
                     v-for="item in TaskTypes"
                     :key="item.id"
                     :label="item.name"
                     :value="item.id">
                   </el-option>
                 </el-select>
                 <el-select
                   v-model="searchInterimForm.tagId"
                   placeholder="请选择"
                   style="width:100px">
                   <el-option
                     v-for="item in TaskTypeDetails"
                     :key="item.id"
                     :label="item.name"
                     :value="item.id">
                   </el-option>
                 </el-select>
               </div>
             </div>
             <div class="search-box-right">
               <el-input v-model="searchInterimFormValue" placeholder="请输入内容"></el-input>
               <el-select
                 v-model="searchInterimType"
                 placeholder="请选择"
                 style="min-width: 100px;width: 100px">
                 <el-option
                   v-for="item in searchType"
                   :key="item.value"
                   :label="item.name"
                   :value="item.value">
                 </el-option>
               </el-select>
               <el-button type="primary" size="medium" @click="handleInterimClick">查询</el-button>
             </div>
           </div>
           <div class="filter-box">
             <div class="item">
               <span class="title">执行部门</span>
               <el-checkbox-group
                 v-model="searchInterimForm.deptIds"
                 @change="getTemporaryList()"
               >
                 <el-checkbox
                   v-for="x in deptList"
                   :key="x.id"
                   :label="x.id">
                   {{x.name}}
                 </el-checkbox>
               </el-checkbox-group>
             </div>
             <div class="item">
               <span class="title">状态</span>
               <el-checkbox-group
                 v-model="InterimFormStatusList"
                 @change="handleInterimStatusChange"
               >
                 <el-checkbox
                   v-for="x in interimStatusList"
                   :key="x.key"
                   :label="x.key">
                   {{x.name}}
                 </el-checkbox>
               </el-checkbox-group>
             </div>
           </div>
           <!--搜索 end-->
           <!--列表-->
           <el-scrollbar tag="div" v-table>
             <el-table
               :data="interimData.list"
             >
               <el-table-column
                 prop="temporaryStatus"
                 class-name="main"
                 label="状态">
                 <template slot-scope="scope">
                   <status-ui :num="Number(scope.row.temporaryStatus)"></status-ui>
                 </template>
               </el-table-column>
               <el-table-column
                 prop="userName"
                 class-name="main"
                 show-overflow-tooltip
                 label="发布人">
               </el-table-column>
               <el-table-column
                 prop="temporaryContent"
                 class-name="main"
                 width="200"
                 show-overflow-tooltip
                 label="任务详情">
               </el-table-column>
               <el-table-column
                 prop="userListName"
                 class-name="main"
                 show-overflow-tooltip
                 label="执行人">
               </el-table-column>
               <el-table-column
                 prop="bizTaskTypeName"
                 show-overflow-tooltip
                 label="任务类型">
               </el-table-column>
               <el-table-column
                 prop="positionListName"
                 show-overflow-tooltip
                 label="负责人职能">
               </el-table-column>
               <el-table-column
                 prop="temporaryPlaceName"
                 show-overflow-tooltip
                 label="任务地址">
               </el-table-column>
               <el-table-column
                 prop="belongCreateDt"
                 width="180"
                 label="创建时间">
                 <template slot-scope="scope">
                   {{scope.row.belongCreateDt?
                   $day(Number(scope.row.belongCreateDt)).format('YYYY/MM/DD HH:mm')
                   :''}}
                 </template>
               </el-table-column>
               <el-table-column
                 prop="belongCompleteDt"
                 width="180"
                 label="完成时间">
                 <template slot-scope="scope">
                   {{scope.row.belongCompleteDt?
                   $day(Number(scope.row.belongCompleteDt)).format('YYYY/MM/DD HH:mm')
                   :''}}
                 </template>
               </el-table-column>
               <el-table-column
                 label="操作">
                 <template slot-scope="scope">
                   <div class="control-item">
                     <router-link :to ="{ name:'taskDetail',
                  path:'/client/tracker/task/task-detail',
                  params: {id: scope.row.id, projectId: projectId} }">
                       <el-button  size="small" plain >查看</el-button>
                     </router-link>
                   </div>
                 </template>
               </el-table-column>
             </el-table>
           </el-scrollbar>
           <div class="pagination">
             <el-pagination
               background
               layout="prev, pager, next, total"
               :page-size="interimData.pageSize"
               :current-page="interimData.pageNum"
               @current-change="handleInterimCurrentChange"
               :total="interimData.total">
             </el-pagination>
             <el-button type="primary" size="medium" @click="exlTemporaryList">导出筛选后所有任务</el-button>
           </div>
           <!--列表 end-->
         </div>
         <div v-else key="tab2">
           <!--搜索 4个-->
           <div class="search-box">
             <div class="search-box-left">
               <div class="item">
                 <span class="title">任务类型</span>
                 <el-radio-group
                   v-model="basicTaskTypes"
                   @change="DailyBasicTaskTypesChange"
                 >
                   <el-radio-button :label="3">路径岗任务</el-radio-button>
                   <el-radio-button :label="4">固定岗任务</el-radio-button>
                 </el-radio-group>
                 <span class="title">任务周期</span>
                 <el-radio-group
                   v-model="searchDailyForm.routePeriod"
                   :disabled="basicTaskTypes != 3">
                   <el-radio-button label="1">每日任务</el-radio-button>
                   <el-radio-button label="2">每周任务</el-radio-button>
                   <el-radio-button label="3">每月任务</el-radio-button>
                 </el-radio-group>
               </div>
               <div class="item">
                 <span class="title">时间区间</span>
                 <date-picker
                   v-model="DailyTimeList"
                   @change="DailyTimeListChange"
                   :type="basicTaskTypes == 3 ? searchDailyForm.routePeriod : '1'"></date-picker>
                 <el-button type="primary" size="medium" @click="handleDailyClick">查询</el-button>
               </div>
             </div>
           </div>
           <div class="filter-box">
             <div class="item">
               <span class="title">执行人部门</span>
               <el-checkbox-group v-model="searchDailyForm.deptIds">
                 <el-checkbox
                   v-for="item in dailyDeptList"
                   :label="item.id"
                   :key="item.id"
                   @change="getDailyList()"
                 >
                   {{item.name}}
                 </el-checkbox>
               </el-checkbox-group>
             </div>
             <div class="item">
               <span class="title">执行人</span>
               <el-checkbox-group v-model="searchDailyForm.assignUserIds">
                 <el-checkbox
                   v-for="item in dailyDeptUserList"
                   :label="item.id"
                   :key="item.id"
                   @change="getDailyList()"
                 >
                   {{item.name}}
                 </el-checkbox>
               </el-checkbox-group>
             </div>
           </div>
           <!--搜索 end-->
           <!--列表-->
           <el-scrollbar tag="div" v-table>
             <el-table
               :data="dailyData.list"
             >
               <el-table-column
                 class-name="main"
                 label="功能类型">
                 <template slot-scope="scope">
                   {{basicTaskTypes === 3 ? '路径岗巡视' : '固定岗巡视'}}
                 </template>
               </el-table-column>
               <el-table-column
                 prop="userListName"
                 class-name="main"
                 show-overflow-tooltip
                 label="执行人">
               </el-table-column>
               <el-table-column
                 class-name="main"
                 label="完成次数">
                 <template slot-scope="scope">
                   {{scope.row.routePatrolCountActual || scope.row.staticDutyMinuteActual || ''}}
                 </template>
               </el-table-column>
               <el-table-column
                 label="任务名称">
                 <template slot-scope="scope">
                   {{scope.row.routeName || scope.row.staticName || ''}}
                 </template>
               </el-table-column>
               <el-table-column
                 prop="bizTaskTypeName"
                 label="任务类型">
               </el-table-column>
               <el-table-column
                 prop="positionListName"
                 show-overflow-tooltip
                 label="职能">
               </el-table-column>
               <el-table-column
                 show-overflow-tooltip
                 label="任务描述">
                 <template slot-scope="scope">
                   {{scope.row.routeContent || scope.row.staticContent || ''}}
                 </template>
               </el-table-column>
               <el-table-column
                 prop="updateAt"
                 width="180"
                 label="更新时间">
                 <template slot-scope="scope">
                   {{scope.row.updateAt?
                   $day(Number(scope.row.updateAt)).format('YYYY/MM/DD HH:mm')
                   :''}}
                 </template>
               </el-table-column>
               <el-table-column
                 label="操作">
                 <template slot-scope="scope">
                   <div class="control-item">
                     <router-link :to ="{ name:'dailyTaskDetails',
                  path:'/client/tracker/task/daily-task-details',
                  params: {
                         id: scope.row.id,
                         projectId: projectId,
                         type: scope.row.basicTaskType
                     } }">
                       <el-button  size="small" plain >查看</el-button>
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
               :page-size="dailyData.pageSize"
               @current-change="handleDailyCurrentChange"
               :total="dailyData.total">
             </el-pagination>
             <el-button type="primary" size="medium">导出筛选后所有任务</el-button>
           </div>
           <!--列表 end-->
         </div>
       </transition>
     </div>
  </div>
</template>

<script>

import statusUi from '@/components/ui/task-btn-ui';
import DatePicker from '@/components/common/datepicker/data-picker-rang';

export default {
  name: 'export-task-list',
  components: { statusUi, DatePicker },
  data() {
    return {
      // 页面头部 tab 标题
      currentPage: 1, // 分页
      tabArr: [
        { name: '临时任务导出', id: 1 },
        { name: '日常任务导出', id: 2 },
      ],
      activeTabIndex: 1, // tab
      // 任务状态
      statueList: [
        { name: '未派工', key: '1' },
        { name: '处理中', key: '2' },
        { name: '特殊状态', key: '3' },
        { name: '待反馈', key: '4' },
        { name: '已完成', key: '5' },
      ],
      // 时间区间
      InterimTimeList: [],
      DailyTimeList: [],
      // 类型
      TaskTypes: [],
      // 类型详情
      TaskTypeDetails: [],
      radio: ['1'],
      // 临时任务检索类型
      searchType: [
        { name: '报修人', value: 'createName' },
        { name: '执行人', value: 'executiveName' },
        { name: '负责人', value: 'positionName' },
        { name: '空间', value: 'spaceName' },
      ],
      // 临时任务检索类型
      searchInterimType: 'createName',
      // 临时任务检索值
      searchInterimFormValue: '',
      // 临时任务状态
      InterimFormStatusList: [],
      // 临时任务查询Form
      searchInterimForm: {
        bizTaskTypeId: '', // ICON类型
        tagId: '', // 标签类型
        // createName: '', // 报修人名字
        // executiveName: '', // 执行人名字
        // positionName: '', // 职能名
        // spaceName: '', // 空间名
        dtStart: '', // 开始时间
        dtEnd: '', // 结束时间
        queryType: '2', // 1查询产生任务，2查询完成任务，null都查
        deptIds: [], // 按部门查询
        statusList: [], // 按状态查询
      },
      // 临时任务查询结果
      interimData: { list: [] },
      // 临时任务执行部门列表
      deptList: [],
      // 状态列表
      interimStatusList: [],
      // 日常任务查询Form
      searchDailyForm: {
        assignUserIds: [],
        deptIds: [],
        basicTaskTypes: [4], // 任务基本型：1临时任务，2报事，3路径巡视，4巡视固定岗，5计划任务 ,
        dtEnd: '',
        dtStart: '',
        queryType: 1,
        routePeriod: '',
      },
      basicTaskTypes: 4,
      // 日常任务执行部门列表
      dailyDeptList: [],
      // 日常任务执行人列表
      dailyDeptUserList: [],
      projectId: null, // 选择项目
      projectArr: [], // 项目列表
      // 日常任务查询结果
      dailyData: { list: [] },
    };
  },
  methods: {
    /*
    * 时间选择
    * */
    InterimTimeListChange(val) {
      if (val && val.length > 0) {
        this.searchInterimForm.dtStart = val[0];
        this.searchInterimForm.dtEnd = val[1];
      } else {
        this.searchInterimForm.dtStart = '';
        this.searchInterimForm.dtEnd = '';
      }
    },
    DailyTimeListChange(val) {
      if (val && val.length > 0) {
        this.searchDailyForm.dtStart = val[0] || '';
        this.searchDailyForm.dtEnd = val[1] || '';
      } else {
        this.searchDailyForm.dtStart = '';
        this.searchDailyForm.dtEnd = '';
      }
    },
    DailyBasicTaskTypesChange(val) {
      this.searchDailyForm.basicTaskTypes = [val];
      if (Number(val) === 4) this.searchDailyForm.routePeriod = '';
    },
    /*
    * 获取类型
    *
    * */
    getBizTaskType() {
      this.$http.post(this.api.exportApi.getBizTaskType, {
        basicTaskType: 1,
        projectId: this.projectId,
      })
        .then((res) => {
          res.list.unshift({ id: '', name: '全部' });
          this.TaskTypes = res.list;
        });
    },
    /*
     * 获取类型详情
     *
     * */
    getBizTaskTypeDetails() {
      this.searchInterimForm.tagId = '';
      if (this.searchInterimForm.bizTaskTypeId === '') {
        this.TaskTypeDetails = [];
        return;
      }
      this.$http.get(this.api.exportApi.getBizTaskTypeDetails, {
        params: {
          id: this.searchInterimForm.bizTaskTypeId,
        },
      })
        .then((res) => {
          this.TaskTypeDetails = res.projectTags;
          this.TaskTypeDetails.unshift({ id: '', name: '全部' });
        });
    },
    /**
     * 选择项目
     *
     * */
    selectProjectList(val) {
      this.projectId = val;
      this.searchInterimForm.tagId = '';
      this.searchInterimForm.bizTaskTypeId = '';
      this.TaskTypeDetails = [];
      this.InterimFormStatusList = [];
      this.searchInterimForm.statusList = [];
      this.searchInterimForm.deptIds = [];
      this.getBizTaskType();
      this.getOptionsList();
      this.getTemporaryList(); //  临时任务查询
    },
    /*
    * 临时任务筛选查询
    *
    * */
    getOptionsList() {
      this.$http.post(this.api.exportApi.getOptionsList, {
        ...this.searchInterimForm,
        [this.searchInterimType]: this.searchInterimFormValue,
        projectId: this.projectId,
      })
        .then((res) => {
          this.deptList = res.deptInfo;
          const sln = [];
          const sl = [];
          res.statusList.forEach((n) => {
            /* eslint-disable*/
            const aaa = this.statueList.find((m) => {
              return m.key.indexOf(n) > -1;
            });
            if (sln.indexOf(aaa.key) < 0) {
              sln.push(aaa.key);
              sl.push(aaa);
            }
          });
          this.interimStatusList = sl;
        });
    },
    /*
    * 临时任务查询
    *
    * */
    getTemporaryList(pageNo = 1) {
      this.$http.post(this.api.exportApi.getTemporaryList, {
        ...this.searchInterimForm,
        [this.searchInterimType]: this.searchInterimFormValue,
        projectId: this.projectId,
        pageIndex: pageNo,
        pageSize: 7,
      })
        .then((res) => {
          this.interimData = res;
          this.interimData.list.forEach((n) => {
            const un = [];
            n.userList.forEach((m) => {
              un.push(m.userName);
            });
            this.$set(n, 'userListName', un.join(','));
            const po = [];
            n.positionList.forEach((m) => {
              po.push(m.positionName);
            });
            this.$set(n, 'positionListName', po.join(','));
          });
        });
    },
    /*
     * 临时任务筛选查询
     *
     * */
    getDailyOptionsList() {
      this.$http.post(this.api.exportApi.getDailyOptionsList, {
        ...this.searchDailyForm,
        projectId: this.projectId,
      })
        .then((res) => {
          this.dailyDeptList = res.deptList;
          this.dailyDeptUserList = res.userList;
        });
    },
    /*
    * 日常任务查询
    *
    * */
    getDailyList(pageNo = 1) {
      this.$http.post(this.api.exportApi.getDailyList, {
        ...this.searchDailyForm,
        projectId: this.projectId,
        pageIndex: pageNo,
        pageSize: 7,
      })
        .then((res) => {
          this.dailyData = res;
          this.dailyData.list.forEach((n) => {
            const un = [];
            n.userList.forEach((m) => {
              un.push(m.userName);
            });
            this.$set(n, 'userListName', un.join(','));
            const po = [];
            n.positionList.forEach((m) => {
              po.push(m.positionName);
            });
            this.$set(n, 'positionListName', po.join(','));
          });
        });
    },
    /*
    * 临时任务导出
    *
    * */
    exlTemporaryList() {
      this.$http.post(this.api.exportApi.exlTemporaryList, {
        ...this.searchInterimForm,
        [this.searchInterimType]: this.searchInterimFormValue,
        projectId: this.projectId,
      }, {
        responseType: 'blob',
      })
        .then((res) => {
          if (window.navigator.msSaveOrOpenBlob) {
            navigator.msSaveBlob(res.blobs, res.name)
          } else {
            const a = document.createElement('a');
            a.download = res.name;
            const url = URL.createObjectURL(res.blobs);
            a.href = url;
            document.body.appendChild(a);
            a.click();
            URL.revokeObjectURL(url);
            document.body.removeChild(a);
          }
        });
    },
    /**
     * 切换分页
     *
     * */
    handleInterimCurrentChange(val) {
      this.getTemporaryList(val);
    },
    handleDailyCurrentChange(val) {
      this.getDailyList(val);
    },
    /**
     * status Change
     *
     * */
    handleInterimStatusChange(val) {
      const arr = [];
      val.forEach((n) => {
        if (n === '2-4') {
          arr.push('2');
          arr.push('4');
        } else {
          arr.push(n);
        }
      });
      this.searchInterimForm.statusList = arr;
      this.getTemporaryList();
    },
    /**
     * 点击查询
     *
     * */
    handleInterimClick() {
      this.InterimFormStatusList = [];
      this.searchInterimForm.statusList = [];
      this.searchInterimForm.deptIds = [];
      this.getOptionsList();
      this.getTemporaryList();
    },
    handleDailyClick() {
      this.dailyDeptList = [];
      this.dailyDeptUserList = [];
      this.searchDailyForm.assignUserIds = [];
      this.searchDailyForm.deptIds = [];
      this.getDailyOptionsList();
      this.getDailyList();
    },
    /**
     *查询 代办任务 和我相关 历史任务 列表
     * 根据传入的 activeTab = 1,2,3 分别取获取对应的列表数据
     * */
    handleChangePage(val) {
      this.activeTabIndex = val;
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
          this.projectId = res.list[0].id;
          this.getBizTaskType();
          this.getOptionsList();
          this.getTemporaryList(); //  临时任务查询
          this.getDailyOptionsList();
          this.getDailyList();
        });
    },
  },
  mounted() {
    this.InterimTimeList = this.getNewDate;
    this.searchInterimForm.dtStart = this.InterimTimeList[0];
    this.searchInterimForm.dtEnd = this.InterimTimeList[1];
    /*this.DailyTimeList = [this.$day(this.getNewDate[0]).valueOf(), this.$day(this.getNewDate[1]).valueOf()];
    this.searchDailyForm.dtStart = this.DailyTimeList[0];
    this.searchDailyForm.dtEnd = this.DailyTimeList[1];*/
    this.getProjectList(); // 查询项目列表
  },
  computed: {
    SearchSelectArr() {
      let arr = [];
      if (this.activeTabIndex === 4) {
        // 报事搜索
        arr = [{ value: 1, name: '事件名称' }];
      } else {
        // 任务 和我相关 历史任务搜索
        arr = [{ value: 1, name: '任务编号' }, { value: 2, name: '任务描述' }, { value: 3, name: '报事人' }, { value: 4, name: '任务地址' }];
      }
      return arr;
    },
    getNewDate() {
      const arr = [];
      const n = new Date();
      arr.push(`${n.getFullYear() - 1}-01-01`);
      arr.push(`${n.getFullYear()}-${n.getMonth() + 1}-${n.getDate()}`);
      return arr;
    },
  },
};
</script>

<style lang="less" type="text/less" scoped>
  .search-box{
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    border-bottom: 1px solid #f3f6f9;
    margin: 0 -30px;
    padding:10px 30px 30px;
    .search-box-left{
      .item{
        display: flex;
        align-items: center;
        &+.item{
          margin-top: 30px;
        }
        .title{
          display: block;
          white-space: nowrap;
          margin-right: 30px;
          color: #7b8aa4;
          font-size: 14px;
        }
        >*+.title{
          margin-left: 80px;
        }
        >*+.el-checkbox-group,>.el-date-editor+.el-radio-group{
          margin-left: 30px;
        }
        .el-select+.el-select{
          margin-left: 10px;
        }
        >*+button{
          margin-left: 20px;
        }
      }
    }
    .search-box-right{
      display: flex;
      align-items: center;
      >*+*{
        margin-left: 10px;
      }
    }
  }
  .filter-box{
    padding:20px 0 10px;
    .item{
      display: flex;
      align-items: center;
      &+.item{
        margin-top: 8px;
      }
      .el-checkbox-group{
        flex-wrap: wrap;
        height: auto;
        .el-checkbox{
          padding:8px 10px;
          margin-left: 0;
        }
      }
      .title{
        display: block;
        white-space: nowrap;
        margin-right: 30px;
        color: #7b8aa4;
        font-size: 14px;
      }
    }
  }
  .task-list{
    .task-tab{
      height: 50px;
      position: relative;
      .header-tab{
        height: 40px;
        line-height: 40px;
        position: absolute;
        bottom: 0;
        width: 800px;
        display: flex;
        align-items: center;
        justify-content: left;
        .item-tab{
          width: 160px;
          height: 0;
          border-bottom: 40px solid #ececed;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          text-align: center;
          cursor: pointer;
          margin-left: -5px;
          &:first-child{
            margin-left: 0;
          }
        }
        .active-tab{
          border-bottom: 40px solid #fff;
          z-index: 1000;
        }
      }
    }
  }
  .box-right{
    float: right;
    display: flex;
    justify-content: space-between;
  }
  .pagination{
    display: flex;
    align-items: center;
    .el-pagination{
      flex: 1;
    }
  }
</style>
