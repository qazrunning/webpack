<template>
  <div>
    <Row>
      <i-col span="24" >
        <span class="title-tag">
          {{ HYCResult(infoObj) }}
        </span>
        <span class="title-btn">
          <ButtonGroup>
            <Button
              class="fx__group"
              @click="imgOrInfo = true"
              :type="imgOrInfo ? 'primary' : 'default'"
              >图片</Button
            >
            <Button
              class="fx__group"
              @click="imgOrInfo = false"
              :type="imgOrInfo ? 'default' : 'primary'"
              >详情</Button
            >
          </ButtonGroup>
        </span>
      </i-col>
    </Row>
    <Row>
      <i-col span="18" >
        <div ref="video">
          <videoDetail :infoObj="infoObj" />
        </div>
      </i-col>
      <i-col span="6">
        <div :style="{ height: this.imgVideoHeight + 'px', overflow: 'auto' }">
          <component
            v-bind:is="currentDetailComponent"
            :infoObj="infoObj"
          ></component>
        </div>
      </i-col>
    </Row>
  </div>
</template>

<script>
import textDetail from "./textDetail";
import imageDetail from "./imageDetail";
import videoDetail from "./videoDtail";
export default {
  name: "",
  props: {
    infoObj: {
      type: Object,
    },
  },
  components: {
    textDetail,
    imageDetail,
    videoDetail,
  },
  data() {
    return {
      imgOrInfo: true, // 右侧详情是图片还是文字，默认true为图片
      currentDetailComponent: "imageDetail", // 当前显示的详情组件，默认是图片详情
      imgVideoHeight: 0,
    };
  },
  watch: {
    imgOrInfo() {
      this.imgOrInfo
        ? (this.currentDetailComponent = "imageDetail")
        : (this.currentDetailComponent = "textDetail");
    },
  },
  methods: {
    async init() {
      this.setHeight();
    },
    // 计算黑烟车结果
    HYCResult(infoObj) {
      let result = "";
      result += infoObj.VLPN + "：";
      let value = infoObj.AuditResult;
      if (value == "13" || value == "25" || value == "37") {
        result += "非黑烟车";
      } else {
        result += "黑烟车";
      }
      return result;
    },
    setHeight() {
      this.imgVideoHeight = this.$refs.video.offsetHeight;
    },
  },
  mounted() {
    this.init();
  },
};
</script>

<style lang="less" scoped>
.title-tag {
  font-size: 18px;
  color: #fd9c02;
  font-weight: bold;
  margin-left: 20px;
}
.title-btn {
  float: right;
  margin-right: 20px;
}
</style>
