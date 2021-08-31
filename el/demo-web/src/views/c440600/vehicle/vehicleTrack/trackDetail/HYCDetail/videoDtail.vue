<template>
  <div>
    <div ref="videoDiv" class="video_div">
      <!-- <div class="carIndo">车辆信息</div> -->
      <video-player
        class="video-player vjs-custom-skin"
        ref="videoPlayer"
        id="videoPlay"
        style="height:100%;"
        :style="{ backgroundColor: '#000' }"
        :playsinline="true"
        :options="playerOptions"
        >浏览器不支持 video 标签，建议升级浏览器。</video-player
      >
      <div class="video_btn_box" id="videoBtnBox" ref="videoBtnBox">
        <Button title="快退" @click="handleBackWard" type="info" ghost>
          <Icon type="md-rewind" size="16" />
        </Button>
        <Button title="快进" @click="handleFaster" type="info" ghost>
          <Icon type="md-fastforward" size="16" />
        </Button>
      </div>
    </div>
  </div>
</template>

<script>
require("vue-video-player/src/custom-theme.css");
require("video.js/src/css/video-js.scss");
// require("video.js/dist/lang/zh-CN.js");
import "video.js/src/css/video-js.scss";
import { videoPlayer } from "vue-video-player";

export default {
  name: "videoDetail",
  props: {
    infoObj: {
      type: Object,
    },
  },
  components: {
    videoPlayer,
  },
  data() {
    return {
      // 视频播放
      playerOptions: {
        playbackRates: [0.5, 0.75, 1.0, 1.5], //播放速度
        autoplay: true, //如果true,浏览器准备好时开始回放。
        controls: true,
        muted: false, // 默认情况下将会消除任何音频。
        loop: true, // 导致视频一结束就重新开始。
        preload: "auto", // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: "zh-CN",
        aspectRatio: "16:9", // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [{ type: "video/mp4", src: "" }],
        notSupportedMessage: "此视频暂无法播放，请稍后再试", //允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true, // 当前时间和持续时间的分隔符
          currentTimeDisplay: true, // 当前时间
          volumeControl: false, // 声音控制键
          durationDisplay: true, // 显示持续时间
          remainingTimeDisplay: false, // 是否显示剩余时间功能
          fullscreenToggle: true, // 是否显示全屏按钮
          ChaptersButton: true,
          captionsButton: false,
          chaptersButton: false,
          subtitlesButton: false,
          liveDisplay: false,
          playbackRateMenuButton: true,
        },
      },
      
    };
  },
  computed: {
    // 获得播放器的dom对象
    player() {
      return this.$refs.videoPlayer.player;
    },
  },

  methods: {
    async init() {
      this.getHYCVideoData();
    },
    async getHYCVideoData() {
      let params = {
        SmokeVehicleID: this.infoObj.SmokeVehicleID,
      };
      // console.log(params, 'this.infoObj.SmokeVehicleID,')
      let res = await this.$curl.get("/api/hj/getHYCFileData", {
        params: JSON.stringify(params),
      });
      if (res.state === 1) {
        /**
         * 文件类型:00 后置图片，01 视频，02前置图片，03车牌图片，04合成，05证据链图片，06证据链视频，07视频截图，99gif图片，
         * 黑烟车详情只显示00， 02， 03， 04， 07类型的图片
         */
        let data = res.fileList.filter((el) => {
          return el.FileType === "01";
        });
          // 测试视频
          //  let src="http://192.168.0.58:5018/BlackSmokeFiles/YDYdamo/3610020010220190720093148866_1_02_1.mp4"
          //   this.playerOptions["sources"][0]["src"] = src;
          // console.log(data[0].FullFileName, 'this is data[0].FullFileName')
        if (data.length > 0) {
          this.playerOptions["sources"][0]["src"] = data[0].FullFileName;
        }
        this.player.currentTime(0);
        this.player.play();
      }
    },
    // 快进
    handleFaster() {
      let currtime = this.player.currentTime();
      let duration = this.player.duration();
      duration - currtime > 0.5
        ? this.player.currentTime(currtime + 0.5)
        : this.player.currentTime(duration);
    },
    //快退
    handleBackWard() {
      this.player.currentTime() < 0.5
        ? this.player.currentTime(0)
        : this.player.currentTime(this.player.currentTime() - 0.5);
    },

  },
  mounted(){
    this.init();
  }
};
</script>

<style lang="less" scoped>
.video_div {
  position: relative;

  /deep/.video-js {
    position: static;

    /deep/.vjs-control-bar {
      display: none !important;
      position: absolute !important;
      bottom: 0 !important;
      left: 0 !important;
      padding-right: 140px;
    }
  }
  .video_btn_box {
    display: none;
    position: absolute;
    right: 0px;
    bottom: 0px;
  }
  &:hover {
    /deep/.vjs-control-bar {
      display: flex !important;
    }
    .video_btn_box {
      display: inline-block;
    }
  }
}

/deep/ .ivu-btn {
  border: none;
}

/deep/ .video-js .vjs-big-play-button {
  height: 80px !important;
  width: 80px !important;
  line-height: 80px !important;
  text-align: center;
  font-size: 4em;
  // background:rgba(0, 0, 0, 0.8) !important;
  border-radius: 50% !important;
  top: 50% !important;
  left: 50% !important;
  margin-left: -40px !important;
  margin-top: -40px !important;
}

/deep/ .vjs-duration,
/deep/.vjs-current-time,
/deep/.vjs-time-control {
  display: inline-block;
  padding: 0px;
  text-align: center;
}

/deep/ .ivu-btn-icon-only {
  padding: 5px 10px;
}
</style>
