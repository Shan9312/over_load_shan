/**
* Created by c on 2018/12/6.
*/
<template>
	<div class="node-tree" >
    <el-collapse  v-for="(item,index) in data" :key="index" v-model="activeNames">
      <el-collapse-item  :name="item.id"
                         v-if="hideDepId != Number(item.sign) && item.valid == 1"
                         :data-child="Number((showPosition
                        && item.deptSonList.length === 0
                        && item.positionList.length === 0)
                        ||( !showPosition && item.deptSonList.length === 0))"
                         :class="{
                         'item-active' :
                         activeDepIdArr.indexOf(item.sign) !== -1 && selectedDepartment}">
        <template slot="title">
          <div
            class="w-100 flex-justify-between flex-center"
            :class="{'company-title':item.level === 0}"
            ref="header"
            :data-num="item.level * 30"
          >
            <!--阻止默认点击事件 -->
            <span @click.stop="chooseItem(item)"
                  class="w-100 p-l-5"
            >
              <img
                src="../../../../../assets/img/icon-img/icon-zhineng.png"
                class="icon-title "
                alt=""/>
            {{item.name}}
            </span>
            <el-checkbox v-model="item.isChecked"
                         @change="chooseItem(item)"
                         v-if="!selectedDepartment"></el-checkbox>
          </div>
        </template>
        <div class="node-tree-content" v-if="showPosition">
          <ul>
            <li
              v-for="(position,index) in item.positionList"
              :key="index"
              >
              {{position.name}}
              ({{position.userIds.length}})
              <img src="../../../../../assets/img/icon-img/icon-lock.png"
                   class="m-l-10 m-r-10" alt=""/>
              <el-checkbox
                v-model="position.checked"
                v-if="isChoosePosition"
                @change="changePosition(position)"></el-checkbox>
            </li>
          </ul>
        </div>
        <div v-if="item.deptSonList">
          <node-tree :data="item.deptSonList"
                     :activeDepIdArr="activeDepIdArr"
                     :hideDepId="hideDepId"
                     :showPosition="showPosition"
                     :isChoosePosition="isChoosePosition"
                     :selectedPosition="selectedPosition"
                     :defaultExpansion="defaultExpansion"
                     :positionActiveIdArr="positionActiveIdArr"
                     :selectedDepartment="selectedDepartment"
                     :selectedDep="selectedDep"
                     @changePositionItem="changePosition"
                     @changeActiveDataSon="chooseItem"
          ></node-tree>
        </div>
      </el-collapse-item>
    </el-collapse>
	</div>
</template>
<script>
export default {
  name: 'node-tree',
  components: {},
  props: ['data', 'activeDepIdArr', 'hideDepId', 'showPosition', 'positionActiveIdArr', 'isChoosePosition', 'selectedPosition', 'defaultExpansion', 'selectedDepartment', 'selectedDep'],
  data() {
    return {
      activeNames: [],
    };
  },
  methods: {
    /**
     * 点击获取当前选择的层级
     * 标记到vuex 中记录当前点击的目标id
     * */
    chooseItem(item) {
      if (!this.isChoosePosition) {
        this.$emit('changeActiveDataSon', item);
      }
    },
    /**
     *
     *
     * */
    /**
     * 选中的职能
     *
     * */
    changePosition(item) {
      if (item && item.checked) {
        this.$emit('changePositionItem', item);
      } else {
        this.$emit('changePositionItem', null);
      }
    },
    /**
     * 计算职位是否显示勾选
     *
     * */
    isCheck() {
      this.data.forEach((item) => {
        if (this.activeDepIdArr.indexOf(item.sign) !== -1) {
          this.$set(item, 'isChecked', true);
        } else {
          this.$set(item, 'isChecked', false);
        }
        item.positionList.forEach((position) => {
          if (
            this.positionActiveIdArr.indexOf(position.id) !== -1) {
            this.$set(position, 'checked', true);
          } else {
            this.$set(position, 'checked', false);
          }
        });
      });
    },
    /**
     * 更新 Dom
     *
     * */
    updateDom() {
      this.$nextTick(() => {
        // 获取到header 给下拉按钮设置一个样式
        const headerDomList = this.$refs.header;
        if (headerDomList) {
          headerDomList.forEach((item) => {
            const leftNum = Number(item.getAttribute('data-num'));
            const child = item.parentNode.parentNode.parentNode.getAttribute('data-child');
            item.parentNode.style.paddingLeft = `${leftNum + 20}px`;
            item.nextSibling.style.left = `${leftNum}px`;
            if (Number(child) === 0) {
              item.nextSibling.style.display = 'block';
            } else {
              item.nextSibling.style.display = 'none';
            }
          });
        }
      });
    },
  },
  watch: {
    positionActiveIdArr() {
      this.isCheck();
    },
    data: {
      handler() {
        this.updateDom();
      },
      deep: true,
    },
    activeDepIdArr() {
      this.isCheck();
    },
  },
  mounted() {
    this.isCheck();
    this.updateDom();
    // 计算全部展开需要的id
    if (this.defaultExpansion) {
      this.activeNames = this.data.map(v => v.id);
    } else {
      this.activeNames = [];
    }
  },
};
</script>

<style lang="less" type="text/less" scoped>
  .node-tree{
    font-size: 16px;
    .icon-title{
      width: 16px;
      height: 16px;
    }
    .node-tree-content{
      ul{
        li{
          height: 60px;
          font-size: 16px;
          padding-right: 35px;
          border-bottom: 1px solid #f3f6f9;
          &.active{
            background: rgba(102,128,216,.05);
          }
          img{
            width: 16px;
            height: 15px;
            display: inline-block;
            margin-right: 10px;
          }
          color: @main-color;
          display: flex;
          align-items: center;
          justify-content: flex-end;
        }
      }
    }
  }
</style>
