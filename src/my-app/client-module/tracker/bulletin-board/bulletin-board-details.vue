/**
 * Created by c on 2019/1/24.
 */
<template>
<div class="bulletin-board-details">
  <panelContentHeader>
  </panelContentHeader>
  <!--详情-->
  <div v-content v-full-content>
    <div v-content-title>{{type === 1? '现显示公告': '历史公告'}}</div>
    <el-row>
      <el-col :span="12">
        <info-item-ui
          :font="14"
          :label-width="80"
          title="公告标题">
          {{result.title}}
        </info-item-ui>
        <info-item-ui
          :font="14"
          :label-width="80"
          align="top"
          title="公告内容">
          {{result.content}}
        </info-item-ui>
        <info-item-ui
          :font="14"
          :label-width="80"
          title="发布人">
          {{result.createByName}}
        </info-item-ui>
        <info-item-ui
          :font="14"
          :label-width="80"
          title="日期">
          {{$day(Number(result.createAt)).format('YYYY/MM/DD HH:mm:ss')}}
        </info-item-ui>
        <info-item-ui
          :font="14"
          :label-width="80"
          align="top"
          title="图片附件">
          <div class="img-list">
            <img :src="item"
                 @click="openDialog(item)"
                 v-if="item"
                 v-for="(item,index) in result.picList" :key="index"/>
          </div>
        </info-item-ui>
      </el-col>
    </el-row>
  </div>
  <!--详情 end-->
  <!--图片弹窗-->
  <el-dialog :visible="dialogVisible" width="35%">
    <el-scrollbar tag="div" style="height: 500px">
      <div class="dialog-img">
        <img :src="activeImg" class="" alt=""/>
      </div>
    </el-scrollbar>
    <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false" size="small" type="primary">确认</el-button>
    </span>
  </el-dialog>
  <!--图片弹窗 end-->
</div>
</template>
<script>
export default{
  name: 'bulletin-board-details',
  components: {},
  data() {
    return {
      id: this.$route.params.id, // 公告id
      type: this.$route.query.type, // 公告类型 1 现在显示的公告 2 历史公告
      activeImg: '', // 弹窗显示的图片
      dialogVisible: false,
      result: {},
    };
  },
  methods: {
    /**
     * 公告详情
     *
     * */
    getDetails() {
      this.$http.post(this.api.bulletinApi.list, { ids: [this.id] })
        .then((res) => {
          this.result = res.list[0];
        });
    },
    /**
     *
     * 打开图片弹窗
     *
     * */
    openDialog(item) {
      this.dialogVisible = true;
      this.activeImg = item;
    },
  },
  mounted() {
    this.getDetails();
  },
};
</script>

<style lang="less" type="text/less" scoped>
  .img-list{
    img{
      width: 80px;
      height: 80px;
      display: inline-block;
      border-radius: 5px;
      margin-right: 10px;
      cursor: pointer;
      .border();
      background: #e5e5e5;
    }
  }
  .dialog-img{
    height: 500px;
    display: flex;
    align-items: center;
    justify-content: center;
    img{
      max-width: 650px;
      border-radius: 10px;
    }
  }
</style>
