<template>
  <div>
    <div v-if="showInfo" class="ychjInfo fx__bgcolor">
      <row>
        <i-col span="24" style="margin-bottom:15px;">
          <h2>基本信息</h2>
        </i-col>
        <i-col
          :lg="8"
          style="text-align:left;"
          class="VecBaseInfo"
          :style="vehicleBaseData.VLPN ? '' : 'display:none'"
        >
          <span class="bold">车牌号：</span>
          <span>{{ vehicleBaseData.VLPN || "无车牌" }}</span>
        </i-col>
        <i-col :lg="8" style="text-align:left;" class="VecBaseInfo">
          <span class="bold">车牌颜色：</span>
          <span>{{
            returncodename(
              cddata["cd_vlpncolor"],
              vehicleBaseData.VLPNColor
            ) || "- -"
          }}</span>
        </i-col>
        <i-col :lg="8" style="text-align:left;" class="VecBaseInfo">
          <span class="bold">车主：</span>
          <span>{{ vehicleBaseData.OwnerName || "- -" }}</span>
        </i-col>
        <i-col :lg="8" style="text-align:left;" class="VecBaseInfo">
          <span class="bold">联系电话：</span>
          <span>{{ vehicleBaseData.Tel || "- -" }}</span>
        </i-col>
        <i-col :lg="8" style="text-align:left;" class="VecBaseInfo">
          <span class="bold">性别：</span>
          <span>{{ vehicleBaseData.Sex || "- -" }}</span>
        </i-col>
        <i-col :lg="8" style="text-align:left;" class="VecBaseInfo">
          <span class="bold">燃油类型：</span>
          <span>{{
            returncodename(
              cddata["cd_fueltype"],
              vehicleBaseData.FuelType
            ) || "- -"
          }}</span>
        </i-col>
        <i-col :lg="8" style="text-align:left;" class="VecBaseInfo">
          <span class="bold">车型号：</span>
          <span>{{ vehicleBaseData.IUVTYPE || "- -" }}</span>
        </i-col>
        <i-col :lg="8" style="text-align:left;" class="VecBaseInfo">
          <span class="bold">车架号：</span>
          <span>{{ vehicleBaseData.VIN || "- -" }}</span>
        </i-col>
        <i-col :lg="8" style="text-align:left;" class="VecBaseInfo">
          <span class="bold">排放标准：</span>
          <span>{{
            returncodename(
              cddata["cd_emissionstandard"],
              vehicleBaseData.EmissionStandard
            ) || "- -"
          }}</span>
        </i-col>
        <i-col :lg="8" style="text-align:left;" class="VecBaseInfo">
          <span class="bold">公安车辆类型：</span>
          <span>{{
            returncodename(cddata["cd_gavtype"], vehicleBaseData.GAVType) ||
              "- -"
          }}</span>
        </i-col>
        <i-col :lg="8" style="text-align:left;" class="VecBaseInfo">
          <span class="bold">车辆类型：</span>
          <span>{{ vehicleBaseData.CARMODE || "- -" }}</span>
        </i-col>
        <i-col :lg="8" style="text-align:left;" class="VecBaseInfo">
          <span class="bold">品牌：</span>
          <span>{{ vehicleBaseData.FactoryPlateModel || "- -" }}</span>
        </i-col>
        <i-col :lg="8" style="text-align:left;" class="VecBaseInfo">
          <span class="bold">运行性质：</span>
          <span>{{
            vehicleBaseData.OCHA == "01" && vehicleBaseData.OCHA
              ? "运营"
              : "非运营" || "- -"
          }}</span>
        </i-col>

        <i-col :lg="8" style="text-align:left;" class="VecBaseInfo">
          <span class="bold">机动车大类：</span>
          <span>{{ VehicleBigType || "- -" }}</span>
        </i-col>
        <i-col :lg="8" style="text-align:left;" class="VecBaseInfo">
          <span class="bold">车辆登记日期：</span>
          <span>{{ vehicleBaseData.RegistDate || "- -" }}</span>
        </i-col>

        <i-col :lg="8" style="text-align:left;" class="VecBaseInfo">
          <span class="bold">发动机型号：</span>
          <span>{{ vehicleBaseData.IUETYPE || "- -" }}</span>
        </i-col>

        <i-col :lg="8" style="text-align:left;" class="VecBaseInfo">
          <span class="bold">发动机排量：</span>
          <span>{{ vehicleBaseData.EDSPL || "- -" }}</span>
        </i-col>
        <i-col :lg="8" style="text-align:left;" class="VecBaseInfo">
          <span class="bold">出厂日期：</span>
          <span>{{ vehicleBaseData.ProductDate || "- -" }}</span>
        </i-col>
        <i-col :lg="8" style="text-align:left;" class="VecBaseInfo">
          <span class="bold">底盘型号：</span>
          <span>{{ vehicleBaseData.ChassisType || "- -" }}</span>
        </i-col>
        <i-col :lg="8" style="text-align:left;" class="VecBaseInfo">
          <span class="bold">档位数：</span>
          <span>{{ vehicleBaseData.GearCount || "- -" }}</span>
        </i-col>
        <i-col :lg="8" style="text-align:left;" class="VecBaseInfo">
          <span class="bold">生产厂家：</span>
          <span>{{ vehicleBaseData.IUVMANU || "- -" }}</span>
        </i-col>
      </row>
    </div>
    <div v-else>
      <row>
        <i-col span="24" style="margin-bottom:15px;">
          <h2>基本信息</h2>
        </i-col>
        <i-col>
          <h3 style="text-align:center">暂无数据</h3>
        </i-col>
      </row>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    infoObj: {
      type: Object,
    },
  },
  data() {
    return {
      showInfo: false, // 控制是否显示

      vehicleBaseData: {}, //车辆基本信息
      ycInfoData: [], //遥测数据
      showmore: false, //更多
      cddata: {}, //cd表数据
      stationlist: [], // 站点列表
      ycStationList: [], //遥测站点
      VehicleBigType: "",
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.init();
    });
  },

  methods: {
    async init() {
      await this.getCDData();

      await this.getVehicleBaseData();
    },
    // 获取车辆基本信息
    async getVehicleBaseData() {
      this.vehicleBaseData = {};
      this.VehicleBigType = "";
      let param = {
        VLPN: this.infoObj.VLPN,
        VLPNColor: this.infoObj.VLPNColor,
      };
      let res = await this.$curl.get(
        "/api/hj/getVehicleInfoByVLPNandVLPNColor",
        {
          param: JSON.stringify(param),
        }
      );
      if (res.state === 1) {
        this.vehicleBaseData = res.data[0];
        let key = this.vehicleBaseData.VehicleBigType;
        switch (key) {
          case "01":
            this.VehicleBigType = "汽车";
            break;
          case "02":
            this.VehicleBigType = "摩托车";
            break;
          case "03":
            this.VehicleBigType = "低速汽车";
            break;
          default:
            break;
        }
        this.showInfo = true;
      }
    },
    async getCDData() {
      let cdList = [
        "cd_vlpncolor",
        "cd_fueltype",
        "cd_emissionstandard",
        "cd_gavtype",
      ];
      let res = await this.$curl.get("api/hj/getHYCCDList", { params: JSON.stringify(cdList) });
      if (res.state === 1) {
        this.cddata = res.data;
      }
    },
        // 根据cd表返回codename
    returncodename(cdList, code) {
      return this.$options.filters.returnCodeName(cdList, code);
    },
  },
};
</script>

<style lang="less" scoped>
.ychjInfo {
  padding: 2.1% 1.7% 1.1% 1.7%;
  border-radius: 6px;
  overflow: auto;
}
/deep/.ivu-tag {
  font-size: 14px;
}
.cardBox {
  margin-bottom: 20px;
}
/deep/ .ivu-card-head {
  font-size: 20px;
}
/deep/ .ivu-card-body {
  padding: 0px;
  overflow: visible;
}
/deep/.ivu-collapse-content {
  font-size: 14px;
}
.VecBaseInfo {
  margin: 10px 0px;
}
.bold {
  font-weight: bold;
}
.nodata {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}
</style>
