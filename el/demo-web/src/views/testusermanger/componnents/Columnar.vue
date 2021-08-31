<template>
  <div v-resize="resize">
    <!--创建一个echarts的容器-->
    <div ref="echartContainer3" style="width:100%; height:500px"></div>
  </div>
</template>
<script>
let echarts = require("echarts");
export default {
  data() {
    return {
      option: {
        backgroundColor: "#37404A",
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: [
            "直接访问",
            "邮件营销",
            "联盟广告",
            "视频广告",
            "搜索引擎",
            "百度",
            "谷歌",
            "必应",
            "其他"
          ],
          textStyle: { color: "#AAB8C5" }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
            axisLabel: {
              textStyle: {
                color: "#AAB8C5"
              }
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            axisLabel: {
              textStyle: {
                color: "#AAB8C5"
              }
            }
          }
        ],
        series: [
          {
            name: "直接访问",
            type: "bar",
            data: [320, 332, 301, 334, 390, 330, 320]
          },
          {
            name: "邮件营销",
            type: "bar",
            stack: "广告",
            data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
            name: "联盟广告",
            type: "bar",
            stack: "广告",
            data: [220, 182, 191, 234, 290, 330, 310]
          },
          {
            name: "视频广告",
            type: "bar",
            stack: "广告",
            data: [150, 232, 201, 154, 190, 330, 410]
          },
          {
            name: "搜索引擎",
            type: "bar",
            data: [862, 1018, 964, 1026, 1679, 1600, 1570],
            markLine: {
              lineStyle: {
                normal: {
                  type: "dashed"
                }
              },
              data: [[{ type: "min" }, { type: "max" }]]
            }
          },
          {
            name: "百度",
            type: "bar",
            barWidth: 5,
            stack: "搜索引擎",
            data: [620, 732, 701, 734, 1090, 1130, 1120]
          },
          {
            name: "谷歌",
            type: "bar",
            stack: "搜索引擎",
            data: [120, 132, 101, 134, 290, 230, 220]
          },
          {
            name: "必应",
            type: "bar",
            stack: "搜索引擎",
            data: [60, 72, 71, 74, 190, 130, 110]
          },
          {
            name: "其他",
            type: "bar",
            stack: "搜索引擎",
            data: [62, 82, 91, 84, 109, 110, 120]
          }
        ]
      }
    };
  },
  methods: {
    resize() {
      const self = this;
      let myChart = echarts.init(this.$refs.echartContainer3);
      myChart.resize();
    },
    ChartDraw() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(this.$refs.echartContainer3);
      window.addEventListener("resize", function() {
        myChart.resize();
      });
      // 绘制图表
      myChart.setOption(this.option);
    }
  },
  mounted() {
    if (localStorage.themeStyle == "light") {
      this.option.backgroundColor = "#FFFFFF";
      this.option.legend.textStyle.color = "black";
      this.option.xAxis[0].axisLabel.textStyle.color = "black";
      this.option.yAxis[0].axisLabel.textStyle.color = "black";
    } else {
      this.option.backgroundColor = "#37404A";
      this.option.legend.textStyle.color = "#AAB8C5";
      this.option.xAxis[0].axisLabel.textStyle.color = "#AAB8C5";
      this.option.yAxis[0].axisLabel.textStyle.color = "#AAB8C5";
    }
    this.$nextTick(() => {
      this.ChartDraw();
    });
  },
  destroyed() {
    window.removeEventListener("resize", function() {
      myChart.resize();
    });
  }
};
</script>

