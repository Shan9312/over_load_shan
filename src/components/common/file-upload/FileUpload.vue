/**
* Created by c on 2018/6/6.
*/
<template>
  <div class="upload-demo">
    <el-upload
      :action="uploadImg"
      :on-preview="handlePreview"
      :on-success="uploadSuccess"
      :on-exceed="handleExceed"
    >
      <el-button size="middle" type="primary">{{names}}</el-button>
    </el-upload>
  </div>
</template>
<script>
import appConfig from '../../../appConfig'; // 接口配置文件

export default {
  name: 'upload',
  components: {
  },
  props: {
    projectId: { required: true },
    url: { required: true },
    names: { type: String, required: true },
  },
  data() {
    return {
      /*  eslint-disable no-underscore-dangle */
      name: this.$options._parentVnode.data.ref,
      userId: this.$cookie.get('userId'),
    };
  },
  methods: {
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    upload() {
      document.getElementById(this.name).click();
    },
    /**
     * 上传成功钩子
     *
     * */
    uploadSuccess(res) {
      if (res.code === '10000') {
        this.$emit('uploadSuc', res); // 不管限制多个上传数量 总是返回一个数组
        this.$message.success('表格导入成功');
      } else {
        this.$message.error(res.msg);
      }
    },
  },
  computed: {
    uploadImg() {
      return `${appConfig.API.BASE_URL}${this.url}?projectId=${this.projectId}&userId=${this.userId}`;
    },
  },
  mounted() {
  },
};
</script>
<style type="text/less" lang="less">
.upload-demo{
  display: inline-block;
  margin-left:15px;
  .el-upload-list{
    display: none;
  }
}
</style>
