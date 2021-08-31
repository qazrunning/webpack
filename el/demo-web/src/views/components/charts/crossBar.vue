<template>
  <div v-resize="resize">
    <!--创建一个echarts的容器-->
    <div ref="echartContainer" style="width:100%;height:100%"></div>
  </div>
</template>
<script>
export default {
  name: "CrossBar",
  props: {
    value: Array,
    title: Array,
    text: String,
    subtext: String
  },
  data() {
    return {
      myChart: null,
      themaColor: this.$store.state.core.themaColor.basetextcolor,
      myColor: []
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
        grid: {
          left: "25%",
          top: "12%",
          right: "25%",
          bottom: "8%",
          containLabel: true
        },
        xAxis: [
          {
            show: false
          }
        ],
        yAxis: [
          {
            axisTick: "none",
            axisLine: "none",
            offset: "27",
            axisLabel: {
              textStyle: {
                color: _this.themaColor,
                fontSize: "16"
              }
            },
            data: this.value.map(v => v.name)
          },
          {
            axisTick: "none",
            axisLine: "none",
            axisLabel: {
              textStyle: {
                fontSize: "0"
              }
            },
            data: [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
          }
        ],
        series: [
          {
            name: "条",
            type: "bar",
            yAxisIndex: 0,
            data: this.value.map(v => v.value),
            label: {
              normal: {
                show: true,
                position: "right",
                textStyle: {
                  color: _this.themaColor,
                  fontSize: "16"
                }
              }
            },
            barWidth: 12,
            itemStyle: {
              normal: {
                color: function (params) {
                  var num = _this.myColor.length;
                  return _this.myColor[params.dataIndex % num];
                }
              }
            },
            z: 2
          }
        ]
      };
    }
  },
  methods: {
    resize() {
      if (this.myChart) this.myChart.resize();
    },
    async loadData() {
      this.myColor = [
        "#eb2100",
        "#eb3600",
        "#d0570e",
        "#d0a00e",
        "#34da62",
        "#00e9db",
        "#00c0e9",
        "#0096f3",
        "#33CCFF",
        "#33FFCC"
      ];
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