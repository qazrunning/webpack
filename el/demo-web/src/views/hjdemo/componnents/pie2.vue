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
      thema:this.$store.state.core.thema,
      option: {
        color:['#c23531','#6dd8da','#61a0a8','#d48265','#91c7ae'],
        backgroundColor: "transparent",
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
          orient: "horizontal",
          x: "left",
          data: ["直接访问", "邮件营销", "联盟广告", "视频广告", "搜索引擎"],
          textStyle: { color: "#515a6e" }
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
    this.$nextTick(() => {    
      if(this.thema == "dark"){
        this.option.color = ['#DD6B66','#759AA0','#E69D87','#8DC1A9','#EA7E53'];
        this.option.legend.textStyle.color = '#AAB8C5'

      }else if(this.thema == "blue"){
        this.option.color = ['#37A2DA','#67E0E3','#FFDB5C','#FF9F7F','#E062AE']
      }
      this.ChartDraw();
    });
  },
  chartDraw() {
      const self = this;
      let myChart = self.myChart;
      window.addEventListener("resize", function() {
        myChart.resize();
      });

      myChart.clear();
      myChart.setOption(self.option);
      myChart.setOption({
        series: [
          {
            animation: true
          }
        ]
      });
    },
  destroyed() {
    window.removeEventListener("resize", function() {
      myChart.resize();
    });
  }
};
</script>

