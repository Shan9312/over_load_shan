/**
* Created by c on 2018/6/6.
*/
<template>
	<div class="upload">
    <el-upload
      :action="uploadImg"
      list-type="picture-card"
      :on-success="uploadSuccess"
      :data="{category:'project'}"
      :limit="limit"
      :on-exceed="handleExceed"
      :on-remove="removeHandle"
      :before-upload="beforeAvatarUpload"
      :file-list="list">
      <el-button size="small" :id="name" type="primary">点击上传</el-button>
      {{name}}
    </el-upload>
	</div>
</template>
<script>
import appConfig from '../../../appConfig'; // 接口配置文件

export default {
  name: 'upload',
  components: {},
  props: {
    list: { type: Array, required: false, default: () => [] },
    limit: { type: Number, default: 1 },
  },
  data() {
    return {
      /*  eslint-disable no-underscore-dangle */
      name: this.$options._parentVnode.data.ref,
    };
  },
  methods: {
  /**
  * 图片上传 大小和 格式 限制
  *
  * */
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG 和 PNG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    upload() {
      document.getElementById(this.name).click();
    },
    /**
     * 上传成功钩子
     *
     * */
    uploadSuccess(res, file, fileList) {
      const pathArr = fileList.map(v => v.response.data); // 取出文件列表的path
      this.$emit('getUrl', pathArr, this.name); // 不管限制多个上传数量 总是返回一个数组
    },
    /**
     * 上传限制文件数量
     *
     * */
    handleExceed() {
      this.$message.error({ message: '超出文件上传个数限制' });
    },
    /**
     * 删除文件时钩子
     *
     * */
    removeHandle(file, fileList) {
      const pathArr = fileList.map(v => v.response.data); // 取出文件列表的path
      this.$emit('getUrl', pathArr, this.name); // 不管限制多个上传数量 总是返回一个数组
    },
  },
  computed: {
    uploadImg() {
      return `${appConfig.API.BASE_URL}${this.api.uploadApi.upload}`;
    },
  },
  mounted() {
    console.log();
  },
};
</script>
