//车辆变更登记审核
<template>
  <div>
    <vehicle-info :VehicleForm="vehicleInfo" :initform="initform" :selectData="selectData"></vehicle-info>
    <app-modify-vehicle :ModifyForm="appModifyVehicle" :initform="initform"></app-modify-vehicle>
    <image-info :ImgForm="imgInfo"></image-info>
    <audit-info :AuditForm="auditInfo" :initform="initform"></audit-info>
  </div>
</template>
<script>
import VehicleInfo from "./drawInfo/VehicleInfo";
import AppModifyVehicle from "./drawInfo/AppModifyVehicle";
import AuditInfo from "./drawInfo/AuditInfo";
import ImageInfo from "./drawInfo/ImageInfo2";
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
      imgInfo: [], //图片信息
      JsonData: {} //组装后的新对象(到时候存储到vehicle表)
    };
  },
  components: {
    VehicleInfo,
    AppModifyVehicle,
    AuditInfo,
    ImageInfo
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
      self.JsonData = {};
      JSON.parse(self.appModifyVehicle.JsonData).forEach(item => {
        self.JsonData[item.Field] = item.NewValue;
      });
      const param = {
        JsonData: this.JsonData,
        auditInfo: this.auditInfo,
        ModifyType: 2,
        isStauts:isStauts
      };
      const res = await this.$curl.post("api/hj/SaveChangeRegistratAudit", param);
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
        BusinessKey: String(this.selectData.BusinessKey),
        ModifyType: 2
      };
      const res = await this.$curl.get("api/hj/getChangeRegistratAudit", {param:JSON.stringify(param)});
      this.vehicleInfo = {};
      this.auditInfo = {};
      this.appModifyVehicle = {};
      if (res.state) {
        if (res.WaitCheck) {
          this.vehicleInfo = res.WaitCheck;
          this.auditInfo = res.WaitCheck;
        }
        if (res.AppModifyVehicle) {
          this.appModifyVehicle = res.AppModifyVehicle;
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
        BusinessKey: String(this.selectData.UniqueString),
        ApplyTime: this.selectData.ApplyTime,
        BusinessType: "12"
      };
      const res = await this.$curl.get("api/hj/getChangeRegistratImage", {param:JSON.stringify(param)});
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
<style scoped>
</style