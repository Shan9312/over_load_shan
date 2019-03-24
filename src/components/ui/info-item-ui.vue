/**
* Created by c on 2018/12/18.
* 显示详情页 主要信息
*/
<template>
	<div class="info-item-ui" :class="{'border-bottom':border}">
    <div class="info-item" :class="{'m-b-0':last}" :style="{marginBottom:`${bottom}px`}">
        <span class="info-label info-label-color "
              :class="{'flex-start': align === 'top','flex-center': align === 'center'}"
              :style="{'fontSize':`${font}px`,minWidth:`${labelWidth}px`, color: color}">
              <img :src=src v-if="src" :style="{width:`${imgWidth}px`}"  class="img"/>
          <b :class="{'is-require': isRequire}">
            {{title}}
          </b>
        </span>
       <span class="info-intro">
          <slot></slot>
        </span>
    </div>
	</div>
</template>
<script>
export default {
  name: 'info-item-ui',
  props: {
    title: String,
    last: Boolean,
    border: Boolean,
    align: {
      type: String,
      default: 'center',
    },
    labelWidth: {
      type: Number,
      default: 130,
    },
    font: {
      type: Number,
      default: 16,
    },
    bottom: {
      type: Number,
      default: 30,
    },
    isRequire: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      default: '#7b8aa4',
    },
    src: {
      type: String,
      default: '',
    },
    imgWidth: {
      type: String,
      default: '0',
    },
  },
  components: {},
  data() {
    return {};
  },
  methods: {},
};
</script>

<style lang="less" type="text/less" scoped>
  .border-bottom{
    border-bottom: 1px solid @bottom-color;
  }
  .info-item{
    display: flex;
    color: #2f3747;
    width: 100%;
    .info-label{
      position: relative;
      /*display: inline-flex;*/
    }
    .is-require{
      position: relative;
      &:before{
        content: '*';
        color: #f56c6c;
        position: absolute;
        left: -10px;
        top: 2px;
      }
    }
    .info-intro{
      word-break: break-all;
      position: relative;
      font-size: 16px;
      flex: 1;
      min-width: 0; // flex 布局宽度超出问题
      padding-right: 20px;
      &>span{
        width: 100%;
      }
    }
    .img{
      margin-right: 5px;
    }
  }
</style>
