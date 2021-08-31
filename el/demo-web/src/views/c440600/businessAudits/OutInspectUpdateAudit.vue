//外检修改审核
<template>
  <div>
    <vehicle-info :VehicleForm="vehicleInfo" :initform="initform" :selectData="selectData"></vehicle-info>
    <applyModify-ext ref="externalMain" :ApplyExteriorEdit="applyExteriorEdit" :ExternalForm="externalInfo" :ExternalBeforeImgList="externalBeforeImgList" :ExternalAfterImgList="externalAfterImgList" :ExternalImgList="externalImgList"></applyModify-ext>
    <audit-info :AuditForm="auditInfo" :initform="initform"></audit-info>
  </div>
</template>
<script>
import VehicleInfo from "./drawInfo/VehicleInfo";
import ApplyModifyExt from "./drawInfo/ApplyModifyExt";
import AuditInfo from "./drawInfo/AuditInfo";
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
      vehicleInfo: {},
      externalInfo: {},
      auditInfo: {},
      externalImgList: [],
      externalBeforeImgList: [], //变更前的图片信息
      externalAfterImgList: [], //变更后的图片信息
      filterBeforeImgArr: [],
      filterAfterImgArr: [],
      applyExteriorEdit: {} //申请变更外检信息对象
    };
  },
  components: {
    VehicleInfo,
    ApplyModifyExt,
    AuditInfo
  },
  methods: {
    SubmitAudit(isStauts) {
      //提交审核
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
      //保存审核信息
      let bimg = [];
      let aimg = [];
      if (this.externalBeforeImgList.length > 0) {
        this.externalBeforeImgList.forEach(v => {
          bimg.push(v.ID);
        });
      }
      if (this.externalAfterImgList.length > 0) {
        this.externalAfterImgList.forEach(v => {
          aimg.push(v.ID);
        });
      }
      const param = {
        auditInfo: this.auditInfo,
        extBeforeImgModel: this.bimg,
        extAfterImgModel: this.aimg,
        isStauts:isStauts
      };
      const res = await this.$curl.post("api/hj/SaveOutInspectUpdateAudit", param);
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
        CheckId: this.selectData.CheckId,
        ApplyID: this.selectData.BusinessKey
      };
      const res = await this.$curl.get("api/hj/getOutInspectUpdateAudit", {param:JSON.stringify(param)});
      this.vehicleInfo = {};
      this.externalInfo = {};
      this.auditInfo = {};

      if (res.state) {
        if (res.data.WaitCheck) {
          this.vehicleInfo = res.data.WaitCheck;
          this.auditInfo = res.data.WaitCheck;
        }
        if (res.data.AppearanceData)
          this.externalInfo = res.data.AppearanceData;
        if (res.data.ApplyExteriorEdit) {
          this.applyExteriorEdit = res.data.ApplyExteriorEdit;
          var imgIndex =
            res.data.ApplyExteriorEdit.UpdateField == "undefined"
              ? -1
              : res.data.ApplyExteriorEdit.UpdateField.toString()
                  .split(",")
                  .findIndex(element => {
                    return element == "ExtImg";
                  }); // 判定该外检申请是否包含图片的变更
          if (imgIndex != -1) {
            let imgBeforeArr = []; //

            let imgAfterArr = [];
            //获取更改前图片的ID
            imgBeforeArr = res.data.ApplyExteriorEdit.OldValue.toString().split(
              ","
            );
            this.filterBeforeImgArr = imgBeforeArr[imgIndex]
              .toString()
              .split("@");
            //获取更改后图片的ID
            imgAfterArr = res.data.ApplyExteriorEdit.NewValue.toString().split(
              ","
            );
            this.filterAfterImgArr = imgAfterArr[imgIndex]
              .toString()
              .split("@");
          }
        }
        if (res.data.ExternalImgList.length > 0) {
          this.externalBeforeImgList = res.data.ExternalImgList.filter(value =>
            _this.filterBeforeImgArr.includes("" + value.ID)
          );
          this.externalAfterImgList = res.data.ExternalImgList.filter(value =>
            _this.filterAfterImgArr.includes("" + value.ID)
          );
        }
      } else {
        this.$Notice.warning({
          title: "提示",
          desc: "获取数据失败!"
        });
      }
    }
  },
  created() {},
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
</style>