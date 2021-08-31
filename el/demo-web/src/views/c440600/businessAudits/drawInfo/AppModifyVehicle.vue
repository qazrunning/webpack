//车辆变更登记审核-变更信息
<template>
  <div class="vehicle-main">
    <Card>
      <p slot="title">车辆变更信息</p>
      <Table border :columns="columns1" :data="data1"></Table>
      <p v-show='ModifyForm.Remarks' class="remarksInfo">备注：<span>{{ModifyForm.Remarks}}</span></p>
    </Card>
  </div>
</template>

<script>
export default {
  props: {
    ModifyForm: {
      type: Object,
      required: true
    },
    initform: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      columns1: [
        {
          title: "关键修改信息",
          key: "Name"
        },
        {
          title: "修改前",
          key: "oldValue",
          render: (h, params) => {
            return h(
              "span",
              {
                style: {
                  color: "#f00"
                }
              },
              params.row.oldValue
            );
          }
        },
        {
          title: "修改后",
          key: "newValue",
          render: (h, params) => {
            return h(
              "span",
              {
                style: {
                  color: "#2d8cf0"
                }
              },
              params.row.newValue
            );
          }
        }
      ],
      data1: []
    };
  },
  methods: {
    returnMultiple(cdList, codeValue) {
      const _this = this;
      if (!codeValue) return;
      const arrs = String(codeValue).split("");
      let CodeName = [];
      for (let key in cdList) {
        arrs.forEach(item => {
          if (key == item) CodeName.push(cdList[key]);
        });
      }
      return CodeName.join(",");
    }
  },
  mounted() { },
  watch: {
    ModifyForm: function (newData, oldData) {
      this.data1 = [];
      const self = this;
      if (!newData) return;
      let columns = {
        OwnerName: "车主姓名",
        Sex: "性别",
        CredentialsType: "证件类型",
        CredentialsNum: "证件号码",
        Tel: "联系电话",
        VLPNColor: "车牌颜色",
        VLPN: "车牌号",
        ZipCode: "邮编",
        Address: "联系地址",
        Remarks: "备注",
        VIN: "车架号",
        HasCCA: "是否有三元催化装置",
        UseOfAuto: "使用性质",
        VRDATE: "初次登记日期",
        FuelType: "燃料种类",
        ProductDate: "出厂日期",
        OCHA: "营运性质",
        VehicleType: "车辆类型",
        GAVType: "公安车辆类型",
        EngineNum: "发动机号码",
        RatedSeats: "座位数",
        VML: "最大总质量(kg)",
        EmissionStandard: "排放标准",
        KerbMass: "整备质量",
        BenchmarkMass: "基准质量 (kg)",
        IUETYPE: "发动机型号",
        FactoryPlateModel: "品牌",
        IUVMANU: "机动车生产厂家",
        EngineRatedSpeed: "发动机额定转速",
        EnginePower: "发动机额定功率(kW)",
        IUVTYPE: "车型号",
        HasOBD:"是否装有OBD",
        IsDoubleFuel:"是否双燃料",
        VehicleKind:"车辆性质"
      };
      const JsonData = newData.JsonData ? JSON.parse(newData.JsonData) : [];
      JsonData.forEach(item => {
        let oldValue = "";
        let newValue = "";
        if (item.Field == "CredentialsType") {
          oldValue = this.initform.cd_credentials[item.OldValue] || "";
          newValue = this.initform.cd_credentials[item.NewValue] || "";
        } else if (item.Field == "UseOfAuto") {
          oldValue = this.initform.cd_useOfAuto[item.OldValue] || "";
          newValue = this.initform.cd_useOfAuto[item.NewValue] || "";
        } else if (item.Field == "VLPNColor") {
          oldValue = this.initform.cd_vlpnColor[item.OldValue] || "";
          newValue = this.initform.cd_vlpnColor[item.NewValue] || "";
        }else if(item.Field == "VehicleKind"){
          oldValue = this.initform.cd_vehicleKind[item.OldValue] || "";
          newValue = this.initform.cd_vehicleKind[item.NewValue] || "";
        } else if (item.Field == "FuelType") {
          oldValue =
            this.returnMultiple(this.initform.cd_fuelType, item.OldValue) || "";
          newValue =
            this.returnMultiple(this.initform.cd_fuelType, item.NewValue) || "";
        } else if (item.Field == "GAVType") {
          oldValue = this.initform.cd_gavType[item.OldValue] || "";
          newValue = this.initform.cd_gavType[item.NewValue] || "";
        } else if (item.Field == "OCHA") {
          oldValue =
            item.OldValue == "01"
              ? "营运"
              : item.OldValue == "02"
                ? "非营运"
                : "";
          newValue =
            item.NewValue == "01"
              ? "营运"
              : item.NewValue == "02"
                ? "非营运"
                : "";
        } else if (item.Field == "ProductDate" || item.Field == "VRDATE") {
          oldValue = this.$options.filters.dataFormat(
            item.OldValue,
            "yyyy-MM-dd"
          );
          newValue = this.$options.filters.dataFormat(
            item.NewValue,
            "yyyy-MM-dd"
          );
        } else if (item.Field == "HasCCA" ||item.Field=="HasOBD"||item.Field=="IsDoubleFuel") {
          oldValue =
            item.OldValue == 1 ? "是" : item.OldValue == "0" ? "否" : "";
          newValue =
            item.NewValue == 1 ? "是" : item.NewValue == "0" ? "否" : "";
        } else if (item.Field == "VehicleType") {
          oldValue = this.initform.cd_vehicleType[item.OldValue] || "";
          newValue = this.initform.cd_vehicleType[item.NewValue] || "";
        } else {
          oldValue = item.OldValue;
          newValue = item.NewValue;
        }

        self.data1.push({
          Name: columns[item.Field] || "",
          oldValue: oldValue,
          newValue: newValue
        });
      });
    }
  }
};
</script>
<style scoped>
.vehicle-main .ivu-form-item {
  margin-bottom: 2px;
}

.vehicle-main /deep/ .ivu-form-item-label {
  color: #a0a0a0;
}

.ivu-card /deep/ .remarksInfo {
  margin-top: 10px;
}
.ivu-card /deep/ .remarksInfo span {
  color: red;
}
</style>

