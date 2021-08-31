//监管明细详情
<template>
  <div class="regulatory fx__bgcolor">
    <Row>
      <i-Col :md="24" :lg="12" :xl="7" class="videoBox">
        <!-- 读取硬盘录像机 1海康威视 2大华 -->
        <DHVideoMonitor v-if="videoType == 2" :InspectionNum="selData.InspectionNum" :SceneCode="selData.SceneCode" :StationCode="selData.StationCode" :InspectTimes="inspectTimes" :IsFinishCheck="this.IsFinishCheck" :CityCode="CityCode"></DHVideoMonitor>
        <video-monitor v-else :InspectionNum="selData.InspectionNum" :SceneCode="selData.SceneCode" :StationCode="selData.StationCode" :InspectTimes="inspectTimes" :IsFinishCheck="this.IsFinishCheck" :CityCode="CityCode"></video-monitor>
      </i-Col>
      <i-Col :md="24" :lg="12" :xl="6" key="2" v-show="isShow.showAccept">
        <accept-info class="supdrvise_col" :AcceptForm="detailData.acceptData" :initForm="initForm" style="height: 340px"></accept-info>
      </i-Col>
      <i-Col :md="24" :lg="24" :xl="11" key="3" v-show="isShow.showExternalInspect">
        <external-inspect :ImgForm="detailData.externalImg" :ExternalForm="detailData.externalInfo" class="supdrvise_col" style="height: 340px"></external-inspect>
      </i-Col>
    </Row>
    <Row>
      <i-Col :lg="24" :sm="24" :md="24" :xxl="14" :xl="24" key="4" v-show="isShow.showInspectProcess">
        <inspect-process-info :IUTYPE="selData.InspectionMethod" :VLPN="selData.VLPN" :InspectProcessForm="detailData.InspectProcessInfo" :initForm="initForm" class="supdrvise_col" style="height: 300px"></inspect-process-info>
      </i-Col>
      <i-Col :lg="24" :sm="24" :md="24" :xxl="10" :xl="24" key="5" v-show="isShow.showInspectResult">
        <inspect-result :Vecid="selData.VehicleID" :VLPN="selData.VLPN" :IUTYPE="selData.InspectionMethod" :StationCode="selData.StationCode" :InspectionNum="selData.InspectionNum" :InspectResultForm="detailData.InspectResultInfo" @getInsData="showInsData" class="supdrvise_col" style="height: 300px"></inspect-result>
      </i-Col>
    </Row>
    <Row>
      <i-Col :md="24" :xxl="19" :xl="24" key="6" v-show="isShow.showOBDProcess">
        <o-b-d-process-info :VLPN="selData.VLPN" :IUTYPE="selData.InspectionMethod" :OBDProcessForm="detailData.OBDProcessInfo" class="supdrvise_col" style="height: 300px"></o-b-d-process-info>
      </i-Col>
      <i-Col :md="24" :xxl="5" :xl="24" key="7" v-show="isShow.showOBDInfo">
        <o-b-d-result :OBDForm="detailData.OBDInfo" class="supdrvise_col" style="height: 300px"></o-b-d-result>
      </i-Col>
    </Row>
  </div>
