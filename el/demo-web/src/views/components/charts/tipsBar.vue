<template>
  <div v-resize="resize">
    <div ref="dom"></div>
  </div>
</template>
<script>
export default {
  name: "TipsBar",
  props: {
    dataValue: Array,
    text: String,
    subtext: String
  },
  data() {
    return {
      dom: null,
      topFive: [],
      lastFive: [],
      topFiveBrand: [],
      lastFiveBrand: []
    };
  },
  methods: {
    resize() {
      if (this.dom) this.dom.resize();
    },
    selectTop() {
      this.dataValue.forEach(v => {
        v.zxcytgl = (v.zxcytg / v.zxcy).toFixed(2);
      });
      this.dataValue.sort(function (a, b) {
        return b.zxcytgl - a.zxcytgl;
      });
      this.topFive = this.dataValue.slice(0, 5).map(c => {
        return (c.zxcytgl * 100).toFixed(0);
      });
      this.topFiveBrand = this.dataValue.slice(0, 5).map(c => {
        return c.FactoryPlateModel;
      });
      this.dataValue.sort(function (a, b) {
        return a.zxcytgl - b.zxcytgl;
      });
      this.lastFive = this.dataValue.slice(0, 5).map(c => {
        return ((1 - c.zxcytgl) * 100).toFixed(0);
      }); //通过率最低前5
      this.lastFiveBrand = this.dataValue.slice(0, 5).map(c => {
        return c.lastFiveBrand;
      }); //通过率最低前5
    },
    loadData() {
      this.$nextTick(() => {
        let option = {
          tooltip: {
            trigger: "axis",
            axisPointer: {
              // 坐标轴指示器，坐标轴触发有效
              type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
            }
            // formatter:function(params){
            //   console.log(params)
            //   return params[0].value+'%'
            // }
          },
          title: {
            text: this.text,
            textStyle: { color: "#6A6A6A", fontSize: "18" },
            x: "left"
          },
          grid: {
            left: "2%",
            right: "4%",
            bottom: "14%",
            top: "16%",
            containLabel: true
          },
          legend: {
            data: ["初检通过率", "初检不通过率"],
            right: 10,
            top: 12,
            itemWidth: 12,
            itemHeight: 10
          },
          xAxis: {
            type: "category",
            data: this.topFiveBrand,
            length: 1,
            axisLabel: {
              // rotate:60,
              textStyle: {
                fontFamily: "Microsoft YaHei"
              }
            },
            axisPointer: {
              //x轴指示器，可自行设置不同的值观察有何不同
            }
          },

          yAxis: {
            type: "value",
            name: "%",
            splitLine: {
              show: true,
              lineStyle: {
                type: "dashed"
              }
            },
            axisLabel: {}
            // axisLine:{symbol:['none','arrow']}
          },

          series: [
            {
              name: "初检通过率",
              type: "bar",
              barWidth: "15%",
              itemStyle: {
                normal: {
                  color: new this.$echartsc.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: "#3dd4d1"
                    },
                    {
                      offset: 1,
                      color: "#06a7fa"
                    }
                  ]),
                  barBorderRadius: 12
                }
              },
              data: this.topFive
            },
            {
              name: "初检不通过率",
              type: "bar",
              barWidth: "15%",
              itemStyle: {
                normal: {
                  color: new this.$echartsc.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: "#fea01b"
                    },
                    {
                      offset: 1,
                      color: "#ffcd53"
                    }
                  ]),
                  barBorderRadius: 11
                }
              },
              data: this.lastFive
            }
          ]
        };
        if (this.dom) {
          this.dom.clear();
          this.$echartsc.dispose(this.dom);
          this.dom = null;
        }
        if (this.$refs.dom) {
          this.dom = this.$echartsc.init(this.$refs.dom, "");
          this.dom.setOption(option, true);
        }
      });
    }
  },
  mounted() {
    this.loadData();
    this.selectTop();
  },
  beforeDestroy() {
    if (this.dom) {
      this.dom.clear();
      this.$echartsc.dispose(this.dom);
      this.dom = null;
    }
  },
  watch: {
    dataValue(data) {
      this.loadData();
    }
  }
};
</script>