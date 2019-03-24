<template>
  <div class="assets-add tables  " >
    <panelContentHeader>
    </panelContentHeader>
    <div class="edit-content">
      <el-form :model="assetsForm"
               :rules="rules"
               ref="assetsFormRef"
               label-width="120px"
               key="Form1"
               class="assetsAddForm">
        <el-row>
          <div v-content-title>基本信息</div>
          <el-col :span="24" class="upload-item-icon">
            <i class="el-icon-plus" @click="uploadImg(uploadProps[0])"></i>
            <el-form-item label="资产图片">
              <upload
                :ref="uploadProps[0]"
                @getUrl="uploadLogo"
                :list="logoList"
                :limit="3"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="basic-panel">
          <el-col :span="8">
            <el-form-item label="资产名" prop="name">
              <el-input  v-model="assetsForm.name" ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="资产编号" >
              <el-input  v-model="assetCode"  ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="资产类型" prop="category">
              <el-select v-model="assetsForm.category"
                         filterable
                         placeholder="请选项目名称">
                <el-option v-for="(child,index) in cateList"
                           :key="index"
                           :label="child.name" :value="child.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="basic-panel">
          <el-col :span="8">
            <el-form-item label="规格型号" prop="spec">
              <el-input  v-model="assetsForm.spec" ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="生产厂家">
              <el-input  v-model="assetsForm.factory" ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="购买日期">
              <el-date-picker
                v-model="assetsForm.buyTime"
                type="date"
                format="yyyy 年 MM 月 dd 日"
                value-format="timestamp"
                placeholder="购买日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="basic-panel">
          <el-col :span="8">
            <el-form-item label="所属项目" prop="projectId">
              <el-select v-model="assetsForm.projectId"
                         filterable
                         @change="selectProject(assetsForm.projectId)"
                         placeholder="请选项目名称">
                <el-option v-for="(child,index) in  projectList"
                           :key="index"
                           :label="child.name" :value="child.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              class="inline-form-choice" label="负责人职能" >
              <el-input disabled v-model="assetsForm.positionName" type="text"></el-input>
              <el-button size="mini"  @click="getDeptTreeList(assetsForm.projectId)">选择 </el-button>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="使用年限" prop="maxYear">
              <el-input  v-model="assetsForm.maxYear" ></el-input>
              <span class="year">年</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16">
            <el-form-item label="所属空间" prop="projectSpaceName" class="inline-form-choice">
              <el-input v-model="assetsForm.projectSpaceName" type="text" disabled></el-input>
              <el-button size="mini" @click="moveSpace">选择</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <div v-content-title>
            巡视内容
          </div>
          <el-row>
            <el-col :span="16">
              <el-form-item label="内容信息">
                <el-input type="textarea"
                          placeholder="请输入巡视内容"
                          :rows="5"
                          v-model="assetsForm.patrolContent"></el-input>
                <span class="notice">注: 多条巡视内容请用 & 隔开</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-row>
        <el-row>
          <div v-content-title>
            备注
          </div>
        </el-row>
        <el-row class="info-item">
          <el-col :span="16">
            <el-form-item label="备注信息" prop="remark">
              <el-input
                type="textarea"
                :rows="5"
                placeholder="请输入备注信息"
                v-model="assetsForm.remark">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!--底部确定取消-->
    <div class="fixed-control">
      <el-button plain @click="$cancel" >取消</el-button>
      <el-button  type="primary" @click="submitForm">确定</el-button>
    </div>
    <!--移动分组弹窗-->
    <space-move :data="data"
                :projectName="assetsForm.projectName"
                :spaceVisible="spaceVisible"
                @getNodeTree="getNodeTree"
                @handleClose="handleClose">
    </space-move>
    <!--移动分组弹窗end-->
    <!--选择职能弹窗-->
    <el-dialog
      width="35%"
      :visible="visible"
      title="选择职能">
      <div class="dialog-content m-t-30 p-l-25 p-r-25">
        <div class="choose-position">
          <el-scrollbar tag="div" style="height: 350px">
            <infinite-collapse
              :singleElection="true"
              :data="deptTree"
              v-if="visible"
              :selectedPosition="selectedPosition"
              :checkedList ="checkedList"
              @getPositionItem="getPosition">
            </infinite-collapse>
            <div v-if="!deptTree.length" style="font-size: 24px;text-align: center;">暂无数据</div>
          </el-scrollbar>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 认</el-button>
      </span>
    </el-dialog>
    <!--选择职能弹窗 end-->
  </div>
