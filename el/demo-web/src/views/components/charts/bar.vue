<template>
  <div v-resize="resize">
    <div ref="dom"></div>
  </div>
</template>
<script>
import tdTheme from "./theme.json";
import { on, off } from "../../../utils/tools";
export default {
  name: "ChartBar",
  props: {
    value: Object,
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
      const self = this;
      self.$nextTick(() => {
        let dom = self.dom;
        dom.resize();
      });
    }
  },
  mounted() {
    this.$nextTick(() => {
      let xAxisData = Object.keys(this.value);
      let seriesData = Object.values(this.value);
      let option = {
        title: {
          text: this.text,
          subtext: this.subtext,
          x: "center"
        },
        xAxis: {
          type: "category",
          data: xAxisData
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            data: seriesData,
            type: "bar"
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
  },
  beforeDestroy() {
    if (this.dom) {
      this.dom.clear();
      this.$echartsc.dispose(this.dom);
      this.dom = null;
    }
  }
};
</script>

