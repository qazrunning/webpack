<template>
  <div v-resize="resize">
    <!--创建一个echarts的容器-->
    <div ref="echartContainer" style="width:100%;height:100%"></div>
  </div>
</template>
<script>
import "echarts-liquidfill/dist/echarts-liquidfill.js";
export default {
  name: "WaterPolo",
  props: {
    value: Object,
    text: String,
    subtext: String,
    sum: Object,
    waterColor: Array,
    borderColor: String
  },
  data() {
    return {
      rangeArr: [],
      myChart: null,
      legend: "",
      valueData: 0,
      sumStat: 0,
      themaColor: this.$store.state.core.themaColor.basetextcolor
    };
  },
  computed: {
    option() {
      let _this = this;
      return {
        backgroundColor: "transparent",
        title: {
          text: this.text,
          textStyle: { color: _this.themaColor, fontSize: "18" },
          subtext: this.subtext,
          x: "left"
        },
        series: [
          {
            type: "liquidFill",
            data: _this.rangeArr,
            //data: this.getRange(ratio[0]),
            radius: "60%",
            // 水球颜色
            color: this.waterColor,
            center: ["70%", "50%"],
            // outline  外边
            outline: {
              // show: false
              borderDistance: 5,
              itemStyle: {
                borderWidth: 5,
                borderColor: this.borderColor
              }
            },
            label: {
              position: ["-180%", "50%"],
              fontSize: 15,
              color: "#D94854",
              formatter: function () {
                return (
                  _this.legend +
                  "\n" +
                  _this.valueData +
                  "辆(" +
                  ((_this.valueData / _this.sumStat) * 100).toFixed(3) +
                  "%)"
                );
              }
            },
            // 内图 背景色 边
            backgroundStyle: {
              color: "rgba(255,239,213,0.8)"
              // borderWidth: 5,
              // borderColor: 'red',
            },
            animation: true,
            animationType: "scale",
            animationEasing: "elasticOut",
            animationDelay: function (idx) {
              return Math.random() * 200;
            }
          }
        ]
      };
    }
  },
  methods: {
    resize() {
      if (this.myChart) this.myChart.resize();
    },
    getRatio(array) {
      //获取占比
      let arr = [];
      if (array) {
        for (var i = 0; i < array.length - 1; i++) {
          arr.push(parseFloat(array[i] / array[length - 1]).toFixed(3));
        }
      }
      return arr;
    },
    getRange(val, sum) {
      let data = [];
      let value = (val / sum).toFixed(3);
      if (value > 10 && value <= 100) {
        data.push(value);
        data.push(value - 5);
        data.push(value - 10);
      } else if (value > 1 && value <= 10) {
        data.push(value);
        data.push(value - 1);
      } else if (value > 0.1 && value <= 1) {
        data.push(value);
        data.push(value - 0.05);
        data.push(value - 0.1);
      } else if (value > 0.01 && value < 0.1) {
        data.push(value);
        data.push(value - 0.005);
        data.push(value - 0.01);
      } else {
        data.push(value);
        data.push(value);
        data.push(value);
      }
      return data;
    },
    async loadData() {
      if (this.value) {
        this.legend = this.value.name;
        this.valueData = this.value.value;
        this.sumStat = this.sum.value;
        let ratio = this.getRatio(this.valueData);
        this.rangeArr = this.getRange(this.valueData, this.sumStat);
        if (this.myChart) {
          this.myChart.clear();
          this.$echartsc.dispose(this.myChart);
          this.myChart = null;
        }
        if (this.$refs.echartContainer) {
          this.myChart = await this.$echartsc.init(this.$refs.echartContainer);
          await this.myChart.setOption(this.option, true);
        }
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.loadData();
    });
  },
  watch: {
    value(data) {
      this.loadData();
    }
  },
  beforeDestroy() {
    if (this.myChart) {
      this.myChart.clear();
      this.$echartsc.dispose(this.myChart);
      this.myChart = null;
    }
  }
};
</script>