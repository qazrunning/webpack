<template>
  <!-- 简易瞬态工况法 -->
  <div
    :class="isInspectProcessInfo===0?'chartBox':'chartBox1'"
    ref="chartBox"
  >
    <div
      ref="cs_div"
      class="chartSize"
    ></div>
    <div
      ref="fdjzs_div"
      class="chartSize"
    ></div>
    <div
      ref="dpcgjjzzh_div"
      class="chartSize"
    ></div>
    <div
      ref="hcwxz_div"
      class="chartSize"
    ></div>
    <div
      ref="hcxzh_div"
      class="chartSize"
    ></div>
    <div
      ref="cowxz_div"
      class="chartSize"
    ></div>
    <div
      ref="coxzh_div"
      class="chartSize"
    ></div>
    <div
      ref="noxwxz_div"
      class="chartSize"
    ></div>
    <div
      ref="noxxzh_div"
      class="chartSize"
    ></div>
    <div
      ref="co2wxz_div"
      class="chartSize"
    ></div>
    <div
      ref="o2wxz_div"
      class="chartSize"
    ></div>
    <div
      ref="o2xzh_div"
      class="chartSize"
    ></div>
    <div
      ref="xspqll_div"
      class="chartSize"
    ></div>
    <div
      ref="xsxs_div"
      class="chartSize"
    ></div>
    <div
      ref="nosdxzxs_div"
      class="chartSize"
    ></div>
    <div
      ref="rz_div"
      class="chartSize"
    ></div>
    <div
      ref="nf_div"
      class="chartSize"
    ></div>
  </div>
</template>

