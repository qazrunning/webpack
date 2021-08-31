<template>
  <div v-resize="resize">
    <!--创建一个echarts的容器-->
    <div ref="echartContainer" style="width:100%;height:100%"></div>
  </div>
</template>
<script>
export default {
  name: "TypePie",
  props: {
    value: Array,
    text: String,
    subtext: String
  },
  data() {
    return {
      sumValue: "",
      myChart: null,
      arrName: [],
      optionData: {},
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
        legend: {
          show: true,
          top: "left",
          left: "0%",
          data: _this.arrName,
          itemWidth: 30,
          itemHeight: 20,
          width: 50,
          padding: [60, 5, 0, 5],
          itemGap: 5,
          formatter: function (name) {
            return (
              "{title|" + name + "}"
              //  n{value|" + objData[name].value + "辆}"
            );
          },
          textStyle: {
            rich: {
              title: {
                fontSize: 10,
                lineHeight: 10,
                color: _this.themaColor
              },
              value: {
                fontSize: 14,
                lineHeight: 18,
                color: _this.themaColor
              }
            }
          }
        },
        tooltip: {
          show: true,
          trigger: "item",
          formatter: "{a}<br>{b}:{c}({d}%)"
        },
        color: [
          "#85b6b2",
          "#6d4f8d",
          "#cd5e7e",
          "#e38980",
          "#f7db88",
          "#0099CC"
        ],
        grid: {
          top: "20%",
          bottom: "48%",
          left: "56%",
          containLabel: false
        },
        yAxis: [
          {
            type: "category",
            inverse: true,
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              interval: 0,
              inside: true,
              textStyle: {
                color: _this.themaColor,
                fontSize: 12
              },
              show: true
            },
            data: _this.optionData.yAxis
          }
        ],
        xAxis: [
          {
            show: false
          }
        ],
        series: _this.optionData.series
      };
    }
  },
  methods: {
    resize() {
      if (this.myChart) this.myChart.resize();
    },
    getArrayValue(array, key) {
      var key = key || "value";
      var res = [];
      if (array) {
        array.forEach(function (t) {
          res.push(t[key]);
        });
      }
      return res;
    },
    array2obj(array, key) {
      var resObj = {};
      for (var i = 0; i < array.length; i++) {
        resObj[array[i][key]] = array[i];
      }
      return resObj;
    },
    getData(data) {
      var res = {
        series: [],
        yAxis: []
      };
      for (let i = 0; i < data.length; i++) {
        res.series.push({
          name: "排放标准",
          type: "pie",
          clockWise: false, //顺时加载
          hoverAnimation: false, //鼠标移入变大
          radius: [65 - i * 10 + "%", 57 - i * 10 + "%"],
          center: ["55%", "55%"],
          label: {
            show: false
          },
          itemStyle: {
            label: {
              show: false
            },
            labelLine: {
              show: false
            },
            borderWidth: 5
          },
          data: [
            {
              value: data[i].value,
              name: data[i].name
            },
            {
              value: this.sumValue - data[i].value,
              name: "",
              itemStyle: {
                color: "rgba(0,0,0,0)",
                borderWidth: 0
              },
              tooltip: {
                show: false
              },
              hoverAnimation: false
            }
          ]
        });
        res.series.push({
          name: "",
          type: "pie",
          silent: true,
          z: 1,
          clockWise: false, //顺时加载
          hoverAnimation: false, //鼠标移入变大
          radius: [65 - i * 10 + "%", 57 - i * 10 + "%"],
          center: ["55%", "55%"],
          label: {
            show: false
          },
          itemStyle: {
            label: {
              show: false
            },
            labelLine: {
              show: false
            },
            borderWidth: 5
          },
          data: [
            {
              value: 7.5,
              itemStyle: {
                color: "#E3F0FF",
                borderWidth: 0
              },
              tooltip: {
                show: false
              },
              hoverAnimation: true
            },
            {
              value: 2.5,
              name: "",
              itemStyle: {
                color: "rgba(0,0,0,0)",
                borderWidth: 0
              },
              tooltip: {
                show: false
              },
              hoverAnimation: false
            }
          ]
        });
        res.yAxis.push(
          data[i].name +
          ":" +
          ((data[i].value / this.sumValue) * 100).toFixed(2) +
          "%" +
          " (" +
          data[i].value +
          "辆)"
        );
      }
      return res;
    },

    async loadData() {
      //let legend = this.value.map(_ => _.name);
      this.arrName = this.getArrayValue(this.value, "name");
      let arrValue = this.getArrayValue(this.value, "value");
      this.sumValue = eval(arrValue.join("+"));
      let objData = this.array2obj(this.value, "name");
      this.optionData = this.getData(this.value);
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
    off(window, "resize", this.resize);
    if (this.myChart) {
      this.myChart.clear();
      this.$echartsc.dispose(this.myChart);
      this.myChart = null;
    }
  }
};
</script>