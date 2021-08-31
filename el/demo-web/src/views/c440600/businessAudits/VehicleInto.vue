<template>
  <!-- 业务审核-受理审核类型 外地转入二手车 -->
  <div>
    <vehicle-info
      :VehicleForm="vehicleInfo"
      :initform="initform"
      :selectData="selectData"
    ></vehicle-info>
    <Card>
      <p slot="title">原车辆信息</p>
      <Row :gutter="16" style="margin-bottom: 10px">
        <i-col span="8">
          原号牌号码：
          {{ oldVehicle.OldVLPN }}
        </i-col>
        <i-col span="8">
          二手车转出地：
          {{ oldVehicle.SecondHandCarPlace == "1" ? "异地" : "本地" }}
        </i-col>
      </Row>
    </Card>
    <image-info v-if="imgInfo.length >0" :ImgForm="imgInfo"></image-info>
    <image-info-new else :ImgForm="imgInfo2"></image-info-new>
    <audit-info
      :AcceptForm="acceptInfo"
      :selectData="selectData"
      :AuditForm="auditInfo"
      :initform="initform"
    ></audit-info>
  </div>
</template>
<script>
import VehicleInfo from "./drawInfo/VehicleInfo";
import AcceptInfo from "./drawInfo/AcceptInfo";
import AuditInfo from "./drawInfo/AuditInfo";
import ImageInfo from "./drawInfo/ImageInfo";
import ImageInfoNew from "./drawInfo/ImageInfo2";
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
      imgInfo: [], //图片信息，读取的是BusinessFileInfo
      imgInfo2: [],//读取的是UploadFileData
      oldVehicle: {}, // 原车辆数据
    };
  },
  components: {
    VehicleInfo,
    AcceptInfo,
    AuditInfo,
    ImageInfo,
    ImageInfoNew
  },
  methods: {
    SubmitAudit(isStauts) {
      let message = "";
      if (!this.auditInfo.AuditState) message += "审核结果不能为空!<br/>";
      if (message != "") return this.$Notice.warning({ title: message });
      this.saveAudit(isStauts);
    },
    BackToAudit() {
      this.$emit('handleBackToAudit', this.auditInfo)
    },
    async saveAudit(isStauts) {
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
      const res = await this.$curl.get("api/hj/getAcceptAudit", {
        CheckId: this.selectData.CheckId
      });
      if (res.state) {
        this.acceptInfo = res.data.WaitCheck || {};
        this.vehicleInfo = res.data.WaitCheck || {};
        this.auditInfo = res.data.WaitCheck || {};
        this.getOldVehicleInfo()

      }
    },
    // 获取原车辆表的vehicleID
    async getOldVehicleInfo() {
      const res = await this.$curl.get("api/hj/getOldVehicleInfo", {
        VehicleID: this.vehicleInfo.VehicleID
      });
      if (res.state) {
        this.oldVehicle = res.result;
      }
    },
    // 获取图片
    async getImgList() {

      const param = {
        vid: this.selectData.VehicleID, //车辆ID
        TYPE: '21', //审核类型
        ApplyTime: this.selectData.ApplyTime, //申请时间
        OP: "6"
      };
      this.imgInfo = [];
      this.imgInfo2 = [];
      const res = await this.$curl.get("api/hj/getBusinessFileInfo", {
        param: JSON.stringify(param)
      });
      if (res.state) {
        if (res.data.imgList.length > 0) {
          res.data.imgList.forEach(item => {
            this.imgInfo.push(item);
          });
        } else {
          const param1 = {
            BusinessKey: String(this.selectData.VehicleID),
            ApplyTime: this.selectData.ApplyTime,
            BusinessType: "81"
          };
          const resPic = await this.$curl.get("api/hj/getChangeRegistratImage", {
            param: JSON.stringify(param1)
          });
          if (resPic.state) {
            if (resPic.data.imgList.length > 0) this.imgInfo2 = resPic.data.imgList;
          } else {
            this.$Notice.warning({
              title: "提示",
              desc: "获取图片列表失败!"
            });
          }
        }
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
        this.getData()
      },
      immediate: true
    },
    acceptInfo: {
      handler(newData, oldData) {
        this.InspectionNum = this.acceptInfo.InspectionNum;
        this.getImgList();
      }
    }
  }
};
</script>
