//申请更改林格曼结果审核
<template>
  <div>
    <vehicle-info :VehicleForm="vehicleInfo" :initform="initform" :selectData="selectData"></vehicle-info>
    <!-- <Button style="margin-left:10px;" size="small" shape="circle" type="primary"
     @click="$router.push({name: 'hj-blackSmokeCar', query:{BusinessKey: selectData.BusinessKey}})">黑烟车抓拍</Button> -->
    <date-edit-check :editDate="editDate" :initform="initform"></date-edit-check>
    <audit-info :AuditForm="auditInfo" :initform="initform"></audit-info>
    <!-- 全屏弹框 -->
    <Modal v-model="isDetail" fullscreen footer-hide scrollable draggable width='80' title="监管明细">
      <Detail :InspectionNum="selectData&&selectData.BusinessKey"></Detail>
    </Modal>
  </div>
</template>

<script>
import VehicleInfo from "./drawInfo/VehicleInfo";
import AuditInfo from "./drawInfo/AuditInfo";
import DateEditCheck from "./drawInfo/DateEditCheck";

const Detail = () => import("./../../components/regulatoryDetail");
export default {
  name: "CheckDateAudit",
  props: {
    selectData: {
      type: Object
    },
    initform: {
      type: Object
    }
  },
  components: {
    VehicleInfo,
    AuditInfo,
    Detail,
    DateEditCheck
  },
  data() {
    return {
      vehicleInfo: {},
      auditInfo: {},
      isDetail: false,
      editDate: {
        blackSmokeCar: {}, //黑烟车检查
        specialAttentionVehicle: {}, //重点关注车
        blackList: {}, //黑名单
        blackSmokeCarCapture: {}, //冒黑烟
        InspectData:{},//检测数据
      }, //检测数据审核
    };
  },
  methods: {
    //获取车辆基本信息和审核信息
    async getData() {
      const param = {
        CheckId: this.selectData.CheckId
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
    //获取检测数据审核信息
    getCheckDateAuditDate() {
      const param = {
        BusinessKey: this.selectData.BusinessKey,
        VehicleID: this.selectData.VehicleID,
        CheckType: this.selectData.CheckType,
        IsCheck: "1"
      };
      this.$curl.get("api/hj/getCheckDateAudit", {param:JSON.stringify(param)}).then(res => {
        if (res.state) {
          this.editDate.blackSmokeCar = res.blackSmokeCar || {};
          this.editDate.specialAttentionVehicle =
            res.specialAttentionVehicle || {};
          this.editDate.blackList = res.blackList || {};
          this.editDate.blackSmokeCarCapture = res.blackSmokeCarCapture || {};
          this.editDate.imgList = res.imgList || {};;
        } else {
          this.$Message.error(res.msg);
        }
      });
    },
    //获取检测信息
    getInspectionData(){
      this.$curl.get("api/hj/getInspectData",{InspectionNum:this.selectData.BusinessKey}).then(res=>{
        if(res.state){
          this.editDate.InspectData=res.InspectData||{};
        }
      })
    },
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
      const param = {
        auditInfo:this.auditInfo,
        isStauts:isStauts,
        IUTYPE:this.editDate.InspectData.IUTYPE
      };
      const res = await this.$curl.post("api/hj/SaveChangeLingmanDataAudit", param);
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
    }
  },
  watch: {
    selectData: {
      handler(newData, oldData) {
        if (!newData) return;    
        this.getData();
        this.getCheckDateAuditDate();
        this.getInspectionData();
      },
      immediate: true
    }
  }
};
</script>

<style lang="less" scoped>
</style>