<template>
  <div class="track-box">
    <Card dis-hover class="track-card">
      <div slot="title" class="track-title">
        <span>
          车辆追踪
        </span>
      </div>

      <!-- <transition name="fade" mode="out-in"> -->
        <chartTrack
          :VLPN="VLPN"
          :VLPNColor="VLPNColor"
          :Vehicleid="Vehicleid"
          key="chart"
        />
      <!-- </transition> -->
    </Card>
  </div>
</template>
<script>
import chartTrack from "./chartTrack/index";
export default {
  name: "vehicleTrack",
  components: {
    chartTrack,
  },
  data() {
    return {
      componentKind: "1", // 车辆追踪的形式，1图表，0表格
    };
  },
  props: {
    VLPN: {
      type: String,
      required: true,
      default: "",
    },
    VLPNColor: {
      type: String,
      required: true,
      default: "",
    },
    Vehicleid: {
      type: Number,
    },
  },
  methods: {
    async init() {},
  },
  created() {
    this.init();
  },
};
</script>
<style lang="less" scoped>
.track-box {
  margin-top: 10px;
  min-height: 50%;
  margin-bottom: 30px;
}
.track-card {
  min-height: 100%;
}
.track-title {
  font-size: 18px;
  position: relative;
}
.track-title-switch {
  position: absolute;
  right: 20px;
}

// 过度动画
.fade-enter-active {
  transition: all 0.3s ease;
}
.fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
.track-card /deep/ .ivu-card-body{
  height: calc(100%  - 40px);
}
</style>
