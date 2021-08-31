<template>
  <div style="width:200px;height:500px" class="charts chart-pie">
    <div ref="dom"></div>
  </div>
</template>
<script>
export default {
  props: {
    value: Array,
    text: String,
    subtext: String
  },
  data() {
    return {
      dom: null
    };
  },
  methods: {
    resize() {
      if (this.dom) this.dom.resize();
    },
    loadData() {
      this.$nextTick(() => {
        var colors = ["#5793f3", "#d14a61", "#675baa"];
        let option = {
          color: colors,
          title: {
            text: "多次检测数据对比分析",
            textStyle: {
              align: "center",
              color: "#fff",
              fontSize: 20
            },
            top: "3%",
            left: "10%"
          },
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "cross"
            }
          },
          legend: {
            top: "8%",
            data: ["NO", "HC", "CO"]
          },
          xAxis: [
            {
              type: "category",
              axisTick: {
                alignWithLabel: true
              },
              data: ["2015-12-28", "2016-12-13", "2017-12-13", "2018-12-25"]
            }
          ],
          yAxis: [
            {
              type: "value",
              name: "NO(10⁻⁶)",
              position: "right",
              axisLine: {
                lineStyle: {
                  color: colors[0]
                }
              },
              axisLabel: {
                formatter: "{value}"
              }
            },
            {
              type: "value",
              name: "HC(10⁻⁶)",
              min: 0,
              max: 250,
              position: "right",
              offset: 80,
              axisLine: {
                lineStyle: {
                  color: colors[1]
                }
              },
              axisLabel: {
                formatter: "{value}"
              }
            },
            {
              type: "value",
              name: "CO",
              position: "left",
              axisLine: {
                lineStyle: {
                  color: colors[2]
                }
              },
              axisLabel: {
                formatter: "{value}%"
              }
            }
          ],
          series: [
            {
              name: "NO",
              type: "line",
              data: [323, 352, 328, 345],
              smooth: true
            },
            {
              name: "HC",
              type: "line",
              yAxisIndex: 1,
              data: [21, 35, 32, 24],
              smooth: true
            },
            {
              name: "CO",
              type: "line",
              yAxisIndex: 2,
              data: [0.22, 0.36, 0.19, 0.28],
              smooth: true
            }
          ]
        };
        if (this.dom) {
          this.dom.clear();
          this.$echartsc.dispose(this.dom);
          this.dom=null;
        }
        if (this.$refs.dom) {
          this.dom = this.$echarts.init(this.$refs.dom, "tdTheme");
          this.dom.setOption(option,true);
        }
      });
    }
  },
  mounted() {},
  beforeDestroy() {
    if (this.dom) {
      this.dom.clear();
      this.$echartsc.dispose(this.dom);
      this.dom=null;
    }
  },
  watch: {
    value(data) {
      this.loadData();
    }
  }
};
</script>