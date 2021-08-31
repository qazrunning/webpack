<template>
  <div v-resize="resize">
    <!--创建一个echarts的容器-->
    <div ref="echartContainer2" style="width:100%; height:300px"></div>
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
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
          orient: "horizontal",
          x: "left",
          data: ["直接访问", "邮件营销", "联盟广告", "视频广告", "搜索引擎"],
          textStyle: { color: "#AAB8C5" }
        },
        series: [
          {
            name: "访问来源",
            type: "pie",
            radius: ["50%", "70%"],
            center: ["50%", "60%"], //默认全局居中
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: "center"
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: "30",
                  fontWeight: "bold"
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [
              { value: 335, name: "直接访问" },
              { value: 310, name: "邮件营销" },
              { value: 234, name: "联盟广告" },
              { value: 135, name: "视频广告" },
              { value: 1548, name: "搜索引擎" }
            ],
            animation: true
          }
        ]
      }
    };
  },
  methods: {
    resize() {
      const self = this;
      let myChart = echarts.init(this.$refs.echartContainer2);
      myChart.resize();
    },
    ChartDraw() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(this.$refs.echartContainer2);
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
    } else {
      this.option.backgroundColor = "#37404A";
      this.option.legend.textStyle.color = "#AAB8C5";
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

