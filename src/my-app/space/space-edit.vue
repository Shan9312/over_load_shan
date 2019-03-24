/**
* Created by c on 2018/7/21.
*/
<template>
  <div class="space-edit">
    <panelContentHeader>
    </panelContentHeader>
    <div class="space-add edit-content" v-edit>
      <el-form :model="spaceForm"
               :rules="rules"
               ref="spaceFormRef"
               label-width="120px"
               class="spaceForm">
        <el-row>
          <div v-content-title>
            <div class="space-level-control">
              <span
                v-for="(item) in levelList"
                :key="item.id"
              >{{item.name}}
          </span>
            </div>
          </div>
        </el-row>
        <el-row class="basic-panel">
          <el-col :span="8">
            <el-form-item label="空间描述" prop="name">
              <el-input  v-model="spaceForm.name" placeholder="请输入空间描述"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="空间属性" >
              <el-select v-model="spaceForm.prop"
                         placeholder="请选择空间属性">
                <el-option v-for="child in spacePropList"
                           :key="child.id"
                           :label="child.name"
                           :value="child.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="basic-panel">
          <el-col :span="8">
            <el-form-item label="空间类型" prop="category">
              <el-select v-model="spaceForm.category"
                         placeholder="请选择空间类型">
                <el-option v-for="(child,index) in spaceList"
                           :key="index"
                           :label="child.name"
                           :value="child.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="空间面积" prop="square">
              <el-input  v-model="spaceForm.square" placeholder="请输入空间描述"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <span class="point">㎡</span>
          </el-col>
        </el-row>
      </el-form>
      <div class="fixed-control">
        <el-button plain @click="$cancel" >取消</el-button>
        <el-button  type="primary" @click="SpaceAdd">保存</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { number } from '../../libs/plugins/validate';

export default {
  name: 'spaceEdit',
  components: {},
  data() {
    return {
      levelList: [],
      projectArr: [], // 项目列表
      spaceForm: {
        category: null, // 类型id
        level: 0, // 层级
        name: '', // 空间名称
        pid: 0, // 上级空间id
        projectId: null, // 项目id
        prop: '', // 空间属性
        square: 0, // 面积平方米
        updateBy: null, // 日志不需要前端传
      }, // 空间form
      rules: {
        name: [
          { required: true, message: '请输入空间描述', trigger: 'blur' },
        ],
        category: [
          { required: true, message: '请输入空间类型', trigger: 'blur' },
        ],
        prop: [
          { required: true, message: '请输入空间类型', trigger: 'blur' },
        ],
        projectId: [
          { required: true, message: '请输入空间类型', trigger: 'blur' },
        ],
        square: [
          { validator: number, message: '只能输入数字', trigger: 'change' },
        ],
      },
      projectId: this.$route.params.id, // 项目id
      spaceList: [], // 空间类型列表
      spacePropList: [], // 空间属性列表
      id: this.$route.params.pid,
    };
  },
  methods: {
    /**
    *获取空间详情
    *
    * */
    getSpaceDetail() {
      this.$http.get(this.api.spaceApi.getSpaceDetail, {
        params: {
          spaceId: this.id,
        },
      }).then((res) => {
        this.spaceForm = res;
      });
    },
    /**
     *查询空间属性列表
     *
     * */
    getSpacePropList() {
      this.$http.get(this.api.dictionaryApi.getSpacePropList).then((res) => {
        this.spacePropList = res;
      });
    },
    /**
     *查询空间类型表
     *
     * */
    getSpaceList() {
      this.$http.get(this.api.dictionaryApi.getSpaceList).then((res) => {
        this.spaceList = res;
      });
    },
    /**
     * 修改空间
     *
     * */
    SpaceAdd() {
      let obj = {};
      if (this.levelList.length > 0) {
        const space = this.levelList[this.levelList.length - 1];
        obj = {
          category: this.spaceForm.category, // 空间类型
          level: space.level,
          pid: space.id,
          name: this.spaceForm.name,
          id: this.spaceForm.id, // 项目id
          prop: this.spaceForm.prop, // 属性
          square: this.spaceForm.square,
        };
      } else {
        obj = {
          category: this.spaceForm.category, // 空间类型
          level: 1,
          pid: 0,
          prop: this.spaceForm.prop, // 属性
          name: this.spaceForm.name,
          id: this.spaceForm.id, // 项目id
          square: this.spaceForm.square,
        };
        this.$store.commit('CHANGE_PROJECT_ID', this.projectId);
      }
      this.$refs.spaceFormRef.validate((valid) => {
        if (valid) {
          this.$http.post(this.api.spaceApi.saveSpaceDetails, obj)
            .then((res) => {
              if (res) {
                if (this.levelList.length > 2) {
                  this.pid = this.levelList[this.levelList.length - 2].id;
                }
                // 把项目的id 存着
                this.$store.commit('CHANGE_PROJECT_ID', this.projectId);
                this.$message.success('空间编辑成功');
                this.$deleteTag();
                this.$router.push({
                  name: 'spaceList',
                });
              } else {
                this.$message.error('编辑失败');
              }
            });
        } else {
          return false;
        }
        return true;
      });
    },
  },
  computed: {
  },
  created() {
    console.log(this.$cookie.get('levelList'), '开始进来');
    if (this.$cookie.get('levelList')) {
      this.levelList = JSON.parse(this.$cookie.get('levelList'));
    }
    this.getSpaceList(); // 空间类型
    this.getSpacePropList(); // 空间属性
  },
  mounted() {
    this.getSpaceDetail(); // 空间详情
  },
  watch: {
  },
};
</script>

<style lang="less" type="text/less" scoped>
  .space-add{
    height: 100vh;
    .el-col-8{
      .point{
        position: relative;
        left: -50px;
        top: 10px;
      }
    }
  }
</style>
