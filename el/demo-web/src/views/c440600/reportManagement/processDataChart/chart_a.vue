<template>
  <!-- 双怠速法 -->
  <div
    :class="isInspectProcessInfo===0?'chartBox':'chartBox1'"
    ref="chartBox"
  >
    <div
      ref="fdjjywd_div"
      class="chartSize"
    ></div>
    <div
      ref="fdjzs_div"
      class="chartSize"
    ></div>
    <div
      ref="hcwxz_div"
      class="chartSize"
    ></div>
    <div
      ref="cowxz_div"
      class="chartSize"
    ></div>
    <div
      ref="o2wxz_div"
      class="chartSize"
    ></div>
    <div
      ref="co2wxz_div"
      class="chartSize"
    ></div>
    <div
      ref="rz_div"
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
      fdjjywd_div: null,
      fdjzs_div: null,
      dpcgjfz_div: null,
      hcwxz_div: null,
      cowxz_div: null,
      nowxz_div: null,
      co2wxz_div: null,
      o2wxz_div: null,
      rz_div: null,
      nosdxzxs_div: null,
      xsxzxsdf_div: null,
      hcxzh_div: null,
      coxzh_div: null,
      noxzh_div: null,
      nf_div: null
    }
  },
  mounted() {
    console.log(this.isInspectProcessInfo);
    this.handleProcessData();
    this.setHeight();
  },
  methods: {
    setHeight() {
      this.$refs.chartBox.style.height = (window.document.body.offsetHeight - this.processResultHeight - 200) + 'px';
    },
    handleProcessData() {
      this.fdjjywd_chart();
      this.fdjzs_chart();
      this.hcwxz_chart();
      this.cowxz_chart();
      this.o2wxz_chart();
      this.co2wxz_chart();
      this.rz_chart();
    },
    toFlostTwo(value) {
      if (value == null) return "";
      if (value == 0.001) return value;
      value = Number(value).toFixed(2);
      return value;
    },
    fdjjywd_chart() {
      let formatData = {
        xAxisData: [],
        yAxis: {}
      };
      const resData = this.ProcessData;
      resData.forEach(item => {
        formatData.xAxisData.push(item.Second_NO || item.Second_No);
      });
      if (this.fdjjywd_div) {
        this.fdjjywd_div.clear();
        this.$echartsc.dispose(this.fdjjywd_div);
        this.fdjjywd_div = null;
      }
      if (this.$refs.fdjjywd_div) {
        this.fdjjywd_div = this.$echartsc.init(this.$refs.fdjjywd_div);
        // 指定图表的配置项和数据
        let seriesData = resData.map(item =>
          this.toFlostTwo(item.EngineOilTemperature == 0 ? 0.001 : item.EngineOilTemperature)
        )
        let option = this.getOption("#00BCD4", "发动机机油温度", formatData.xAxisData, seriesData, "value", 0, 100);
        this.fdjjywd_div.setOption(option, true);
      }
    },
    fdjzs_chart() {
      let formatData = {
        xAxisData: [],
        yAxis: {}
      };
      const resData = this.ProcessData;
      resData.forEach(item => {
        formatData.xAxisData.push(item.Second_NO || item.Second_No);
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
          this.toFlostTwo((item.Flow_RotateSpeed == 0 ? 0.001 : item.Flow_RotateSpeed) || (item.RotateSpeed == 0 ? 0.001 : item.RotateSpeed))
        )
        let option = this.getOption("#E91E63", "发动机转速", formatData.xAxisData, seriesData, "value", 0, 10000);
        this.fdjzs_div.setOption(option, true);
      }
    },
    hcwxz_chart() {
      let formatData = {
        xAxisData: [],
        yAxis: {}
      };
      const resData = this.ProcessData;
      resData.forEach(item => {
        formatData.xAxisData.push(item.Second_NO || item.Second_No);
      });
      if (this.hcwxz_div) {
        this.hcwxz_div.clear();
        this.$echartsc.dispose(this.hcwxz_div);
        this.hcwxz_div = null;
      }
      if (this.$refs.hcwxz_div) {
        this.hcwxz_div = this.$echartsc.init(this.$refs.hcwxz_div);
        // 指定图表的配置项和数据
        let seriesData = resData.map(item =>
          isNull(item.Flow_HC) ? item.HCR == 0 ? 0.001 : item.HCR : item.Flow_HC == 0 ? 0.001 : item.Flow_HC
        )
        let option = this.getOption("#FF9800", "HC(未修正)", formatData.xAxisData, seriesData);
        this.hcwxz_div.setOption(option, true);
      }
    },
    cowxz_chart() {
      let formatData = {
        xAxisData: [],
        yAxis: {}
      };
      const resData = this.ProcessData;
      resData.forEach(item => {
        formatData.xAxisData.push(item.Second_NO || item.Second_No);
      });
      if (this.cowxz_div) {
        this.cowxz_div.clear();
        this.$echartsc.dispose(this.cowxz_div);
        this.cowxz_div = null;
      }
      if (this.$refs.cowxz_div) {
        this.cowxz_div = this.$echartsc.init(this.$refs.cowxz_div);
        // 指定图表的配置项和数据
        let seriesData = resData.map(item =>
          isNull(item.Flow_CO) ? item.COR == 0 ? 0.001 : item.COR : item.Flow_CO == 0 ? 0.001 : item.Flow_CO
        )
        let option = this.getOption("#009688", "CO2(未修正)", formatData.xAxisData, seriesData);
        this.cowxz_div.setOption(option, true);
      }
    },
    co2wxz_chart() {
      let formatData = {
        xAxisData: [],
        yAxis: {}
      };
      const resData = this.ProcessData;
      resData.forEach(item => {
        formatData.xAxisData.push(item.Second_NO || item.Second_No);
      });
      if (this.co2wxz_div) {
        this.co2wxz_div.clear();
        this.$echartsc.dispose(this.co2wxz_div);
        this.co2wxz_div = null;
      }
      if (this.$refs.co2wxz_div) {
        this.co2wxz_div = this.$echartsc.init(this.$refs.co2wxz_div);
        // 指定图表的配置项和数据
        let seriesData = resData.map(item =>
          isNull(item.Flow_CO2) ? item.CO2R == 0 ? 0.001 : item.CO2R : item.Flow_CO2 == 0 ? 0.001 : item.Flow_CO2
        )
        let option = this.getOption("#AB47BC", "CO2(未修正)", formatData.xAxisData, seriesData);
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
        formatData.xAxisData.push(item.Second_NO || item.Second_No);
      });
      if (this.o2wxz_div) {
        this.o2wxz_div.clear();
        this.$echartsc.dispose(this.o2wxz_div);
        this.o2wxz_div = null;
      }
      if (this.$refs.o2wxz_div) {
        this.o2wxz_div = this.$echartsc.init(this.$refs.o2wxz_div);
        // 指定图表的配置项和数据
        let seriesData = resData.map(item =>
          isNull(item.Flow_O2) ? item.O2R == 0 ? 0.001 : item.O2R : item.Flow_O2 == 0 ? 0.001 : item.Flow_O2
        )
        let option = this.getOption("#607D8B", "O2(未修正)", formatData.xAxisData, seriesData);
        this.o2wxz_div.setOption(option, true);
      }
    },
    rz_chart() {
      let formatData = {
        xAxisData: [],
        yAxis: {}
      };
      const resData = this.ProcessData;
      resData.forEach(item => {
        formatData.xAxisData.push(item.Second_NO || item.Second_No);
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
        let option = this.getOption("rgb(4,147,207)", "λ值", formatData.xAxisData, seriesData);
        this.rz_div.setOption(option, true);
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
            // console.log('提示参数：', params)
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
          splitLine: {
            lineStyle: {
              type: "dashed"
            }
          },
          minorSplitLine: {
              show: true
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