<template>
  <div style="height:calc(100%)" class="fx__box" v-resize="resize">
    <!--创建一个echarts的容器-->
    <div ref="echartContainer" style="width:100%; height:400px"></div>
    <div style="display:flex;justify-content: center;">
      <Button type="success" @click="addValue()" style="margin-left:20px">点击增加综合室人数</Button>
      <Button type="success" @click="reduceValue()" style="margin-left:20px">点击减少综合室人数</Button>
    </div>

  </div>
</template>
<script>
var echarts = require("echarts");
export default {
  data() {
    return {
      dataSoucre: {},
      departments: {},
      myChart: null,   //定义一个myChart
      themaColor: this.$store.state.core.themaColor.basetextcolor,  //从store里获取基本文字颜色
      thema:this.$store.state.core.thema,
    };
  },
  computed: {
    // 图表的配置信息
    option() {
      let _this = this;
      return {
        backgroundColor: "transparent",
        //提示框
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        //该项设置每区域饼图颜色
        color: [
          "#C1232B",
          "#B5C334",
          "#FCCE10",
          "#E87C25",
          "#27727B",
          "#FE8463",
          "#9BCA63",
          "#FAD860",
          "#F3A43B",
          "#60C0DD",
          "#D7504B",
          "#C6E579"
        ],
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
                  color: _this.themaColor
                }
              }
            },
            labelLine: {
              normal: {
                lineStyle: {
                  color: "#AAB8C5"
                },
                smooth: 0.2,
                length: 10,
                length2: 20
              }
            },
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
      };
    }
  },
  methods: {
    //调接口拿数据，画图
    async loadData() {
      let _this = this;
      await _this.$curl.get("/api/demo/usermanager/getall").then(res => {
        let { users, departments } = res;
        _this.dataSoucre = users;
        _this.departments = departments;
        let list = [];
        _this.departments.forEach(DPitem => {
          let count = 0;
          _this.dataSoucre.forEach(DSitem => {
            if (DSitem.DPID == DPitem.DPID) {
              count++;
            }
          });
          let res = { value: count, name: DPitem.DPName };
          list.push(res);
        });
        _this.option.series[0].data = list;
      });
      _this.myChart = await echarts.init(this.$refs.echartContainer);
      await _this.myChart.setOption(_this.option);
    },
    addValue() {
      this.option.series[0].data[1].value += 1;
    },
    reduceValue() {
      this.option.series[0].data[1].value -= 1;
    },
    resize() {
      const self = this;
      let myChart = self.myChart;
      myChart.resize();
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
    this.$nextTick(() => {
      this.loadData();
    });
  },
};
</script>

