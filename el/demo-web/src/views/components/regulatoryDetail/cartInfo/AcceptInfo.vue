//过程监管-受理信息
<template>
  <Card class="accept-main" :bordered="false">
    <p slot="title">受理信息</p>
    <div style="height:290px;overflow:auto;">
      <Form label-position="right" :label-width="90">
        <FormItem label="车牌号:"><span :style="this.setVLPNColor(resData.VLPNColor)">{{resData.VLPN}}</span></FormItem>
        <FormItem label="受理编码:" :title="resData.InspectionNum">{{resData.InspectionNum}}</FormItem>
        <FormItem label="车架号:" :title="resData.VIN">{{resData.VIN}}</FormItem>
        <FormItem label="站点名称:">{{initForm.cd_station[resData.StationCode] || ' '}}</FormItem>
        <FormItem label="线编号:">{{resData.SceneCode}}</FormItem>
        <FormItem label="受理人员:">{{resData.Operator}}</FormItem>
        <FormItem label="受理时间:">{{resData.AcceptanceDate | dataFormat("yyyy-MM-dd hh:mm:ss")}}</FormItem>
        <FormItem label="检测方法:">{{returnMethodnames(initForm.cd_inspectMethod,resData.InspectionMethod)}}</FormItem>
        <FormItem label="检测类型:">{{initForm.cd_inspectionNature[resData.InspectionWay]}}</FormItem>
        <FormItem label="出厂日期:">{{resData.ProductDate | dataFormat("yyyy-MM-dd hh:mm:ss")}}</FormItem>
        <FormItem label="车辆类型:">{{initForm.cd_vehicleType[resData.VehicleType]}}</FormItem>
        <FormItem label="总质量:">{{resData.VML}}</FormItem>
        <FormItem label="燃油种类:">{{returnMultiple(initForm.cd_fuelType,resData.FuelType)}}</FormItem>
      </Form>
    </div>
  </Card>
</template>

<script>
import { config } from '../../../../utils/tools'
export default {
  props: {
    AcceptForm: {
      type: Object
    },
    initForm: {
      type: Object
    }
  },
  data() {
    return {
      resData: {}
    };
  },
  methods: {
    //多选过滤
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
    },
    returnMethodnames(namelist, codevalue) {
      if (namelist) {
        let CodeName = "";
        if(codevalue) {
          let arr = codevalue.split(',');
          if(arr.length > 1) {
            let typeList = [];
            arr.forEach(item => {
              let flag = namelist.hasOwnProperty(item);
              if(flag) {
                typeList.push(namelist[item])
              }
            })
            CodeName = typeList.join('、');
          } else {
            CodeName = namelist[codevalue]
          }
        }
        return CodeName;
      }
    },
    // 设置车牌颜色
    setVLPNColor(VLPNColor) {
      if (!config.vlpn_c[VLPNColor]) return {};
      const vlpn_c = config.vlpn_c[VLPNColor];
      return {
        display: "inline-block",
        margin: "-2 auto",
        "border-radius": "6px",
        "border-style": "double",
        "text-align": "center",
        "line-height": "21px",
        "height": "25px",
        padding: "0px 2px",
        background: `${vlpn_c.Background}`,
        color: `${vlpn_c.TextColor}`,
        "border-color": `${vlpn_c.BorderColor}`,
        "font-weight": "bold",
        "font-size": "10pt"
      };
    },
  },
  watch: {
    AcceptForm: {
      handler(newData) {
        this.resData = newData||{};
      },
      immediate: true
    }
  },
  mounted() {}
};
</script>

<style lang="scss" scoped>
.accept-main ::v-deep.ivu-form-item {
  margin-bottom: -4px;
  overflow: hidden;
}

.accept-main ::v-deep.ivu-form-item-label {
  color: #a0a0a0;
  padding: 6px 12px 10px 0;
}

.accept-main ::v-deep.ivu-form-item-content {
  line-height: 25px;
}
::v-deep.ivu-form{
  &:hover{
    .ivu-form-item{}
  }
  .ivu-form-item{
    &:hover{
      background-color: rgba(45, 140, 240, 0.2)
    }
  }
}
</style>