<script>
import { isNull } from "util";
export default {
  props: {
    IUTYPE: {
      type: String
    },
    ProcessData: {
      type: Array
    },
    processResultHeight: {
      type: Number,
      default: 0
    },
    isInspectProcessInfo:{//InspectProcessInfo.vue传来
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      themaColor: this.$store.state.core.themaColor.basetextcolor,
      cs_div: null,
      fdjzs_div: null,
      dpcgjjzzh_div: null,
      hcwxz_div: null,
      hcxzh_div: null,
      cowxz_div: null,
      coxzh_div: null,
      noxwxz_div: null,
      noxxzh_div: null,
      co2wxz_div: null,
      o2wxz_div: null,
      o2xzh_div: null,
      xspqll_div: null,
      xsxs_div: null,
      nosdxzxs_div: null,
      rz_div: null,
      nf_div: null
    }
  },
  mounted() {
    console.log(this.isInspectProcessInfo);
    console.log('加载简易瞬态组件')
    this.handleProcessData();
    this.setHeight();
  },
  methods: {
    setHeight() {
      this.$refs.chartBox.style.height = (window.document.body.offsetHeight - this.processResultHeight - 200) + 'px';
    },
    handleProcessData() {
      this.cs_chart();
      this.fdjzs_chart();
      this.dpcgjjzzh_chart();
      this.hcwxz_chart();
      this.hcxzh_chart();
      this.cowxz_chart();
      this.coxzh_chart();
      this.noxwxz_chart();
      this.noxxzh_chart();
      this.co2wxz_chart();
      this.o2wxz_chart();
      this.o2xzh_chart();
      this.xspqll_chart();
      this.xsxs_chart();
      this.nosdxzxs_chart();
      this.rz_chart();
      this.nf_chart();
    },
    toFlostTwo(value) {
      if (value == null) return "";
      if (value == 0.001) return value;
      value = Number(value).toFixed(2);
      return value;
    },
    cs_chart() {
      let formatData = {
        xAxisData: [],
        yAxis: {}
      };
      const resData = this.ProcessData;
      resData.forEach(item => {
        formatData.xAxisData.push(item.Second_NO || Second_No);
      });
      if (this.cs_div) {
        this.cs_div.clear();
        this.$echartsc.dispose(this.cs_div);
        this.cs_div = null;
      }
      if (this.$refs.cs_div) {
        this.cs_div = this.$echartsc.init(this.$refs.cs_div);
        // 指定图表的配置项和数据
        let seriesData = resData.map(item =>
          isNull(item.Flow_Speed)
            ? this.toFlostTwo(item.LineSpeed == 0 ? 0.001 : item.LineSpeed)
            : this.toFlostTwo(item.Flow_Speed == 0 ? 0.001 : item.Flow_Speed)
        )
        let option = this.getOption("#00BCD4", "车速", formatData.xAxisData, seriesData, 'value', 0, 50);
        this.cs_div.setOption(option, true);
      }
    },
    fdjzs_chart() {
      let formatData = {
        xAxisData: [],
        yAxis: {}
      };
      const resData = this.ProcessData;
      resData.forEach(item => {
        formatData.xAxisData.push(item.Second_NO || Second_No);
      });
      if (this.fdjzs_div) {
        this.fdjzs_div.clear();
        this.$echartsc.dispose(this.fdjzs_div);
        this.fdjzs_div = null;
      }
      if (this.$refs.fdjzs_div) {
        this.fdjzs_div = this.$echartsc.init(this.$refs.fdjzs_div);
        // 指定图表的配置项和数据
        let seriesData = resData.map(item =>
          isNull(item.Flow_RotateSpeed)
            ? this.toFlostTwo(item.RotateSpeed == 0 ? 0.001 : item.RotateSpeed)
            : this.toFlostTwo(item.Flow_RotateSpeed == 0 ? 0.001 : item.Flow_RotateSpeed)
        )
        let option = this.getOption("#E91E63", "发动机转速", formatData.xAxisData, seriesData, "value", 0, 10000);
        this.fdjzs_div.setOption(option, true);
      }
    },
    dpcgjjzzh_chart() {
      let formatData = {
        xAxisData: [],
        yAxis: {}
      };
      const resData = this.ProcessData;
      resData.forEach(item => {
        formatData.xAxisData.push(item.Second_NO || Second_No);
      });
      if (this.dpcgjjzzh_div) {
        this.dpcgjjzzh_div.clear();
        this.$echartsc.dispose(this.dpcgjjzzh_div);
        this.dpcgjjzzh_div = null;
      }
      if (this.$refs.dpcgjjzzh_div) {
        this.dpcgjjzzh_div = this.$echartsc.init(this.$refs.dpcgjjzzh_div);
        // 指定图表的配置项和数据
        let seriesData = resData.map(item => this.toFlostTwo(item.Flow_Freeweight == 0 ? 0.001 : item.Flow_Freeweight))
        let option = this.getOption("#FF9800", "底盘测功机加载载荷", formatData.xAxisData, seriesData);
        this.dpcgjjzzh_div.setOption(option, true);
      }
    },
    hcwxz_chart() {
      let formatData = {
        xAxisData: [],
        yAxis: {}
      };
      const resData = this.ProcessData;
      resData.forEach(item => {
        formatData.xAxisData.push(item.Second_NO || Second_No);
      });
      if (this.hcwxz_div) {
        this.hcwxz_div.clear();
        this.$echartsc.dispose(this.hcwxz_div);
        this.hcwxz_div = null;
      }
      if (this.$refs.hcwxz_div) {
        this.hcwxz_div = this.$echartsc.init(this.$refs.hcwxz_div);
        // 指定图表的配置项和数据
        let seriesData = resData.map(item => item.Flow_HC == 0 ? 0.001 : item.Flow_HC);
        let option = this.getOption("#009688", "HC(未修正)", formatData.xAxisData, seriesData);
        this.hcwxz_div.setOption(option, true);
      }
    },
    hcxzh_chart() {
      let formatData = {
        xAxisData: [],
        yAxis: {}
      };
      const resData = this.ProcessData;
      resData.forEach(item => {
        formatData.xAxisData.push(item.Second_NO || Second_No);
      });
      if (this.hcxzh_div) {
        this.hcxzh_div.clear();
        this.$echartsc.dispose(this.hcxzh_div);
        this.hcxzh_div = null;
      }
      if (this.$refs.hcxzh_div) {
        this.hcxzh_div = this.$echartsc.init(this.$refs.hcxzh_div);
        // 指定图表的配置项和数据
        let seriesData = resData.map(item => item.Flow_HCCorrect == 0 ? 0.001 : item.Flow_HCCorrect);
        let option = this.getOption("#607D8B", "HC(修正后)", formatData.xAxisData, seriesData);
        this.hcxzh_div.setOption(option, true);
      }
    },
    cowxz_chart() {
      let formatData = {
        xAxisData: [],
        yAxis: {}
      };
      const resData = this.ProcessData;
      resData.forEach(item => {
        formatData.xAxisData.push(item.Second_NO || Second_No);
      });
      if (this.cowxz_div) {
        this.cowxz_div.clear();
        this.$echartsc.dispose(this.cowxz_div);
        this.cowxz_div = null;
      }
      if (this.$refs.cowxz_div) {
        this.cowxz_div = this.$echartsc.init(this.$refs.cowxz_div);
        // 指定图表的配置项和数据
        let seriesData = resData.map(item => item.Flow_CO == 0 ? 0.001 : item.Flow_CO)
        let option = this.getOption("#AB47BC", "CO(未修正)", formatData.xAxisData, seriesData);
        this.cowxz_div.setOption(option, true);
      }
    },
    coxzh_chart() {
      let formatData = {
        xAxisData: [],
        yAxis: {}
      };
      const resData = this.ProcessData;
      resData.forEach(item => {
        formatData.xAxisData.push(item.Second_NO || Second_No);
      });
      if (this.coxzh_div) {
        this.coxzh_div.clear();
        this.$echartsc.dispose(this.coxzh_div);
        this.coxzh_div = null;
      }
      if (this.$refs.coxzh_div) {
        this.coxzh_div = this.$echartsc.init(this.$refs.coxzh_div);
        // 指定图表的配置项和数据
        let seriesData = resData.map(item => item.Flow_COCorrect == 0 ? 0.001 : item.Flow_COCorrect);
        let option = this.getOption("rgb(4,147,207)", "CO(修正后)", formatData.xAxisData, seriesData);
        this.coxzh_div.setOption(option, true);
      }
    },
    noxwxz_chart() {
      let formatData = {
        xAxisData: [],
        yAxis: {}
      };
      const resData = this.ProcessData;
      resData.forEach(item => {
        formatData.xAxisData.push(item.Second_NO || Second_No);
      });
      if (this.noxwxz_div) {
        this.noxwxz_div.clear();
        this.$echartsc.dispose(this.noxwxz_div);
        this.noxwxz_div = null;
      }
      if (this.$refs.noxwxz_div) {
        this.noxwxz_div = this.$echartsc.init(this.$refs.noxwxz_div);
        // 指定图表的配置项和数据
        let seriesData = resData.map(item => item.Flow_NOX == 0 ? 0.001 : item.Flow_NOX);
        let option = this.getOption("rgb(255,82,8)", "NOX(未修正)", formatData.xAxisData, seriesData);
        this.noxwxz_div.setOption(option, true);
      }
    },
    noxxzh_chart() {
      let formatData = {
        xAxisData: [],
        yAxis: {}
      };
      const resData = this.ProcessData;
      resData.forEach(item => {
        formatData.xAxisData.push(item.Second_NO || Second_No);
      });
      if (this.noxxzh_div) {
        this.noxxzh_div.clear();
        this.$echartsc.dispose(this.noxxzh_div);
        this.noxxzh_div = null;
      }
      if (this.$refs.noxxzh_div) {
        this.noxxzh_div = this.$echartsc.init(this.$refs.noxxzh_div);
        // 指定图表的配置项和数据
        let seriesData = resData.map(item => item.Flow_NOXCorrect == 0 ? 0.001 : item.Flow_NOXCorrect);
        let option = this.getOption("rgb(244,114,152)", "NOX(修正后)", formatData.xAxisData, seriesData);
        this.noxxzh_div.setOption(option, true);
      }
    },
    co2wxz_chart() {
      let formatData = {
        xAxisData: [],
        yAxis: {}
      };
      const resData = this.ProcessData;
      resData.forEach(item => {
        formatData.xAxisData.push(item.Second_NO || Second_No);
      });
      if (this.co2wxz_div) {
        this.co2wxz_div.clear();
        this.$echartsc.dispose(this.co2wxz_div);
        this.co2wxz_div = null;
      }
      if (this.$refs.co2wxz_div) {
        this.co2wxz_div = this.$echartsc.init(this.$refs.co2wxz_div);
        // 指定图表的配置项和数据
        let seriesData = resData.map(item => item.Flow_CO2 == 0 ? 0.001 : item.Flow_CO2)
        let option = this.getOption("rgb(105,171,60)", "CO2(未修正)", formatData.xAxisData, seriesData);
        this.co2wxz_div.setOption(option, true);
      }
    },
    o2wxz_chart() {
      let formatData = {
        xAxisData: [],
        yAxis: {}
      };
      const resData = this.ProcessData;
      resData.forEach(item => {
        formatData.xAxisData.push(item.Second_NO || Second_No);
      });
      if (this.o2wxz_div) {
        this.o2wxz_div.clear();
        this.$echartsc.dispose(this.o2wxz_div);
        this.o2wxz_div = null;
      }
      if (this.$refs.o2wxz_div) {
        this.o2wxz_div = this.$echartsc.init(this.$refs.o2wxz_div);
        // 指定图表的配置项和数据
        let seriesData = resData.map(item => item.Flow_O2 == 0 ? 0.001 : item.Flow_O2)
        let option = this.getOption("rgb(103,224,233)", "O2(未修正)", formatData.xAxisData, seriesData);
        this.o2wxz_div.setOption(option, true);
      }
    },
    o2xzh_chart() {
      let formatData = {
        xAxisData: [],
        yAxis: {}
      };
      const resData = this.ProcessData;
      resData.forEach(item => {
        formatData.xAxisData.push(item.Second_NO || Second_No);
      });
      if (this.o2xzh_div) {
        this.o2xzh_div.clear();
        this.$echartsc.dispose(this.o2xzh_div);
        this.o2xzh_div = null;
      }
      if (this.$refs.o2xzh_div) {
        this.o2xzh_div = this.$echartsc.init(this.$refs.o2xzh_div);
        // 指定图表的配置项和数据
        let seriesData = resData.map(item => item.Flow_O2Correct == 0 ? 0.001 : item.Flow_O2Correct)
        let option = this.getOption("rgb(198,0,255)", "O2(修正后)", formatData.xAxisData, seriesData);
        this.o2xzh_div.setOption(option, true);
      }
    },
    xspqll_chart() {
      let formatData = {
        xAxisData: [],
        yAxis: {}
      };
      const resData = this.ProcessData;
      resData.forEach(item => {
        formatData.xAxisData.push(item.Second_NO || Second_No);
      });
      if (this.xspqll_div) {
        this.xspqll_div.clear();
        this.$echartsc.dispose(this.xspqll_div);
        this.xspqll_div = null;
      }
      if (this.$refs.xspqll_div) {
        this.xspqll_div = this.$echartsc.init(this.$refs.xspqll_div);
        // 指定图表的配置项和数据
        let seriesData = resData.map(item => item.FlowDiluteExhaust == 0 ? 0.001 : item.FlowDiluteExhaust);
        let option = this.getOption("#00BCD4", "稀释排气流量", formatData.xAxisData, seriesData);
        this.xspqll_div.setOption(option, true);
      }
    },
    xsxs_chart() {
      let formatData = {
        xAxisData: [],
        yAxis: {}
      };
      const resData = this.ProcessData;
      resData.forEach(item => {
        formatData.xAxisData.push(item.Second_NO || Second_No);
      });
      if (this.xsxs_div) {
        this.xsxs_div.clear();
        this.$echartsc.dispose(this.xsxs_div);
        this.xsxs_div = null;
      }
      if (this.$refs.xsxs_div) {
        this.xsxs_div = this.$echartsc.init(this.$refs.xsxs_div);
        // 指定图表的配置项和数据
        let seriesData = resData.map(item => item.Flow_Dilute == 0 ? 0.001 : item.FlowDiluteExhaust);
        let option = this.getOption("#E91E63", "稀释系数", formatData.xAxisData, seriesData);
        this.xsxs_div.setOption(option, true);
      }
    },
    nosdxzxs_chart() {
      let formatData = {
        xAxisData: [],
        yAxis: {}
      };
      const resData = this.ProcessData;
      resData.forEach(item => {
        formatData.xAxisData.push(item.Second_NO || Second_No);
      });
      if (this.nosdxzxs_div) {
        this.nosdxzxs_div.clear();
        this.$echartsc.dispose(this.nosdxzxs_div);
        this.nosdxzxs_div = null;
      }
      if (this.$refs.nosdxzxs_div) {
        this.nosdxzxs_div = this.$echartsc.init(this.$refs.nosdxzxs_div);
        // 指定图表的配置项和数据
        let seriesData = resData.map(item =>
          this.toFlostTwo(item.NOHumidityCorrect == 0 ? 0.001 : item.NOHumidityCorrect)
        )
        let option = this.getOption("#FF9800", "NO湿度修正系数", formatData.xAxisData, seriesData);
        this.nosdxzxs_div.setOption(option, true);
      }
    },
    rz_chart() {
      let formatData = {
        xAxisData: [],
        yAxis: {}
      };
      const resData = this.ProcessData;
      resData.forEach(item => {
        formatData.xAxisData.push(item.Second_NO || Second_No);
      });
      if (this.rz_div) {
        this.rz_div.clear();
        this.$echartsc.dispose(this.rz_div);
        this.rz_div = null;
      }
      if (this.$refs.rz_div) {
        this.rz_div = this.$echartsc.init(this.$refs.rz_div);
        // 指定图表的配置项和数据
        let seriesData = resData.map(item => item.Flow_Lambda == 0 ? 0.001 : item.Flow_Lambda)
        let option = this.getOption("#009688", "λ值", formatData.xAxisData, seriesData);
        this.rz_div.setOption(option, true);
      }
    },
    nf_chart() {
      let formatData = {
        xAxisData: [],
        yAxis: {}
      };
      const resData = this.ProcessData;
      resData.forEach(item => {
        formatData.xAxisData.push(item.Second_NO || Second_No);
      });
      if (this.nf_div) {
        this.nf_div.clear();
        this.$echartsc.dispose(this.nf_div);
        this.nf_div = null;
      }
      if (this.$refs.nf_div) {
        this.nf_div = this.$echartsc.init(this.$refs.nf_div);
        // 指定图表的配置项和数据
        let seriesData = resData.map(item => (item.nf == 0 ? 0.001 : item.nf) || (item.NF == 0 ? 0.001 : item.NF))
        let option = this.getOption("#607D8B", "扭力", formatData.xAxisData, seriesData);
        this.nf_div.setOption(option, true);
      }
    },
    getOption(color, tooltip, xAxisData, seriesData, value, min, max) {
      let mindata = 0.1
      let maxdata = 100
      let iMin = Math.min.apply(null,seriesData);
      let iMax = Math.max.apply(null,seriesData);
      if(iMax>1){
        if(iMax>100){
          if(iMax>1000){
            if(iMax>5000){
              maxdata =10000
            }else{
              maxdata = 5000
            }
          }else{
            maxdata =1000
          }
        }
      }else{
        maxdata = 1
      }
      if(iMin<0.1){
          if(iMin<0.01){
            mindata = 0.001
          }else{
            mindata = 0.01
          }
      }
      let option = {
        color: [color],
        title: {
          text: ""
        },
        tooltip: {
          trigger: "axis",
          confine: true,
          formatter: function (params) {
            return `${tooltip}：${params[0].data}`;
          }
        },
        legend: {
          itemWidth: 12,
          itemHeight: 8,
          textStyle: {
            color: this.themaColor,
            fontSize: 11 //字体大小
          },
          itemGap: 0,
          x: "right",
          type: "scroll",
          pageIconColor: "blue",
          pageIconInactiveColor: "#888",
          pageFormatter: "",
          pageButtonItemGap: -6,
          data: [tooltip]
        },
        grid: {
          top: "12%",
          left: "1%",
          right: "2%",
          bottom: "0%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: xAxisData,
          axisLabel: {
            textStyle: {
              color: this.themaColor
            }
          },
          axisLine: {
            lineStyle: {
              color: this.themaColor
            }
          }
        },
        yAxis: {
          type: value ? value : 'log',
          min: mindata,
          max: maxdata,
          minorSplitLine: {
              show: true
          },
          splitLine: {
            lineStyle: {
              type: "dashed"
            }
          },
          axisLabel: {
            textStyle: {
              color: this.themaColor
            },
            formatter: function (value) {
              return value === 0.001 ? 0 : value;
            }
          },
          axisLine: {
            lineStyle: {
              color: this.themaColor
            }
          }
        },
        series: [
          {
            name: tooltip,
            type: "line",
            smooth: true,
            // showSymbol: false,
            data: seriesData
          }
        ]
      };
      return option;
    }
  },
  watch: {
    processResultHeight: function (newValue, oldValue) {
      this.chartBoxHeight = newValue;
      this.setHeight();
    }
  },
}
</script>

<style lang="scss" scoped>
.chartBox {
  // background-color: red;
  margin-top: 50px;
  padding: 0 5px;
  display: flex;
  flex-wrap: wrap;
  overflow: auto;
  height: 500px;

  .chartSize {
    height: 300px;
    width: 300px;
    margin: 10px 50px;
  }
}
.chartBox1 {
  // background-color: red;
  // margin-top: 50px;
  padding: 0 5px;
  display: flex;
  flex-wrap: wrap;
  // overflow: auto;
  // height: 500px;

  .chartSize {
    height: 300px;
    width: 300px;
    margin: 10px 50px;
  }
}
</style>