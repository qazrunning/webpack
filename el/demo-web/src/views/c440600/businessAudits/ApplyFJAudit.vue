//业务审核-抽查审核
<template>
  <div>
    <vehicle-info :VehicleForm="vehicleInfo" :initform="initform" :selectData="selectData"></vehicle-info>
    <Button style="margin-left:10px;" size="small" shape="circle" type="primary" @click="prodatafn">检测数据</Button>
    <Card>
      <p slot="title">申请信息</p>
      <Form label-position="right" :label-width="150">
        <Row>
          <i-col :xxl="24" :xl="24" :lg="24" :md="24" :xs="24" :sm="24">
                  <Divider>检测结果</Divider>
             <processTable :processData="processData"></processTable>
              <Divider>OBD结果</Divider>
          <OBDInfo :OBDInfo="OBDInfo"  :InsDataInfo="processData.InspectData"></OBDInfo>
          <Divider>申请原因</Divider>
            <div style="fontSize:16px;text-align: center;"> {{ vehicleInfo.ApplyDetailReason || "" }}</div>
          </i-col>
        </Row>
      </Form>
    </Card>
    <img-Info :ImgForm="ImgList"></img-Info>
    <audit-info :AuditForm="auditInfo" :initform="initform"></audit-info>

    <!-- 全屏弹框 -->
    <Modal v-model="isDetail" fullscreen footer-hide scrollable draggable width='80' title="监管明细">
      <Detail  :InspectionNum="auditInfo.BusinessKey" :IsFinishCheck="1" @getProcessData="getProData"></Detail>
    </Modal>
  </div>
</template>

<script>
import VehicleInfo from "./drawInfo/VehicleInfo";
import AuditInfo from "./drawInfo/AuditInfo";
import ImgInfo from "./drawInfo/ImageInfo2";
import processTable from "./process"
import OBDInfo from './OBDProcess'
const Detail = () => import("./../../components/regulatoryDetail");
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
      isDetail: false,
      vehicleInfo: {},
      auditInfo: {},
      ImgList: [],
      processData:{},
      OBDInfo:{},
    };
  },
  components: {
    VehicleInfo,
    AuditInfo,
    ImgInfo,
    Detail,
    processTable,
    OBDInfo
  },
  methods: {
    prodatafn(){
      this.isDetail=true
      // console.log(this.vehicleInfo)
    },
    // 子组件传值
    getProData(res){
     this.processData=res;
     this.OBDInfo=res.OBDInfo;
    },
    SubmitAudit(isStauts) {
      if(this.auditInfo.AuditState == 1 || this.auditInfo.AuditState == 0) {
        this.saveAudit(isStauts);
      } else {
        this.$Message.info('请勾选审核结果！')
      }
      
    },
    BackToAudit() {
      this.$emit('handleBackToAudit', this.auditInfo)
    },
    async saveAudit(isStauts) {
      const param = {
        auditInfo: this.auditInfo,
        isStauts:isStauts
      };
      const res = await this.$curl.post(
        "api/hj/saveApplyFJAudit",
        param
      );
      if (res.code) {
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
        CheckId: this.selectData.CheckId
      };
      const res = await this.$curl.get("api/hj/getApplyFJAudit", {param:JSON.stringify(param)});
      this.vehicleInfo = {};
      this.ImgList = [];
      this.auditInfo = {};
      if (res.code) {
        if (res.data.WaitCheck) {
          this.vehicleInfo = res.data.WaitCheck;
    
          this.auditInfo = res.data.WaitCheck;
        }
        if (res.data.ImgList.length > 0)
          this.ImgList = res.data.ImgList;
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
        this.$nextTick(() => {
	      this.getData();
	    })
    
      },
      immediate: true
    }
  },
  mounted(){

  }
};
</script>
<style>
</style>

