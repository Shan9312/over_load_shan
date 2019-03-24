/**
 * Created by c on 2019/2/28.
 * 自定义日期选择  可选择 日 周 月 年
 */
<template>
<div class="date-picker-custom">
  <el-popover
    placement="bottom-start"
    popper-class="date-picker-custom-popper"
    class="date-picker-week"
    v-if="type === 'week'"
    trigger="click">
    <div class="week-content">
      <div class="header">
        <i class="el-icon-arrow-left" @click="computeYear(false)"></i>
        <span>{{currentYear}}</span>
        <i class="el-icon-arrow-right" @click="computeYear(true)"></i>
      </div>
      <el-scrollbar tag="div" style="height: 300px" class="item-list">
        <span v-for="(item,index) in weekList"
              @click="chooseWeek(item)"
              class="cursor"
              :class="{'active': weekActiveNum === Number(item.weekNo)}"
              :key="index">
          第{{item.weekNo}}周
        </span>
      </el-scrollbar>
    </div>
    <el-input
      class="w-100"
      placeholder="选择周"
      prefix-icon="el-icon-date"
      slot="reference"
      v-model="time">
      <i
        slot="suffix"
        v-if="time"
        class="el-input__icon el-icon-error cursor"
        @click="deleteWeek"></i>
    </el-input>
  </el-popover>
  <el-date-picker
    v-else
    v-model="time"
    :type="pickerData[type].type"
    :format="pickerData[type].format"
    value-format="timestamp"
    @change="chooseTime"
    :placeholder="pickerData[type].placeholder">
  </el-date-picker>
</div>
</template>
<script>
export default{
  name: 'date-picker-custom',
  components: {},
  props: {
    type: { type: String, required: true, default: 'day' },
  },
  data() {
    return {
      time: '', // 绑定的时间
      weekActiveNum: 0, // 保存选中的周数
      updateTime: '', // 选取的值 传递给父组件
      pickerData: {
        day: {
          type: 'date',
          placeholder: '选择日',
          format: 'yyyy 年 MM 月 dd 日',
        },
        week: {
          type: 'week',
          placeholder: '选择周',
          format: 'yyyy 第 WW 周',
        },
        month: {
          type: 'month',
          placeholder: '选择月',
          format: 'yyyy 年 MM 月',
        },
        year: {
          type: 'year',
          placeholder: '选择年',
          format: 'yyyy 年',
        },
      },
      currentYear: new Date().getFullYear(),
      weekList: [], // 周数
    };
  },
  methods: {
    /**
     * 选择 日 月 年 返回的时间戳
     *
     * */
    chooseTime(val) {
      this.updateTime = val;
      this.$emit('getData', this.updateTime);
    },
    /**
     * 删除周数
     *
     * */
    deleteWeek() {
      this.time = '';
      this.weekActiveNum = 0;
      this.$emit('getData', null);
    },
    /**
     * 选择周数
     *
     * */
    chooseWeek(item) {
      this.time = `${this.currentYear}年 第${item.weekNo}周`;
      this.weekActiveNum = item.weekNo;
      document.querySelector('#app').click(); // 关闭弹窗
      this.$emit('getData', item);
    },
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
        if (this.currentYear < 9999) {
          this.currentYear = this.currentYear + 1;
        }
      } else if (this.currentYear > 1) {
        this.currentYear = this.currentYear - 1;
      }
    },
  },
  mounted() {
    this.getWeek();
  },
  watch: {
    currentYear() {
      this.getWeek();
    },
    type() {
      this.time = '';
    },
  },
};
</script>

<style lang="less" type="text/less" scoped>
  .date-picker-custom{
    >span{
      width: 100%;
    }
  }
  .date-picker-custom-popper{
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
  }
</style>
