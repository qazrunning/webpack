<template>
  <!-- 加载减速法 -->
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
      ref="cgjzh_div"
      class="chartSize"
    ></div>
    <div
      ref="cgjnj_div"
      class="chartSize"
    ></div>
    <div
      ref="gxsxsk_div"
      class="chartSize"
    ></div>
    <div
      ref="co2wxz_div"
      class="chartSize"
    ></div>
    <div
      ref="noxwxz_div"
      class="chartSize"
    ></div>
    <div
      ref="yw_div"
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
      chartBoxHeight: 0,
      themaColor: this.$store.state.core.themaColor.basetextcolor,
      cs_div: null,
      fdjzs_div: null,
      cgjzh_div: null,
      cgjnj_div: null,
      gxsxsk_div: null,
      co2wxz_div: null,
      noxwxz_div: null,
      yw_div: null,
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
      this.cs_chart();
      this.fdjzs_chart();
      this.cgjzh_chart();
      this.cgjnj_chart();
      this.gxsxsk_chart();
      this.co2wxz_chart();
      this.noxwxz_chart();
      this.yw_chart();
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
        formatData.xAxisData.push(item.Second_NO || item.Second_No);
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
            ? this.toFlostTwo(item.SpeedPerSec == 0 ? 0.001 : item.SpeedPerSec)
            : this.toFlostTwo(item.Flow_Speed == 0 ? 0.001 : item.Flow_Speed)
        )
        let option = this.getOption("#00BCD4", "车速", formatData.xAxisData, seriesData, 'value', 0, 100);
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
          isNull(item.Flow_RotateSpeed)
            ? item.RotateSpeed == 0 ? 0.001 : item.RotateSpeed
            : item.Flow_RotateSpeed == 0 ? 0.001 : item.Flow_RotateSpeed
        )
        let option = this.getOption("#E91E63", "发动机转速", formatData.xAxisData, seriesData, 'value', 0, 10000);
        this.fdjzs_div.setOption(option, true);
      }
    },
    cgjzh_chart() {
      let formatData = {
        xAxisData: [],
        yAxis: {}
      };
      const resData = this.ProcessData;
      resData.forEach(item => {
        formatData.xAxisData.push(item.Second_NO || item.Second_No);
      });
      if (this.cgjzh_div) {
        this.cgjzh_div.clear();
        this.$echartsc.dispose(this.cgjzh_div);
        this.cgjzh_div = null;
      }
      if (this.$refs.cgjzh_div) {
        this.cgjzh_div = this.$echartsc.init(this.$refs.cgjzh_div);
        // 指定图表的配置项和数据
        let seriesData = resData.map(item => item.Flow_LoadPower == 0 ? 0.001 : item.Flow_LoadPower)
        let option = this.getOption("#FF9800", "测功机载荷", formatData.xAxisData, seriesData);
        this.cgjzh_div.setOption(option, true);
      }
    },
    cgjnj_chart() {
      let formatData = {
        xAxisData: [],
        yAxis: {}
      };
      const resData = this.ProcessData;
      resData.forEach(item => {
        formatData.xAxisData.push(item.Second_NO || item.Second_No);
      });
      if (this.cgjnj_div) {
        this.cgjnj_div.clear();
        this.$echartsc.dispose(this.cgjnj_div);
        this.cgjnj_div = null;
      }
      if (this.$refs.cgjnj_div) {
        this.cgjnj_div = this.$echartsc.init(this.$refs.cgjnj_div);
        // 指定图表的配置项和数据
        let seriesData = resData.map(item => item.Flow_Torque == 0 ? 0.001 : item.Flow_Torque)
        let option = this.getOption("#009688", "测功机扭矩", formatData.xAxisData, seriesData);
        this.cgjnj_div.setOption(option, true);
      }
    },
    gxsxsk_chart() {
      let formatData = {
        xAxisData: [],
        yAxis: {}
      };
      const resData = this.ProcessData;
      resData.forEach(item => {
        formatData.xAxisData.push(item.Second_NO || item.Second_No);
      });
      if (this.gxsxsk_div) {
        this.gxsxsk_div.clear();
        this.$echartsc.dispose(this.gxsxsk_div);
        this.gxsxsk_div = null;
      }
      if (this.$refs.gxsxsk_div) {
        this.gxsxsk_div = this.$echartsc.init(this.$refs.gxsxsk_div);
        // 指定图表的配置项和数据
        let seriesData = resData.map(item =>
          isNull(item.Flow_K) ? item.Smoke_K == 0 ? 0.001 : item.Smoke_K : item.Flow_K == 0 ? 0.001 : item.Flow_K
        )
        let option = this.getOption("#607D8B", "光吸收系数k", formatData.xAxisData, seriesData);
        this.gxsxsk_div.setOption(option, true);
      }
    },
    noxwxz_chart() {
      let formatData = {
        xAxisData: [],
        yAxis: {}
      };
      const resData = this.ProcessData;
      resData.forEach(item => {
        formatData.xAxisData.push(item.Second_NO || item.Second_No);
      });
      if (this.noxwxz_div) {
        this.noxwxz_div.clear();
        this.$echartsc.dispose(this.noxwxz_div);
        this.noxwxz_div = null;
      }
      if (this.$refs.noxwxz_div) {
        this.noxwxz_div = this.$echartsc.init(this.$refs.noxwxz_div);
        // 指定图表的配置项和数据
        let seriesData = resData.map(item => item.Flow_NOX == 0 ? 0.001 : item.Flow_NOX)
        let option = this.getOption("rgb(4,147,207)", "NOX(未修正)", formatData.xAxisData, seriesData);
        this.noxwxz_div.setOption(option, true);
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
        let seriesData = resData.map(item => item.Flow_CO2 == 0 ? 0.001 : item.Flow_CO2)
        let option = this.getOption("#AB47BC", "CO2(未修正)", formatData.xAxisData, seriesData);
        this.co2wxz_div.setOption(option, true);
      }
    },
    yw_chart() {
      let formatData = {
        xAxisData: [],
        yAxis: {}
      };
      const resData = this.ProcessData;
      resData.forEach(item => {
        formatData.xAxisData.push(item.Second_NO || item.Second_No);
      });
      if (this.yw_div) {
        this.yw_div.clear();
        this.$echartsc.dispose(this.yw_div);
        this.yw_div = null;
      }
      if (this.$refs.yw_div) {
        this.yw_div = this.$echartsc.init(this.$refs.yw_div);
        // 指定图表的配置项和数据
        let seriesData = resData.map(item => this.toFlostTwo(item.OilTemperature == 0 ? 0.001 : item.OilTemperature))
        let option = this.getOption("#0dde12", "油温", formatData.xAxisData, seriesData);
        this.yw_div.setOption(option, true);
      }
    },
    nf_chart() {
      let formatData = {
        xAxisData: [],
        yAxis: {}
      };
      const resData = this.ProcessData;
      resData.forEach(item => {
        formatData.xAxisData.push(item.Second_NO || item.Second_No);
      });
      if (this.nf_div) {
        this.nf_div.clear();
        this.$echartsc.dispose(this.nf_div);
        this.nf_div = null;
      }
      if (this.$refs.nf_div) {
        this.nf_div = this.$echartsc.init(this.$refs.nf_div);
        // 指定图表的配置项和数据
        let seriesData = resData.map(item => this.toFlostTwo((item.nf == 0 ? 0.001 : item.nf) || (item.NF == 0 ? 0.001 : item.NF)));
        let option = this.getOption("rgb(255,82,8)", "扭力", formatData.xAxisData, seriesData);
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