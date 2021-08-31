<template>
  <!-- 自由加速 -->
  <div
    :class="isInspectProcessInfo===0?'chartBox':'chartBox1'"
    ref="chartBox"
  >
    <div
      ref="fdjzs_div"
      class="chartSize"
    ></div>
    <div
      ref="gxsxsk_div"
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
      this.fdjzs_chart();
      this.gxsxsk_chart();
    },
    toFlostTwo(value) {
      if (value == null) return "";
      if (value == 0.001) return value;
      value = Number(value).toFixed(2);
      return value;
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
        let seriesData = resData.map(item => item.Flow_RotateSpeed == 0 ? 0.001 : item.Flow_RotateSpeed)
        let option = this.getOption("#00BCD4", "发动机转速", formatData.xAxisData, seriesData, 'value', 0, 10000);
        this.fdjzs_div.setOption(option, true);
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
        let seriesData = resData.map(item => item.Flow_K == 0 ? 0.001 : item.Flow_K)
        let option = this.getOption("#E91E63", "光吸收系数k", formatData.xAxisData, seriesData);
        this.gxsxsk_div.setOption(option, true);
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