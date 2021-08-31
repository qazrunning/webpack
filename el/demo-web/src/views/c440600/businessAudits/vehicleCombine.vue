<template>
  <!-- 业务审核-受理审核类型 -->
  <div>
    <vehicle-info :VehicleForm="vehicleInfo" :initform="initform" :selectData="selectData"></vehicle-info>
    <Card>
      <p slot="title">
            修改原因
        </p>
        {{auditInfo.ApplyDetailReason}}
    </Card>
    <image-info :ImgForm="imgInfo"></image-info>
    <audit-info :AcceptForm="acceptInfo" :selectData="selectData" :AuditForm="auditInfo" :initform="initform"></audit-info>
  </div>
</template>
<script>
import VehicleInfo from "./drawInfo/VehicleInfo";
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
      acceptInfo: {},
      vehicleInfo: {}, //车辆信息
      auditInfo: {}, //审核信息
      imgInfo: [], //图片信息
    };
  },
  components: {
    VehicleInfo,
    AuditInfo,
    ImageInfo
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
      }
    },
    async getImgList() {
     

      const param = {
        vid: this.selectData.CheckId, //车辆ID
        OP: "7",
        type: '73'
      };
      this.imgInfo = [];
      const res = await this.$curl.get("api/hj/getBusinessFileInfo", {
        param: JSON.stringify(param)
      });
      if (res.state) {
        if (res.data.imgList.length > 0) {
          res.data.imgList.forEach(item => {
            this.imgInfo.push(item);
          });
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
        this.getImgList();
      },
      immediate: true
    },
  }
};
</script>
