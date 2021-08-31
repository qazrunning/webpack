<template>
  <div style="width:100%" class="chilren">
    <Row type="flex" style="width:100%;flex-wrap:wrap;" id="card">
      <i-col v-for="(item,index) in listArr" :key="index" class="pdr10px" style="margin:20px 0px 0 0;" :xxl="number.xxl" :xl="number.xl" :lg="number.lg" :md="24" :sm="24">
        <div class="fx__box">
          <div style="display:flex;justify-content:space-between;">
            <span>
              <span :style="setVLPNColor(item.VLPNColor)">{{item.VLPN}}</span>
              <span style="font-size: 15px;font-weight: 700;font-family: Impact;margin:0 0 0 10px">{{returncodenames( StationInfo,item.StationCode)}}</span>
            </span>
            <span style="padding:5px 0 0 0">{{item.CaptureTime}}</span>
          </div>
          <div style="width:100%;margin:10px 0 0 0;height:200px;">
            <div v-if="item.imgSrc.includes('null')">
              <img style="width:100%;height:200px;" src="../../../../../public/hj/img/error.gif" @error="onError($event)" />
            </div>
            <div v-else>
              <viewer :images="listArr">
                <img style="width:100%;height:200px;" :src="item.imgSrc" @error="onError($event)" />
              </viewer>
            </div>
          </div>
          <div style="margin:5px 0 0 0;display:flex;justify-content:space-between;">
            <span>
              <Button type="primary" ghost style="margin:0px 10px 0 0" @click="ShowVideo(item,index)"><Icon type="md-videocam" /></Button>  
              <!-- <Button type="success" style="margin:0px 10px 0 0" @click="handleShowYS(item,index)">原始视频</Button>
              <Button type="success" style="margin:0px 10px 0 0" @click="handleShow(item,index)">推理视频</Button>-->
              <Button icon="ios-paper" style="margin:0px 10px 0 0" @click="getInspectionReport(item,index)">检测报告</Button>
            </span>
            <span style="font-size: 24px;font-weight: 700;color: #c8a06a;font-family: Impact;">{{item.LingmanRank || item.LingmanRank == 0 ?item.LingmanRank+"级":""}}</span>
          </div>
        </div>
      </i-col>
    </Row>
    <Modal title="视频" :styles="{ padding: '0px',width:'1000px', height:'500px' }" v-model="ShiPinModal" footer-hide>
      <Button type="success" style="margin:0px 10px 10px 0px" @click="yuanli()" :disabled="jinyong">原始视频</Button>
      <Button type="success" style="margin:0px 10px 10px 0px" @click="tuili()" :disabled="!jinyong">推理视频</Button>
      <!-- <video style="width:970px;height:500px;" :src="yuanli?ysVideoSrc:hycVideoSrc" ref="video11" controls /> -->
      <video style="width:970px;height:500px;" :src="videoSrc" ref="video11" controls />
    </Modal>
    <!-- <Modal title="原始视频" :styles="{ padding: '0px',width:'1000px', height:'500px' }" v-model="videoModal1" footer-hide>
      <video style="width:970px;height:500px;" :src="ysVideoSrc" ref="video1" controls />
    </Modal>
    <Modal title="黑烟车视频" :styles="{ padding: '0px', width:'1000px', height:'500px' }" v-model="videoModal" class-name="vertical-center-modal" footer-hide>
      <video style="width:970px;height:500px;" :src="hycVideoSrc" ref="video" controls />
    </Modal>-->
    <Drawer title="检测报告" :closable="true" v-model="reportModel" width="50">
      <printContent :giveReport="giveReport" ref="reportCont"></printContent>
    </Drawer>
  </div>
