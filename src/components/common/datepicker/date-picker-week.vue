<template>
  <el-popover
    placement="bottom-start"
    popper-class="date-picker-custom-popper"
    class="date-picker-week"
    trigger="click">
    <div class="week-content">
      <div class="header">
        <i class="el-icon-arrow-left"
           @click="computeYear(false)"
           :class="{'disabled': this.currentYear <= this.minYear }"
        ></i>
        <span>{{currentYear}}</span>
        <i class="el-icon-arrow-right"
           @click="computeYear(true)"
           :class="{'disabled': this.currentYear >= this.maxYear }"
        ></i>
      </div>
      <el-scrollbar tag="div" style="height: 300px" class="item-list">
        <span v-for="(item,index) in weekList"
              @click="chooseWeek(item)"
              class="cursor"
              :class="{ 'active': Number(item.startAt) === Number(currentValue) }"
              :key="index">
          第{{item.weekNo}}周
        </span>
      </el-scrollbar>
    </div>
    <el-input
      class="w-100"
      :placeholder="placeholder || '选择周'"
      prefix-icon="el-icon-date"
      slot="reference"
      v-model="currentStr">
      <i
        v-if="currentValue"
        slot="suffix"
        class="el-input__icon el-icon-error cursor"
        @click="deleteWeek"></i>
    </el-input>
  </el-popover>
</template>

<script>
export default{
  props: {
    value: null,
    min: null,
    max: null,
    placeholder: null,
  },
  data() {
    return {
      currentValue: 0,
      currentStr: '',
      currentYear: new Date().getFullYear(),
      maxYear: 9999,
      minYear: 1970,
      weekList: [], // 周数
    };
  },
  watch: {
    min(val) {
      this.minYear = this.min ? (new Date(Number(this.min)).getFullYear()) : 1970;
      if (val && Number(val) > Number(this.currentValue)) {
        this.currentYear = new Date(Number(val)).getFullYear();
        this.getWeek();
        this.chooseWeek();
      }
    },
    max(val) {
      this.maxYear = this.max ? (new Date(Number(this.max)).getFullYear()) : 9999;
      if (val && Number(val) < Number(this.currentValue)) {
        this.currentYear = new Date(Number(val)).getFullYear();
        this.getWeek();
        this.chooseWeek();
      }
    },
  },
  methods: {
    /**
     * 根据年份查询周数
     *
     * */
    getWeek() {
      this.$http.get(this.api.taskApi.getWeek, { params: { year: this.currentYear } })
        .then((res) => {
          this.weekList = res;
        });
    },
    /**
     * 计算年份
     *
     * */
    computeYear(type) {
      if (type) {
        // 年份加一年
        if (this.currentYear < this.maxYear) {
          this.currentYear = this.currentYear + 1;
          this.getWeek();
        }
      } else if (this.currentYear > this.minYear) {
        this.currentYear = this.currentYear - 1;
        this.getWeek();
      }
    },
    /**
     * 选择周数
     *
     * */
    chooseWeek(item) {
      if (!item) {
        this.currentStr = '';
        this.currentValue = 0;
      } else {
        this.currentStr = `${this.currentYear}年 第${item.weekNo}周`;
        this.currentValue = Number(item.startAt);
        document.querySelector('#app').click(); // 关闭弹窗
      }
      this.$emit('input', this.currentValue);
      this.$emit('change', this.currentValue);
    },
    /**
     * 删除周数
     *
     * */
    deleteWeek() {
      this.currentStr = '';
      this.currentValue = 0;
      this.$emit('input', this.currentValue);
      this.$emit('change', this.currentValue);
    },
  },
  mounted() {
    this.getWeek();
  },
  created() {

  },
};
</script>

<style lang="less" type="text/less" scoped>
  .week-content{
    .header{
      display: flex;
      align-items: center;
      justify-content: space-between;
      span{
        color: @main-color;
      }
      i{
        cursor: pointer;
        width: 30px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        &.disabled{
          opacity:0.1;
        }
      }
    }
    .item-list{
      width: 300px;
      span{
        color: @main-color;
        width: 50px;
        height: 32px;
        border-radius: 3px;
        line-height: 32px;
        text-align: center;
        margin: 20px 5px;
        &:hover,&.active{
          background: @main-blue;
          color: #ffffff;
        }
      }
    }
  }
</style>
