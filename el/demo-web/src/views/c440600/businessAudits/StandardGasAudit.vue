<template>
  <div>
    <StandardGas :AcceptForm="StandardGasInfo" :area="initform.area"></StandardGas>
    <image-info :ImgForm="imgInfo"></image-info>
    <StandardAudit :AuditForm="auditInfo" :initform="initform"></StandardAudit>
  </div>
</template>

<script>
import StandardGas from "./drawInfo/StandardGas";
import ImageInfo from "./drawInfo/ImageInfo";
import StandardAudit from "./drawInfo/StandardAudit";
export default {
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
  components: {
    StandardGas,
    ImageInfo,
    StandardAudit
  },
  data() {
    return {
      StandardGasInfo: {},
      imgInfo: [], //图片信息
      auditInfo: {}
    };
  },
  methods: {
    SubmitAudit(isStauts) {
      //提交审核
      let message = "";
      if (!this.auditInfo.AuditState) message += "审核结果不能为空!<br/>";
      if (this.$hjconfig.reSure && (!+this.auditInfo.AuditState && !this.auditInfo.Remarks))
        message += "备注不能为空!<br/>";
      if (message != "") return this.$Notice.warning({ title: message });
      this.saveAudit();
    },
    BackToAudit() {
      this.$emit('handleBackToAudit', this.auditInfo)
    },
    async saveAudit(isStauts) {
      const param = {
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
        _this.auditInfo = res.data.WaitCheck || {};
        
      } else {
        this.$Notice.warning({
          title: "提示",
          desc: res.msg
        });
      }
    },
    async getStandardGasManageData() {
       await this.$curl.get('api/hj/getStandardGasData',{param:JSON.stringify(this.selectData.BusinessKey)}).then(res => {
        const { data, state } = res;
        if (state) {
          if(data)
            this.StandardGasInfo = data;
            this.getImgInfo();
        }
      });
    },

    // 根据标气的pathID获取图片
    async getImgInfo() {
      await this.$curl.get('api/hj/getStandardGas',{param:JSON.stringify(this.StandardGasInfo.PathID)}).then(res => {
        const { data, state } = res;
        if (state) {
          if(data)
            this.imgInfo = data;
        }
      });
    },
    
  },
  watch: {
    selectData: {
      handler(newData, oldData) {
        if (!newData) return;
        this.getData();
        this.getStandardGasManageData();
      },
      immediate: true
    }
  },
  
};
</script>

<style>
</style>