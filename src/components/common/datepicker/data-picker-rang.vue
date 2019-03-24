<template>
<div class="data-picker-rang">
  <div class="flex" v-if="type === '1'">
    <el-date-picker
      v-model="dayStar"
      type="date"
      value-format="timestamp"
      placeholder="选择起始日"
      @change="handleChange('day')"
      :picker-options="{ disabledDate: dayMax}">
    </el-date-picker>
    <el-date-picker
      v-model="dayEnd"
      type="date"
      value-format="timestamp"
      placeholder="选择结束日"
      @change="handleChange('day')"
      :picker-options="{ disabledDate: dayMin}">
    </el-date-picker>
  </div>
  <div class="flex" v-else-if="type === '3'">
    <el-date-picker
      v-model="monthStar"
      type="month"
      value-format="timestamp"
      placeholder="选择起始月"
      @change="handleChange('month')"
      :picker-options="{ disabledDate: monthMax}">
    </el-date-picker>
    <el-date-picker
      v-model="monthEnd"
      type="month"
      value-format="timestamp"
      placeholder="选择结束月"
      @change="handleChange('month')"
      :picker-options="{ disabledDate: monthMin}">
    </el-date-picker>
  </div>
  <div class="flex" v-else>
    <week-picker
      v-model="weekStar"
      :max="weekEnd"
      placeholder="选择起始周"
      @change="handleChange('week')"
    ></week-picker>
    <week-picker
      v-model="weekEnd"
      :min="weekStar"
      placeholder="选择结束周"
      @change="handleChange('week')"
    ></week-picker>
  </div>
</div>
</template>

<script>

import weekPicker from '@/components/common/datepicker/date-picker-week';

export default{
  components: { weekPicker },
  props: {
    type: null,
    value: null,
  },
  data() {
    return {
      dayStar: '',
      dayEnd: '',
      weekStar: '',
      weekEnd: '',
      monthStar: '',
      monthEnd: '',
    };
  },
  watch: {
    value(val, old) {
      if (old.length < 1) {
        switch (this.type) {
          case '1':
            this.dayStar = val[0];
            this.dayEnd = val[1];
            break;
          case '2':
            this.weekStar = val[0];
            this.weekEnd = val[1];
            break;
          case '3':
            this.monthStar = val[0];
            this.monthEnd = val[1];
            break;
          default:
            break;
        }
      }
    },
    type() {
      this.dayStar = '';
      this.dayEnd = '';
      this.weekStar = '';
      this.weekEnd = '';
      this.monthStar = '';
      this.monthEnd = '';
      this.$emit('input', ['', '']);
      this.$emit('change', ['', '']);
    },
  },
  methods: {
    dayMax(val) {
      return this.dayEnd && val.getTime() > Number(this.dayEnd);
    },
    dayMin(val) {
      return this.dayStar && val.getTime() < Number(this.dayStar);
    },
    monthMax(val) {
      return this.monthEnd && val.getTime() > Number(this.monthEnd);
    },
    monthMin(val) {
      return this.monthStar && val.getTime() < Number(this.monthStar);
    },
    handleChange(type) {
      const arr = [this[`${type}Star`], this[`${type}End`]];
      this.$emit('input', arr);
      this.$emit('change', arr);
    },
  },
  computed: {

  },
  mounted() {

  },
  created() {

  },
};
</script>

<style lang="less" type="text/less" scoped>
  .flex{
    display: flex;
    >*{
      flex:1;
      &+*{
        margin-left: 30px;
      }
    }
  }
</style>