</template>

<script>
import { positiveInteger, nameEn, englishAndNum } from '../../libs/plugins/validate';
import appConfig from '../../appConfig'; // 接口配置文件
import upload from '../../components/common/upload/upload';
import spaceMove from '../../components/common/dialog-space-move/space-move';
import funcDialog from '../../components/common/func-dialog/func-dialog';
import infiniteCollapse from '../../components/common/func-dialog/infinite-collapse/infinite-collapse';


export default {
  name: 'assets-add',
  components: { upload, spaceMove, funcDialog, infiniteCollapse },
  data() {
    return {
      checkedList: [], // 选中的节点
      selectedPosition: [], // 职能
      AssetGroupQuery: {
        name: '',
        lineIds: '',
      }, // 分组数组
      visible: false, // 是否显示 部门弹框
      deptTree: [], // 部门组织架构
      assetsForm: {
        projectSpaceId: '', // 元空间id
        buyTime: '', // 购买时间
        projectSpaceName: '', // 空间路径
        positionName: '', // 职能
        positionId: '', // 职能id
        projectName: '', // 项目名称
        spec: '', // 规格型号
        pics: '', // 图片
        assetCode: '', // 资产编号
        macAddress: '', // 资产位置的位址
        minor: '', // 蓝牙
        major: '', // 蓝牙
        projectId: '', // 所属项目
        businessLine: '', // 条线
        category: '', // 资产分类 1：设备，2：设施，3：蓝牙点位 ,
        fault: '', // 故障
        factory: '', // 生产厂家
        patrolContent: '', // 巡视内容
        id: this.$route.params.id,
      }, // 资产表单信息
      assetsList: [], // 资产列表
      spaceList: [], // 空间列表
      pathList: [], // 路径列表
      lineList: [], // 条线列表
      projectList: [], // 项目列表
      groupList: [], // 分组列表
      cateList: [
        { id: '1', name: '设备' },
        { id: '2', name: '设施' },
      ], // 资产设备类型
      rules: {
        related: [
          { required: true, message: '不能为空', trigger: 'blur' },
        ],
        name: [{ required: true, message: '不能为空', trigger: 'blur' }],
        category: [{ required: true, message: '不能为空', trigger: 'change' }],
        spec: [{ validator: englishAndNum, message: '请输入英文或数字', trigger: 'blur' }],
        groupId: [{ required: true, message: '不能为空', trigger: 'change' }],
        projectId: [{ required: true, message: '不能为空', trigger: 'change' }],
        projectSpaceName: [{ required: true, message: '不能为空', trigger: 'change' }],
        positionName: [{ required: false, message: '不能为空', trigger: 'change' }],
        businessLine: [{ required: true, message: '不能为空', trigger: 'change' }],
        maxYear: [{ validator: positiveInteger, trigger: 'change' }],
        assetCode: [{ required: true, validator: nameEn, trigger: 'change' }],
        macAddress: [{ required: true, validator: nameEn, trigger: 'change' }],
        major: [{ required: true, validator: nameEn, trigger: 'change' }],
        minor: [{ required: true, validator: nameEn, trigger: 'change' }],
        lineIds: [{ required: true, message: '不能为空', trigger: 'change' }],
        remark: [
          { message: '请输入备注信息', trigger: 'blur' },
          { min: 1, max: 128, message: '备注信息最多128字符' },
        ],
      }, // 列表规则
      uploadProps: [this.$uuid()],
      dialogVisible: false, // logo图片弹框
      dialogImageUrl: '', // logo图片地址
      dialogVisibleImg: false,
      fileList: [], // logo图片 列表
      spaceIdArr: [], // 获取所有空间id ,查询路径
      flag: false,
      logoList: [], // logo图片 列表
      spaceVisible: false, // 空间移动的弹窗
      data: [], // 空间信息
    };
  },
  methods: {
    /**
     *
     * 遍历职能树 找到positionList
     * */
    depListHasPosition(id, arr) {
      if (arr.length) {
        arr.forEach((child) => {
          if (child.positionList && child.positionList.length > 0) {
            child.positionList.forEach((son) => {
              if (son.id === id) {
                this.$set(son, 'checked', true);
              }
            });
          }
          if (child.deptSonList && child.deptSonList.length > 0) {
            child.deptSonList.forEach((obj) => {
              if (obj.positionList && obj.positionList.length > 0) {
                obj.positionList.forEach((item) => {
                  if (item.id === id) {
                    this.$set(item, 'checked', true);
                    console.log('item');
                  }
                });
                this.depListHasPosition(id, obj.positionList);
              }
              if (obj.deptSonList && obj.deptSonList.length > 0) {
                this.depListHasPosition(id, obj.deptSonList);
              }
            });
          }
        });
      }
    },
    /**
     * 如果选择的职能 和职能树 进行对比, 选择的职能让 checked= true;
     *
     * */
    isCheckedPosition(id) {
      this.depListHasPosition(id, this.deptTree);
    },
    /**
     * 获得选中的职能
     *
     * */
    getPosition(data) {
      this.positionList = data;
    },
    /**
    * 根据空间的id ,查找路径名称
    *
    * */
    searchPathNameBySpaceId(id) {
      this.$http.post(this.api.spaceApi.pathBatch, id).then((res) => {
        const arr = res[0].pnames;
        const pathName = arr.reverse().join('/');
        this.assetsForm.projectSpaceName = `${pathName}/${this.assetsForm.projectSpaceName}`;
      });
    },
    /**
     *查询资产详情
     *
     * */
    getAssetsDetails() {
      this.$http.get(this.api.assetsApi.getAssetsDetails, {
        params: {
          assetId: this.assetsForm.id,
        },
      }).then((res) => {
        res.pics = res.pics[0];
        // 处理logo
        if (res.pics) {
          this.logoList.push({ url: res.pics });
        }
        const spaceId = [];
        spaceId.push(res.projectSpaceId);
        this.assetsForm = JSON.parse(JSON.stringify(res));
        // 若已存在职能的id 就获取数据 确定节点的状态
        this.searchPathNameBySpaceId(spaceId);
      });
    },
    /**
     *查询部门结构
     *
     * */
    getDeptTreeList(id) {
      if (!id) {
        this.$message.error('请选择所属项目');
        return false;
      }
      this.visible = true;
      this.$http.get(this.api.operationApi.companyMsg, {
        params: {
          projectId: id,
          positionValid: '',
          deptValid: '',
        },
      }).then((res) => {
        this.deptTree = res;
        // this.eachData(this.deptTree);
        // 若已存在职能的id 就获取数据 确定节点的状态
        if (this.assetsForm.positionId) {
          this.isCheckedPosition(this.assetsForm.positionId);
        }
      });
      return true;
    },
    /**
     *
     * 职能弹框点击确定
     * */
    confirm() {
      this.visible = false;
      this.assetsForm.positionName = this.positionList ? this.positionList.name : '';
      this.assetsForm.positionId = this.positionList ? this.positionList.id : '';
    },
    /**
     *弹框事件
     *
     * */
    changeClose(val) {
      this.visible = val;
    },
    /**
     *获取选定的空间节点 给显示框
     *
     * */
    getNodeTree(val) {
      this.assetsForm.projectSpaceName = val.path;
      this.assetsForm.projectSpaceId = val.id;
      this.spaceVisible = false;
    },
    /**
     *取消按钮
     *
     * */
    handleClose(val) {
      this.spaceVisible = val;
    },
    /**
     * 获取上传logo返回的地址
     *
     * */
    uploadLogo(res) {
      this.assetsForm.pics = res[0] ? res[0] : '';
    },
    /**
     *点击 + 资产新增图片
     *
     * */
    uploadImg(name) {
      this.$refs[name].upload();
    },
    handleExceed() {
      this.$message.warning('图片最大数量为3个');
    },
    /**
     * 上传成功
     *
     * */
    uploadSuccess(res) {
      const path = `${appConfig.API.BASE_URL}/file/download?path=${res.data.path}&name=${res.data.fileName}`; // 根据返回的地址拼接绝对地址
      this.assetsForm.pics.push(path);
    },
    /**
     * 移除图片地址
     *
     * */
    handleRemove(file) {
      this.assetsForm.pics.forEach((item, index) => {
        if (item === file.url) {
          this.assetsForm.pics.splice(index, 1);
        }
      });
    },
    /**
     * 查询条线列表
     *
     * */
    getLineList() {
      this.$http.get(this.api.dictionaryApi.getLineList)
        .then((res) => {
          this.lineList = res;
        });
    },
    /**
     *查询项目列表
     *
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
          this.projectList = res.list;
        });
    },
    /**
     * 点击移动空间
     *
     * */
    moveSpace() {
      if (!this.assetsForm.projectId) {
        this.$message.error('请先选择项目');
        return false;
      }
      this.spaceVisible = true;
      this.spaceFormat();
      return true;
    },
    /**
     *点击移动 弹框出现 空间列表
     *
     * */
    spaceFormat() {
      this.$http.get(this.api.spaceApi.spaceFormat, { params:
          { projectId: this.assetsForm.projectId } }).then((res) => {
        this.data = JSON.parse(JSON.stringify(res));
        if (this.assetsForm.projectId) {
          this.$refs.tree.setCheckedNodes(this.assetsForm.projectId);
        }
      });
    },
    /**
     *选择项目，查询 空间 和 资产分组
     *
     * */
    selectProject(id) {
      const obj = this.projectList.filter(child => child.id === id);
      this.assetsForm.projectName = obj[0].name;
      this.assetsForm.positionName = '';
      this.assetsForm.positionId = '';
      this.assetsForm.projectSpaceName = '';
      this.assetsForm.spacePathId = '';
    },
    /**
     *根据项目id ，选择空间列表
     *
     * */
    getSpaceListById(id) {
      this.flag = false;
      this.$http.post(this.api.spaceApi.spaceList, {
        nameLike: '',
        projectId: id,
      }).then((res) => {
        if (res.length) {
          this.spaceList = res;
          this.spaceIdArr = res.map(item => item.id);
          this.selectSpace();
        } else {
          this.$message.error('请先进入空间模块,添加项目空间');
          return false;
        }
        return true;
      });
    },
    /**
     *获取空间路径
     *
     * */
    selectSpace() {
      this.$http.post(this.api.spaceApi.pathBatch, this.spaceIdArr).then((res) => {
        this.pathList = res;
        this.pathList.forEach((item) => {
          let name = '';
          item.pnames.forEach((path) => {
            name += `-${path}`;
          });
          this.$set(item, 'path', name);
        });
        this.flag = true;
      });
    },
    /**
     * 保存资产新增
     *
     * */
    submitForm() {
      this.$refs.assetsFormRef.validate((valid) => {
        if (valid) {
          this.$http.post(this.api.assetsApi.insertAssets, this.assetsForm).then((res) => {
            if (res) {
              this.$message.success('编辑成功');
              this.$deleteTag();
              // this.$router.push({ name: 'assetsList' });
              this.$cancel();
            }
          });
        } else {
          this.$message.error('编辑失败,请重新填写');
          return false;
        }
        return true;
      });
    },
  },
  created() {
    this.getProjectList(); // 所属项目
    this.getAssetsDetails(); // 资产详情
  },
  watch: {
  },
  computed: {
    assetCode: {
      get() {
        return this.assetsForm.assetCode;
      },
      set(val) {
        this.assetsForm.assetCode = val.toUpperCase();
      },
    },
  },
};
</script>

<style type="text/less" lang="less" scoped>
  .assets-add{
    .year{
      position: absolute;
      right: -20px;
      top: 3px;
    }
    .notice{
      color:#7b8aa4;
      font-size: 12px;
    }
  }
</style>
