<template>
  <div class="filter_input_wrapper">
    <el-input :value="inputValue | filterNum" v-if="isShow"
              @focus="isShow = false" ></el-input>
    <el-input v-model="myInputValue"
              @change="handleChang"
              v-else @blur="isShow = true"
              :disabled="status === '2'"
    ></el-input>
  </div>
</template>

<script>
export default {
  name: 'FilterInput',
  data() {
    return {
      isShow: true, // 是否显示
      myInputValue: '0', // 传入的值
      myStatus: '1', //  1未收，2已收
    };
  },
  props: {
    inputValue: {
      require: true,
    },
    status: { //  1未收，2已收
      require: true,
    },
  },
  methods: {
    handleChang() {
      this.$emit('updateInput', this.myInputValue);
    },
  },
  mounted() {
    this.myInputValue = this.inputValue;
    this.myStatus = this.status;
  },
  watch: {
    inputValue(v) {
      this.myInputValue = v;
    },
  },
};
</script>
