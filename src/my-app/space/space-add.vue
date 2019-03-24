/**
* Created by c on 2018/7/21.
*/
<template>
  <div>
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
                         placeholder="请选择空间类型">
                <el-option v-for="(child,index) in spacePropList"
                           :key="index"
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
  name: 'space-add',
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
        square: '', // 面积平方米
        updateBy: null, // 日志不需要前端传
      }, // 空间form
      rules: {
        name: [
          { required: true, message: '请输入空间描述', trigger: 'blur' },
        ],
        category: [
          { required: true, message: '请输入空间类型', trigger: 'change' },
        ],
        prop: [
          { message: '请输入空间属性', trigger: 'blur' },
        ],
        square: [
          { validator: number, trigger: 'change' },
        ],
      },
      projectId: this.$route.params.id, // 项目id
      spaceList: [], // 空间类型列表
      spacePropList: [], // 空间属性列表
      pid: 0,
    };
  },
  methods: {
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
     * 新增空间
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
          projectId: this.projectId, // 项目id
          square: this.spaceForm.square,
          prop: this.spaceForm.prop,
        };
      } else {
        obj = {
          category: this.spaceForm.category, // 空间类型
          level: 1,
          pid: 0,
          name: this.spaceForm.name,
          projectId: this.projectId, // 项目id
          square: this.spaceForm.square,
          prop: this.spaceForm.prop,
        };
      }
      this.$refs.spaceFormRef.validate((valid) => {
        if (valid) {
          this.$http.post(this.api.spaceApi.spaceAdd, obj)
            .then((res) => {
              if (res) {
                if (this.levelList.length > 2) {
                  this.pid = this.levelList[this.levelList.length - 2].id;
                }
                // 把项目的id 存着
                this.$store.commit('CHANGE_PROJECT_ID', this.projectId);
                this.$message.success('空间新增成功');
                this.$deleteTag();
                this.$router.push({
                  name: 'spaceList',
                });
              } else {
                this.$message.error('新增失败');
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
    //
    if (this.$cookie.get('levelList')) {
      this.levelList = JSON.parse(this.$cookie.get('levelList'));
    }
    this.getSpaceList(); // 空间类型
    this.getSpacePropList(); // 空间属性
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
