/**
 * Created by c on 2019/1/24.
 */
<template>
<div class="bulletin-board-add">
  <panelContentHeader>
  </panelContentHeader>
  <div class="edit-content" v-full-content>
    <el-row>
      <el-col :span="12">
        <el-form ref="form" :model="form" label-width="100px" :rules="formRules">
          <div v-content-title>编辑内容</div>
          <el-form-item label="公告标题" prop="title">
            <el-input v-model="form.title"></el-input>
          </el-form-item>
          <el-form-item label="公告内容" prop="content">
            <el-input v-model="form.content" type="textarea" :rows="4"></el-input>
          </el-form-item>
          <div class="upload-item-icon">
            <i class="el-icon-plus" @click="uploadImg(uploadProps)"></i>
            <el-form-item label="图片附件">
              <upload
                :ref="uploadProps"
                @getUrl="uploadLogo"
                :limit="4"
                :list="[]"
              />
            </el-form-item>
          </div>
        </el-form>
      </el-col>
    </el-row>
  </div>
  <div class="fixed-control">
    <el-button plain @click="$cancel">取消</el-button>
    <el-button  type="primary" @click="submit">确认发布</el-button>
  </div>
</div>
</template>
<script>
import upload from '../../../../components/common/upload/upload';

export default{
  name: 'bulletin-board-add',
  components: { upload },
  data() {
    return {
      uploadProps: this.$uuid(),
      form: {
        title: '',
        content: '',
        picList: [],
        projectId: this.$route.params.projectId,
      },
      formRules: {
        title: [
          { required: true, message: '请输入公告标题', trigger: 'change' },
          { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'change' },
        ],
        content: [
          { required: true, message: '请输入公告内容', trigger: 'change' },
          { min: 1, max: 512, message: '长度在 1 到 512 个字符', trigger: 'change' },
        ],
      },
    };
  },
  methods: {
    /**
     * 获取上传logo返回的地址
     *
     * */
    uploadLogo(res) {
      this.form.picList = res;
    },
    /**
     * 上传图片
     *
     * */
    uploadImg(name) {
      this.$refs[name].upload();
    },
    /**
     * 确认发布
     *
     * */
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$confirm('是否确认发布？发布后会替代原公告，请确认', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }).then(() => {
            this.$http.post(this.api.bulletinApi.edit, this.form)
              .then((res) => {
                if (res) {
                  this.$message.success('发布成功');
                  this.$deleteTag();
                  this.$router.push({ name: 'bulletinBoardList', query: { projectId: this.form.projectId } });
                }
              });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消发布',
            });
          });
        }
      });
    },
  },
};
</script>

<style lang="less" type="text/less" scoped>
  .bulletin-board-add{
  }
</style>
