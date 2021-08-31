<template>
  <div v-resize="resize">
    <div v-if="selectState == 'zdgz'" class="dataSelect">
      <DatePicker v-model="time" @on-ok="changeTime" placement="bottom-end" :confirm="true" type="year" placeholder="时间" style="width: 150px;"></DatePicker>
    </div>
    <!--创建一个echarts的容器-->
    <div ref="echartContainer" style="width:100%;height:100%"></div>
  </div>
</template>
<script>
export default {
  name: "KindBar",
  props: {
    value: Array,
    text: String,
    subtext: String,
    selectState: {
      type: String
    }
  },
  data() {
    return {
      myChart: null,
      themaColor: this.$store.state.core.themaColor.basetextcolor,
      time: ""
    };
  },
  computed: {
    option() {
      let _this = this;
      return {
        backgroundColor: "transparent",
        color: ["#3398DB"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: function (value) {
            return value[0].name + ":" + value[0].value + "辆";
          }
        },
        title: {
          text: _this.text,
          textStyle: { color: _this.themaColor, fontSize: "18" },
          subtext: _this.subtext,
          x: "left"
        },
        grid: {
          left: "-8%",
          right: "0%",
          bottom: "0%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            data: [],
            axisTick: {
              show: false,
              color: "#707070"
            },
            axisLabel: {
              interval: 0 //强制显示
            },
            axisLine: {
              show: true, //隐藏X轴轴线
              lineStyle: {
                color: _this.themaColor
              }
            }
          }
        ],
        yAxis: [
          {
            show: false,
            type: "value"
          }
        ],
        series: [
          {
            name: "",
            type: "bar",
            barWidth: 20,
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  position: "top",
                  formatter: "{c}",
                  color: _this.themaColor
                  
                },
                shadowColor: "rgba(0, 0, 0, 0.6)"
              }
            },
            data: []
          }
        ],
        animation: true,
        animationType: "scale",
        animationEasing: "elasticOut",
        animationDelay: function (idx) {
          return Math.random() * 200;
        }
      };
    }
  },
  methods: {
    resize() {
      if (this.myChart) this.myChart.resize();
    },
    async loadData() {
      this.option.xAxis[0].data = this.value.map(_ => _.name);
      this.option.series[0].data = this.value.map(function (a) {
        return a;
      });
      if (this.myChart) {
        this.myChart.clear();
        this.$echartsc.dispose(this.myChart);
        this.myChart = null;
      }
      if (this.$refs.echartContainer) {
        this.myChart = await this.$echartsc.init(this.$refs.echartContainer);
        await this.myChart.setOption(this.option);
      }
    },
    changeTime() {
      this.$emit("changeTime", this.time);
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
<style scoped>
.dataSelect {
  position: absolute;
  right: 30px;
}
</style>