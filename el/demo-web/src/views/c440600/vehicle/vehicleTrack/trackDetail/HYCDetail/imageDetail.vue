<template>
  <div>
    <div v-if="imgList.length > 0">
      <viewer :images="imgList">
        <img
          @error="onError($event)"
          v-for="(src, index) in imgList"
          :src="src"
          :key="index"
          class="img-style"
        />
      </viewer>
    </div>
    <div v-else class="no-img">暂 无 图 片</div>
  </div>
</template>

<script>
export default {
  name: "imageDetail",
  props: {
    infoObj: {
      type: Object,
    },
  },
  data() {
    return {
      imgList: [], // 黑烟车照片
    };
  },
  methods: {
    async init() {
      this.getHYCImageData();
    },
    async getHYCImageData() {
      let params = {
        SmokeVehicleID: this.infoObj.SmokeVehicleID,
      };
      let res = await this.$curl.get("/api/hj/getHYCFileData", {
        params: JSON.stringify(params),
      });
      if (res.state === 1) {
        /**
         * 文件类型:00 后置图片，01 视频，02前置图片，03车牌图片，04合成，05证据链图片，06证据链视频，07视频截图，99gif图片，
         * 黑烟车详情只显示00， 02， 03， 04， 07类型的图片
         */
        let data = res.fileList.filter((el) => {
          return (
            el.FileType === "00" ||
            el.FileType === "02" ||
            el.FileType === "03" ||
            el.FileType === "04" ||
            el.FileType === "07"
          );
        });
        data.forEach((e) => {
          this.imgList.push({
            SmokeVehicleID: e.SmokeVehicleID,
            SmokeFileInfoID: e.SmokeFileInfoID,
            src: e.FullFileName,
            FileType: e.FileType,
            isChecked: false,
          });
        });
      }
    },
    onError(event) {
      event.target.src = "static/img/imgError.png";
    },
  },
  mounted() {
    this.init();
  },
};
</script>

<style lang="less" scoped>
.no-img {
  text-align: center;
  font-size: 16px;
}
.img-style {
  width: 90%;
  margin-left: 5%;
  margin-top: 5px;
}
</style>
