<template>
  <div v-resize="resize">
    <!--创建一个echarts的容器-->
    <div ref="echartContainer" style="width:100%; height:300px"></div>
    <!-- <button @click="addValue()" style="margin-left:20px">点击增加综合室人数</button>
    <button @click="reduceValue()" style="margin-left:20px">点击减少综合室人数</button> -->
  </div>
</template>
<script>
var echarts = require("echarts");
export default {
  data() {
    return {
      thema:this.$store.state.core.thema,
      dataSoucre: {},
      departments: {},
      myChart: null,
      option: {
        backgroundColor: "transparent",
        //提示框
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        //该项为设置饼图颜色,渐变样式
        // visualMap: {
        //   show: false,
        //   min: 0,
        //   max: 13,
        //   inRange: {
        //     colorLightness: [0, 1]
        //   }
        // },

        //该项设置每区域饼图颜色
        color: ["#E062AE","#DD6B66","#759AA0","#E69D87","#8DC1A9","#EA7E53", "#EEDD78","#73A373","#73B9BC","#7289AB","#91CA8C","#F49F42"],

        //系列设置
        series: [
          {
            name: "user类别",
            type: "pie",
            radius: "55%",
            center: ["50%", "50%"], //默认全局居中
            data: [],
            roseType: "radius",

            label: {
              normal: {
                textStyle: {
                  color: "#AAB8C5"
                },
                textStyle:{
                  color: ''
                },
              }
            },
            // label: {
            //   normal: {
            //     //饼形图显示格式
            //     formatter: "{b|{b}}  {per|{d}%}  ",
            //     rich: {
            //       b: {
            //         color: "white",
            //         fontSize: 14,
            //         lineHeight: 33
            //       },
            //       //设置百分比数字颜色
            //       per: {
            //         color: "#00B4FB",
            //         fontSize: 14,
            //         padding: [2, 4],
            //         borderRadius: 2
            //       }
            //     }
            //   }
            // },
            labelLine: {
              normal: {
                lineStyle: {
                  color: "#AAB8C5"
                },
                textStyle:{
                  color: ''
                },
                smooth: 0.2,
                length: 10,
                length2: 20
              }
            },
            // itemStyle: {
            //   normal: {
            //     color: "#c23531",
            //     shadowBlur: 200,
            //     shadowColor: "rgba(0, 0, 0, 0.5)"
            //   }
            // },
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            },

            animation: true,
            animationType: "scale",
            animationEasing: "elasticOut",
            animationDelay: function(idx) {
              return Math.random() * 200;
            }
          }
        ]
      }
    };
  },
  // computed: {
  //   thema() {
  //     return this.$store.state.core.thema;
  //   }
  // },
  watch: {
    option: {
      handler(newVal, oldVal) {
        if (this.myChart) {
          this.option.series[0].animation = false;
          this.chartDraw();
        } else {
          this.myChart = echarts.init(this.$refs.echartContainer);
          this.chartDraw();
        }
      },
      deep: true
    },
    //根据store的thema的值来改变echarts属性配置
    thema(val) {
      if (val == "light") {
        this.option.series[0].label.normal.textStyle.color = "#37404A";
        this.option.series[0].labelLine.normal.textStyle.color = "#37404A";
      } else {
        this.option.series[0].label.normal.textStyle.color = "#ccc";
        this.option.series[0].labelLine.normal.textStyle.color = "#ccc";
      }
    }
  },

  methods: {
    async loadData() {
      let self = this;
      this.$curl.get("/api/demo/usermanager/getall").then(res => {
        let { users, departments } = res;
        self.dataSoucre = users;
        self.departments = departments;
        let list = [];
        self.departments.forEach(DPitem => {
          let count = 0;
          self.dataSoucre.forEach(DSitem => {
            if (DSitem.DPID == DPitem.DPID) {
              count++;
            }
          });
          let res = { value: count, name: DPitem.DPName };
          list.push(res);
        });
        self.option.series[0].data = list;
      });
    },
    addValue() {
      this.option.series[0].data[1].value += 1;
    },
    reduceValue() {
      this.option.series[0].data[1].value -= 1;
    },
    resize() {
      const self = this;
      if (self.myChart) {
        let myChart = self.myChart;
        myChart.resize();
      }
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
    }
  },
  mounted() {
    if (this.thema == "dark") {
      // this.option.backgroundColor = "#FFFFFF";
      // this.option.series[0].label.normal.textStyle.color = "#37404A";
      // this.option.series[0].labelLine.normal.textStyle.color = "#37404A"; 
      this.option.color = ["#DD6B66","#759AA0","#E69D87","#8DC1A9","#EA7E53","#EEDD78","#73A373","#73B9BC","#7289AB","#E7BCF3","#9D96F5","#8378EA"]
    } else if(this.thema == "blue"){
      // this.option.backgroundColor = "#37404A";
      // this.option.series[0].label.normal.textStyle.color = "#ccc";
      // this.option.series[0].labelLine.normal.textStyle.color = "#ccc";
      this.option.color =  ["#37A2DA","#32C5E9","#67E0E3","#9FE6B8","#FFDB5C","#FF9F7F", "#FB7293","#E062AE","#E690D1","#7289AB","#91CA8C","#F49F42"]
    }
    // this.myChart = echarts.init(self.$refs.echartContainer);
    this.$nextTick(() => {
      this.loadData();
    });
  },
  destroyed() {
    window.removeEventListener("resize", function() {
      myChart.resize();
    });
  }
};
</script>

