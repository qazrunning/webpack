<template>
  <div class="summanyBox" style="overflow:auto auto;padding:10px;width:100%">
    <Row style="font-size:14px;padding-left:10px;margin-bottom:10px;background-color:#ffae7a3b;font-weight:800">
      <Col :xxl='24' :xl='24' :lg='24' :md='24' :xs='24' v-if='showHmd'>
      <p style="text-align:left;padding-top:4px" v-show="specialInfo.hmd.InsertDate||specialInfo.hmd.Reason||specialInfo.hmd.Operator||specialInfo.hmd.BLType">
        <span v-show='specialInfo.hmd.InsertDate'>加入黑名单时间：{{specialInfo.hmd.InsertDate}};</span>
        <span v-show='specialInfo.hmd.Reason'>加入原因：{{specialInfo.hmd.Reason}};</span>
        <span v-show='specialInfo.hmd.Operator'>操作人：{{specialInfo.hmd.Operator}};</span>
        <span v-show='specialInfo.hmd.BLType'>黑名单类型：{{specialInfo.hmd.BLType?(returncodename(cddata.CD_BLType,specialInfo.hmd.BLType)):""}};</span>
      </p>
      </Col>
      <Col :xxl='24' :xl='24' :lg='24' :md='24' :xs='24' v-if="showHyc">
      <p style="text-align:left;padding-top:4px" v-show="specialInfo.hyc.InsertDate||specialInfo.hyc.Reason||specialInfo.hyc.Operator">
        <span v-show='specialInfo.hyc.InsertDate'>加入黑烟车时间：{{specialInfo.hyc.InsertDate|dataFormat("yyyy-MM-dd hh:mm:ss")}};</span>
        <span v-show='specialInfo.hyc.Reason'>加入原因：{{specialInfo.hyc.Reason}};</span>
        <span v-show='specialInfo.hyc.Operator'>操作人：{{specialInfo.hyc.Operator}};</span>
      </p>
      </Col>
      <Col :xxl='24' :xl='24' :lg='24' :md='24' :xs='24' v-if="showHbc">
      <p style="text-align:left;padding-top:4px" v-show="specialInfo.hbc.ImportDateTime||specialInfo.hbc.Remark||specialInfo.hbc.Auditer||specialInfo.hbc.YLCAuditWay">
        <span v-show='specialInfo.hbc.ImportDateTime'>加入黄标车时间：{{specialInfo.hbc.ImportDateTime|dataFormat("yyyy-MM-dd hh:mm:ss")}};</span>
        <span v-show='specialInfo.hbc.Remark'>加入原因：{{specialInfo.hbc.Remark}};</span>
        <span v-show='specialInfo.hbc.Auditer'>操作人：{{specialInfo.hbc.Auditer}};</span>
        <span v-show='specialInfo.hbc.YLCAuditWay'>黄标车来源：{{specialInfo.hbc.YLCAuditWay?(returncodename(cddata.CD_YLCAuditWay,specialInfo.hbc.YLCAuditWay)):""}};</span>
      </p>
      </Col>
      <Col :xxl='24' :xl='24' :lg='24' :md='24' :xs='24' v-if="showZdgz">
      <p style="text-align:left;padding-top:4px" v-show="specialInfo.zdgz.RecordTime||specialInfo.zdgz.Reason||specialInfo.zdgz.Recorder||specialInfo.zdgz.Type">
        <span v-show='specialInfo.zdgz.RecordTime'>加入重点关注时间：{{specialInfo.zdgz.RecordTime|dataFormat("yyyy-MM-dd hh:mm:ss")}};</span>
        <span v-show='specialInfo.zdgz.Reason'>加入原因：{{specialInfo.zdgz.Reason}};</span>
        <span v-show='specialInfo.zdgz.Recorder'>操作人：{{specialInfo.zdgz.Recorder}};</span>
        <span v-show='specialInfo.zdgz.Type'>重点关注类型：{{specialInfo.zdgz.Type?(returncodename(cddata.CD_SpecialAttentionType,specialInfo.zdgz.Type)):''}};</span>
      </p>
      </Col>
      <Col :xxl='24' :xl='24' :lg='24' :md='24' :xs='24' v-if="showBmd">
      <p style="text-align:left;padding-top:4px" v-show="specialInfo.bmd.InsertDate||specialInfo.bmd.Reason||specialInfo.bmd.Operator||specialInfo.bmd.WLType">
        <span v-show='specialInfo.bmd.InsertDate'>加入白名单时间：{{specialInfo.bmd.InsertDate|dataFormat("yyyy-MM-dd hh:mm:ss")}};</span>
        <span v-show='specialInfo.bmd.Reason'> 加入原因：{{specialInfo.bmd.Reason}};</span>
        <span v-show='specialInfo.bmd.Operator'> 操作人：{{specialInfo.bmd.Operator}};</span>
        <span v-show='specialInfo.bmd.WLType'> 白名单类型：{{specialInfo.bmd.WLType?(returncodename(cddata.CD_WhiteListType,specialInfo.bmd.WLType)):''}}</span>
      </p>
      </Col>
    </Row>

    <!-- 车主车辆信息 -->
    <div style="width:100%;" class="mainInfoB">
      <!-- 车辆信息 -->
      <Card class="vehicle">
        <p slot="title">车辆主要信息</p>
        <!-- 当没有检测报告时,车主信息站一行，一行4列 -->
        <div class="vehicleInfo" v-show="!showReport">
          <div>
            <viewer :images="photo">
              <img :src="imgData.djz?'data:image/jpg;base64,'+imgData.djz:'exhaust/img/error.gif'" style="width:75%;max-height:170px" @error="onError($event)" />
            </viewer>
          </div>
          <div>
            <p>
              <span class="bold">号牌号码：</span>
              <span>{{vehicleData.VLPN}}</span>
            </p>
            <p>
              <span class="bold">车牌颜色：</span>
              <span>{{returncodename(cddata.CD_VLPNColor,vehicleData.VLPNColor)}}</span>
            </p>
            <p>
              <span class="bold">车辆类型：</span>
              <span>{{returncodename(cddata.CD_GAVType,vehicleData.GAVType)}}</span>
            </p>
            <p>
              <span class="bold">排放标准：</span>
              <span>{{returncodename(cddata.CD_EmissionStandard,vehicleData.EmissionStandard)}}</span>
            </p>
          </div>
          <div>
            <p>
              <span class="bold">审核方式：</span>
              <span>{{vehicleData.VerifyWay?returncodename(checkWay,vehicleData.VerifyWay):' '}}</span>
            </p>
            <p>
              <span class="bold">发动机额定功率(kW)：</span>
              <span>{{vehicleData.EnginePower}}</span>
            </p>
            <p>
              <span class="bold">品牌：</span>
              <span>{{vehicleData.FactoryPlateModel}}</span>
            </p>
            <p>
              <span class="bold">初登日期：</span>
              <span>{{vehicleData.VRDATE | dataFormat("yyyy-MM-dd")}}</span>
            </p>
          </div>
          <div>
            <p>
              <span class="bold">出厂日期：</span>
              <span>{{vehicleData.ProductDate | dataFormat("yyyy-MM-dd")}}</span>
            </p>
            <p>
              <span class="bold">车架号：</span>
              <span>{{vehicleData.VIN}}</span>
            </p>
            <p>
              <span class="bold">燃油种类：</span>
              <span>{{returnMultiple(cddata.CD_FuelType,vehicleData.FuelType)}}</span>
            </p>
            <p>
              <span class="bold">使用性质：</span>
              <span>{{returncodename(cddata.CD_UseOfAuto,vehicleData.UseOfAuto)}}</span>
              <span @click="goToVehicleTab" style="color:#5cadff;float:right;cursor:pointer;">[更多信息]</span>
            </p>
          </div>
        </div>
        <!-- 当有检测报告时，车主信息占一半 ，一行三列-->
        <div class="vehicleInfo" v-show="showReport" style="min-width:420px">
          <Row>
            <i-col :xxl="8" :xl="0" :lg="0" :md="0" :sm="0" :xs="0">
              <div>
                <img :src="imgData.djz?imgData.djz:'exhaust/img/error.gif'" style="width:100%" @error="onError($event)" />
              </div>
            </i-col>
            <i-col :xxl="8" :xl="12" :lg="24" :md="24" :sm="24" :xs="24">
              <div>
                <p>
                  <span class="bold">号牌号码：</span>
                  <span>{{vehicleData.VLPN}}</span>
                </p>
                <p>
                  <span class="bold">车牌颜色：</span>
                  <span>{{returncodename(cddata.CD_VLPNColor,vehicleData.VLPNColor)}}</span>
                </p>
                <p>
                  <span class="bold">车辆类型：</span>
                  <span>{{returncodename(cddata.CD_GAVType,vehicleData.GAVType)}}</span>
                </p>
                <p>
                  <span class="bold">排放标准：</span>
                  <span>{{returncodename(cddata.CD_EmissionStandard,vehicleData.EmissionStandard)}}</span>
                </p>
                <p>
                  <span class="bold">出厂日期：</span>
                  <span>{{vehicleData.ProductDate | dataFormat("yyyy-MM-dd")}}</span>
                </p>
                <p>
                  <span class="bold">使用性质：</span>
                  <span>{{returncodename(cddata.CD_UseOfAuto,vehicleData.UseOfAuto)}}</span>
                </p>
              </div>
            </i-col>
            <i-col :xxl="8" :xl="12" :lg="24" :md="24" :sm="24" :xs="24">
              <div class="half">
                <p class="word-break: break-all">
                  <span class="bold">车架号：</span>
                  <span>{{vehicleData.VIN}}</span>
                </p>

                <p>
                  <span class="bold">发动机额定功率(kW)：</span>
                  <span>{{vehicleData.EnginePower}}</span>
                </p>
                <p>
                  <span class="bold">品牌：</span>
                  <span>{{vehicleData.FactoryPlateModel}}</span>
                </p>
                <p>
                  <span class="bold">初登日期：</span>
                  <span>{{vehicleData.VRDATE | dataFormat("yyyy-MM-dd")}}</span>
                </p>
                <p>
                  <span class="bold">燃油种类：</span>
                  <span>{{returnMultiple(cddata.CD_FuelType,vehicleData.FuelType)}}</span>
                </p>
                <p>
                  <span class="bold">审核方式：</span>
                  <span>{{vehicleData.VerifyWay?returncodename(checkWay,vehicleData.VerifyWay):' '}}</span>
                  <span @click="goToVehicleTab" style="color:#5cadff;float:right;cursor:pointer;">[更多信息]</span>
                </p>
              </div>
            </i-col>
          </Row>
        </div>
      </Card>
      <!-- 检测报告 -->
      <Card v-show="showReport">
        <p slot="title">检测报告</p>
        <div class="checkRepot">
          <div>
            <p>
              <span class="bold">检测站点：</span>
              <span>{{printdata.StationName}}</span>
            </p>
            <p>
              <span class="bold">检测结果：</span>
              <span>{{printdata.NewVDCT=='1'?'通过':'未通过'}}</span>
            </p>
            <p>
              <span class="bold">检测方法：</span>
              <span>{{returncodename(cddata.CD_InspectionMethod,printdata.IUTYPE)}}</span>
            </p>
            <p>
              <span class="bold">检测类型：</span>
              <span>{{printdata.jctype}}</span>
            </p>
            <p>
              <span class="bold">检测日期：</span>
              <span>{{printdata.DetectEndTime|dataFormat("yyyy-MM-dd hh:mm:ss")}}</span>
            </p>
            <p>
              <span class="bold">文件预览：</span>
              <span v-if="photoNum==0">无文件</span>
              <span style="cursor: pointer;color:#5cadff" @click="showReportImg=true" v-if="photoNum!=0">{{photoNum+'个文件'}}</span>
              <Button type="primary" size="small" style="margin-left: 10px;float:right" @click="getCurrentReport">预览打印</Button>

              <span @click="goToPrintMore" style="color:#5cadff; cursor: pointer;float:right">[更多报告]</span>
            </p>
          </div>
        </div>
      </Card>
    </div>
    <VehicleTrack :VLPN="vehicleData.VLPN" :VLPNColor="vehicleData.VLPNColor" :Vehicleid="Vecid" class="track-box-out" />
    <!-- <vehicle-track style="overflow:auto;margin-top:10px;" :cddata="cddata" :tabkey="tabkey" ref='vehicleTrack' :Vecid="Vecid" :selectVIN="selectVIN" :vehicleData="vehicleData"></vehicle-track> -->
    <!-- 报告内容 -->
    <Modal width="880" v-model="showModel">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="md-print" />
        <span>打印报告</span>
      </p>
      <printContent :giveReport="giveReport" ref="reportCont"></printContent>
      <div slot="footer">
        <Button type="success" size="large" long @click="printStart">打印</Button>
      </div>
    </Modal>
    <!-- 检测报告相关图片展示 -->
    <Modal v-model="showReportImg" :width="width">
      <viewer :images="photo" style="display:flex;justify-content: space-between;flex-wrap: wrap;">
        <div v-for="(item, index) in photo" :key="index" :style="{width:(width-30)/n+'px'}" style="flex:1;min-width:370px;max-width:380px;">
          <p style="height:38px;line-height:38px;font-size:14px;">{{returncodename(cddata.CD_BusinessType,item.BusinessType)}} / {{item.UploadFileUser}} / {{item.UploadFileTime}}</p>
          <img :src="item.Url" :key="index" style="width:80%;marign-right:4px;" @error="onError($event)" />
        </div>
      </viewer>
    </Modal>
  </div>
