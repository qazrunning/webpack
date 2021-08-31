//跨站检测申请
<template>
  <div>
    <vehicle-info :VehicleForm="vehicleInfo" :initform="initform" :selectData="selectData"></vehicle-info>
    <audit-info :AuditForm="auditInfo" :initform="initform"></audit-info>
  </div>
</template>
<script>
import VehicleInfo from "./drawInfo/VehicleInfo";
import AuditInfo from "./drawInfo/AuditInfo";
export default {
  name: "changeRegistratAudit",
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
      vehicleInfo: {}, //车辆信息
      appModifyVehicle: {}, //车辆变更信息
      auditInfo: {}, //审核信息
      JsonData: {} //组装后的新对象(到时候存储到vehicle表)
    };
  },
  components: {
    VehicleInfo,
    AuditInfo,
  },
  methods: {
    SubmitAudit(isStauts) {
      //提交审核
      let message = "";
      if (!this.auditInfo.AuditState) message += "审核结果不能为空!<br/>";
      if (this.$hjconfig.reSure && (!+this.auditInfo.AuditState && !this.auditInfo.Remarks)) message += "备注不能为空!<br/>";
      if (message != "")  return this.$Notice.warning({ title: message }); 
      this.saveAudit(isStauts);
    },
    BackToAudit() {
      this.$emit('handleBackToAudit', this.auditInfo)
    },
    async saveAudit(isStauts) {
      const self = this;
      const param = {
        auditInfo: this.auditInfo,
        isStauts:isStauts
      };
      const res = await this.$curl.post("api/hj/SaveCrossStationAudit", param);
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
      };
      const res = await this.$curl.get("api/hj/getChangeRegistratAudit", {param:JSON.stringify(param)});
      this.vehicleInfo = {};
      this.auditInfo = {};
      if (res.state) {
        if (res.WaitCheck) {
          this.vehicleInfo = res.WaitCheck;
          this.auditInfo = res.WaitCheck;
        }
      } else {
        this.$Notice.warning({
          title: "提示",
          desc: "获取数据失败!"
        });
      }
    },
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
<style scoped>
</style