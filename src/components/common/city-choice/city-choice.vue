/**
* Created by c on 2018/7/5.
*/
<template>
	<div class="city-choice-model">
    <el-cascader
      :options="cityList"
      @change="handleItemChange"
      :props="cascadeProps"
      v-model="list"
      :placeholder="textCity"
      change-on-select
    >
    </el-cascader>
  </div>
</template>
<script>
export default {
  name: 'city-choice',
  components: {},
  props: ['defaultList'],
  data() {
    return {
      cityList: [], // 城市列表
      cityObj: {}, // 选择城市保存对象
      cascadeProps: {
        value: 'obj',
        label: 'label',
        children: 'cities',
      },
      list: [],
    };
  },
  methods: {
    /**
     * 查询省份
     *
     * */
    getProvince() {
      this.$http.get(this.api.zoneApi.getList, { params: { countryId: 1, zoneLv: 1 } })
        .then((res) => {
          res.forEach((item, index) => {
            this.cityList.push({
              label: item.name + item.suffix,
              obj: { id: item.id, objIndex: index, lv: item.zoneLv },
              cities: [],
            });
          });
        });
    },
    /**
     * 查询市区
     *
     * */
    getCity(obj) {
      this.cityObj = obj;
      this.$http.get(this.api.zoneApi.getList, { params: { pid: obj.id, zoneLv: 2 } })
        .then((res) => {
          this.cityList[obj.objIndex].cities = [];
          const arr = [1, 2, 3, 4, 33, 34]; // 直辖市和香港澳门只有二级
          res.forEach((item, index) => {
            if (arr.indexOf(Number(obj.id)) !== -1) {
              this.cityList[obj.objIndex].cities.push({
                label: item.name + item.suffix,
                obj: { id: item.id, objIndex: index, lv: item.zoneLv },
              });
            } else {
              this.cityList[obj.objIndex].cities.push({
                label: item.name + item.suffix,
                obj: { id: item.id, objIndex: index, lv: item.zoneLv },
                cities: [],
              });
            }
          });
        });
    },
    /**
     * 查询区县
     *
     * */
    getArea(obj) {
      this.$http.get(this.api.zoneApi.getList, { params: { pid: obj.id, zoneLv: 3 } })
        .then((res) => {
          if (res.length > 0) {
            this.cityList[this.cityObj.objIndex].cities[obj.objIndex].cities = [];
            res.forEach((item, index) => {
              this.cityList[this.cityObj.objIndex].cities[obj.objIndex].cities.push({
                label: item.name + item.suffix,
                obj: { id: item.id, objIndex: index, lv: item.zoneLv,
                },
              });
            });
          }
        });
    },
    /**
     * 选择某个选项触发事件
     *
     * */
    handleItemChange(val) {
      const length = val.length;
      if (length === 1) {
        this.getCity(val[0]);
        this.$emit('getCity', val[0].id);
      } else if (length === 2) {
        this.getArea(val[1]);
        this.$emit('getCity', val[1].id);
      } else {
        this.$emit('getCity', val[2].id);
      }
    },
  },
  computed: {
    textCity() {
      if (this.defaultList) {
        return `${this.defaultList.lv1Name ? `${this.defaultList.lv1Name}` : ''}${this.defaultList.lv2Name ? `/${this.defaultList.lv2Name}` : ''}${this.defaultList.lv3Name ? `/${this.defaultList.lv3Name}` : ''}`;
      }
      return '';
    },
  },
  mounted() {
    this.getProvince();
  },
};
</script>

<style lang="less" type="text/less">
  .city-choice-model{
    position: relative;
    .cell{
      top: 5px;
      width: 150px;
      left: 30px;
      height: 33px;
      background: #ffffff;
      position: absolute;
    }
    input::placeholder{
        color: @main-color;
    }
    .el-cascader{
      width: 100%;
    }
  }
</style>
