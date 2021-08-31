<template>
  <Row class="CartRow">
    <div class="fx__text_default">
      <span @click.stop="vlpnClick(CartForm.VehicleID)" :style="setVLPNColor(CartForm.VLPNColor)">{{CartForm.VLPN}}</span>
      <span v-show="CartForm.OwnerName">/</span>
      <span style="display:inline-block;">{{CartForm.OwnerName}}</span><span v-show="CartForm.VIN">/</span>
      <span :title="CartForm.VIN">{{ CartForm.VIN }}</span>
      <span class="Form_div">{{CartForm.ApplyTime | dataFormat("yyyy-MM-dd hh:mm:ss") }}</span>
    </div>
    <div style="font-size: 14px;">
      <span style="display:inline-block;margin-right:10px;" v-show="CartForm.CheckType.indexOf('10')==-1">申请人：{{CartForm.ApplyUserName}}</span>
      <span :title="initform.cd_station[CartForm.OrgCode]" v-show="CartForm.CheckType.indexOf('10')==-1">申请站点：{{initform.cd_station[CartForm.OrgCode]}}</span>
    </div>
    <div>
      <label>申请原因：{{ApplyReasonName(CartForm.CheckType,CartForm.ApplyReason)}}</label>
    </div>
    <div v-if="initform.cd_inspectionNature && CartForm.InspectionNature">
      <label>检测类型：{{initform.cd_inspectionNature[CartForm.InspectionNature]}}</label>
    </div>
  </Row>
</template>

<script>
import { config } from '../../../../utils/tools'
export default {
  name: "cartInfo",
  props: {
    CartForm: {
      type: Object,
      required: true
    },
    initform: {
      type: Object,
      required: true
    }
  },
  data() {
    return {};
  },
  methods: {
    vlpnClick(VehicleID) {
      this.$router.push({
        name: "hj-home-vehicle",
        params: {
          VehicleId: VehicleID
        }
      });
    },
    setVLPNColor(VLPNColor) {
      if (!config.vlpn_c[VLPNColor]) return `padding:2px 4px;`;
      const vlpn_c = config.vlpn_c[VLPNColor];
      return `
              margin: 0 auto;
              border-radius: 6px;
              border-style: double;
              text-align: center;
              padding:2px 2px;
              background: ${vlpn_c.Background};
              color:${vlpn_c.TextColor};
              border-color:${vlpn_c.BorderColor};
              font-weight: bold;
              font-size: 14px;`;
    },
    ApplyReasonName(CheckType, ApplyReason) {
      if (!ApplyReason) return;
      const _this = this;
      if (CheckType == "20" || CheckType == "31") {
        const arrs = ApplyReason.split(",");
        return arrs
          .map(t => {
            return _this.initform.cd_auditReason[t];
          })
          .join(",");
      } else if (CheckType == "10") {
        const arrs = ApplyReason.split(",");
        return arrs
          .map(t => {
            return _this.initform.cd_applyreason[t];
          })
          .join(",");
      } else {
        return ApplyReason;
      }
    }
  }
};
</script>


<style  lang="less" scoped>
.Form_div {
  float: right;
  font-size: 12px;
}

.Station_div {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 140px;
  vertical-align: -12px;
  display: inline-block;
}

.CartRow {
  line-height: 34px;
}
</style>


