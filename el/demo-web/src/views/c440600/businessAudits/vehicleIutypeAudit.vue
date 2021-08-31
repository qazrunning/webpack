<template>
  <!-- 业务审核-受理审核类型 -->
  <div>
    <vehicle-info :VehicleForm="vehicleInfo" :initform="initform" :selectData="selectData"></vehicle-info>
    <iutype-change :selectData="selectData"></iutype-change>
    <image-info :ImgForm="imgInfo"></image-info>
    <audit-info :AcceptForm="acceptInfo" :selectData="selectData" :AuditForm="auditInfo" :initform="initform" :isFGK="isFGKs" :FGKForm="FGKForms" :CrossApplyForm="CrossApplyForms"></audit-info>
  </div>
</template>
<script>
import VehicleInfo from "./drawInfo/VehicleInfo";
import iutypeChange from "./drawInfo/IutypeChange";
import AuditInfo from "./drawInfo/AuditInfo";
import ImageInfo from "./drawInfo/ImageInfo";
export default {
  name: "acceptaudit",
  props: {
    selectData: {
      type: Object,
      default: {}
    },
    initform: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      vehicleInfo: {}, //车辆信息
      acceptInfo: {}, //受理信息
      auditInfo: {}, //审核信息
      imgInfo: [], //图片信息
      isFGKs: false, //true为非工况
      FGKForms: {},
      CrossApplyForms: {}, //跨站信息
      InspectionNum: "", // 存储当前受理编号
      img: []
    };
  },
  components: {
    VehicleInfo,
    iutypeChange,
    AuditInfo,
    ImageInfo
  },
  methods: {
    SubmitAudit(isStauts) {
      // if (this.auditInfo.AuditState != 0 && this.auditInfo.AuditState != 1) {
      //   this.$Notice.warning({
      //     title: "审核结果不能为空"
      //   });
      //   return;
      // }
      // if(!+this.auditInfo.AuditState && this.auditInfo.Remarks) {
      //   this.$Notice.warning({
      //     title: "不通过时备注不能为空"
      //   });
      //   return;
      // }
      //提交审核
      let message = "";
      if (!this.auditInfo.AuditState) message += "审核结果不能为空!<br/>";
      if (this.$hjconfig.reSure && (!+this.auditInfo.AuditState && !this.auditInfo.Remarks))
        message += "备注不能为空!<br/>";
      if (message != "") return this.$Notice.warning({ title: message });
      this.saveAudit(isStauts);
    },
    BackToAudit() {
      this.$emit('handleBackToAudit', this.auditInfo)
    },
    async saveAudit(isStauts) {
      if (!this.acceptInfo.AcceptanceAuditID) return;
      const param = {
        ApplyReason: this.vehicleInfo.ApplyReason,
        acceptInfo: this.acceptInfo,
        auditInfo: this.auditInfo,
        isStauts: isStauts
      };
      const res = await this.$curl.post("api/hj/SaveAuditForWaitCheck", param);
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
      const _this = this;
      const param = {
        CheckId: this.selectData.CheckId
      };
      const res = await this.$curl.get("api/hj/getAcceptAudit", {
        CheckId: this.selectData.CheckId
      });
      if (res.state) {
        _this.acceptInfo = res.data.AcceptAudit || {};
        _this.vehicleInfo = res.data.WaitCheck || {};
        _this.auditInfo = res.data.WaitCheck || {};
        if (
          this.vehicleInfo.ApplyReason &&
          this.vehicleInfo.ApplyReason.indexOf("21") > -1
        )
          _this.getFGKData();
        if (
          this.vehicleInfo.ApplyReason &&
          this.vehicleInfo.ApplyReason.indexOf("18") > -1
        )
          _this.getCrossAudit();
      } else {
        this.$Notice.warning({
          title: "提示",
          desc: res.msg
        });
      }
    },
    async getFGKData() {
      const res = await this.$curl.get("api/hj/getFGKData", {
        InspectionNum: this.acceptInfo.InspectionNum
      });
      if (res.state && res.data.FGKInfo) this.FGKForms = res.data.FGKInfo;
      this.isFGKs = true;
    },
    async getCrossAudit() {
      const param = {
        CheckId: this.selectData.CheckId,
        VehicleiD: this.vehicleInfo.VehicleID
      };
      const res = await this.$curl.get("api/hj/getCrossAudit", {
        VehicleiD: this.vehicleInfo.VehicleID
      });
      if (res.state && res.data.CrossApply)
        this.CrossApplyForms = res.data.CrossApply;
    },
    getImgList() {}
  },
  watch: {
    selectData: {
      handler(newData, oldData) {
        if (!newData) return;
        this.getData();
      },
      immediate: true
    },
    acceptInfo: {
      handler(newData, oldData) {
        this.InspectionNum = this.acceptInfo.InspectionNum;
      }
    }
  }
};
</script>
