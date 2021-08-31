//过程监管历史查询-obd检测过程数据
<template>
  <div
    style="overflow-x:hidden;overflow-y:auto;height:100%;width:100%"
    ref="innerHeight"
  >
    <div style="float:right;margin-bottom:5px;margin-right:8px;">
      <RadioGroup v-model="dataShowType" type="button">
        <Radio label="table">表格</Radio>
        <Radio label="chart">分析图</Radio>
      </RadioGroup>
      <Button type="primary" @click="exportExcel" style="margin-left:10px"
        >数据导出</Button
      >
    </div>
    <div v-if="dataShowType == 'chart'" v-resize="resize">
      <div
        v-show="resData.length > 0"
        style="margin-top:50px;height:365px;"
        ref="obdProcessDiv"
      ></div>
      <div
        v-show="resData.length == 0"
        style="height:100%;text-align:center;margin-top:50px;"
      >
        暂无数据
      </div>
    </div>
    <div v-else style="width:100%;overflow:auto" class="obd-process">
      <Table
        ref="table"
        size="small"
        :loading="loading"
        :columns="columns"
        :data="resData"
        :height="tableHeight"
      ></Table>
    </div>
  </div>
</template>
<script>
import { export_json_to_excel } from "../../../../excel/Export2Excel";
import { formatDates } from "../../../utils/utils";
export default {
  props: {
    InspectionNum: {
      type: String,
    },
    IUTYPE: {
      type: String,
    },
    InspectProcessForm: {
      type: Array,
    },
    VLPN: {
      type: String,
    },
    rightBlockHeight: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      themaColor: this.$store.state.core.themaColor.basetextcolor,
      height: 0,
      loading: false,
      resData: [],
      columns: [],
      dataShowType: "table", //过程数据显示形式 table 表格，chart 图表
      obdProcessDiv: null,
      tableHeight: 0,
    };
  },
  methods: {
    getTwoTimeList(beginTime, endTime) {
      let intervaltime =
        (new Date(endTime).getTime() - new Date(beginTime).getTime()) / 1000;
      let timeList = [];
      for (let i = 0; i < intervaltime + 1; i++) {
        let time = new Date(beginTime).getTime() + i * 1000;
        timeList.push(time);
      }
      return timeList.map(function(item, index, input) {
        let date = new Date(item);
        // 这里的 - 可以按照需要改为 /. 等等其他符号
        return date
          .toJSON()
          .substr(11, 19)
          .replace("T", " ")
          .replace(/-/g, "-");
      });
    },
    resize() {
      if (this.obdProcessDiv) this.obdProcessDiv.resize();
    },
    exportExcel() {
      require.ensure([], () => {
        const tHeader = this.columns.map((c) => c.title);
        const filterVal = this.columns.map((c) => c.key);
        const list = JSON.parse(JSON.stringify(this.resData));
        const data = this.formatJson(filterVal, list);
        export_json_to_excel(
          tHeader,
          data,
          this.VLPN + " OBD过程数据" + formatDates(new Date(), "yyyyMMdd")
        );
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) => filterVal.map((j) => v[j]));
    },
    showChart() {
      try {
        if (this.obdProcessDiv) {
          this.obdProcessDiv.clear();
          this.$echartsc.dispose(this.obdProcessDiv);
          this.obdProcessDiv = null;
        }
        const resData = this.resData;
        if (resData.length == 0) return;
        let formatData = {
          xAxisData: [],
          yAxis: {},
        };

        resData.forEach((item) => {
          formatData.xAxisData.push(item.Second_NO);
        });

        if (this.$refs.obdProcessDiv) {
          this.obdProcessDiv = this.$echartsc.init(this.$refs.obdProcessDiv);
          // 指定图表的配置项和数据
          var option = {
            color: [
              "#00BCD4",
              "#E91E63",
              "#FF9800",
              "#009688",
              "#607D8B",
              "#AB47BC",
              "rgb(4,147,207)",
              "rgb(255,82,8)",
              "rgb(244,114,152)",
              "rgb(105,171,60)",
              "rgb(103,224,233)",
              "rgb(198,0,255)",
            ],
            title: {
              text: "",
            },
            tooltip: {
              trigger: "axis",
              formatter: function(params) {
                let html = params[0].name;
                if (params[0].data === "") {
                  return `${params[0].marker + params[0].name}: 过程数据缺失`;
                } else {
                  params.forEach((item, index) => {
                    html += `<br/>${item.marker + item.seriesName}: ${
                      item.value === 0.001 ? 0 : item.value
                    }`;
                  });
                  return html;
                }
              },
            },
            legend: {
              itemWidth: 15,
              itemHeight: 10,
              itemGap: 4,
              textStyle: {
                color: this.themaColor,
              },
              x: "right",
              type: "scroll",
              data: [
                "发动机输出功率(kw)",
                "发动机转速(r/min)",
                "进气量(g/s)",
                "车速",
              ],
              pageIconColor: "blue",
              pageIconInactiveColor: "#888",
              pageFormatter: "",
              pageButtonItemGap: -6,
            },
            grid: {
              top: "14%",
              left: "1%",
              right: "2%",
              bottom: "0%",
              containLabel: true,
            },
            xAxis: {
              type: "category",
              boundaryGap: false,
              data: formatData.xAxisData,
              axisLabel: {
                textStyle: {
                  color: this.themaColor,
                },
              },
              axisLine: {
                lineStyle: {
                  color: this.themaColor,
                },
              },
            },
            yAxis: {
              type: "log",
              min: 0.001,
              splitLine: {
                lineStyle: {
                  type: "dashed",
                },
              },
              axisLabel: {
                textStyle: {
                  color: this.themaColor,
                },
                formatter: function(value) {
                  return value === 0.001 ? 0 : value;
                },
              },
              axisLine: {
                lineStyle: {
                  color: this.themaColor,
                },
              },
            },
            series: [
              {
                name: "发动机输出功率(kw)",
                type: "line",
                smooth: true,
                data: resData.map((item) =>
                  this.toFloatTwo(
                    item.Flow_OutputPower == 0 ? 0.001 : item.Flow_OutputPower
                  )
                ),
              },
              {
                name: "发动机转速(r/min)",
                type: "line",
                smooth: true,
                data: resData.map((item) =>
                  item.Flow_RotateSpeed == 0 ? 0.001 : item.Flow_RotateSpeed
                ),
              },
              {
                name: "进气量(g/s)",
                type: "line",
                smooth: true,
                data: resData.map((item) =>
                  item.Flow_AirInput == 0 ? 0.001 : item.Flow_AirInput
                ),
              },
              {
                name: "车速",
                type: "line",
                smooth: true,
                data: resData.map((item) =>
                  item.Flow_Speed == 0 ? 0.001 : item.Flow_Speed
                ),
              },
            ],
          };
          this.obdProcessDiv.setOption(option, true);
        }
      } catch (error) {
        console.log(error);
      }
    },
    toFloatTwo(value) {
      if (value == null) return "";
      if (value == 0.001) return value;
      value = Number(value).toFixed(2);
      return value;
    },
    setHeight() {
      this.height = this.$refs.innerHeight.offsetHeight;
    },
    judgeType() {
      // 判断检测方法
      let IUTYPEArr = this.IUTYPE.split(",");
      let IUTYPE = IUTYPEArr[0];
      if (IUTYPE == "A" || IUTYPE == "B" || IUTYPE == "C") {
        // 汽油
        if (this.dataShowType == "table") {
          this.qy_columns();
        } else {
          this.qy_chart();
        }
      } else if (IUTYPE == "F" || IUTYPE == "G") {
        // 柴油
        if (this.dataShowType == "table") {
          this.cy_columns();
        } else {
          this.cy_chart();
        }
      }
    },
    qy_columns() {
      const _this = this;
      this.columns = [
        {
          title: "编号",
          minWidth: 60,
          key: "Second_NO",
          render: (h, params) => {
            const name = params.row.Second_NO || params.row.Second_No;
            return h("span", {}, name);
          },
        },
        {
          title: "节气门绝对开度(%)",
          minWidth: 130,
          key: "Flow_ThrottleValue",
          render: (h, params) => {
            return h(
              "span",
              {},
              this.toFloatTwo(params.row.Flow_ThrottleValue)
            );
          },
        },
        {
          title: "计算负荷值(%)",
          minWidth: 100,
          key: "Flow_CLV",
          render: (h, params) => {
            return h("span", {}, this.toFloatTwo(params.row.Flow_CLV));
          },
        },
        {
          title: "前氧传感器信号(mV/mA)",
          minWidth: 160,
          key: "Flow_PreOSS",
          render: (h, params) => {
            return h("span", {}, this.toFloatTwo(params.row.Flow_PreOSS));
          },
        },
        {
          title: "过量空气系数(λ)",
          minWidth: 130,
          key: "Flow_Lamda",
          render: (h, params) => {
            return h("span", {}, this.toFloatTwo(params.row.Flow_Lamda));
          },
        },
        {
          title: "车速(km/h)",
          minWidth: 130,
          key: "Flow_Speed",
          render: (h, params) => {
            return h("span", {}, this.toFloatTwo(params.row.Flow_Speed));
          },
        },
        {
          title: "发动机转速(r/min)",
          minWidth: 130,
          key: "Flow_RotateSpeed",
          render: (h, params) => {
            return h("span", {}, this.toFloatTwo(params.row.Flow_RotateSpeed));
          },
        },
        {
          title: "进气量(g/s)",
          minWidth: 130,
          key: "Flow_AirInput",
          render: (h, params) => {
            return h("span", {}, this.toFloatTwo(params.row.Flow_AirInput));
          },
        },
        {
          title: "进气压力(kPa)",
          minWidth: 130,
          key: "Flow_IntakePressure",
          render: (h, params) => {
            return h(
              "span",
              {},
              this.toFloatTwo(params.row.Flow_IntakePressure)
            );
          },
        },
      ];
    },
    cy_columns() {
      const _this = this;
      this.columns = [
        {
          title: "编号",
          minWidth: 60,
          key: "Second_NO",
          render: (h, params) => {
            const name = params.row.Second_NO || params.row.Second_No;
            return h("span", {}, name);
          },
        },
        {
          title: "油门开度(%)",
          minWidth: 70,
          key: "Flow_ThrottlePosition",
          render: (h, params) => {
            return h(
              "span",
              {},
              this.toFloatTwo(params.row.Flow_ThrottlePosition)
            );
          },
        },
        {
          title: "车速(km/h)",
          minWidth: 70,
          key: "Flow_Speed",
          render: (h, params) => {
            return h("span", {}, this.toFloatTwo(params.row.Flow_Speed));
          },
        },
        {
          title: "发动机输出功率(kW)",
          minWidth: 105,
          key: "Flow_OutputPower",
          render: (h, params) => {
            return h("span", {}, this.toFloatTwo(params.row.Flow_OutputPower));
          },
        },
        {
          title: "发动机转速(r/min)",
          minWidth: 80,
          key: "Flow_RotateSpeed",
          render: (h, params) => {
            return h("span", {}, this.toFloatTwo(params.row.Flow_RotateSpeed));
          },
        },
        {
          title: "进气量(g/s)",
          minWidth: 56,
          key: "Flow_AirInput",
          render: (h, params) => {
            return h("span", {}, this.toFloatTwo(params.row.Flow_AirInput));
          },
        },
        {
          title: "增压压力(kPa)",
          minWidth: 68,
          key: "Flow_BoostPressure",
          render: (h, params) => {
            return h(
              "span",
              {},
              this.toFloatTwo(params.row.Flow_BoostPressure)
            );
          },
        },
        {
          title: "耗油量(L/100km)",
          minWidth: 72,
          key: "Flow_OilConsume",
          render: (h, params) => {
            return h("span", {}, this.toFloatTwo(params.row.Flow_OilConsume));
          },
        },
        {
          title: "氮氧传感器浓度(ppm)",
          minWidth: 105,
          key: "Flow_NOX",
          render: (h, params) => {
            return h("span", {}, this.toFloatTwo(params.row.Flow_NOX));
          },
        },
        {
          title: "尿素喷射量(L/h)",
          minWidth: 80,
          key: "Flow_UreaInject",
          render: (h, params) => {
            return h("span", {}, this.toFloatTwo(params.row.Flow_UreaInject));
          },
        },
        {
          title: "排气温度(℃)",
          minWidth: 70,
          key: "Flow_ExhaustTmp",
          render: (h, params) => {
            return h("span", {}, this.toFloatTwo(params.row.Flow_ExhaustTmp));
          },
        },
        {
          title: "颗粒捕集器压差(kPa)",
          minWidth: 105,
          key: "Flow_DPFPressure",
          render: (h, params) => {
            return h("span", {}, this.toFloatTwo(params.row.Flow_DPFPressure));
          },
        },
        {
          title: "EGR开度(%)",
          minWidth: 100,
          key: "Flow_EGRPostion",
          render: (h, params) => {
            return h("span", {}, this.toFloatTwo(params.row.Flow_EGRPostion));
          },
        },
        {
          title: "燃油喷射压力(bar)",
          minWidth: 100,
          key: "Flow_FuelInjectPressure",
          render: (h, params) => {
            return h(
              "span",
              {},
              this.toFloatTwo(params.row.Flow_FuelInjectPressure)
            );
          },
        },
      ];
    },
    cy_chart() {
      try {
        if (this.obdProcessDiv) {
          this.obdProcessDiv.clear();
          this.$echartsc.dispose(this.obdProcessDiv);
          this.obdProcessDiv = null;
        }
        const resData = this.resData;
        if (resData.length == 0) return;
        let formatData = {
          xAxisData: [],
          yAxis: {},
        };

        let startTime = resData[0].ProcessTime;
        let endTime = resData.slice(-1)[0].ProcessTime;
        let timeArr = this.getTwoTimeList(startTime, endTime);
        formatData.xAxisData = timeArr;
        // resData.forEach(item => {
        //   formatData.xAxisData.push(item.Second_NO || Second_No);
        // });
        let dataArr = [];
        formatData.xAxisData.forEach((v) => {
          let data = {
            Flow_ThrottlePosition: "",
            Flow_Speed: "",
            Flow_OutputPower: "",
            Flow_RotateSpeed: "",
            Flow_AirInput: "",
            Flow_BoostPressure: "",
            Flow_OilConsume: "",
            Flow_NOX: "",
            Flow_UreaInject: "",
            Flow_ExhaustTmp: "",
            Flow_DPFPressure: "",
            Flow_EGRPostion: "",
            Flow_FuelInjectPressure: "",
          };
          resData.forEach((k) => {
            if (v == k.ProcessTime.substring(11)) {
              data = k;
            }
          });
          dataArr.push(data);
        });
        let markArr = [];
        let lostArr = [];
        let sData = JSON.parse(JSON.stringify(dataArr));
        sData.forEach((v, index) => {
          if (lostArr.indexOf(formatData.xAxisData[index]) !== -1) return;
          let s = 1;
          let a = [{ name: "", xAxis: "" }, { xAxis: "" }];
          if (v.Flow_ThrottlePosition === "") {
            lostArr.push(formatData.xAxisData[index]);
            arr(sData, index);
            a[0].xAxis = formatData.xAxisData[index - 1];
            a[1].xAxis = formatData.xAxisData[index + s];
            markArr.push(a);
          }
          // 如果连续的逐秒数据为空，将它们合并到一个markArea数组里面
          function arr(data, i) {
            if (data[i + s].Flow_ThrottlePosition === "") {
              lostArr.push(formatData.xAxisData[i + s]);
              s++;
              arr(sData, index);
            }
          }
        });

        if (this.$refs.obdProcessDiv) {
          this.obdProcessDiv = this.$echartsc.init(this.$refs.obdProcessDiv);
          // 指定图表的配置项和数据
          var option = {
            color: [
              "#00BCD4",
              "#E91E63",
              "#FF9800",
              "#009688",
              "#607D8B",
              "#AB47BC",
              "rgb(4,147,207)",
              "rgb(255,82,8)",
              "rgb(244,114,152)",
              "rgb(105,171,60)",
              "rgb(103,224,233)",
              "rgb(198,0,255)",
              "rgb(5,65,140)",
            ],
            title: {
              text: "",
            },
            tooltip: {
              trigger: "axis",
              confine: true,
              formatter: function(params) {
                let html = params[0].name;
                if (params[0].data === "") {
                  return `${params[0].marker + params[0].name}: 过程数据缺失`;
                } else {
                  params.forEach((item, index) => {
                    html += `<br/>${item.marker + item.seriesName}: ${
                      item.value === 0.001 ? 0 : item.value
                    }`;
                  });
                  return html;
                }
              },
            },
            legend: {
              itemWidth: 15,
              itemHeight: 10,
              itemGap: 4,
              textStyle: {
                color: this.themaColor,
              },
              x: "right",
              type: "scroll",
              selected: {
                发动机转速: false,
                进气量: false,
                油门开度: false,
                发动机输出功率: false,
                增压压力: false,
                耗油量: false,
                氮氧传感器浓度: false,
                尿素喷射量: false,
                排气温度: false,
                颗粒捕集器压差: false,
                EGR开度: false,
                燃油喷射压力: false,
              },
              data: [
                "车速",
                "发动机转速",
                "进气量",
                "油门开度",
                "发动机输出功率",
                "增压压力",
                "耗油量",
                "氮氧传感器浓度",
                "尿素喷射量",
                "排气温度",
                "颗粒捕集器压差",
                "EGR开度",
                "燃油喷射压力",
              ],
              pageIconColor: "blue",
              pageIconInactiveColor: "#888",
              pageFormatter: "",
              pageButtonItemGap: -6,
            },
            grid: {
              top: "14%",
              left: "1%",
              right: "2%",
              bottom: "0%",
              containLabel: true,
            },
            xAxis: {
              type: "category",
              boundaryGap: false,
              data: formatData.xAxisData,
              axisLabel: {
                textStyle: {
                  color: this.themaColor,
                },
              },
              axisLine: {
                lineStyle: {
                  color: this.themaColor,
                },
              },
            },
            yAxis: {
              type: "log",
              min: 0.001,
              splitLine: {
                lineStyle: {
                  type: "dashed",
                },
              },
              axisLabel: {
                textStyle: {
                  color: this.themaColor,
                },
                formatter: function(value) {
                  return value === 0.001 ? 0 : value;
                },
              },
              axisLine: {
                lineStyle: {
                  color: this.themaColor,
                },
              },
            },
            series: [
              {
                name: "油门开度",
                type: "line",
                smooth: true,
                data: dataArr.map((item) => {
                  if (item.Flow_ThrottlePosition === "") return "";
                  else {
                    return item.Flow_ThrottlePosition == 0
                      ? 0.001
                      : item.Flow_ThrottlePosition;
                  }
                }),
              },
              {
                name: "车速",
                type: "line",
                smooth: true,
                data: dataArr.map((item) => {
                  if (item.Flow_Speed === "") return "";
                  else {
                    return item.Flow_Speed == 0 ? 0.001 : item.Flow_Speed;
                  }
                }),
                markArea: {
                  data: markArr,
                },
              },
              {
                name: "发动机输出功率",
                type: "line",
                smooth: true,
                data: dataArr.map((item) => {
                  if (item.Flow_OutputPower === "") return "";
                  else {
                    return this.toFloatTwo(
                      item.Flow_OutputPower == 0 ? 0.001 : item.Flow_OutputPower
                    );
                  }
                }),
              },
              {
                name: "发动机转速",
                type: "line",
                smooth: true,
                data: dataArr.map((item) => {
                  if (item.Flow_RotateSpeed === "") return "";
                  else {
                    return item.Flow_RotateSpeed == 0
                      ? 0.001
                      : item.Flow_RotateSpeed;
                  }
                }),
              },
              {
                name: "进气量",
                type: "line",
                smooth: true,
                data: dataArr.map((item) => {
                  if (item.Flow_AirInput === "") return "";
                  else {
                    return item.Flow_AirInput == 0 ? 0.001 : item.Flow_AirInput;
                  }
                }),
              },
              {
                name: "增压压力",
                type: "line",
                smooth: true,
                data: dataArr.map((item) => {
                  if (item.Flow_BoostPressure === "") return "";
                  else {
                    return item.Flow_BoostPressure == 0
                      ? 0.001
                      : item.Flow_BoostPressure;
                  }
                }),
              },
              {
                name: "耗油量",
                type: "line",
                smooth: true,
                data: dataArr.map((item) => {
                  if (item.Flow_OilConsume === "") return "";
                  else {
                    return item.Flow_OilConsume == 0
                      ? 0.001
                      : item.Flow_OilConsume;
                  }
                }),
              },
              {
                name: "氮氧传感器浓度",
                type: "line",
                smooth: true,
                data: dataArr.map((item) => {
                  if (item.Flow_NOX === "") return "";
                  else {
                    return item.Flow_NOX == 0 ? 0.001 : item.Flow_NOX;
                  }
                }),
              },
              {
                name: "尿素喷射量",
                type: "line",
                smooth: true,
                data: dataArr.map((item) => {
                  if (item.Flow_UreaInject === "") return "";
                  else {
                    return this.toFloatTwo(
                      item.Flow_UreaInject == 0 ? 0.001 : item.Flow_UreaInject
                    );
                  }
                }),
              },
              {
                name: "排气温度",
                type: "line",
                smooth: true,
                data: dataArr.map((item) => {
                  if (item.Flow_ExhaustTmp === "") return "";
                  else {
                    return item.Flow_ExhaustTmp == 0
                      ? 0.001
                      : item.Flow_ExhaustTmp;
                  }
                }),
              },
              {
                name: "颗粒捕集器压差",
                type: "line",
                smooth: true,
                data: dataArr.map((item) => {
                  if (item.Flow_DPFPressure === "") return "";
                  else {
                    return item.Flow_DPFPressure == 0
                      ? 0.001
                      : item.Flow_DPFPressure;
                  }
                }),
              },
              {
                name: "EGR开度",
                type: "line",
                smooth: true,
                data: dataArr.map((item) => {
                  if (item.Flow_EGRPostion === "") return "";
                  else {
                    return item.Flow_EGRPostion == 0
                      ? 0.001
                      : item.Flow_EGRPostion;
                  }
                }),
              },
              {
                name: "燃油喷射压力",
                type: "line",
                smooth: true,
                data: dataArr.map((item) => {
                  if (item.Flow_FuelInjectPressure === "") return "";
                  else {
                    return item.Flow_FuelInjectPressure == 0
                      ? 0.001
                      : item.Flow_FuelInjectPressure;
                  }
                }),
              },
            ],
          };
          this.obdProcessDiv.setOption(option, true);
        }
      } catch (error) {
        console.log(error);
      }
    },
    qy_chart() {
      try {
        if (this.obdProcessDiv) {
          this.obdProcessDiv.clear();
          this.$echartsc.dispose(this.obdProcessDiv);
          this.obdProcessDiv = null;
        }
        const resData = this.resData;
        if (resData.length == 0) return;
        let formatData = {
          xAxisData: [],
          yAxis: {},
        };

        let startTime = resData[0].ProcessTime;
        let endTime = resData.slice(-1)[0].ProcessTime;
        let timeArr = this.getTwoTimeList(startTime, endTime);
        formatData.xAxisData = timeArr;
        // resData.forEach(item => {
        //   formatData.xAxisData.push(item.Second_NO || Second_No);
        // });
        let dataArr = [];
        formatData.xAxisData.forEach((v) => {
          let data = {
            Flow_ThrottleValue: "",
            Flow_CLV: "",
            Flow_PreOSS: "",
            Flow_Lamda: "",
            Flow_Speed: "",
            Flow_RotateSpeed: "",
            Flow_AirInput: "",
            Flow_IntakePressure: "",
          };
          resData.forEach((k) => {
            if (v == k.ProcessTime.substring(11)) {
              data = k;
            }
          });
          dataArr.push(data);
        });
        let markArr = [];
        let lostArr = [];
        let sData = JSON.parse(JSON.stringify(dataArr));
        sData.forEach((v, index) => {
          if (lostArr.indexOf(formatData.xAxisData[index]) !== -1) return;
          let s = 1;
          let a = [{ name: "", xAxis: "" }, { xAxis: "" }];
          if (v.Flow_ThrottleValue === "") {
            lostArr.push(formatData.xAxisData[index]);
            arr(sData, index);
            a[0].xAxis = formatData.xAxisData[index - 1];
            a[1].xAxis = formatData.xAxisData[index + s];
            markArr.push(a);
          }
          // 如果连续的逐秒数据为空，将它们合并到一个markArea数组里面
          function arr(data, i) {
            if (data[i + s].Flow_ThrottleValue === "") {
              lostArr.push(formatData.xAxisData[i + s]);
              s++;
              arr(sData, index);
            }
          }
        });
        if (this.$refs.obdProcessDiv) {
          this.obdProcessDiv = this.$echartsc.init(this.$refs.obdProcessDiv);
          // 指定图表的配置项和数据
          var option = {
            color: [
              "#00BCD4",
              "#E91E63",
              "#FF9800",
              "#009688",
              "#607D8B",
              "#AB47BC",
              "rgb(4,147,207)",
              "rgb(255,82,8)",
            ],
            title: {
              text: "",
            },
            tooltip: {
              trigger: "axis",
              formatter: function(params) {
                let html = params[0].name;
                if (params[0].data === "") {
                  return `${params[0].marker + params[0].name}: 过程数据缺失`;
                } else {
                  params.forEach((item, index) => {
                    html += `<br/>${item.marker + item.seriesName}: ${
                      item.value === 0.001 ? 0 : item.value
                    }`;
                  });
                  return html;
                }
              },
            },
            legend: {
              itemWidth: 15,
              itemHeight: 10,
              itemGap: 4,
              textStyle: {
                color: this.themaColor,
              },
              x: "right",
              type: "scroll",
              selected: {
                前氧传感器信号: false,
                "过量空气系数(λ)": false,
                发动机转速: false,
                进气量: false,
                进气压力: false,
                节气门绝对开度: false,
                计算负荷值: false,
              },
              data: [
                "车速",
                "前氧传感器信号",
                "过量空气系数(λ)",
                "发动机转速",
                "进气量",
                "进气压力",
                "节气门绝对开度",
                "计算负荷值",
              ],
              pageIconColor: "blue",
              pageIconInactiveColor: "#888",
              pageFormatter: "",
              pageButtonItemGap: -6,
            },
            grid: {
              top: "14%",
              left: "1%",
              right: "2%",
              bottom: "0%",
              containLabel: true,
            },
            xAxis: {
              type: "category",
              boundaryGap: false,
              data: formatData.xAxisData,
              axisLabel: {
                textStyle: {
                  color: this.themaColor,
                },
              },
              axisLine: {
                lineStyle: {
                  color: this.themaColor,
                },
              },
            },
            yAxis: {
              type: "log",
              min: 0.001,
              splitLine: {
                lineStyle: {
                  type: "dashed",
                },
              },
              axisLabel: {
                textStyle: {
                  color: this.themaColor,
                },
                formatter: function(value) {
                  return value === 0.001 ? 0 : value;
                },
              },
              axisLine: {
                lineStyle: {
                  color: this.themaColor,
                },
              },
            },
            series: [
              {
                name: "节气门绝对开度",
                type: "line",
                smooth: true,
                data: dataArr.map((item) => {
                  if (item.Flow_ThrottleValue === "") return "";
                  else {
                    return this.toFloatTwo(
                      item.Flow_ThrottleValue == 0
                        ? 0.001
                        : item.Flow_ThrottleValue
                    );
                  }
                }),
              },
              {
                name: "计算负荷值",
                type: "line",
                smooth: true,
                data: dataArr.map((item) => {
                  if (item.Flow_CLV === "") return "";
                  else {
                    return item.Flow_CLV == 0 ? 0.001 : item.Flow_CLV;
                  }
                }),
              },
              {
                name: "前氧传感器信号",
                type: "line",
                smooth: true,
                data: dataArr.map((item) => {
                  if (item.Flow_PreOSS === "") return "";
                  else {
                    return item.Flow_PreOSS == 0 ? 0.001 : item.Flow_PreOSS;
                  }
                }),
              },
              {
                name: "过量空气系数(λ)",
                type: "line",
                smooth: true,
                data: dataArr.map((item) => {
                  if (item.Flow_Lamda === "") return "";
                  else {
                    return item.Flow_Lamda == 0 ? 0.001 : item.Flow_Lamda;
                  }
                }),
              },
              {
                name: "车速",
                type: "line",
                smooth: true,
                data: dataArr.map((item) => {
                  if (item.Flow_Speed === "") return "";
                  else {
                    return item.Flow_Speed == 0 ? 0.001 : item.Flow_Speed;
                  }
                }),
                markArea: {
                  data: markArr,
                },
              },
              {
                name: "发动机转速",
                type: "line",
                smooth: true,
                data: dataArr.map((item) => {
                  if (item.Flow_RotateSpeed === "") return "";
                  else {
                    return item.Flow_RotateSpeed == 0
                      ? 0.001
                      : item.Flow_RotateSpeed;
                  }
                }),
              },
              {
                name: "进气量",
                type: "line",
                smooth: true,
                data: dataArr.map((item) => {
                  if (item.Flow_AirInput === "") return "";
                  else {
                    return item.Flow_AirInput == 0 ? 0.001 : item.Flow_AirInput;
                  }
                }),
              },
              {
                name: "进气压力",
                type: "line",
                smooth: true,
                data: dataArr.map((item) => {
                  if (item.Flow_IntakePressure === "") return "";
                  else {
                    return item.Flow_IntakePressure == 0
                      ? 0.001
                      : item.Flow_IntakePressure;
                  }
                }),
              },
            ],
          };
          this.obdProcessDiv.setOption(option, true);
          console.log(3);
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.resData = this.InspectProcessForm;
      // this.showChart();
      this.judgeType();
      this.setHeight();
      window.addEventListener("resize", this.setHeight);
      this.tableHeight = this.rightBlockHeight - 98;
    });
  },

  watch: {
    InspectProcessForm: {
      async handler(data) {
        this.resData = [];
        this.resData = data;
        this.$nextTick(() => {
          this.judgeType();
        });
      },
    },
    dataShowType(val, oldVal) {
      //普通的watch监听
      this.$nextTick(() => {
        // if (val != 'chart') return;
        //dom没有加载完的问题，要放在this.$nextTick
        console.log("切换");
        this.judgeType();
      });
    },
  },
  destroyed() {
    window.removeEventListener("resize", this.setHeight);
    // if (this.obdProcessDiv) {
    //   this.obdProcessDiv.clear();
    //   this.$echartsc.dispose(this.obdProcessDiv);
    // }
  },
};
</script>

<style lang="scss">
.obd-process {
  .ivu-table-cell {
    padding: 0 10px;
  }
}
</style>
