<template>
  <div class="whole-blacklist">
    <div class="blacklist-frame">
      <Form class="i-Form">
        <FormItem label="车牌号" :label-width="90" style="margin-bottom:8px;">
          <i-input style="width:200px;" readonly v-model="vehicleData.VLPN"></i-input>
        </FormItem>
        <FormItem label="车牌颜色" :label-width="90" style="margin-bottom:8px;">
          <Select v-model="vehicleData.VLPNColor" style="width:200px" disabled>
            <Option v-for="item in cddata.CD_VLPNColor" :value="item.CodeValue" :key="item.CodeValue">{{ item.CodeName }}</Option>
          </Select>
        </FormItem>
        <FormItem label="车架号" :label-width="90" style="margin-bottom:8px;">
          <i-input style="width:200px;" readonly v-model="vehicleData.VIN"></i-input>
        </FormItem>
        <FormItem label="黑名单类型" :label-width="90" style="margin-bottom:8px;" required>
          <Select clearable style="width:200px" v-model="blackListType.CodeValue">
            <Option v-for="item in cddata.CD_BLType" :value="item.CodeValue" :key="item.CodeValue">{{ item.CodeName }}</Option>
          </Select>
        </FormItem>
        <FormItem label="加入黑名单原因" :label-width="90" style="margin-bottom:8px;" required>
          <i-input type="textarea" :autosize="{minRows: 2,maxRows: 2}" placeholder="请输入..." style="width: 200px" v-model="blackReason"></i-input>
        </FormItem>
        <FormItem label="录入时间" :label-width="90" style="margin-bottom:8px;">
          <i-input style="width:200px;" readonly v-model="optime"></i-input>
        </FormItem>
        <FormItem label="违规时间" :label-width="90" style="margin-bottom:8px;">
          <DatePicker type="date" placeholder="选择时间" style="width: 200px" v-model="date"></DatePicker>
        </FormItem>
        <FormItem label="操作员" :label-width="90">
          <i-input style="width:200px;" readonly v-model="operator"></i-input>
        </FormItem>
      </Form>
    </div>
  </div>
</template>
<script>
import renderMessege from "../../../HJ/components/message";
import { formatDates,addOperaLog } from "../../../HJ/utils/utils";
export default {
    name:"blackList",
    data(){
        return{
            blackListType:{},
            blackReason:'',  
            operator:'',
            optime:'',
            date:''
        }
    },
    props: {
      Vecid: {
        type: Number
      },
      cddata: {
        type: Object
      },
      vehicleData: {
        type: Object
      }
  },
  methods: {
    //保存新增车辆黑名单
    saveaddBlacklist() {
      const params = {
        VLPN: this.vehicleData.VLPN,
        VLPNColor: this.vehicleData.VLPNColor,
        VIN: this.vehicleData.VIN,
        BLType: this.blackListType.CodeValue,
        Reason: this.blackReason,
        InsertDate: this.optime,
        CHECKDATE: formatDates(this.date, "yyyy-MM-dd"),
        Operator: this.operator,
        CityCode: this.vehicleData.City,
        VehicleID: this.vehicleData.VehicleID,
        UniqueString: this.vehicleData.UniqueString
      };
      if (!this.blackListType.CodeValue) {
        this.$Notice.warning({
          title: "提示",
          desc: "黑名单类型不能为空. "
        });
        return true;
      }
      if (this.blackReason == "") {
        this.$Notice.warning({
          title: "提示",
          desc: "加入黑名单原因不能为空. "
        });
        return true;
      } else {
        this.$curl
          .post("api/hj/setvehicleBlacklist", { params: params })
          .then(json => {
            this.$Message.success(json.msg);
            this.$emit("refreshData");
            let params={}
            params.DataSource=[]
            params.DataTable='VEHICLE'
            params.DataSource.push(`{old:'',new:'blackList',field:VehicleID}`)
            addOperaLog(this,params)
            return false;
          });
      }
    },
  },
  mounted() {
    this.operator = this.$store.state.core.user.username;
    this.optime = formatDates(new Date(), "yyyy-MM-dd hh:mm:ss");
  }
};
</script>
<style lang="less" scoped>
 .whole-blacklist /deep/ .i-Form{
     width:410px;
     height:370px;
     text-align:left;
     padding:13px 5px 0 20px;
     font-size: 214px;
 }
</style>
