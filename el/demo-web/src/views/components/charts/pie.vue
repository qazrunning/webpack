<template>
  <div v-resize="resize">
    <div ref="dom"></div>
  </div>
</template>
<script>
import { on, off } from "../../../utils/tools";
export default {
  name: "ChartPie",
  props: {
    value: Array,
    text: String,
    subtext: String
  },
  data() {
    return {
      dom: null
    };
  },
  methods: {
    resize() {
      if (this.dom) this.dom.resize();
    },
    loadData() {
      this.$nextTick(() => {
        let legend = this.value.map(_ => _.name);
        let option = {
          title: {
            text: this.text,
            subtext: this.subtext,
            x: "center"
          },
          tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{br} : {c} ({d}%)"
          },
          legend: {
            orient: "vertical",
            left: "left",
            data: legend
          },
          series: [
            {
              type: "pie",
              radius: "55%",
              center: ["50%", "60%"],
              data: this.value,
              label: {
                normal: {
                  show: true,
                  position: "inner",
                  formatter: "{d}",
                  fontSize: 7
                }
              },
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: "rgba(0, 0, 0, 0.5)"
                }
              }
            }
          ]
        };
        if (this.dom) {
          this.dom.clear();
          this.$echartsc.dispose(this.dom);
          this.dom = null;
        }
        if (this.$refs.dom) {
          this.dom = this.$echartsc.init(this.$refs.dom, "tdTheme");
          this.dom.setOption(option, true);
        }
      });
    }
  },
  mounted() { },
  beforeDestroy() {
    if (this.dom) {
      this.dom.clear();
      this.$echartsc.dispose(this.dom);
      this.dom = null;
    }
  },
  watch: {
    value(data) {
      this.loadData();
    }
  }
};
</script>