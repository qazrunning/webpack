<template>
  <div id="myChart" ref="myChart" :style="{height:'350px',width:Width}"></div>
</template>

<script>
export default {
  props: {
    zhuansu: {
      type: Number,
      default: 0
    },
    Width: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      themaColor: this.$store.state.core.themaColor.basetextcolor,
      height: 0,
    }
  },
  methods: {
    myEcharts() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = this.$echartsc.init(document.getElementById("myChart"))
      // 指定图表的配置项和数据
      var option = {
        // backgroundColor: '#1b1b1b',  //背景色
        backgroundColor: '#3f474e',
        series: [
          {
            name: '速度',
            type: 'gauge',
            min: 0,
            max: 8000,
            splitNumber: 8,
            radius: '80%',
            axisLine: {            // 坐标轴线
              lineStyle: {       // 属性lineStyle控制线条样式
                color: [[0.09, 'lime'], [0.82, '#1e90ff'], [1, '#ff4500']],
                width: 3,
                shadowColor: '#fff', //默认透明
                shadowBlur: 10
              }
            },
            axisLabel: {            // 坐标轴小标记
              fontWeight: 'bolder',
              color: '#fff',
              shadowColor: '#fff', //默认透明
              shadowBlur: 10
            },
            axisTick: {            // 坐标轴小标记
              length: 15,        // 属性length控制线长
              lineStyle: {       // 属性lineStyle控制线条样式
                color: 'auto',
                shadowColor: '#fff', //默认透明
                shadowBlur: 10
              }
            },
            splitLine: {           // 分隔线
              length: 25,         // 属性length控制线长
              lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                width: 3,
                color: '#fff',
                shadowColor: '#fff', //默认透明
                shadowBlur: 10
              }
            },
            pointer: {           // 分隔线
              shadowColor: '#fff', //默认透明
              shadowBlur: 5
            },
            title: {
              textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                fontWeight: 'bolder',
                fontSize: 20,
                fontStyle: 'italic',
                color: '#fff',
                shadowColor: '#fff', //默认透明
                shadowBlur: 10
              }
            },
            detail: {
              backgroundColor: 'rgba(30,144,255,0.8)',
              borderWidth: 1,
              borderColor: '#fff',
              shadowColor: '#fff', //默认透明
              shadowBlur: 5,
              offsetCenter: [0, '50%'],       // x, y，单位px
              textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                fontWeight: 'bolder',
                color: '#fff'
              }
            },
            data: [{ value: this.zhuansu, name: '转速(rpm)' }
            ]
          },

        ]
      };
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option, true);
      window.addEventListener("resize", function () {
        myChart.resize();
      });
    },
  },
   watch: {
    zhuansu(newValue, oldValue) {
 
      this.myEcharts()
    },
    
  Width(newValue, oldValue) {
      // console.log(newValue);
      this.Width = newValue
      this.$echartsc.init(document.getElementById('myChart')).resize()
    },

  },

  mounted() {
  
    window.addEventListener("resize", this.setHeight);
    this.$nextTick(() => {
      this.myEcharts()
    });
    window.addEventListener('resize', () => {
      this.$echartsc.init(document.getElementById('myChart')).resize()
    })
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.setHeight);
  },
  created() {
    // this.$nextTick(() => {
    //   this.myEcharts()
    // });
  }
}

</script>

<style lang="less">
.aa{
  height: 350px;
  width:100%;
}
</style>