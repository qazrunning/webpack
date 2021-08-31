//变更检测方法
<template>
  <div>
    <vehicle-info
      :VehicleForm="vehicleInfo"
      :initform="initform"
      :selectData="selectData"
    ></vehicle-info>
    <apply-modify-method
      :ModifyMethodForm="applyModifyMethod"
      :initform="initform"
    ></apply-modify-method>
    <!-- <image-info :ImgForm="imgInfo"></image-info> -->
    <audit-info :AuditForm="auditInfo" :initform="initform"></audit-info>
  </div>
</template>
<script>
import VehicleInfo from "./drawInfo/VehicleInfo";
import ApplyModifyMethod from "./drawInfo/ApplyModifyMethod";
import AuditInfo from "./drawInfo/AuditInfo";
import ImageInfo from "./drawInfo/ImageInfo2";
export default {
  name: "changeMethodAudit",
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
      vehicleInfo: {},//车辆信息
      applyModifyMethod: {},//变更检测方法
      auditInfo: {},//审核信息
      // imgInfo:[],//审核图片
    }
  },
  components: {
    VehicleInfo,
    ApplyModifyMethod,
    AuditInfo,
    ImageInfo
  },
  methods: {
    SubmitAudit(isStatus) { //提交审核
      let message = "";
      if (!this.auditInfo.AuditState) message += "审核结果不能为空!<br/>";
      if (this.$hjconfig.reSure && (!+this.auditInfo.AuditState && !this.auditInfo.Remarks))
        message += "备注不能为空!<br/>";
      if (message != "") return this.$Notice.warning({ title: message });
      this.saveAudit(isStatus);
    },
    BackToAudit() {
      this.$emit('handleBackToAudit', this.auditInfo)
    },
    async saveAudit(isStatus) {
      const param = {
        auditInfo: this.auditInfo,
        isStatus: isStatus,
        applyModifyMethod: this.applyModifyMethod,
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
    async getData() { //获取车辆信息和变更检测方法信息
      const param = {
        CheckId: this.selectData.CheckId,
        BusinessKey: String(this.selectData.BusinessKey)
      }
      const res = await this.$curl.get("api/hj/getChangeInspectionMethodAudit", { param: JSON.stringify(param) });
      this.vehicleInfo = {};
      this.auditInfo = {};
      this.applyModifyMethod = {};
      if (res.state) {
        if (res.WaitCheck) {
          this.vehicleInfo = res.WaitCheck;
          this.auditInfo = res.WaitCheck;
        }
        if (res.ApplyModifyMethod) {
          this.applyModifyMethod = res.ApplyModifyMethod;
        }
      } else {
        this.$Notice.warning({
          title: "提示",
          desc: "获取数据失败!"
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
}
</script>
<style lang="scss" scoped>
</style>