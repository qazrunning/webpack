<template>
  <!-- 业务审核-车型审核类型 -->
  <div class="modelReview">
    <vehicle-info :VehicleForm="vehicleInfo" :initform="$attrs.initform" :selectData="selectData">
      <template v-slot:footer>
        <Row v-show="auditInfo.ApplyReason!='新车录入车型审核'">
          <i-col :xxl="8" :xl="12" :lg="24" :md="24" :xs="24" :sm="24">
            <FormItem label="原号牌号码:">{{ vehicleInfo.OldVLPN || ''}}</FormItem>
            <FormItem label="原省:">{{ $attrs.initform.area[vehicleInfo.OldProv] || ''}}</FormItem>
          </i-col>
          <i-col :xxl="8" :xl="12" :lg="24" :md="24" :xs="24" :sm="24">
            <FormItem label="原车牌颜色:">{{ $attrs.initform.cd_vlpnColor[vehicleInfo.OldVLPNColor] || '' }}</FormItem>
            <FormItem label="原市:">{{ $attrs.initform.cd_city[vehicleInfo.OldCity] || ''}}</FormItem>
          </i-col>
          <i-col :xxl="8" :xl="12" :lg="24" :md="24" :xs="24" :sm="24">
            <FormItem label="原车主:">{{ vehicleInfo.OldOwner || ''}}</FormItem>
            <FormItem label="原县:">{{ $attrs.initform.area[vehicleInfo.OldCounty] || ''}}</FormItem>
          </i-col>

        </Row>
      </template>
    </vehicle-info>
    <image-info :ImgForm="imgInfo"></image-info>
    <audit-info :AuditForm="auditInfo" :initform="$attrs.initform"></audit-info>
    <emission-info ref="emiss_div" :hasAuthority="false"></emission-info>
  </div>
</template>
<script>
import VehicleInfo from "./drawInfo/VehicleInfo";
import AuditInfo from "./drawInfo/AuditInfo";
import ImageInfo from "./drawInfo/ImageInfo2";
import EmissionInfo from "./drawInfo/EmissionInfo";
export default {
  name: "modelReviewAudit",
  props: {
    selectData: {
      type: Object
      
    }
    // initform: {
    //   type: Object
    // }
  },
  data() {
    return {
      vehicleInfo: {}, //车辆信息
      auditInfo: {}, //审核信息
      imgInfo: [] //图片信息
    };
  },
  components: {
    VehicleInfo,
    AuditInfo,
    ImageInfo,
    EmissionInfo
  },
  methods: {
    //车型审核
    handleModel() {
      this.$refs.emiss_div.openModel();
      this.$refs.emiss_div.childMethods(this.selectData); //调用子组件方法并传参
    },
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
      const param = {
        ApplyReason: [],
        acceptInfo: {},
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
      const res = await this.$curl.get("api/hj/getModelReview", {param:JSON.stringify(param)});
      if (res.state) {
        if (res.data.WaitCheck) this.auditInfo = res.data.WaitCheck;
        if (res.data.VehicleInfo) this.vehicleInfo = res.data.VehicleInfo;
      } else {
        this.$Message.error("查询失败!");
      }
    },
    async getImgList() {
      const param = {
        BusinessKey: String(this.selectData.CheckId), //审核ID
        BusinessType: "08" //业务组
      };
      const res = await this.$curl.get("api/hj/getUploadFileData", {param:JSON.stringify(param)});
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
  },
  mounted() {}
};
</script>
<style scoped>
.modelReview .ivu-form-item {
  margin-bottom: 2px;
}

.modelReview /deep/ .ivu-form-item-label {
  color: #a0a0a0;
}
</style>