</template>

<script>
import VehicleTrack from "./vehicleTrack/index";
import printContent from "./printContent";
export default {
  name: "summaryInfo",
  props: {
    Vecid: {
      type: Number
    },
    cddata: {
      type: Object
    },
    vehicleData: {
      type: Object
    },
    selectVIN:{
      type:String
    },
    tabkey:{
      type:String,
    }
  },
  components: {
    VehicleTrack,
    printContent
  },
  data() {
    return {
      photo: [], //图片数组
      photoNum: 0,
      width: 500,
      n: 1, //控制多个图片时
      showReportImg: false,
      showModel: false,
      showBmd: false,
      showZdgz: false,
      showHbc: false,
      showHyc: false,
      showHmd: false,
      specialInfo: {
        hbc: {},
        hmd: {},
        bmd: {},
        hyc: {},
        zdgz: {}
      },
      imgData: { djz: "" }, //车主相关照片
      checkWay: [
        { CodeValue: 1, CodeName: "方式一" },
        { CodeValue: 2, CodeName: "方式二" },
        { CodeValue: 3, CodeName: "方式三" }
      ], //审核方式
      giveReport: {}, //给报告子组件
      showReport: false, //是否显示报告模块
      loading: false,
      printdata: [],
      newprints: {
        InsDataInfo: [],
        jcsb: [],
        OBDInfo: [],
        wgj: [],
        Method_g: [],
        Method_f: [],
        Method_a: [],
        Method_b: [],
        Method_c: []
      }
    };
  },
  methods: {
    onError(event) {
      event.target.src = "static/img/imgError.png";
    },
    arrayBufferToBase64(buffer) {
      //buffer 转base64方法
      var binary = "";
      var bytes = new Uint8Array(buffer);
      var len = bytes.byteLength;
      for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return window.btoa(binary);
    },
    //过滤数据
    returncodename(namelist, codevalue) {
      if (namelist) {
        let CodeName = "";
        namelist.forEach(item => {
          if (item.CodeValue == codevalue) CodeName = item.CodeName;
        });
        return CodeName;
      }
    },
    returnMultiple(namelist, codevalue) {
      if (codevalue) {
        let arrs = String(codevalue).split("");
        if (namelist) {
          let CodeName = [];
          namelist.forEach(item => {
            arrs.forEach(aitem => {
              if (item.CodeValue == aitem) CodeName.push(item.CodeName);
            });
          });
          return CodeName.join(",");
        }
      }
    },
    //获取报告数据
    loaddata() {
      let self = this;
      this.loading = true;
      this.showReport=false;
      this.printdata = [];
      this.$curl
        .get("api/hj/getInspectionDataByVehicleID", { VehicleID: this.Vecid })
        .then(res => {
          const { data } = res;
          let data1 = [];
          if (data.length > 0) {
            this.showReport = true;
            data1.push(data[0]);
          }
          self.printdata = data1;
          self.printdata = self.printdata[0] || {};
          let stationName = "";
          self.cddata.StationInfo.forEach(i => {
            if (self.printdata.StationCode == i.CodeValue) {
              stationName = i.CodeName;
            }
          });
          self.printdata.StationName = stationName;

          if (self.printdata.length > 0) {
            let list = self.printdata.map(e => {
              return e.InspectionDataID;
            });
            let time = self.printdata.map(e => {
              return self.$options.filters.dataFormat(
                e.DetectEndTime,
                "yyyy-MM-dd hh:mm:ss"
              );
            });
          }
          self.loading = false;
          let BusinessKey = [];
          BusinessKey.push(self.printdata.InspectionNum);
          if (BusinessKey.length) {
            const param = {
              BusinessType: "11",
              BusinessKey: BusinessKey
            };
            self.$curl
              .post("api/hj/getReportAndDataImg", param)
              .then(res => {
                const { data } = res;
                if (data) {
                  self.photo = data;
                  self.photoNum = data.length;
                  if (self.photoNum > 1) {
                    self.n = 2;
                    self.width = 800;
                  }
                }
              })
              .catch(error => {});
          }
        })
        .catch(err => {
          self.$Message.error("获取数据失败!");
        });
    },
    // 点击打印预览,传参给子组件
    getCurrentReport() {
      this.showModel = true;
      this.giveReport = {
        InspectionDataID: this.printdata.InspectionDataID,
        VehicleID: this.printdata.VehicleID,
        IUTYPE: this.printdata.IUTYPE,
        InspectionNum: this.printdata.InspectionNum,
        VDCT: this.printdata.VDCT
      };
      this.$nextTick(() => {
        this.$refs.reportCont.printaction();
      });
    },
    //跳转到车辆信息Tab
    goToVehicleTab() {
      this.$emit("selectV", "vehicleTab");
    },
    //跳转到报告Tab
    goToPrintMore() {
      this.$emit("selectV", "reportTab");
    },
    //根据车辆id获取黑名单白名单信息
    getSpeciallInfo() {
      let param = {
        VehicleID: this.Vecid
      };
      this.showBmd = false;
      this.showHmd = false;
      this.showHbc = false;
      this.showZdgz = false;
      this.$curl
        .get("api/hj/getVehicleInSpecialCD", {VehicleID: this.Vecid})
        .then(res => {
          const { bmd, hbc, hmd, zdgz, hyc, zxcy } = res;
          if (bmd != null) {
            this.specialInfo.bmd = bmd;
            this.showBmd = true;
          }
          if (hmd != null) {
            this.specialInfo.hmd = hmd;
            this.showHmd = true;
          }
          if (hbc != null) {
            this.specialInfo.hbc = hbc;
            this.showHbc = true;
          }
          if (zdgz != null) {
            this.specialInfo.zdgz = zdgz;
            this.showZdgz = true;
          }
          if (hyc != null) {
            this.specialInfo.hyc = hyc;
            this.showHyc = true;
          }
        })
        .catch(err => {});
    },
    //打印
    printStart() {
      this.showModel = false;
      this.$refs.reportCont.print_stat();
    }
  },
};
</script>

