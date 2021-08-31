<template>
  <div v-resize="resize">
    <!--创建一个echarts的容器-->
    <div ref="echartContainer" style="width:100%;height:100%"></div>
  </div>
</template>
<script>
export default {
  name: "TipsPie",
  props: {
    value: Array,
    text: String,
    subtext: String
  },
  data() {
    return {
      myChart: null,
      themaColor: this.$store.state.core.themaColor.basetextcolor,
      topFive: [],
      zxcyc: []
    };
  },
  computed: {
    option() {
      let _this = this;
      return {
        backgroundColor: "transparent",
        title: {
          text: _this.text,
          textStyle: { color: _this.themaColor, fontSize: "18" },
          x: "left"
        },
        grid: {
          top: "30%",
          right: "6%",
          left: "6%",
          bottom: "13%"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          },
          formatter: function (params) {
            let index = params[0].dataIndex;
            return params[0].name + "<br>重型柴油车总数:" + _this.zxcyc[index];
          }
        },
        xAxis: [
          {
            type: "category",
            data: [],
            axisPointer: {
              type: "line"
            },
            axisLine: {
              lineStyle: {
                color: _this.themaColor
              }
            },
            axisPointer: {
              //x轴指示器，可自行设置不同的值观察有何不同
              type: "shadow"
            },
            axisLabel: {
              rotate: 10,
              textStyle: {
                fontSize: 12
              }
            }
          }
        ],
        yAxis: [
          {
            axisLabel: {
              formatter: "{value}%",
              color: _this.themaColor
            },
            axisLine: {
              show: false
            },
            splitLine: {
              lineStyle: {
                type: "dashed",
                color: _this.themaColor
              }
            }
          }
        ],
        series: [
          {
            type: "bar",
            data: [],
            barWidth: "20px",
            itemStyle: {
              normal: {
                color: new this.$echartsc.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: "rgba(0,244,255,1)" // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: "rgba(0,160,221,1)" // 100% 处的颜色
                    }
                  ],
                  false
                ),
                barBorderRadius: [30, 30, 0, 0],
                shadowColor: "rgba(0,255,225,1)",
                shadowBlur: 4
              }
            },
            label: {
              normal: {
                show: true,
                lineHeight: 20,
                width: 80,
                height: 20,
                backgroundColor: "rgba(0,160,221,0.1)",
                borderRadius: 200,
                position: ["-8", "-30"],
                distance: 1,
                formatter: "    {d|●}{a|{c}%}     \n    {b|}",
                rich: {
                  d: {
                    color: _this.themaColor
                  },
                  a: {
                    align: "center",
                    color: _this.themaColor
                  },
                  b: {
                    width: 1,
                    height: 20,
                    borderWidth: 1,
                    borderColor: "rgba(0,244,255,1)",
                    align: "left"
                  }
                }
              }
            }
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
    gettopFive() {
      let _this = this;
      let dataValueNew = _this.value;
      dataValueNew.forEach(d => {
        d.zxcytgl = ((d.zxcytg / d.zxcy) * 100).toFixed(1);
      });
      dataValueNew.sort(function (a, b) {
        return b.zxcytgl - a.zxcytgl;
      });
      _this.topFive = dataValueNew.slice(0, 5);
      _this.zxcyc = _this.topFive.map(t => {
        return t.zxcy;
      });
    },
    async loadData() {
      let _this = this;
      _this.option.xAxis[0].data = _this.topFive.map(t => {
        return t.name;
      });
      _this.option.series[0].data = _this.topFive.map(t => {
        return t.zxcytgl;
      });
      if (_this.myChart) {
        _this.myChart.clear();
        _this.$echartsc.dispose(_this.myChart);
        _this.myChart = null;
      }
      if (_this.$refs.echartContainer) {
        _this.myChart = await _this.$echartsc.init(_this.$refs.echartContainer);
        await _this.myChart.setOption(_this.option, true);
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.gettopFive();
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