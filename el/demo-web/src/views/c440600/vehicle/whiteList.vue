<template>
  <div class="whole-whitelist">
    <Form class="i-Form">
      <FormItem label="车牌号" :label-width="90" style="margin-bottom:6px;">
        <i-input style="width:200px;" readonly v-model="vehicleData.VLPN"></i-input>
      </FormItem>
      <FormItem label="车牌颜色" :label-width="90" style="margin-bottom:6px;">
        <Select v-model="vehicleData.VLPNColor" style="width:200px" disabled>
          <Option v-for="item in cddata.CD_VLPNColor" :value="item.CodeValue" :key="item.CodeValue">{{ item.CodeName }}</Option>
        </Select>
      </FormItem>
      <FormItem label="车架号" :label-width="90" style="margin-bottom:6px;">
        <i-input style="width:200px;" readonly v-model="vehicleData.VIN"></i-input>
      </FormItem>
      <FormItem label="白名单类型" :label-width="90" style="margin-bottom:6px;" required>
        <Select clearable style="width:200px" v-model="whiteListType.CodeValue">
          <Option v-for="item in cddata.CD_WhiteListType" :value="item.CodeValue" :key="item.CodeValue">{{ item.CodeName }}</Option>
        </Select>
      </FormItem>
      <FormItem label="白名单性质" :label-width="90" style="margin-bottom:6px;" required>
        <Select clearable style="width:200px" v-model="WLNatureList.value">
          <Option v-for="item in WLNatureList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem label="加入白名单原因" :label-width="90" style="margin-bottom:6px;" required>
        <i-input type="textarea" :autosize="{minRows: 2,maxRows: 2}" placeholder="请输入..." style="width: 200px" v-model="blackReason"></i-input>
      </FormItem>
      <FormItem label="录入时间" :label-width="90" style="margin-bottom:6px;">
        <i-input style="width:200px;" readonly v-model="optime"></i-input>
      </FormItem>
      <FormItem label="操作员" :label-width="90">
        <i-input style="width:200px;" readonly v-model="operator"></i-input>
      </FormItem>
    </Form>
  </div>
</template>
<script>
import renderMessege from "../../../HJ/components/message";
import { formatDates,addOperaLog } from "../../../HJ/utils/utils";
export default {
  name: "whiteList",
  data() {
    return {
      whiteListType: {},
      blackReason: "",
      operator: "",
      optime: "",
      date: "",
      WLNatureList: [
        {
          value: "0",
          label: "临时白名单"
        },
        {
          value: "1",
          label: "永久白名单"
        }
      ]
    };
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
    //保存新增车辆白名单
    saveaddWhitelist() {
      const params = {
        VehicleID: this.vehicleData.VehicleID,
        VLPNColor: this.vehicleData.VLPNColor,
        VLPN: this.vehicleData.VLPN,
        VIN: this.vehicleData.VIN,
        WLType: this.whiteListType.CodeValue,
        Reason: this.blackReason,
        InsertDate: this.optime,
        Operator: this.operator,
        WLNature: this.WLNatureList.value
      };
      if (!this.whiteListType.CodeValue) {
        this.$Notice.warning({
          title: "提示",
          desc: "白名单类型不能为空. "
        });
        return true;
      }
      if (!this.WLNatureList.value) {
        this.$Notice.warning({
          title: "提示",
          desc: "白名单性质不能为空. "
        });
        return true;
      }
      if (!this.blackReason) {
        this.$Notice.warning({
          title: "提示",
          desc: "加入白名单原因不能为空. "
        });
        return true;
      } else {
        this.$curl
          .post("api/hj/setvehicleWhitelist", { params: params })
          .then(json => {
            this.$Message.success(json.msg);
            this.$emit("refreshData");
            let params={}
            params.DataSource=[]
            params.DataTable='VEHICLE'
            params.DataSource.push(`{old:'',new:'whiteList',field:VehicleID}`)
            addOperaLog(this,params)
          });
        return false;
      }
    }
  },
  mounted() {
    this.operator = this.$store.state.core.user.username;
    this.optime = formatDates(new Date(), "yyyy-MM-dd hh:mm:ss");
  }
};
</script>
<style lang="less" scoped>
.whole-whitelist /deep/ .i-Form {
  width: 410px;
  height: 380px;
  text-align: left;
  padding: 13px 5px 0 20px;
  font-size: 214px;
}
</style>


