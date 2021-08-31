<template>
  <div v-resize="resize">
    <!--创建一个echarts的容器-->
    <div ref="LabelType" style="width:100%;height:100%"></div>
  </div>
</template>
<script>
export default {
  name: "cbcstatis",
  props: {
    value: Array,
    text: String,
    subtext: String
  },
  data() {
    return {
      myChart: null,
      themaColor: this.$store.state.core.themaColor.basetextcolor
    };
  },
  computed: {
    option() {
      let _this = this;
      // let cbcTotal = 0;
      // let cbcNum = ;
      // cbcNum.forEach(v => (cbcTotal += +v));
      return {
        backgroundColor: "transparent",
        color: ["#3398DB"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
          // formatter:function(value){
          //   return value[0].name+':'+value[0].value+'辆'
          // }
        },
        title: {
          text: _this.text,
          left: "center",
          textStyle: { color: _this.themaColor, fontSize: "18" },
          subtext: _this.subtext
          // x: "left"
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "value",
            data: [],
            boundaryGap: [0, 0.01],
            axisTick: {
              show: false,
              color: "#707070"
            },
            axisLabel: {
              interval: 0 //强制显示
            },
            axisLine: {
              show: true, //隐藏X轴轴线
              lineStyle: {
                color: _this.themaColor
              }
            }
          }
        ],
        yAxis: [
          {
            // show: false,
            type: "category",
            data: [],
            axisLine: {
              show: true, //隐藏X轴轴线
              lineStyle: {
                color: _this.themaColor
              }
            }
          }
        ],
        series: [
          {
            name: "超标数",
            type: "bar",
            barWidth: 5,
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  position: "right",
                  formatter: "{c}",
                  color: _this.themaColor
                },
                shadowColor: "rgba(0, 0, 0, 0.6)"
              }
            },
            data: []
          }
          // {
          //   name: "占比",
          //   type: "bar",
          //   barWidth: 5,
          //   itemStyle: {
          //     normal: {
          //       label: {
          //         show: true,
          //         position: "right",
          //         formatter: "{c}",
          //         color: _this.themaColor
          //       },
          //       shadowColor: "rgba(0, 0, 0, 0.6)"
          //     }
          //   },
          //   data: _this.value.map(v =>  new Number(v.total / cbcTotal).toFixed(2) + "%")
          // }
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
    async loadData() {
      // this.option.xAxis[0].data = this.value.map(_ => _.FactoryPlateModel);
      this.option.yAxis[0].data = this.value.map(_ => {
        if (_.FactoryPlateModel) return _.FactoryPlateModel;
        else if (_.StationCode) return _.StationCode;
        else if (_.OwnerName) return _.OwnerName;
        else if (_.Province) return _.Province;
      });
      this.option.series[0].data = this.value.map(_ => _.total);
      if (this.myChart) {
        this.myChart.clear();
        this.$echartsc.dispose(this.myChart);
        this.myChart = null;
      }
      if (this.$refs.LabelType) {
        this.myChart = await this.$echartsc.init(this.$refs.LabelType);
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
    if (this.myChart) {
      this.myChart.clear();
      this.$echartsc.dispose(this.myChart);
      this.myChart = null;
    }
  }
};
</script>
