<template>
  <div ref="dom">
    <row style="font-size:18px;font-family:MicrosoftYaHei-Bold;font-weight:bold;color:rgba(106,106,106,1);padding: 0px 0px 5px 5px;text-align: left;">黄绿标统计</row>
    <row>
      <i-col :lg="6" style="minwidth:96">
        <Icon type="md-pie" style="font-size: 36px;margin-right: 7px;color: #4CAF50;" /><span>绿标</span></i-col>
      <i-col :lg="18"> <Progress :percent="Number(l_sum)" stroke-color="#4CAF50" style="padding-top: 7px;" /></i-col>
    </row>
    <Divider size="small" />
    <row>
      <i-col :lg="6" style="minwidth:96">
        <Icon type="md-pie" style="font-size: 36px;margin-right: 7px;color: #FFD600;" /><span>黄标</span></i-col>
      <i-col :lg="18"> <Progress :percent="Number(h_sum)" stroke-color="#FFD600" style="padding-top: 7px;" /></i-col>
    </row>
  </div>
</template>
<script>
import { on, off } from "../../../utils/tools";
export default {
  name: "TypeBar",
  props: {
    value: Array,
    text: String,
    subtext: String
  },
  data() {
    return {
      dom: null,
      h_sum: 0,
      l_sum: 0
    };
  },
  methods: {
    resize() {
      this.dom.resize();
    },
    GetSumData(array) {
      //获取总数
      let sum = 0;
      if (array) {
        for (var i = 0; i < array.length; i++) {
          sum += array[i];
        }
      }
      return sum;
    },
    GetRatio(val, array) {
      //获取占比
      let arr = [];
      if (array && val > 0) {
        for (var i = 0; i < array.length; i++) {
          arr.push(((array[i] / val) * 100).toFixed(2));
        }
      }
      return arr;
    },
    loadData() {
      this.$nextTick(() => {
        let titlename = this.value.map(_ => _.name);
        let valdata = this.value.map(_ => _.value);
        let sumdata = this.GetSumData(valdata);
        let data = this.GetRatio(sumdata, valdata);
        this.l_sum = data[0];
        this.h_sum = data[1];
      });
    }
  },
  mounted() {},
  beforeDestroy() {
    off(window, "resize", this.resize);
  },
  watch: {
    value(data) {
      this.loadData();
    }
  }
};
</script>

