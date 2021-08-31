<template>
  <div v-resize='resize'>
    <div ref="dom" class="charts chart-pie"></div>
  </div>

</template>
<script>
export default {
  data() {
    return {
      dom: null
    };
  },
  props: {
    value: {
      type: Array,
      default() {
        return [];
      },
      time: ""
    },
    height: {
      type: [Number, String]
    },
    //是否显示标题
    showtitle: {
      type: Boolean,
      default: false
    },
    backgroundColor: {
      type: String,
      default: "#2c343c"
    },
    titleColor: {
      type: String,
      default: "#ccc"
    },
    itemColor: {
      type: String,
      default: "#c23531"
    },
    //标题名称
    title: {
      type: String,
      default: "饼状图"
    },
    //统计名称
    name: {
      type: String,
      default: "数量"
    }
  },
  methods: {
    resize() {
      if (this.dom) this.dom.resize();
    },
    showPie() {
      this.$nextTick(() => {
        if (this.dom) {
          this.dom.clear();
          this.$echartsc.dispose(this.dom);
          this.dom=null;
        }
        if (this.$refs.dom) {
          this.dom = this.$echartsc.init(this.$refs.dom);
          var option = {
            backgroundColor: this.backgroundColor,
            title: {
              show: this.showtitle,
              text: this.title,
              x: "center",
              textStyle: {
                color: this.titleColor
              }
            },
            tooltip: {
              trigger: "item",
              formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            visualMap: {
              show: false,
              min: 80,
              max: 600,
              inRange: {
                colorLightness: [0, 1]
              }
            },
            series: [
              {
                name: this.name,
                type: "pie",
                radius: "55%",
                center: ["50%", "50%"],
                roseType: "radius",
                label: {
                  normal: {
                    textStyle: {
                      color: "rgba(255, 255, 255, 0.3)"
                    }
                  }
                },
                labelLine: {
                  normal: {
                    lineStyle: {
                      color: "rgba(255, 255, 255, 0.3)"
                    },
                    smooth: 0.2,
                    length: 10,
                    length2: 20
                  }
                },
                itemStyle: {
                  normal: {
                    color: this.itemColor,
                    shadowBlur: 200,
                    shadowColor: "rgba(0, 0, 0, 0.5)"
                  }
                },
                animationType: "scale",
                animationEasing: "elasticOut",
                animationDelay: function(idx) {
                  return Math.random() * 200;
                },
                data: this.value
              }
            ]
          };
          this.dom.setOption(option,true);
          //设置默认选中高亮部分
          let echarts_action = 0;

          this.time = setInterval(function() {
            if (this.time) clearInterval(this.time);
            var a = 0,
              b = 0;
            if (echarts_action == 0) {
              a = 0;
              b = 2;
              echarts_action = 1;
            } else if (echarts_action == 1) {
              a = 1;
              b = 0;
              echarts_action = 2;
            } else {
              a = 2;
              b = 1;
              echarts_action = 0;
            }
            if (this.backgroundColor == "#2c343c")
              this.backgroundColor = "#404040";
            else if (this.backgroundColor == "#404040")
              this.backgroundColor = "#2c343c";

            this.dom.dispatchAction({
              type: "downplay",
              seriesIndex: 0,
              dataIndex: b
            });
            this.dom.dispatchAction({
              type: "highlight",
              seriesIndex: 0,
              dataIndex: a
            });
          }, 2000);
          this.dom.on("mouseover", function(e) {
            //当检测到鼠标悬停事件，取消默认选中高亮
            this.dom.dispatchAction({
              type: "downplay",
              seriesIndex: 0,
              dataIndex: echarts_action
            });
            //高亮显示悬停的那块
            this.dom.dispatchAction({
              type: "highlight",
              seriesIndex: 0,
              dataIndex: e.dataIndex
            });
          });
          //检测鼠标移出后显示之前默认高亮的那块
          this.dom.on("mouseout", function(e) {
            this.dom.dispatchAction({
              type: "highlight",
              seriesIndex: 1,
              dataIndex: echarts_action
            });
          });
        }
      });
    }
  },
  mounted() {},
  watch: {
    value(data) {
      this.showPie();
    }
  },
  beforeDestroy() {
    if (this.time) clearInterval(this.time);
    if (this.dom) {
      this.dom.clear();
      this.$echartsc.dispose(this.dom);
      this.dom=null;
    }
  }
};
</script>
<style scoped>
canvas {
  width: 100%;
}
</style>
