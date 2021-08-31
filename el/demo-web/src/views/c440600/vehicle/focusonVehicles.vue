<template>
  <div class="whole-focusonVehicles">
    <Form class="i-Form">
      <FormItem label="车牌号" :label-width="90" style="margin-bottom:8px;">
        <i-input style="width:200px;" readonly v-model="vehicleData.VLPN"></i-input>
      </FormItem>
      <FormItem label="车架号" :label-width="90" style="margin-bottom:8px;">
        <i-input style="width:200px;" readonly v-model="vehicleData.VIN"></i-input>
      </FormItem>
      <FormItem label="车主" :label-width="90" style="margin-bottom:8px;">
        <i-input style="width:200px;" readonly v-model="vehicleData.OwnerName"></i-input>
      </FormItem>
      <FormItem label="记录人" :label-width="90" style="margin-bottom:8px;">
        <i-input style="width:200px;" readonly v-model="operator"></i-input>
      </FormItem>
      <FormItem label="记录时间" :label-width="90" style="margin-bottom:8px;">
        <i-input style="width:200px;" readonly v-model="optime"></i-input>
      </FormItem>
      <FormItem label="是否可用" :label-width="90" style="margin-bottom:8px;" required>
        <Select style="width:200px" v-model="selectValue">
          <Option v-for="item in IsAvailable" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem label="被加入重点关注的原因" :label-width="90" required>
        <i-input type="textarea" :autosize="{minRows: 4,maxRows: 4}" placeholder="请输入..." style="width: 200px" v-model="focusonReason"></i-input>
      </FormItem>
    </Form>
  </div>
</template>
<script>
import renderMessege from "../../../HJ/components/message";
import { formatDates,addOperaLog } from "../../../HJ/utils/utils";
export default {
  name: "focusonVehicles",
  data() {
    return {
      operator: "",
      optime: "",
      IsAvailable: [
        {
          label: "是",
          value: 1
        },
        {
          label: "否",
          value: 0
        }
      ],
      focusonReason: "",
      selectValue: 1
    };
  },
  props: {
    Vecid: {
      type: Number
    },
    vehicleData: {
      type: Object
    }
  },
  methods: {
    //保存新增重点关注车辆
    saveaddFocuson() {
      const params = {
        VLPN: this.vehicleData.VLPN,
        VIN: this.vehicleData.VIN,
        RecordTime: formatDates(this.optime, "yyyy/MM/dd"),
        Recorder: this.operator,
        IsAvailable: this.selectValue,
        Reason: this.focusonReason,
        VehicleID: this.vehicleData.VehicleID,
        UniqueString: this.vehicleData.UniqueString,
        VRDATE: this.vehicleData.VRDATE
      };
      if (!this.focusonReason) {
        this.$Notice.warning({
          title: "提示",
          desc: "被加入重点关注的原因不能为空. "
        });
        return true;
      } else {
        this.$curl.post("api/hj/setfocusonVeh", { params: params }).then(json => {
          this.$Message.success(json.msg);
          this.$emit("refreshData");
          let params={}
          params.DataSource=[]
          params.DataTable='VEHICLE'
          params.DataSource.push(`{old:'',new:'addFocsonVehicles',field:VehicleID}`)
          addOperaLog(this,params)
        });
        return false;
      }
    },
  },
  mounted() {
    this.operator = this.$store.state.core.user.username;
    this.optime = formatDates(new Date(),'yyyy-MM-dd hh:mm:ss');
  }
};
</script>
<style lang="less" scoped>
.whole-focusonVehicles /deep/ .i-Form {
  width: 410px;
  height: 380px;
  text-align: left;
  padding: 13px 5px 0 20px;
  // background-color: white;
  font-size: 214px;
}
</style>

