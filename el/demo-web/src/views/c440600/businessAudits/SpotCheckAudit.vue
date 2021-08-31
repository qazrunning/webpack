//业务审核-抽查审核
<template>
  <div>
    <vehicle-info :VehicleForm="vehicleInfo" :initform="initform" :selectData="selectData"></vehicle-info>
    <img-Info :ImgForm="vehicleImgList"></img-Info>
    <Button style="margin-left:10px;" size="small" shape="circle" type="primary" @click="isDetail=true;">环检抽查检测数据</Button>
    <tailCheck-info :CheckStep="auditInfo.CheckStep" :Status="auditInfo.Status" :TailCheckForm="tailCheckInfo" v-on:selectChange="selChange"></tailCheck-info>

    <external-info ref="externalMain" v-on:selectChange="selChange" :Status="auditInfo.Status" :SpotCheckForm="vehicleInfo" :ExternalForm="externalInfo" :TailCheckForm="tailCheckInfo" :ExternalImgList="externalImgList"></external-info>

    <audit-info :AuditForm="auditInfo" :initform="initform"></audit-info>

    <!-- 全屏弹框 -->
    <Modal v-model="isDetail" fullscreen footer-hide scrollable draggable width='80' title="监管明细">
      <Detail :InspectionNum="tailCheckInfo.InspectionNum" :IsFinishCheck="1"></Detail>
    </Modal>
  </div>
</template>