<style lang="less" scoped>
.summanyBox {
  img {
    width: 100%;
  }
  overflow: hidden auto;
  // background-color: rgb(232, 234, 236);
  padding: 10px;
  width: 100%;
  .mainInfoB {
    width: 100%;
    display: flex;
    justify-content: center;
    .vehicle.ivu-card {
      margin-right: 10px;
    }
    > .ivu-card {
      flex: 1;
      // margin-right: 10px;
      /deep/ p {
        text-align: left;
      }
    }
    > .ivu-card:nth-of-type(2) {
      margin-right: 0;
    }
  }
  .bold {
    font-weight: bold;
  }
  .moreInfo {
    display: flex;
    justify-content: flex-end;
    line-height: 30px;
    span {
      text-align: right;
      padding-right: 10px;
      color: #5cadff;
      cursor: pointer;
    }
  }
  // 车辆信息
  .vehicleInfo,
  .checkRepot {
    .half {
      p {
        padding: 0;
      }
    }
    width: 100%;
    display: flex;
    align-items: center;
    > div {
      flex: 1;
      p {
        text-align: left;
        padding-left: 12px;
        line-height: 24px;
      }
      flex: 1;
    }
  }
  //其它信息
  .OtherInfo {
    margin-top: 10px;
    p {
      text-align: left;
      padding-left: 12px;
      line-height: 24px;
    }

    .blackInfo,
    .whiteInfo,
    .yellowv,
    .keyFocus,
    .blackSmoke {
      display: flex;
      justify-content: flex-start;
      span {
        cursor: pointer;
        padding: 2px 4px;
        border-radius: 4px;
      }
    }
    //黑名单
    .blackInfo {
      span {
        background: rgb(71, 65, 57);
        border: 1px solid rgb(71, 65, 57);
        color: rgb(255, 255, 255);
      }
    }
    //白名单
    .whiteInfo {
      span {
        color: #5e5e5e;
        border: 1px solid #bbb;
        background: #fff;
      }
    }
    //黄标车
    .yellowv {
      span {
        background: rgb(247, 181, 59);
        border: 1px solid rgb(247, 181, 59);
        color: rgb(255, 255, 255);
      }
    }
    //重点关注
    .keyFocus {
      span {
        background: #fff0f6;
        border: 1px solid #ffa39e;
        color: #ff1f1f;
      }
    }
    //黑烟车
    .blackSmoke {
      span {
        background: gray;
        border: 1px solid gray;
        color: rgb(255, 255, 255);
      }
    }
  }
}
.track-box-out{
  // height: calc(100% - 230px);
}
</style>