</template>
<script>
const path = require("path");
const files = require.context(
  "./cartInfo",
  false,
  /\.vue$/
);
const modules = {};
files.keys().forEach((key) => {
  const name = path.basename(key, ".vue");
  modules[name] = files(key).default || files(key);
});
export default {
  props: {
    InspectionNum: {
      type: String,
    },
    IsFinishCheck: {
      type: Number,
    },
    CityCode: {
      type: String,
    },
  },
  data() {
    return {
      selData: {
        InspectionNum: "",
        InspectionMethod: "",
        VLPN: "",
        VLPNColor: "",
        VIN: "",
      },
      inspectTimes: {
        //检测时间
        startTime: "",
        endTime: "",
      },
      initForm: {
        cd_station: {},
        cd_tsi_gklx: {},
        cd_inspectMethod: {},
        cd_inspectionNature: {},
        cd_vehicleType: {},
        cd_fuelType: {},
      },
      isShow: {
        showAccept: false,
        showExternalInspect: false,
        showOBDInfo: false,
        showOBDProcess: false,
        showInspectProcess: false,
        showInspectResult: false,
        showBlackBox: false,
      },
      detailData: {
        acceptData: {}, //受理数据
        externalInfo: {}, //外检数据
        externalImg: [], //外检图片
        InspectResultInfo: {}, //检测结果数据
        InspectProcessInfo: [], //检测过程数据
        OBDInfo: {}, //OBD数据
        OBDProcessInfo: [], //OBD过程数据
      },
      videoType: null,
    };
  },
  components: {
    // VideoMonitor, //实时视频模板
    // AcceptInfo, //受理信息模板
    // ExternalInspect, //外检信息模板
    // OBDProcessInfo, //OBD过程模板
    // OBDResult, //OBD结果模板
    // InspectProcessInfo, //检测过程模板
    // InspectResult, //检测结果模板
    // BlackBoxInfo //黑匣子模板
    ...modules,
  },
  methods: {
    showInsData(res) {
      Object.assign(res, { OBDInfo: this.detailData.OBDInfo })
      this.$emit('getProcessData', res)
    },
    async getCDData() {
      const self = this;
      const list = [
        {
          tableName: "StationInfo",
          columns: "StationCode as CodeValue,StationName as CodeName",
        },
        {
          tableName: "CD_TSI_GKLX",
          columns: "CodeValue,CodeName",
          where: "where IsAvailable=1",
        },
        {
          tableName: "CD_InspectionMethod",
          columns: "CodeValue,CodeName",
          where: "where IsAvailable=1",
        },
        {
          tableName: "CD_InspectionWay",
          columns: "CodeValue,CodeName",
          where: "where IsAvailable=1",
        },
        {
          tableName: "CD_VehicleType",
          columns: "CodeValue,CodeName",
          where: "where IsAvailable=1",
        },
        {
          tableName: "CD_FuelType",
          columns: "CodeValue,CodeName",
          where: "where IsAvailable=1",
        },
      ];
      let table = Object.keys(self.initForm);
      if (self.$getDBTable) {
        const tabName = list.map((l) => l.tableName);
        self.$getDBTable(tabName).then((res) => {
          let data = [];
          res.forEach((item, index) => {
            data = JSON.parse(item);
            if (data[0].hasOwnProperty("IsAvailable"))
              data = data.filter((d) => d.IsAvailable == 1);
            self.initForm[table[index]] = {};
            data.forEach((item2) => {
              self.initForm[table[index]][item2.CodeValue] =
                item2.CodeName;
            });
          });
        });
      } else {
        let res = await this.$curl.get("api/hj/getCDData", {
          CDDataList: JSON.stringify(list),
        });
        if (res.state) {
          res.data.forEach((item, index) => {
            self.initForm[table[index]] = {};
            item.forEach((item2) => {
              self.initForm[table[index]][item2.CodeValue] =
                item2.CodeName;
            });
          });
        }
      }
    },
    async getData() {
      this.selData = {};
      this.inspectTimes = {
        startTime: "",
        endTime: "",
      };
      let InspectionNum=this.InspectionNum;
      const res = await this.$curl.get("api/hj/getVLPNList",{strwhere:'',InspectionNum:InspectionNum});
      if (res.state && res.data.dataCount) {
        this.selData = res.data.vlpnList[0];
        this.inspectTimes = {
          startTime: this.$options.filters.dataFormat(
            res.data.vlpnList[0].DetectStartTime,
            "yyyy-MM-dd hh:mm:ss"
          ),
          endTime: this.$options.filters.dataFormat(
            res.data.vlpnList[0].DetectEndTime,
            "yyyy-MM-dd hh:mm:ss"
          ),
        };
      }
      this.$curl
        .get("api/hj/getStationVideoType", {
          param: JSON.stringify(this.selData),
        })
        .then((res) => {
          if (res.result) this.videoType = res.result.Tag;
        });
      this.getDetailData();
    },
    async getDetailData() {
      // console.log('获取监管数据');
      // this.inspectTimes = {
      //   startTime: "",
      //   endTime: ""
      // };
      const param = {
        InspectionNum: this.selData.InspectionNum,
        InspectionMethod: this.selData.InspectionMethod,
        VLPN: this.selData.VLPN,
        VLPNColor: this.selData.VLPNColor,
        VIN: this.selData.VIN,
      };
      let acceptInfo = await this.$curl.get("api/hj/getAcceptInfo", {
        InspectionNum: this.selData.InspectionNum,
        CityCode: this.CityCode,
      });
      this.detailData.acceptData = {};
      if (JSON.stringify(acceptInfo.data) == "{}") return;
      if (acceptInfo.state) {
        this.detailData.acceptData = acceptInfo.data;
        this.isShow.showAccept = true;
      }

      this.detailData.externalInfo = {};
      this.detailData.externalImg = [];
      this.$curl
        .get("api/hj/getExternalInspect", {
          param: JSON.stringify(param),
        })
        .then((res) => {
          if (res.state && res.data.externalInfo) {
            this.detailData.externalInfo = res.data.externalInfo;
            this.detailData.externalImg = res.data.externalImg;
          }
          this.isShow.showExternalInspect = true;
        })
        .catch((err) => {
          this.isShow.showExternalInspect = true;
        });

      this.detailData.InspectProcessInfo = [];
      this.$curl
        .get("api/hj/getInspectProcess", {
          param: JSON.stringify(param),
        })
        .then((res) => {
          if (res.state && res.data.length > 0) {
            this.detailData.InspectProcessInfo = res.data;
          }
          this.isShow.showInspectProcess = true;
        })
        .catch((err) => {
          this.isShow.showInspectProcess = true;
        });

      this.detailData.InspectResultInfo = [];
      this.$curl
        .get("api/hj/getInspectResult", {
          param: JSON.stringify(param),
        })
        .then((res) => {
          if (res.state && res.data) {

            this.detailData.InspectResultInfo = res.data || {};

            // this.inspectTimes = {
            //   startTime: this.$options.filters.dataFormat(
            //     res.data[0].DetectStartTime,
            //     "yyyy-MM-dd hh:mm:ss"
            //   ),
            //   endTime: this.$options.filters.dataFormat(
            //     res.data[0].DetectEndTime,
            //     "yyyy-MM-dd hh:mm:ss"
            //   )
            // };
            // console.log('获取时间数据',this.inspectTimes);
            // console.log('获取时间数据',res.data);
          }
          this.isShow.showInspectResult = true;
        })
        .catch((err) => {
          this.isShow.showInspectResult = true;
        });

      this.detailData.OBDProcessInfo = [];
      this.$curl
        .get("api/hj/getOBDProcessInfo", {
          InspectionNum: this.selData.InspectionNum,
        })
        .then((res) => {
          if (res.state && res.data.length > 0) {
            this.detailData.OBDProcessInfo = res.data;
          }
          this.isShow.showOBDProcess = true;
        })
        .catch((err) => {
          this.isShow.showOBDProcess = true;
        });

      this.detailData.OBDInfo = {};
      this.$curl
        .get("api/hj/getOBDInfo", {
          InspectionNum: this.selData.InspectionNum,
        })
        .then((res) => {
          if (res.state && res.data) {
            this.detailData.OBDInfo = res.data;
          }
          this.isShow.showOBDInfo = true;
        });
      this.isShow.showBlackBox = true;
    },
    async subscribeSocket() {
      //订阅socket
      const self = this;
      //外检信息
      this.$app.io.on("wjapp/jgxt/wjxx", (msg) => {
        if (!msg) return;
        const objs = JSON.parse(msg.msgObj);
        if (objs.InspectionNum != self.selData.InspectionNum) return;
        self.detailData.externalInfo = objs;
        self.isShow.showExternalInspect = true;
      });
      //稳态过程数据
      this.$app.io.on("fwd/ljfw/asmpro", (msg) => {
        if (!msg) return;
        const objs = JSON.parse(msg.msgObj);
        if (
          objs.InspectionNum != self.selData.InspectionNum ||
          self.selData.InspectionMethod != "B"
        )
          return;
        self.detailData.InspectProcessInfo.push(objs);
        self.isShow.showInspectProcess = true;
      });
      //简易瞬态过程数据
      this.$app.io.on("fwd/ljfw/impro", (msg) => {
        if (!msg) return;
        const objs = JSON.parse(msg.msgObj);
        if (
          objs.InspectionNum != self.selData.InspectionNum ||
          self.selData.InspectionMethod != "C"
        )
          return;
        self.detailData.InspectProcessInfo.push(objs);
        self.isShow.showInspectProcess = true;
      });
      //双怠速过程数据
      this.$app.io.on("fwd/ljfw/tsipro", (msg) => {
        if (!msg) return;
        const objs = JSON.parse(msg.msgObj);
        if (
          objs.InspectionNum != self.selData.InspectionNum ||
          self.selData.InspectionMethod != "A"
        )
          return;
        self.detailData.InspectProcessInfo.push(objs);
        self.isShow.showInspectProcess = true;
      });
      //自由加速过程数据
      this.$app.io.on("fwd/ljfw/lpspro", (msg) => {
        if (!msg) return;
        const objs = JSON.parse(msg.msgObj);
        if (
          objs.InspectionNum != self.selData.InspectionNum ||
          self.selData.InspectionMethod != "F"
        )
          return;
        self.detailData.InspectProcessInfo.push(objs);
        self.isShow.showInspectProcess = true;
      });

      //加载减速过程数据
      this.$app.io.on("fwd/ljfw/ldpro", (msg) => {
        if (!msg) return;
        const objs = JSON.parse(msg.msgObj);
        if (
          objs.InspectionNum != self.selData.InspectionNum ||
          self.selData.InspectionMethod != "G"
        )
          return;
        self.detailData.InspectProcessInfo.push(objs);
        self.isShow.showInspectProcess = true;
      });
      //稳态检测结果数据
      this.$app.io.on("fwd/ljfw/asm", (msg) => {
        if (!msg) return;
        const objs = JSON.parse(msg.msgObj);
        if (
          objs.InspectionNum != self.selData.InspectionNum ||
          self.selData.InspectionMethod != "B"
        )
          return;
        let index = self.detailData.InspectResultInfo.findIndex(item => item.IUTYPE == 'B');
        if (index != -1) {
          self.detailData.InspectResultInfo[index] = { IUTYPE: 'B', data: objs }
        } else {
          self.detailData.InspectResultInfo.push({ IUTYPE: 'B', data: objs })
        }
        // self.detailData.InspectResultInfo = objs;
        self.isShow.showInspectResult = true;
      });
      //简易瞬态检测结果数据
      this.$app.io.on("fwd/ljfw/im", (msg) => {
        if (!msg) return;
        const objs = JSON.parse(msg.msgObj);
        if (
          objs.InspectionNum != self.selData.InspectionNum ||
          self.selData.InspectionMethod != "C"
        )
          return;
        let index = self.detailData.InspectResultInfo.findIndex(item => item.IUTYPE == 'C');
        if (index != -1) {
          self.detailData.InspectResultInfo[index] = { IUTYPE: 'C', data: objs }
        } else {
          self.detailData.InspectResultInfo.push({ IUTYPE: 'C', data: objs })
        }
        // self.detailData.InspectResultInfo = objs;
        self.isShow.showInspectResult = true;
      });
      //双怠速检测结果数据
      this.$app.io.on("fwd/ljfw/tsi", (msg) => {
        if (!msg) return;
        const objs = JSON.parse(msg.msgObj);
        if (
          objs.InspectionNum != self.selData.InspectionNum ||
          self.selData.InspectionMethod != "A"
        )
          return;
        let index = self.detailData.InspectResultInfo.findIndex(item => item.IUTYPE == 'A');
        if (index != -1) {
          self.detailData.InspectResultInfo[index] = { IUTYPE: 'A', data: objs }
        } else {
          self.detailData.InspectResultInfo.push({ IUTYPE: 'A', data: objs })
        }
        // self.detailData.InspectResultInfo = objs;
        self.isShow.showInspectResult = true;
      });
      //自由加速检测结果数据
      this.$app.io.on("fwd/ljfw/lps", (msg) => {
        if (!msg) return;
        const objs = JSON.parse(msg.msgObj);
        if (
          objs.InspectionNum != self.selData.InspectionNum ||
          self.selData.InspectionMethod != "F"
        )
          return;
        let index = self.detailData.InspectResultInfo.findIndex(item => item.IUTYPE == 'F');
        if (index != -1) {
          self.detailData.InspectResultInfo[index] = { IUTYPE: 'F', data: objs }
        } else {
          self.detailData.InspectResultInfo.push({ IUTYPE: 'F', data: objs })
        }
        // self.detailData.InspectResultInfo = objs;
        self.isShow.showInspectResult = true;
      });
      //加载减速检测结果数据
      this.$app.io.on("fwd/ljfw/ld", (msg) => {
        if (!msg) return;
        const objs = JSON.parse(msg.msgObj);
        if (
          objs.InspectionNum != self.selData.InspectionNum ||
          self.selData.InspectionMethod != "G"
        )
          return;
        let index = self.detailData.InspectResultInfo.findIndex(item => item.IUTYPE == 'G');
        if (index != -1) {
          self.detailData.InspectResultInfo[index] = { IUTYPE: 'G', data: objs }
        } else {
          self.detailData.InspectResultInfo.push({ IUTYPE: 'G', data: objs })
        }
        // self.detailData.InspectResultInfo = objs;
        self.isShow.showInspectResult = true;
      });
      //OBD结果数据
      this.$app.io.on("fwd/ljfw/obdjg", (msg) => {
        if (!msg) return;
        const objs = JSON.parse(msg.msgObj);
        if (objs.InspectionNum != self.selData.InspectionNum) return;
        self.detailData.OBDInfo = objs || {};
        self.isShow.showOBDInfo = true;
      });
      //OBD过程数据
      this.$app.io.on("fwd/ljfw/obdpro", (msg) => {
        if (!msg) return;
        const objs = JSON.parse(msg.msgObj);
        if (objs.InspectionNum != self.selData.InspectionNum) return;
        self.detailData.OBDProcessInfo.push(objs);
        self.isShow.showOBDProcess = true;
      });
    },

  },
  watch: {
    InspectionNum: {
      handler(newval) {
         if(!newval) return; 
        this.isShow = {
          showDetail: true,
          showAccept: false,
          showExternalInspect: false,
          showOBDInfo: false,
          showOBDProcess: false,
          showInspectProcess: false,
          showInspectResult: false,
          showBlackBox: false,
        };
        this.getData();
      },
      deep:true,
      immediate: true
    },
  },
  mounted() {
    this.getCDData();
    this.subscribeSocket();
  },
};
</script>
<style scoped>
.regulatory /deep/ .ivu-row {
  margin-left: 0;
}

.regulatory /deep/ .ivu-card-body {
  padding: 6px;
}

.regulatory .supdrvise_col {
  margin-left: 8px;
  margin-top: 8px;
}

.videoMonitor_div /deep/ .ivu-card-body {
  padding: 0;
}

.regulatory .ivu-form-item {
  margin-bottom: 2px;
}

.regulatory /deep/ .ivu-form-item-content {
  font-size: 12px;
  font-weight: bold;
}

.regulatory /deep/ .ivu-form-item-label {
  color: #a0a0a0;
}

.regulatory /deep/ .ivu-card-head {
  padding: 6px 16px;
}

.regulatory /deep/ .ivu-card-head p {
  height: 24px;
  line-height: 24px;
  color: #92b1f3;
  overflow: visible;
}
.regulatory /deep/ .ivu-tabs-bar {
  margin-bottom: 0px;
}

.supdrvise_col {
  margin-left: 8px;
  margin-top: 8px;
}
.videoBox {
  height: 340px;
}
</style>