<script>
import VehicleInfo from "./drawInfo/VehicleInfo";
import TailCheckInfo from "./drawInfo/TailCheckInfo";
import ExternalInfo from "./drawInfo/ExternalInfo";
import AuditInfo from "./drawInfo/AuditInfo";
import ImgInfo from "./drawInfo/ImageInfo2";
const Detail = () => import("./../../components/regulatoryDetail");
export default {
  props: {
    selectData: {
      type: Object
    },
    initform: {
      type: Object
    }
  },
  data() {
    return {
      isDetail: false,
      isAllPass: false,
      vehicleInfo: {},
      tailCheckInfo: {},
      externalInfo: {},
      externalImgList: [],
      auditInfo: {},
      vehicleImgList: [],
      rscModel: {}
    };
  },
  components: {
    VehicleInfo,
    TailCheckInfo,
    ExternalInfo,
    AuditInfo,
    Detail,
    ImgInfo
  },
  methods: {
    SubmitAudit(isStauts) {
      //获取checkBox选中项
      const tailCheckInfo = this.tailCheckInfo;
      let ExtImg = "ExtImg";
      this.$refs.externalMain.checkImgArr.forEach(ID => (ExtImg += "@" + ID));
      const btgzd = ExtImg;
      tailCheckInfo.InsExternalNoZWM = btgzd;

      let message = "";
      if (!tailCheckInfo.InsReportAudit)
        message += "检测报告审核结果不能为空!<br/>";
      if (!tailCheckInfo.InsProcessAudit)
        message += "检测过程数据审核结果不能为空!<br/>";
      if (!tailCheckInfo.InsImgAudit)
        message += "检测图片审核结果不能为空!<br/>";
      if (!tailCheckInfo.InsVideoAudit)
        message += "检测视频审核结果不能为空!<br/>";
      if (!tailCheckInfo.InsBlackSmokeAudit)
        message += "冒黑烟图片审核结果不能为空!<br/>";
      if (!tailCheckInfo.InsExternalAudti)
        message += "外检信息审核结果不能为空!<br/>";
      if (!this.auditInfo.AuditState) message += "审核结果不能为空!<br/>";

      if (!this.auditInfo.AuditState) message += "审核结果不能为空!<br/>";

      if (
        this.$refs.externalMain.checkImgArr.length > 0 &&
        tailCheckInfo.InsExternalAudti == "1" &&
        !tailCheckInfo.InsExternalAudtiReason
      )
        message += "外检信息审核备注不能为空!<br/>";

      if (
        !this.isAllPass &&
        this.auditInfo.AuditState == "1" &&
        !this.auditInfo.Remarks
      )
        message += "备注不能为空!<br/>";

      if (message != "") {
        this.$Notice.warning({
          title: message
        });
        return;
      }

      this.saveAudit(isStauts);
    },
    BackToAudit() {
      const tailCheckInfo = this.tailCheckInfo;
      let ExtImg = "ExtImg";
      this.$refs.externalMain.checkImgArr.forEach(ID => {
        if(ID != undefined) 
          ExtImg += "@" + ID
      });
      const btgzd = ExtImg;
      tailCheckInfo.InsExternalNoZWM = btgzd;
      if (tailCheckInfo.InsExternalNoZWM.indexOf('@') != -1 && !tailCheckInfo.InsExternalAudtiReason){
        this.$Message.warning("外检信息审核备注不能为空!");
        return
      }
      this.$emit('handleBackToAudit', this.auditInfo, tailCheckInfo)
    },
    async saveAudit(isStauts) {
      let imgToHandle = {
        imgToChange: [],
        imgToDelete: []
      }
      if(this.auditInfo.AuditState == '1') {
        this.$refs.externalMain.reviewImgs.forEach(item => {
          if(this.$refs.externalMain.checkImgArr.indexOf(item.ID) == -1)
            imgToHandle.imgToChange.push(item)
        })
        if(imgToHandle.imgToChange.length) {
          imgToHandle.imgToChange.forEach(item => {
            let index = this.$refs.externalMain.initialImgs.findIndex(img => img.PicType == item.PicType)
            imgToHandle.imgToDelete.push(this.$refs.externalMain.initialImgs[index])
          })
        }
      }
      
      const param = {
        rscModel: this.tailCheckInfo,
        auditInfo: this.auditInfo,
        isStauts:isStauts,
        imgToHandle
      };
      const res = await this.$curl.post(
        "api/hj/SaveVehicleRingTestSpotCheck",
        param
      );
      if (res.state) {
        if (res.auditInfo) {
          //将后台返回的处理人，处理时间赋值
          this.auditInfo.Checker = res.auditInfo.Checker;
          this.auditInfo.CheckTime = res.auditInfo.CheckTime;

          //合并修改后的数据
          this.selectData.Status = this.auditInfo.Status = "1";
          Object.assign(this.selectData, this.auditInfo);
          this.$emit("on-edit", this.selectData);
        }
        this.$Message.success(res.msg);
      } else {
        this.$Notice.warning({
          title: "提示",
          desc: res.msg
        });
      }
    },
    async getData() {
      const param = {
        CheckId: this.selectData.CheckId,
        RingTestSpotCheckID: this.selectData.BusinessKey
      };
      const res = await this.$curl.get("api/hj/getSpotCheckAudit", {param:JSON.stringify(param)});
      this.vehicleInfo = {};
      this.tailCheckInfo = {};
      this.externalInfo = {};
      this.externalImgList = [];
      this.auditInfo = {};
      if (res.state) {
        if (res.data.WaitCheck) {
          this.vehicleInfo = res.data.WaitCheck;
          this.auditInfo = res.data.WaitCheck;
        }
        if (res.data.RingTestSpotCheck)
          this.tailCheckInfo = res.data.RingTestSpotCheck;
        if (res.data.AppearanceData)
          this.externalInfo = res.data.AppearanceData;
        if (res.data.ExternalImgList.length > 0)
          this.externalImgList = res.data.ExternalImgList;
      } else {
        this.$Notice.warning({
          title: "提示",
          desc: "获取数据失败!"
        });
      }
      this.getImgList();
    },
    selChange() {
      if (this.auditInfo.Status == "1") return; //审核则不往下走

      if (
        this.tailCheckInfo.InsReportAudit == 1 &&
        this.tailCheckInfo.InsProcessAudit == 1 &&
        this.tailCheckInfo.InsImgAudit == 1 &&
        this.tailCheckInfo.InsVideoAudit == 1 &&
        this.tailCheckInfo.InsBlackSmokeAudit == 1 &&
        this.tailCheckInfo.InsExternalAudti == 1
      )
        this.isAllPass = true;
      else this.isAllPass = false;

      //只有抽查项都为通过，最终结果才为通过
      if (this.isAllPass) this.auditInfo.AuditState = "1";
      else this.auditInfo.AuditState = "0";
    },
    async getImgList() {
      this.vehicleImgList = [];
      const param = {
        BusinessKey: String(this.selectData.VehicleID),
      };
      const res = await this.$curl.get("api/hj/getSpotAuditImg", {param:JSON.stringify(param)});
      if (res.code) {
        if (res.data.length > 0) this.vehicleImgList = res.data;
      } else {
        this.$Notice.warning({
          title: "提示",
          desc: "获取图片列表失败!"
        });
      }
    }
  },
  watch: {
    selectData: {
      handler(newData, oldData) {
        if (!newData) return;
        this.getData();
      },
      immediate: true
    }
  }
};
</script>
<style>
.ivu-modal-no-mask {
  z-index: 1500 !important;
}
</style>

