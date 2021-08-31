<template>
  <div v-resize='resize'>
    <!--创建一个echarts的容器-->
    <div ref="echartContainer" style="width:100%;height:100%"></div>
  </div>
</template>
<script>
import tdTheme from "./theme.json";
export default {
  name: "KindPie",
  props: {
    value: Array,
    text: String,
    subtext: String,
    lineWidth:{
      type:Number,
      default:10
    }
  },
  data() {
    return {
      myChart: null,
      valdata: [],
      valTitle: [],
      sumdata: 0,
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
        color: ["#F4F4F4"],
        tooltip: {
          trigger: "item",
          show: true,
          formatter: "{b} :<br/>{d}%",
          backgroundColor: "rgba(0,0,0,0.7)", // 背景
          padding: [8, 10], //内边距
          extraCssText: "box-shadow: 0 0 3px rgba(255, 255, 255, 0.4);" //添加阴影
        },
        legend: {
          orient: "vertical",
          // icon: 'circle',
          left: "left",
          top: "80",
          itemGap: 20,
          data: "",
          formatter: function (name) {
            let sums = 0;
            _this.value.map(e => {
              if (e.name == name) sums = e.value;
            });
            if (sums) {
              sums = ((sums / _this.sumdata) * 100).toFixed(2);
            }
            return name + ": " + sums + "%";
          },
          textStyle: {
            color: "#fft"
          }
        },
        series: [
          {
            name: "Line 1",
            type: "pie",
            clockWise: false,
            radius: [100 - _this.lineWidth, 100],
            center: ["70%", "50%"],
            itemStyle: {
              normal: {
                label: {
                  show: false
                },
                labelLine: {
                  show: false
                },
                shadowBlur: 40,
                borderWidth: 10,
                shadowColor: "rgba(0, 0, 0, 0)" //边框阴影
              }
            },
            hoverAnimation: false,
            startAngle: 90,
            label: {
              borderRadius: "10"
            },
            data: [
              {
                value: 0,
                name: "",
                itemStyle: {
                  normal: {
                    color: "#858EF5"
                  }
                }
              },
              {
                value: 0,
                name: "",
                tooltip: {
                  show: false
                }
              }
            ]
          },
          {
            name: "Line 2",
            type: "pie",
            clockWise: false,
            radius: [100 - _this.lineWidth*3, 100 - _this.lineWidth*2],
            center: ["70%", "50%"],
            itemStyle: {
              normal: {
                label: {
                  show: false
                },
                labelLine: {
                  show: false
                },
                shadowBlur: 40,
                borderWidth: 10,
                shadowColor: "rgba(0, 0, 0, 0)" //边框阴影
              }
            },
            hoverAnimation: false,
            startAngle: 90,
            data: [
              {
                value: 0,
                name: "",
                itemStyle: {
                  normal: {
                    color: "#0DB5CA"
                  }
                }
              },
              {
                value: 0,
                name: "",
                tooltip: {
                  show: false
                }
                //itemStyle: placeHolderStyle
              }
            ]
          },
          {
            name: "Line 3",
            type: "pie",
            clockWise: false,
            radius: [100 - _this.lineWidth*5, 100 - _this.lineWidth*4],
            center: ["70%", "50%"],
            itemStyle: {
              normal: {
                label: {
                  show: false
                },
                labelLine: {
                  show: false
                },
                shadowBlur: 40,
                borderWidth: 10,
                shadowColor: "rgba(0, 0, 0, 0)" //边框阴影
              }
            },
            hoverAnimation: false,
            startAngle: 90,
            data: [
              {
                value: 0,
                name: "",
                itemStyle: {
                  normal: {
                    color: "#FD9912"
                  }
                }
              },
              {
                value: 0,
                name: "",
                tooltip: {
                  show: false
                }
              }
            ]
          },
          {
            name: "Line 4",
            type: "pie",
            clockWise: false,
            radius: [100 - _this.lineWidth*7, 100 - _this.lineWidth*6],
            center: ["70%", "50%"],
            itemStyle: {
              normal: {
                label: {
                  show: false
                },
                labelLine: {
                  show: false
                },
                shadowBlur: 40,
                borderWidth: 10,
                shadowColor: "rgba(0, 0, 0, 0)" //边框阴影
              }
            },
            hoverAnimation: false,
            startAngle: 90,
            data: [
              {
                value: 0,
                name: "",
                itemStyle: {
                  normal: {
                    color: "#ff4eaf"
                  }
                }
              },
              {
                value: 0,
                name: "",
                tooltip: {
                  show: false
                }
              }
            ]
          },
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
    async loadData() {
      let _this = this;
      let labelShow = {
        show: true,
        color: "#000",
        fontSize: 12,
        formatter: ["{d| {d}% }", "{b| {b} }"].join("\n"),
        rich: {
          d: {
            fontSize: 12,
            color: "#000"
          },
          b: {
            fontSize: 12,
            color: "#000"
          }
        }
      };
      _this.valdata = _this.value.map(_ => _.value);
      _this.valTitle = _this.value.map(_ => _.name);
      _this.sumdata = _this.GetSumData(_this.valdata);
      _this.option.legend.data = _this.valTitle;
      _this.option.series[0].data[0].value = _this.valdata[0];
      _this.option.series[0].data[0].name = _this.valTitle[0];
      _this.option.series[0].data[1].value = _this.sumdata - _this.valdata[0];
      _this.option.series[1].data[0].value = _this.valdata[1];
      _this.option.series[1].data[0].name = _this.valTitle[1];
      _this.option.series[1].data[1].value = _this.sumdata - _this.valdata[1];
      _this.option.series[2].data[0].value = _this.valdata[2];
      _this.option.series[2].data[0].name = _this.valTitle[2];
      _this.option.series[2].data[1].value = _this.sumdata - _this.valdata[2];
      _this.option.series[3].data[0].value = _this.valdata[3];
      _this.option.series[3].data[0].name = _this.valTitle[3];
      _this.option.series[3].data[1].value = _this.sumdata - _this.valdata[3];
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