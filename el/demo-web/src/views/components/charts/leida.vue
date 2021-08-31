<template >
    <!-- 雷达图
    IUTYPE: 车型号名,
    tagArr:legend的数组 ,
    nameValueArr:值,
    xArr: -->
  <div class="container" ref="container" style="width:100%;height:100%">
    <Card style="width:auto;height:calc(100% - 20px);margin:10px">
      <div ref="echartPie" style="width:100%;height:100%" v-resize="resize"></div>
    </Card>
  </div>
</template>
<script>
export default {
  props: {
    formdata: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {
      echartsID: null,
      themaColor: this.$store.state.core.themaColor.basetextcolor
    };
  },
  methods: {
    showleida() {
      console.log(this.formdata)
      let self = this;
      if (this.echartsID) {
        this.echartsID.clear();
        this.$echartsc.dispose(this.echartsID);
        this.echartsID = null;
      }
      this.echartsID = this.$echartsc.init(this.$refs.echartPie);
      let seriesData = [];
      self.formdata.tagArr.forEach((e, i) => {
        seriesData.push({
          name: e,
          type: "line",
          data: [],
          smooth: true
        });
        self.formdata.nameValueArr.forEach(v => {
          if(v!=null){
            seriesData[i].data.push(v[e]!=null?v[e].toFixed(2):0)
          }else{
            seriesData[i].data.push(0)
          }
        });
      });

      let option = {
        title: {
          text: "车型：" + self.formdata.IUTYPE,
          textStyle: {
            fontSize: 14,
            color: "#ffa500"
          }
        },
        color: [
          "#F58080",
          "#47D8BE",
          "#F9A589",
          "#749f83",
          "#ca8622",
          "#bda29a",
          "#6e7074",
          "#546570",
          "#c4ccd3"
        ],
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: self.formdata.tagArr,
          right: 0,
          bottom: "top",
          textStyle: {
            color: this.themaColor,
            align: "center"
          }
        },
        grid: {
          top: "middle",
          left: "3%",
          right: "4%",
          bottom: "3%",
          height: "80%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          data: self.formdata.xArr,
          axisLine: {
            lineStyle: {
              color:  this.themaColor
            }
          }
        },
        yAxis: {
          type: "value",//'log'
          splitArea: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color:  this.themaColor
            }
          },
          axisLabel: {
            formatter: function(value) {
              return value === 0.1 ? 0 : value;
            },
          }
        },
        series: seriesData
      };
      self.echartsID.setOption(option);
    },
    getheight() {
      this.height = this.$refs.container.offsetHeight;
    },
    resize() {
      if (this.echartsID) this.echartsID.resize();
    }
  },
  mounted() {
    this.getheight();
    window.addEventListener("resize", this.getheight);
    this.showleida();
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.getheight);
    if (this.echartsID) {
      this.echartsID.clear();
      this.$echartsc.dispose(this.echartsID);
      this.echartsID = null;
    }
  },
  watch:{
    formdata(nw,ol){
      console.log(nw,ol)
    }
  }
};
</script>
<style lang="less" scoped>
.container /deep/ .ivu-card-body {
  padding: 8px 8px;
  width: 100%;
  height: 100%;
}
</style>

