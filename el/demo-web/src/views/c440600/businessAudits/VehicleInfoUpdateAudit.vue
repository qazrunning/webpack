//车辆关键信息修改审核
<template>
  <div>
    <vehicle-info :VehicleForm="vehicleInfo" :initform="initform" ></vehicle-info>
    <image-info :ImgForm="imgInfo"></image-info>
    <audit-info :AuditForm="auditInfo" :initform="initform"></audit-info>
  </div>
</template>

<script>
import VehicleInfo from "./drawInfo/VehicleInfo3";
import AuditInfo from "./drawInfo/AuditInfo";
import ImageInfo from "./drawInfo/ImageInfo";
export default {
  name: "vehicleInfoUpdateAudit",
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
      vehicleInfo: {},
      auditInfo: {},
      oldVec: {},
      imgInfo: []
    };
  },
  components: {
    VehicleInfo,
    AuditInfo,
    ImageInfo
  },
  methods: {
    SubmitAudit(isStauts) {
      //提交审核
      let message = "";
      if (!this.auditInfo.AuditState) message += "审核结果不能为空!<br/>";
      if (this.$hjconfig.reSure && (!+this.auditInfo.AuditState && !this.auditInfo.ApplyReason && !this.auditInfo.Remarks)) message += "备注不能为空!<br/>";
      if (message != "")  return this.$Notice.warning({ title: message }); 
      this.saveVehicleInfoUpdateData(isStauts);
    },
    BackToAudit() {
      this.$emit('handleBackToAudit', this.auditInfo)
    },
    async saveVehicleInfoUpdateData(isStauts) {
      //车辆关键信息修改审核
      const param = {
        VehicleID: this.auditInfo.VehicleID,
        CheckID: this.auditInfo.CheckId,
        AuditState: this.auditInfo.AuditState,
        isStauts:isStauts
      };
      const res = await this.$curl.post("api/hj/SaveModifyVec", param);
      if (res.state) {
        this.saveAudit(isStauts);
      }
    },
    async saveAudit(isStauts) {
      const param = {
        acceptInfo: this.acceptInfo,
        auditInfo: this.auditInfo,
        isStauts:isStauts
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
      const param = {
        CheckId: this.selectData.CheckId,
        VehicleID: this.selectData.VehicleID
      };
      const res = await this.$curl.get("api/hj/getVehicleUpdateInfo", {param:JSON.stringify(param)});
      this.vehicleInfo = {};
      this.auditInfo = {};
      if (res.state) {
        if (res.data.WaitCheck) {
          this.vehicleInfo = res.data.WaitCheck;
          this.auditInfo = res.data.WaitCheck;
        }
      } else {
        this.$Notice.warning({
          title: "提示",
          desc: "获取数据失败!"
        });
      }
    },
    async getImgList() {
      const param = {
        ID: this.selectData.CheckId, //审核ID
        TYPE: this.selectData.CheckType, //业务组
        OP: "5",
        vid: this.selectData.VehicleID
      };
      const res = await this.$curl.get("api/hj/getBusinessFileInfo", {param:JSON.stringify(param)});
      this.imgInfo = [];
      if (res.state) {
        if (res.data.imgList.length > 0) this.imgInfo = res.data.imgList;
      } else {
        this.$Notice.warning({
          title: "提示",
          desc: "获取图片列表失败!"
        });
      }
    }
  },
  mounted() {
    this.getData();
  },
  watch: {
    selectData: {
      handler(newData, oldData) {
        if (!newData) return;
        this.getData();
        this.getImgList();
      },
      immediate: true
    }
  }
};
</script>

<style>
</style>
