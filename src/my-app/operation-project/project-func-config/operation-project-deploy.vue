<template>
  <div class="operation-project-deploy">
    <div v-content>
      <div class="header">
        <span class="tag"
              :key="item.id"
              v-for="item in list"
              @click="chooseItem(item)"
              :class="{'active-tag':activeItem.name === item.name}"
              >
          <img :src="`../../../static/img/icon-${item.name}.png`" alt=""/>
        </span>
      </div>
      <div class="content-info">
        <transition name="slider" mode="out-in">
          <tracker-item v-if="activeItem.name === 'tracker'"
                        :activeItem="activeItem"></tracker-item>
          <seer-item v-if="activeItem.name === 'seer'"></seer-item>
          <sentry-item v-if="activeItem.name === 'sentry'"></sentry-item>
          <provider-item v-if="activeItem.name === 'provider'"></provider-item>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import trackerItem from './tracker/tracker-config';
import seerItem from './seer/seer-config';
import sentryItem from './sentry/sentry-config';
import providerItem from './provider/provider-config';

export default {
  name: 'role-project-detail',
  components: { trackerItem, seerItem, sentryItem, providerItem },
  data() {
    return {
      activeItem: {
        name: '',
      },
      list: [],
    };
  },
  computed: {

  },
  methods: {
    /**
     * 切换标签页
     *
     * */
    chooseItem(item) {
      this.activeItem = item;
    },
    /**
     * 获取一级权限
     *
     *
     * */
    getLv() {
      this.$http.post(this.api.operationApi.getAtoms, { lvs: [1] })
        .then((res) => {
          res.forEach((item) => {
            item.isCheck = item.isCheck !== '0';
          });
          this.list = res;
          this.activeItem = res[0];
        });
    },
  },
  mounted() {
    this.getLv();
  },
};
</script>

<style scoped type="text/less" lang="less" >
  .operation-project-deploy{
    position: relative;
    padding-top: 70px;
    .header{
      position: absolute;
      top: 30px;
      left: 0;
      span.tag{
        position: relative;
        transition: all .4s;
        display: inline-flex;
        z-index: 99;
        width: 190px;
        min-width: 10px;
        height: 40px;
        padding-left: 15px;
        align-items: center;
        justify-content: space-between;
        &:not(:first-child){
          margin-left: -10px;
        }
        &:after,&:before{
          content: '';
          position: absolute;
          border-width:0 10px 40px;
          border-style:none solid solid;
        }
        &:before{
          width:calc(98%);
          left:0;
          bottom:0;
          border-color:transparent transparent #f0f0f0;
          z-index: -2;
        }
        &:after{
          width:calc(97.1%);
          left:1px;
          bottom:-1px;
          border-color:transparent transparent #ececed;
          z-index: -1;
        }
        &.active-tag{
          z-index: 100;
          &:after{
            border-color:transparent transparent #ffffff;
          }
        }
      }
    }
  }
</style>