</template>
<script>
import { config } from '../../../../utils/tools'
import printContent from "./printContent";
import { getCDData } from "../../../utils/utils";
export default {
  components: {
    printContent,
  },
  name: "blackSmokeCar1",
  props: {
    list: {
      type: Array,
      default: []
    },
    imgList: {
      type: Array,
      default: []
    },
    number: {
      type: Object,
      default: () => { }
    }
  },
  data() {
    return {
      jinyong: false,
      videoSrc: "",
      StationInfo: [],
      reportModel: false,
      giveReport: {},
      ysVideoSrc: "",
      hycVideoSrc: "",
      videoModal: false,
      videoModal1: false,
      ShiPinModal: false,
      listArr: []
    };
  },
  methods: {
    yuanli() {
      this.videoSrc = this.ysVideoSrc
      this.jinyong = true
    },
    tuili() {
      this.videoSrc = this.hycVideoSrc
      this.jinyong = false
    },
    async getCDData() {
      const _this = this;
      const list = [
        {
          tableName: "StationInfo",
          columns: "StationCode as CodeValue,StationName as CodeName",
          where: ""
        }
      ];
      const res = await this.$curl.get("api/hj/getCDData", {
        CDDataList: JSON.stringify(list)
      });
      _this.StationInfo = res.data[0];
    },
    returncodenames(namelist, codevalue) {
      let CodeName = "";
      namelist.forEach(item => {
        if (item.CodeValue == codevalue) {
          CodeName = item.CodeName;
        }
      });
      return CodeName;
    },
    async getInspectionReport(item, index) {
      const res = await this.$curl.get("api/hj/getBlackSmokeParam", { param: item.InspectionNum })
      this.giveReport = {
        InspectionDataID: res && res.data && res.data.inspectionDataID ? res.data.inspectionDataID : "",
        VehicleID: res && res.data && res.data.vehicleID ? res.data.vehicleID : "",
        IUTYPE: res && res.data && res.data.IUTYPE ? res.data.IUTYPE : "",
        InspectionNum: item.InspectionNum,
        VDCT: res && res.data && res.data.VDCT ? res.data.VDCT : ""
        // ifName: true,
      };
      this.reportModel = true
    },
    setVLPNColor(VLPNColor) {
      if (!config.vlpn_c[VLPNColor]) return {};
      const vlpn_c = config.vlpn_c[VLPNColor];
      return {
        display: "inline-block",
        margin: "-2 auto",
        "border-radius": "6px",
        "border-style": "double",
        "text-align": "center",
        padding: "0px 2px",
        background: `${vlpn_c.Background}`,
        color: `${vlpn_c.TextColor}`,
        "border-color": `${vlpn_c.BorderColor}`,
        "font-weight": "bold",
        "font-size": "10pt"
      };
    },
    initDate() {
      this.listArr.forEach(v => {
        // console.log('*******', v.ImgFile1);
        // if (v.ImgFile1.indexOf(",") > -1) {
        //   v.ImgFile1 = v.ImgFile1.match(/(\S*),/)[1];
        // }
        v.imgSrc = `${this.imgList[0].FieldValue}/${(v.CaptureTime + "")
          .replace("-", "")
          .replace("-", "")
          .substr(0, 8)}/${v.StationCode}/${v.LineCode}/${v.ImgFile1}`;
        v.hycVideoSrc = `${this.imgList[0].FieldValue}/${(v.CaptureTime + "")
          .replace("-", "")
          .replace("-", "")
          .substr(0, 8)}/${v.StationCode}/${v.LineCode}/${v.VideoFile}`;
        v.ysVideoSrc = `${this.imgList[0].FieldValue}/OriginalVideo/${(
          v.CaptureTime + ""
        )
          .replace("-", "")
          .replace("-", "")
          .substr(0, 8)}/${v.StationCode}/${v.LineCode}/${v.VideoFile}`;
      });
    },
    ShowVideo(item, index) {
      this.ShiPinModal = true;
      this.ysVideoSrc = item.ysVideoSrc;
      this.hycVideoSrc = item.hycVideoSrc;
      this.videoSrc = this.ysVideoSrc
      this.jinyong = true
    },
    handleShow(item, index) {
      this.videoModal = true;
      this.hycVideoSrc = item.hycVideoSrc;
    },
    handleShowYS(item, index) {
      this.videoModal1 = true;
      this.ysVideoSrc = item.ysVideoSrc;
    },
    onError(event) {
      event.target.src = "static/img/imgError.png";
    }
  },
  mounted() {
    this.getCDData();
    this.listArr = this.list;
    this.initDate();
  },
  watch: {
    list(newVal) {
      this.listArr = this.list;
      this.initDate();
    },
    imgList(newVal) {
      this.imgList = newVal;
    },
    // number(newVal) {
    //   this.number = newVal;
    // }
    number: {
      handler(newVal, oldVal) { this.number = newVal },
      deep: true,
      immediate: true
    }
  }
};
</script>
<style scoped>
.pdr10px {
  padding-right: 10px;
}
/* #card div:nth-child(4n) {
  padding-right: 0px; */
/* } */
#card div:last-child {
  margin-bottom: 0px;
}
.chilren /deep/ .ivu-modal-body {
  padding: 0px;
}
</style>