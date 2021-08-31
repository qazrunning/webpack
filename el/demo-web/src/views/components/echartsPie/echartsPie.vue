<template>
  <div v-resize='resize'>
    <div ref="domPie" class="charts chart-pie">
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      pieData: this.data,
      domPie: null
    };
  },
  props: {
    data: {
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
      if (this.domPie) this.domPie.resize();
    },
    showPie() {
      this.$nextTick(() => {
        if (this.domPie) {
          this.domPie.clear();
          this.$echartsc.dispose(this.domPie);
          this.domPie=null;
        }
        if (this.$refs.domPie) {
          this.domPie = this.$echartsc.init(this.$refs.domPie);
          var option = {
            title: {
              show: this.showtitle,
              text: this.title,
              x: "center"
            },
            tooltip: {
              trigger: "item",
              formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            series: [
              {
                name: this.name,
                type: "pie",
                radius: ["50%", "70%"],
                avoidLabelOverlap: false,
                label: {
                  normal: {
                    show: false,
                    position: "center",
                    formatter: "{b}: {c} \n ({d}%)"
                  },
                  emphasis: {
                    show: true,
                    textStyle: {
                      fontSize: "14",
                      fontWeight: "bold"
                    }
                  }
                },
                labelLine: {
                  normal: {
                    show: false
                  }
                },
                data: this.pieData
              }
            ]
          };
          this.domPie.setOption(option,true);
          //设置默认选中高亮部分
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
            this.domPie.dispatchAction({
              type: "downplay",
              seriesIndex: 0,
              dataIndex: b
            });
            this.domPie.dispatchAction({
              type: "highlight",
              seriesIndex: 0,
              dataIndex: a
            });
          }, 2000);
          this.domPie.on("mouseover", function(e) {
            //当检测到鼠标悬停事件，取消默认选中高亮
            this.domPie.dispatchAction({
              type: "downplay",
              seriesIndex: 0,
              dataIndex: echarts_action
            });
            //高亮显示悬停的那块
            this.domPie.dispatchAction({
              type: "highlight",
              seriesIndex: 0,
              dataIndex: e.dataIndex
            });
          });
          //检测鼠标移出后显示之前默认高亮的那块
          this.domPie.on("mouseout", function(e) {
            this.domPie.dispatchAction({
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
    if (this.domPie) {
      this.domPie.clear();
      this.$echartsc.dispose(this.domPie);
      this.domPie=null;
    }
  }
};
</script>
