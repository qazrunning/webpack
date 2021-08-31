<template>
  <div>
    <!-- 双怠速 -->
    <div>
      <Table stripe border ref="selection" :columns="tableHeader" :data="tableData"></Table>
    </div>
  </div>
</template>

<script>
import { isNull } from "util";
import { formatDates } from "../../../utils/utils";
import { forEach } from '../../../../utils/tools';
export default {
  props: {
    baseInfo: {
      type: Object,
      default: () => { }
    },
    stationList: {
      type: Array,
      default: () => []
    },
    InspectionMethodList: {
      type: Array,
      default: () => []
    },
  },

  data() {
    return {
      lastInspectionNum: '',
      tableHeader: [],
      tableData: [],
    }
  },
  methods: {
    async getinspectionprocessdata(val) {
      this.lastInspectionNum = val
      this.tableHeader = []
      this.tableData = []
      await this.judgeType()
    },
    TSI_column() {
      const _this = this;
      this.tableHeader = [
        {
          title: "采样时序",
          minWidth: 80,
          key: "Second_No",
          render: (h, params) => {
            const name = params.row.Second_NO || params.row.Second_No;
            return h("span", {}, name);
          },
        },
        {
          title: "检测时间",
          minWidth: 170,
          key: "ProcessTime",
          render: (h, params) => {
            const Name = _this.$options.filters.dataFormat(
              params.row.ProcessTime,
              "yyyy-MM-dd hh:mm:ss"
            );
            return h("span", {}, Name);
          },
        },
        {
          title: "发动机机油温度(℃)",
          minWidth: 130,
          key: "EngineOilTemperature",
          render: (h, params) => {
            const EngineOilTemperature = _this.toFlostTwo(
              params.row.EngineOilTemperature
            );
            return h("span", {}, EngineOilTemperature);
          },
        },
        {
          title: "发动机转速(r/min)",
          minWidth: 120,
          key: "Flow_RotateSpeed",
          render: (h, params) => {
            const Name = isNull(params.row.Flow_RotateSpeed)
              ? _this.toFlostTwo(params.row.RotateSpeed)
              : _this.toFlostTwo(params.row.Flow_RotateSpeed);
            return h("span", {}, Name);
          },
        },
        {
          title: "测试工况HC(10-6vol)",
          minWidth: 130,
          key: "Flow_HC",
          render: (h, params) => {
            const Name = _this.toFlostTwo(params.row.Flow_HC);
            return h("span", {}, Name);
          },
        },
        {
          title: "测试工况CO(%vol)",
          minWidth: 130,
          key: "Flow_CO",
          render: (h, params) => {
            const Name = _this.toFlostTwo(params.row.Flow_CO);
            return h("span", {}, Name);
          },
        },
        {
          title: "测试工况O2(%vol)",
          minWidth: 130,
          key: "Flow_O2",
          render: (h, params) => {
            const Name = _this.toFlostTwo(params.row.Flow_O2);
            return h("span", {}, Name);
          },
        },
        {
          title: "测试工况CO2(%vol)",
          minWidth: 130,
          key: "Flow_CO2",
          render: (h, params) => {
            const Name = _this.toFlostTwo(params.row.Flow_CO2);
            return h("span", {}, Name);
          },
        },
        {
          title: "λ值",
          minWidth: 60,
          key: "Flow_Lambda",
          render: (h, params) => {
            const Name = _this.toFlostTwo(params.row.Flow_Lambda);
            return h("span", {}, Name);
          },
        },
      ];
    },
    ASM_column() {
      const _this = this;
      this.tableHeader = [
        {
          title: "采样时序",
          minWidth: 60,
          key: "Second_NO",
          render: (h, params) => {
            const name = params.row.Second_NO || params.row.Second_No;
            return h("span", {}, name);
          },
        },
        {
          title: "检测时间",
          minWidth: 170,
          key: "ProcessTime",
          render: (h, params) => {
            return h(
              "span",
              formatDates(params.row.ProcessTime, "yyyy-MM-dd hh:mm:ss")
            );
          },
        },
        {
          title: "车速(km/h)",
          minWidth: 80,
          key: "Flow_Speed",
          render: (h, params) => {
            const Name = isNull(params.row.Flow_Speed)
              ? _this.toFlostTwo(params.row.LineSpeed)
              : _this.toFlostTwo(params.row.Flow_Speed);
            return h("span", {}, Name);
          },
        },
        {
          title: "发动机转速(r/min)",
          minWidth: 105,
          key: "Flow_RotateSpeed",
          render: (h, params) => {
            const Name = isNull(params.row.Flow_RotateSpeed)
              ? _this.toFlostTwo(params.row.RotateSpeed)
              : _this.toFlostTwo(params.row.Flow_RotateSpeed);
            return h("span", {}, Name);
          },
        },
        {
          title: "逐秒HC浓度值(修正后)(10-6vol)",
          minWidth: 130,
          key: "Flow_HCCorrect",
          render: (h, params) => {
            const Flow_HCCorrect = _this.toFlostTwo(params.row.Flow_HCCorrect);
            return h("span", {}, Flow_HCCorrect);
          },
        },
        {
          title: "逐秒CO浓度值(修正后)(%vol)",
          minWidth: 130,
          key: "Flow_COCorrect",
          render: (h, params) => {
            const Flow_COCorrect = _this.toFlostTwo(params.row.Flow_COCorrect);
            return h("span", {}, Flow_COCorrect);
          },
        },
        {
          title: "逐秒NO浓度值(修正后)(10-6vol)",
          minWidth: 130,
          key: "Flow_NOCorrect",
          render: (h, params) => {
            const Flow_NOCorrect = _this.toFlostTwo(params.row.Flow_NOCorrect);
            return h("span", {}, Flow_NOCorrect);
          },
        },
        {
          title: "逐秒底盘测功机负载（kg）",
          minWidth: 130,
          key: "Flow_Freeweight",
          render: (h, params) => {
            const Name = _this.toFlostTwo(params.row.Flow_Freeweight);
            return h("span", {}, Name);
          },
        },
        {
          title: "测试工况HC(10-6vol)",
          minWidth: 130,
          key: "Flow_HC",
          render: (h, params) => {
            const Flow_HC = _this.toFlostTwo(params.row.Flow_HC);
            return h("span", {}, Flow_HC);
          },
        },
        {
          title: "测试工况CO(%vol)",
          minWidth: 130,
          key: "Flow_CO",
          render: (h, params) => {
            const Flow_CO = _this.toFlostTwo(params.row.Flow_CO);
            return h("span", {}, Flow_CO);
          },
        },
        {
          title: "测试工况NO(10-6vol)",
          minWidth: 130,
          key: "Flow_NO",
          render: (h, params) => {
            const Flow_NO = _this.toFlostTwo(params.row.Flow_NO);
            return h("span", {}, Flow_NO);
          },
        },
        {
          title: "测试工况CO2(%vol)",
          minWidth: 130,
          key: "Flow_CO2",
          render: (h, params) => {
            const Flow_CO2 = _this.toFlostTwo(params.row.Flow_CO2);
            return h("span", {}, Flow_CO2);
          },
        },
        {
          title: "测试工况O2(%vol)",
          minWidth: 130,
          key: "Flow_O2",
          render: (h, params) => {
            const Flow_O2 = _this.toFlostTwo(params.row.Flow_O2);
            return h("span", {}, Flow_O2);
          },
        },
        {
          title: "逐秒计算的λ值",
          minWidth: 120,
          key: "Flow_Lambda",
          render: (h, params) => {
            const Flow_Lambda = _this.toFlostTwo(params.row.Flow_Lambda);
            return h("span", {}, Flow_Lambda);
          },
        },
        {
          title: "NO湿度修正系数",
          minWidth: 130,
          key: "NOHumidityCorrect",
          render: (h, params) => {
            const NOHumidityCorrect = _this.toFlostTwo(
              params.row.NOHumidityCorrect
            );
            return h("span", {}, NOHumidityCorrect);
          },
        },
        {
          title: "逐秒稀释修正系数DF",
          minWidth: 130,
          key: "DiluteCorrect",
          render: (h, params) => {
            const DiluteCorrect = _this.toFlostTwo(params.row.DiluteCorrect);
            return h("span", {}, DiluteCorrect);
          },
        },
        {
          title: "扭力",
          minWidth: 80,
          key: "nf",
          render: (h, params) => {
            return h(
              "span",
              {},
              _this.toFlostTwo(params.row.nf || params.row.NF)
            );
          },
        }
      ];
    },
    //简易瞬态过程数据
    IM_column() {
      const _this = this;
      this.tableHeader = [
        {
          title: "采样时序",
          minWidth: 80,
          key: "Second_NO",
          render: (h, params) => {
            const name = params.row.Second_NO || params.row.Second_No;
            return h("span", {}, name);
          },
        },
        {
          title: "检测时间",
          minWidth: 170,
          key: "ProcessTime",
          render: (h, params) => {
            return h(
              "span",
              {},
              formatDates(params.row.ProcessTime, "yyyy-MM-dd hh:mm:ss")
            );
          },
        },
        {
          title: "车速(km/h)",
          minWidth: 80,
          key: "Flow_Speed",
          render: (h, params) => {
            const Name = isNull(params.row.Flow_Speed)
              ? _this.toFlostTwo(params.row.LineSpeed)
              : _this.toFlostTwo(params.row.Flow_Speed);
            return h("span", {}, Name);
          },
        },
        {
          title: "发动机转速(r/min)",
          minWidth: 120,
          key: "Flow_RotateSpeed",
          render: (h, params) => {
            const Name = isNull(params.row.Flow_RotateSpeed)
              ? _this.toFlostTwo(params.row.RotateSpeed)
              : _this.toFlostTwo(params.row.Flow_RotateSpeed);
            return h("span", {}, Name);
          },
        },
        {
          title: "测试工况HC(10-6vol)",
          minWidth: 130,
          key: "Flow_HC",
          render: (h, params) => {
            return h("span", {}, _this.toFlostTwo(params.row.Flow_HC));
          },
        },
        {
          title: "测试工况CO(%vol)",
          minWidth: 130,
          key: "Flow_CO",
          render: (h, params) => {
            return h("span", {}, _this.toFlostTwo(params.row.Flow_CO));
          },
        },
        {
          title: "测试工况NOX(10-6vol)",
          minWidth: 130,
          key: "Flow_NOX",
          render: (h, params) => {
            return h("span", {}, _this.toFlostTwo(params.row.Flow_NOX));
          },
        },
        {
          title: "HC(修正后)(10-6vol)",
          minWidth: 130,
          key: "Flow_HCCorrect",
          render: (h, params) => {
            return h("span", {}, _this.toFlostTwo(params.row.Flow_HCCorrect));
          },
        },
        {
          title: "CO(修正后)(%vol)",
          minWidth: 130,
          key: "Flow_COCorrect",
          render: (h, params) => {
            return h("span", {}, _this.toFlostTwo(params.row.Flow_COCorrect));
          },
        },
        {
          title: "NOX(修正后)(10-6vol)",
          minWidth: 130,
          key: "Flow_NOXCorrect",
          render: (h, params) => {
            return h("span", {}, _this.toFlostTwo(params.row.Flow_NOXCorrect));
          },
        },
        {
          title: "测试工况分析仪CO2(%vol)",
          minWidth: 130,
          key: "Flow_CO2",
          render: (h, params) => {
            return h("span", {}, _this.toFlostTwo(params.row.Flow_CO2));
          },
        },
        {
          title: "测试工况流量计O2(%vol)",
          minWidth: 130,
          key: "Flow_O2",
          render: (h, params) => {
            return h("span", {}, _this.toFlostTwo(params.row.Flow_O2));
          },
        },
        {
          title: "O2(修正后)(%vol)",
          minWidth: 130,
          key: "Flow_O2Correct",
          render: (h, params) => {
            return h("span", {}, _this.toFlostTwo(params.row.Flow_O2Correct));
          },
        },
        {
          title: "底盘测功机加载载荷(KW)",
          minWidth: 130,
          key: "Flow_LoadPower",
          render: (h, params) => {
            return h("span", {}, _this.toFlostTwo(params.row.Flow_LoadPower));
          },
        },
        {
          title: "稀释排气流量(m3/min)",
          minWidth: 130,
          key: "FlowDiluteExhaust",
          render: (h, params) => {
            return h(
              "span",
              {},
              _this.toFlostTwo(params.row.FlowDiluteExhaust)
            );
          },
        },
        {
          title: "稀释系数",
          minWidth: 110,
          key: "Flow_Dilute",
          render: (h, params) => {
            return h("span", {}, _this.toFlostTwo(params.row.Flow_Dilute));
          },
        },
        {
          title: "NO湿度修正系数",
          minWidth: 130,
          key: "NOHumidityCorrect",
          render: (h, params) => {
            return h(
              "span",
              {},
              _this.toFlostTwo(params.row.NOHumidityCorrect)
            );
          },
        },
        {
          title: "λ值",
          minWidth: 80,
          key: "Flow_Lambda",
          render: (h, params) => {
            return h("span", {}, _this.toFlostTwo(params.row.Flow_Lambda));
          },
        },
        {
          title: "扭力(N)",
          minWidth: 80,
          key: "nf",
          render: (h, params) => {
            return h(
              "span",
              {},
              _this.toFlostTwo(params.row.nf || params.row.NF)
            );
          },
        },
      ];
    },
    //自由加速
    LightProofSmoke_column() {
      const _this = this;
      this.tableHeader = [
        {
          title: "采样时序",
          minWidth: 80,
          key: "Second_No",
          render: (h, params) => {
            const name = params.row.Second_NO || params.row.Second_No;
            return h("span", {}, name);
          },
        },
        {
          title: "检测时间",
          minWidth: 170,
          key: "ProcessTime",
          render: (h, params) => {
            const Name = _this.$options.filters.dataFormat(
              params.row.ProcessTime,
              "yyyy-MM-dd hh:mm:ss"
            );
            return h("span", {}, Name);
          },
        },
        {
          title: "发动机转速(r/min)",
          minWidth: 100,
          key: "Flow_RotateSpeed",
          render: (h, params) => {
            const Name = _this.toFlostTwo(params.row.Flow_RotateSpeed);
            return h("span", {}, Name);
          },
        },
        {
          title: "光吸收系数k(m-1)",
          minWidth: 100,
          key: "Flow_K",
          render: (h, params) => {
            return h("span", {}, _this.toFlostTwo(params.row.Flow_K));
          },
        },
      ];
    },
    LD_column() {
      const _this = this;
      this.tableHeader = [
        {
          title: "采样时序",
          minWidth: 100,
          key: "Second_NO",
          render: (h, params) => {
            const name = params.row.Second_NO || params.row.Second_No;
            return h("span", {}, name);
          },
        },
        {
          title: "检测时间",
          minWidth: 170,
          key: "ProcessTime",
          render: (h, params) => {
            const Name = _this.$options.filters.dataFormat(
              params.row.ProcessTime,
              "yyyy-MM-dd hh:mm:ss"
            );
            return h("span", {}, Name);
          },
        },
        {
          title: "车速(km/h)",
          minWidth: 80,
          key: "Flow_Speed",
          render: (h, params) => {
            const Name = isNull(params.row.Flow_Speed)
              ? _this.toFlostTwo(params.row.SpeedPerSec)
              : _this.toFlostTwo(params.row.Flow_Speed);
            return h("span", {}, Name);
          },
        },
        {
          title: "发动机转速(r/min)",
          minWidth: 130,
          key: "Flow_RotateSpeed",
          render: (h, params) => {
            const Name = isNull(params.row.Flow_RotateSpeed)
              ? _this.toFlostTwo(params.row.RotateSpeed)
              : _this.toFlostTwo(params.row.Flow_RotateSpeed);
            return h("span", {}, Name);
          },
        },
        {
          title: "光吸收系数k(m-1)",
          minWidth: 130,
          key: "Flow_K",
          render: (h, params) => {
            return h("span", {}, _this.toFlostTwo(params.row.Flow_K));
          },
        },
        {
          title: "测试工况CO2(%vol)",
          minWidth: 130,
          key: "Flow_CO2",
          render: (h, params) => {
            const Name = _this.toFlostTwo(params.row.Flow_CO2);
            return h("span", {}, Name);
          },
        },
        {
          title: "测试工况NOX(10-6vol)",
          minWidth: 130,
          key: "Flow_NOX",
          render: (h, params) => {
            const Name = _this.toFlostTwo(params.row.Flow_NOX);
            return h("span", {}, Name);
          },
        },
        {
          title: "油温",
          minWidth: 80,
          key: "OilTemperature",
          render: (h, params) => {
            const Name = _this.toFlostTwo(params.row.OilTemperature);
            return h("span", {}, Name);
          },
        },
        {
          title: "测功机载荷(KW)",
          minWidth: 130,
          key: "Flow_LoadPower",
          render: (h, params) => {
            return h("span", {}, _this.toFlostTwo(params.row.Flow_LoadPower));
          },
        },
        {
          title: "测功机扭矩(Nm)",
          minWidth: 130,
          key: "Flow_Torque",
          render: (h, params) => {
            let Flow_Torque = _this.toFlostTwo(params.row.Flow_Torque);
            return h("span", {}, Flow_Torque);
          },
        },
        {
          title: "扭力(N)",
          minWidth: 80,
          key: "nf",
          render: (h, params) => {
            const Name = _this.toFlostTwo(params.row.nf || params.row.NF);
            return h("span", {}, Name);
          },
        },
      ];
    },
    async judgeType() {
      //   console.log('检测方法', this.baseInfo.IUTYPE);
      //   console.log('孙子组件2', this.lastInspectionNum);
      if (this.baseInfo.IUTYPE && this.baseInfo.IUTYPE.indexOf('A') > -1) await this.TSI_column();
      else if (this.baseInfo.IUTYPE && this.baseInfo.IUTYPE.indexOf("B") > -1) await this.ASM_column();
      else if (this.baseInfo.IUTYPE && this.baseInfo.IUTYPE.indexOf("C") > -1) await this.IM_column();
      else if (this.baseInfo.IUTYPE && this.baseInfo.IUTYPE.indexOf("F") > -1) await this.LightProofSmoke_column();
      else if (this.baseInfo.IUTYPE && this.baseInfo.IUTYPE.indexOf("G") > -1) await this.LD_column();
      await this.getProcessData()

    },
    toFlostTwo(value) {
      if (value == null) return "";
      if (value == 0.001) return value;
      value = Number(value).toFixed(2);
      return value;
    },
    //获取过程数据
    async getProcessData() {
      const param = {
        InspectionNum: this.baseInfo.inspectionNum,
        InspectionMethod: this.baseInfo.IUTYPE,
      };
      const param1 = {
        InspectionNum: this.lastInspectionNum,
        InspectionMethod: this.baseInfo.IUTYPE,
      };
      let data1 = []
      let data2 = []
      let res1 = await this.$curl.get("api/hj/getInspectProcessFromDB", { param: JSON.stringify(param1) })
      data1 = res1.data
      // console.log('上一次过程数据', data1);

      let res2 = await this.$curl.get("api/hj/getInspectProcessFromDB", { param: JSON.stringify(param), })
      data2 = res2.data
      // console.log('过程数据', data2);


      //  生成新的表格数组
      let newtableData = [];
      let maxlength, maxlength1, maxlength2;
      //   console.log('#####', data1, data2);
      if (data1 && data1.length > 0) {
        maxlength1 = data1[data1.length - 1].Second_NO
        if (!maxlength1) {
          maxlength1 = data1[data1.length - 1].Second_No
        }
      }
      if (data2 && data2.length > 0) {
        maxlength2 = data2[data2.length - 1].Second_NO
        if (!maxlength2) {
          maxlength2 = data2[data2.length - 1].Second_No
        }
      }
      if (maxlength1 > maxlength2) {
        maxlength = maxlength1
      } else {
        maxlength = maxlength2
      }

      console.log('maxlength', maxlength);

      for (let i = 1; i <= maxlength; i++) {
        let b, f;
        data1.forEach(e => {
          if (e.Second_NO && e.Second_NO == i) {
            b = e;
            newtableData.push(e)
          } else if (e.Second_No && e.Second_No == i) {
            b = e;
            newtableData.push(e)
          }
        });
        if (JSON.stringify(newtableData).indexOf(JSON.stringify(b)) == -1) {
          newtableData.push({})
        }
        data2.forEach(x => {
          if (x.Second_NO && x.Second_NO == i) {
            f = x;
            newtableData.push(x)
          } else if (x.Second_No && x.Second_No == i) {
            f = x;
            newtableData.push(x)
          }
        });
        if (JSON.stringify(newtableData).indexOf(JSON.stringify(f)) == -1) {
          newtableData.push({})
        }
      }
      console.log('newtableData', newtableData);
      // newtableData = JSON.parse(JSON.stringify(newtableData));
      // console.log('newtableData1111111111', newtableData); 
      this.tableData = newtableData


    }
  },
  mounted() {
  },
  watch: {
  }
}
</script>

<style>
</style>